from math import inf
import os,sys
from datetime import datetime
from multiprocessing import Pool
import pandas as pd
import numpy as np
from numpy import fromfile, array, uint8

from utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
from utils.verify_methods import Hamming,ReedSolomon
from utils.encoding_methods import BaseCodingAlgorithm,Church,Goldman,Grass,Blawat,DNAFountain,YinYangCode,SrcCode

def cut_file(file_data,encode_method):
    file_size = file_data.shape[0]
    cut_file_data = []
    print(file_size)
    if encode_method in ['DNA_Fountain','Yin_Yang']:
        cut_size = 1000000
    else:
        if file_size <= 1000000:
            cut_size = 4000
        else:
            cut_size = 12000 

    if file_size <= cut_size:
        cut_file_data.append(list(file_data))
    else:
        for i in range(file_size//cut_size):
            if i+1 != file_size//cut_size:
                cut_data = file_data[i*cut_size:(i+1)*cut_size]
            else:
                cut_data = file_data[i*cut_size:]
            cut_data = cut_data.tolist()
            cut_file_data.append(cut_data)
    
    return cut_file_data


verify_methods = {
    "WithoutVerifycode":False,
    "Hamming":Hamming(),
    "ReedSolomon":ReedSolomon()}

encoding_methods = {
    "Basic":BaseCodingAlgorithm(need_logs=False),
    "Church":Church(need_logs=False),
    "Goldman":Goldman(need_logs=False),
    "Grass":Grass(need_logs=False),
    "Blawat":Blawat(need_logs=False),
    "DNA_Fountain":DNAFountain(need_logs=False),
    "Yin_Yang":YinYangCode(need_logs=True)}



def join_list(l):
    return [''.join(map(str,i)) for i in l]


class Encoding():
    def __init__(self,file_uid,segment_length,index_length,verify_method,encode_method):
        self.file_uid = file_uid
        self.segment_length = segment_length
        self.index_length = index_length
        self.verify_method = verify_method
        self.encode_method = encode_method

        self.config = get_config(yaml_path='config')
        self.backend_dir = self.config['backend_dir']

        # file save dir and file information
        self.file_dir = '{}/{}'.format(self.backend_dir,self.config['file_save_dir'])
        self.file_info_path = '{}/{}.yaml'.format(self.file_dir,file_uid)
        self.file_info_dict = get_config(yaml_path=self.file_info_path)
        self.file_name = self.file_info_dict['file_name']
        self.file_path = '{}/{}_{}'.format(self.file_dir,file_uid,self.file_name)

        # define useful value
        self.byte_size = 0
        self.bit_size = 0
        self.segment_number = 0
        self.verify_code_length = 0

        # file encode dir
        self.dna_dir = self.config['encode_dir']
        self.dna_file = '{}/{}/{}.dna'.format(self.backend_dir,self.dna_dir,self.file_uid)

        # min free energy
        self.dna_demo_file = '{}/{}/{}_demo.dna'.format(self.backend_dir,self.dna_dir,self.file_uid)
        # self.free_enerfy_file = '{}/{}/{}_min_free_energy.txt'.format(self.backend_dir,self.dna_dir,self.file_uid)
        self.free_enerfy_file = '{}/{}/1565536927137009664_min_free_energy.txt'.format(self.backend_dir,self.dna_dir,self.file_uid)


        # user download file
        self.user_download_file = '{}/{}/{}.txt'.format(self.backend_dir,self.dna_dir,self.file_uid)
        f = open(self.user_download_file,'w')
        f.write('payload,index,index_payload,index_payload_verfiycode,DNA_sequence\n')
        f.close()

        # other utils
        self.monitor = Monitor()


    def segment_file(self):
        # compute file size
        print("Read binary matrix from file: " + self.file_path)

        matrix, values = [], fromfile(file=self.file_path, dtype=uint8)

        for current, value in enumerate(values):
            matrix += list(map(int, list(str(bin(value))[2:].zfill(8))))
            self.monitor.output(current + 1, len(values))

        if len(matrix) % self.segment_length != 0:
            matrix += [0] * (self.segment_length - len(matrix) % self.segment_length)

        self.byte_size = len(values)
        self.bit_size = len(matrix)
        matrix = array(matrix)
        matrix = matrix.reshape(int(len(matrix) / self.segment_length), self.segment_length)
        bit_segments =matrix.tolist()
        self.segment_number = len(bit_segments)

        print('Segment the unload file....')
        print("There are " + str(len(values) * 8) + " bits in the inputted file. ")
        print("There are " + str(len(bit_segments)) + " bits sequences.\n ")
        print("There are " + str(len(bit_segments[0])) + "  segment.\n ")
        return bit_segments

    def connet_index(self):
        original_bit_segments = self.segment_file()

        connected_bit_segments = []
        record_index = []
        for index in range(len(original_bit_segments)):
            # define index
            index_code = list(map(int, list(str(bin(index))[2:].zfill(self.index_length))))
            record_index.append(index_code)
            add_index_seg = index_code + original_bit_segments[index]
            connected_bit_segments.append(add_index_seg)
            self.monitor.output(index + 1, len(original_bit_segments))
        
        print("There are " + str(len(connected_bit_segments[0])) + " index segment.\n ")

        print('After segment,add index to the bit sequences.\n')

        return connected_bit_segments,original_bit_segments,record_index
        
    def verify_code(self):
        connected_bit_segments,original_bit_segments,record_index = self.connet_index()

        verify_method = verify_methods[self.verify_method]
        if verify_method == False:
            final_bit_segments, error_correction_length = connected_bit_segments,0
        else:
            final_bit_segments, error_correction_length = verify_method.insert(connected_bit_segments)
        
        # verify_code_length = len(bit_segments[0]) - len(connected_bit_segments[0])
        self.verify_code_length = error_correction_length
        record_info = {"verify_code_length":error_correction_length,
                        "final_segment_bit_length":len(final_bit_segments[0])}

        write_yaml(yaml_path=self.file_info_path,data=record_info,appending=True)
        print('After add index,add verify code to the bit sequences.\n')
        print("There are " + str(len(final_bit_segments[0])) + "  verify.\n ")

        return original_bit_segments,record_index,connected_bit_segments,final_bit_segments

    def bit_to_dna(self): 
        start_time = datetime.now()
        original_bit_segments,record_index,connected_bit_segments,final_bit_segments = self.verify_code()
        encode_method = encoding_methods[self.encode_method]
        print("\n ",self.encode_method,len(final_bit_segments[0]))
        dna_sequences = encode_method.encode(final_bit_segments)
        print('Encode bit segments to DNA sequences by coding scheme. \n')
        
        t = datetime.now()
        print(t-start_time)
      
if __name__ == '__main__':

    def hamming(segment_length,index_length):
        if segment_length + index_length<=120:
            return 7
        elif segment_length + index_length >120:
            return 8
    
    def rscode():
        return 24

    def get_progress_bar(file_size,encode_method,verify_method):
        index_dict = {10: 1023, 11: 2047, 12: 4095, 13: 8191,
                    14: 16383, 15: 32767, 16: 65535, 17: 131071, 
                    18: 262143, 19: 524287, 20: 1048575, 21: 2097151, 
                    22: 4194303, 23: 8388607, 24: 16777215, 25: 33554431, 
                    26: 67108863, 27: 99999999}
        progress_bar = {
                    "Basic":[100,200],
                    "Church":[100,200],
                    "Goldman":[100,200],
                    "Grass":[100,200],
                    "Blawat":[100,200],
                    "DNA_Fountain":[80,150],
                    "Yin_Yang":[80,150]}

        progress_bar_rule = {
                    "Basic":2,
                    "Church":1,
                    "Goldman":8,
                    "Grass":16,
                    "Blawat":8,
                    "DNA_Fountain":1,
                    "Yin_Yang":1}

        bar_star = progress_bar[encode_method][0]
        bar_end = progress_bar[encode_method][1]
        segnumber = (file_size)/bar_star
        for size in index_dict:
            if index_dict[size] > segnumber:
                index_length = size
                break    
        save_dict = {}
        save_dict['encode_method'] = encode_method
        save_dict['verify_method'] = verify_method
        save_dict['index'] = index_length
        save_dict['progress_bar'] = []

        method_rule = progress_bar_rule[encode_method]
        n = 0 
        for s in range(bar_star,bar_end):
            if verify_method == 'WithoutVerifycode':
                while (index_length +  s)% method_rule != 0:
                    s +=1
                if s not in save_dict['progress_bar']:
                    save_dict['progress_bar'].append(s)
            elif verify_method == "Hamming":
                while (index_length +s + hamming(s,index_length))% method_rule !=0:
                    s +=1
                if s not in save_dict['progress_bar']:
                    save_dict['progress_bar'].append(s)
            elif verify_method == "ReedSolomon":
                while ((index_length + s) % 8 !=0) or ((index_length + s + rscode()) % method_rule !=0) :
                    s +=1
                if s not in save_dict['progress_bar']:
                    save_dict['progress_bar'].append(s)
            
        
        return index_length,save_dict['progress_bar']
            
            # print('#',encode_method,verify_method,index_length,s)
            # obj = Encoding(file_uid=1593936476343767040,
            #                             encode_method=encode_method,
            #                             segment_length=s,
            #                             index_length=index_length,
            #                             verify_method=verify_method)
            # obj.bit_to_dna()
            # n +=1
            # if n ==9:
            #     break
                                        
        return save_dict

    # ooo = []
    # for e in ["DNA_Fountain","Yin_Yang","Basic","Church","Goldman","Grass","Blawat"]:
    #     for v in ['ReedSolomon','WithoutVerifycode',"Hamming"]:
    #         a = get_progress_bar(864768,encode_method=e,verify_method=v)
    #         ooo.append(a)
    #         print(e,v,a)
    # print(ooo)

    # 1593936476343767040
    # 1582258845189804032
    
    obj = Encoding(file_uid=1594216853138444288,
                  encode_method='Yin_Yang',
                  segment_length=106,
                  index_length=14,
                  verify_method="ReedSolomon")
    t1 = datetime.now()
    obj.bit_to_dna()
    t2 = datetime.now()
    print(t2-t1)

    # {'encode_method': 'Basic', 'verify_method': 'ReedSolomon', 'index': {15: [105, 113, 121, 129, 137, 145, 153, 161, 169, 177, 185, 193, 201]}}
    # Basic ReedSolomon {'encode_method': 'Basic', 'verify_method': 'ReedSolomon', 'index': 17, 'progress_bar': [101, 103, 105, 107, 109, 111, 113, 115, 117, 119, 121, 123, 125, 127, 129, 131, 133, 135, 137, 139, 141, 143, 145, 147, 149, 151, 153, 155, 157, 159, 161, 163, 165, 167, 169, 171, 173, 175, 177, 179, 181, 183, 185, 187, 189, 191, 193, 195, 197, 199]}
        # if encoding_method == 'Basic':
        #     if verify_method == 'WithoutVerifycode':
        #             for s in range(100,200):
        #                 while (index_length +  s)%2 != 0:
        #                     s +=1
        #                 if s not in save_dict['progress_bar']:
        #                     save_dict['progress_bar'].append(s)
        #     elif verify_method == "Hamming":
        #             for s in range(100,200):
        #                 while (index +s + hamming(s,index))%2 !=0:
        #                         s +=1
        #                 if s not in save_dict['progress_bar']:
        #                     save_dict['progress_bar'].append(s)
        #     elif verify_method == "ReedSolomon":
        #             for s in range(100,200):
        #                 while  (index_length + s)%8 !=0 and (index_length + s + rscode()) % 2 !=0 :
        #                     s +=1
        #                 if s not in save_dict['progress_bar']:
        #                     save_dict['progress_bar'].append(s)
        # elif  encoding_method == 'Church':
        #     if verify_method == 'WithoutVerifycode':
        #             for s in range(100,200):
        #                 save_dict['progress_bar'].append(s)
        #     elif verify_method == "Hamming":
        #             for s in range(100,200):
        #                 save_dict['progress_bar'].append(s)
        #     elif verify_method == "ReedSolomon":
        #             for s in range(100,200):
        #                 while (index_length + s + rscode()) % 8 !=0 :
        #                     s +=1
        #                 if s not in save_dict['progress_bar']:
        #                     save_dict['progress_bar'].append(s)
        # elif encoding_method == "Goldman":
        #     if verify_method == 'WithoutVerifycode':
        #             for s in range(100,200):
        #                 while (index_length +  s)%8 != 0:
        #                     s +=1
        #                 if s not in save_dict['progress_bar']:
        #                     save_dict['progress_bar'].append(s)
        #     elif verify_method == "Hamming":
        #             for s in range(100,200):
        #                 while (index +s + hamming(s,index))%8 !=0:
        #                     s +=1 
        #                 if s not in save_dict['progress_bar']:
        #                     save_dict['progress_bar'].append(s)
        #     elif verify_method == "ReedSolomon":
        #             for s in range(100,200):
        #                 while (index_length + s + rscode()) % 8 !=0 :
        #                     s +=1
        #                 if s not in save_dict['progress_bar']:
        #                     save_dict['progress_bar'].append(s)
        # elif encoding_method == "Grass":
        #     if verify_method == 'WithoutVerifycode':
        #             for s in range(100,200):
        #                 while (index_length +  s)%16 != 0:
        #                     s +=1
        #                 if s not in save_dict['progress_bar']:
        #                     save_dict['progress_bar'].append(s)
        #     elif verify_method == "Hamming":
        #             for s in range(97,200):
        #                 while (index +s + hamming(s,index))%16 !=0:
        #                     s +=1 
        #                 if s not in save_dict['progress_bar']:
        #                     save_dict['progress_bar'].append(s)
        #     for s in range(100,200):
        #                 while (index_length + s +rscode() ) % 16 !=0 :
        #                     s +=1
        #                 if s not in save_dict['progress_bar']:
        #                     save_dict['progress_bar'].append(s)

            

    
      
    

    # save_dict = {}
    # encoding_method = "Basic"
    # # # encoding_method = "Church"
    # # # encoding_method =  "Goldman"
    # # encoding_method ="Grass"

    # # # encoding_method = "Blawat"

    # # # verify_method = 'WithoutVerifycode'
    # # # verify_method = "Hamming"
    # verify_method = 'ReedSolomon'

    # save_dict['encode_method'] = encoding_method
    # save_dict['verify_method'] = verify_method
    # save_dict['index'] = {}

    
    # if encoding_method == "Basic":
    #     if verify_method == 'WithoutVerifycode':
    #         for index in range(14,30):
    #             save_dict['index'][index] = []
    #             for s in range(100,200):
    #                 print('### begin',encoding_method,verify_method,s,index)
    #                 while (index +  s)%8 != 0:
    #                     s +=1
    #                 t1 = datetime.now() 
    #                 print('### deal',encoding_method,verify_method,s,index)
    #                 obj = Encoding(file_uid=1593936476343767040,
    #                                 encode_method=encoding_method,
    #                                 segment_length=s,
    #                                 index_length=index,
    #                                 verify_method=verify_method)

    #                 obj.bit_to_dna()
    #                 t2 = datetime.now()
    #                 print('### final',encoding_method,verify_method,s,index,t2-t1)
    #                 if s not in save_dict['index'][index]:
    #                     save_dict['index'][index].append(s)
    #             print(save_dict)
    #     elif verify_method == "Hamming":
    #         for index in range(15,30):
    #             save_dict['index'][index] = []
    #             for s in range(100,200):
    #                 print('### begin',encoding_method,verify_method,s,index)

    #                 while (index +s + hamming(s,index))%8 !=0:
    #                     s +=1 

    #                 t1 = datetime.now() 
    #                 print('### deal',encoding_method,verify_method,s,index)
    #                 obj = Encoding(file_uid=1593936476343767040,
    #                                 encode_method=encoding_method,
    #                                 segment_length=s,
    #                                 index_length=index,
    #                                 verify_method=verify_method)

    #                 obj.bit_to_dna()
    #                 t2 = datetime.now()
    #                 print('### final',encoding_method,verify_method,s,index,t2-t1)
    #                 if s not in save_dict['index'][index]:
    #                     save_dict['index'][index].append(s)
    #             print(save_dict)
    #     elif verify_method == "ReedSolomon":
    #         for index in range(15,16):
    #             save_dict['index'][index] = []
    #             for s in range(100,200):
    #                 print('### begin',encoding_method,verify_method,s,index)
    #                 while (index + s + rscode()) % 8 !=0 :
    #                     s +=1

    #                 t1 = datetime.now() 
    #                 print('### deal',encoding_method,verify_method,s,index)
    #                 obj = Encoding(file_uid=1593936476343767040,
    #                                 encode_method=encoding_method,
    #                                 segment_length=s,
    #                                 index_length=index,
    #                                 verify_method=verify_method)

    #                 obj.bit_to_dna()
    #                 t2 = datetime.now()
    #                 print('### final',encoding_method,verify_method,s,index,t2-t1)
    #                 if s not in save_dict['index'][index]:
    #                     save_dict['index'][index].append(s)
    #             print(save_dict)
       
   