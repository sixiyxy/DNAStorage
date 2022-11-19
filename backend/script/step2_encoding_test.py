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
    "Yin_Yang":YinYangCode(need_logs=False)}



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
        print(values)

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
        print("\n ",self.encode_method)
        dna_sequences = encode_method.encode(final_bit_segments)
        print('Encode bit segments to DNA sequences by coding scheme. \n')
        
        t = datetime.now()
        print(t-start_time)
      
if __name__ == '__main__':
    # obj = Encoding(file_uid=1582258845189804032,
    #               encode_method='Yin_Yang',
    #               segment_length=120,
    #               index_length=15,
    #               verify_method="Hamming")

    # "Goldman","Grass","Blawat"
    # "Basic"
    # mm = ["Church" ,"DNA_Fountain","Yin_Yang"]
    # mm = ['Basic']
    # index = 16
    # for m in mm:
    #     for v in ["Hamming","ReedSolomon","WithoutVerifycode"]:
    #         for s in range(120,200,2):
    #             print('### begin',m,v,s,index)
    #             t1 = datetime.now()
                
    #             # if m == 'Basic':
    #                 # while (s + index)%4 !=0:
    #                     # index +=1  
    #             print('### deal',m,v,s,index)
    #             obj = Encoding(file_uid=1593443692746772480,
    #                         encode_method=m,
    #                         segment_length=s,
    #                         index_length=index,
    #                         verify_method=v)
                
    #             obj.bit_to_dna()
    #             t2 = datetime.now()
    #             print('### final',m,v,s,index,t2-t1)

    index_dict = {10: 1023, 11: 2047, 12: 4095, 13: 8191,
                  14: 16383, 15: 32767, 16: 65535, 17: 131071, 
                  18: 262143, 19: 524287, 20: 1048575, 21: 2097151, 
                  22: 4194303, 23: 8388607, 24: 16777215, 25: 33554431, 
                  26: 67108863, 27: 99999999}
    segnumber = (108096*8)/100
    for index in index_dict:
        if index_dict[index] > segnumber:
            index = index
            break
    print('##### ',index,segnumber)
    

    m = "Basic"
    # v = 'WithoutVerifycode'
    # v = "Hamming"
    v = 'ReedSolomon'
    if m == 'Basic':
        if v == 'WithoutVerifycode':
            for s in range(100,200):
                print('### begin',m,v,s,index)
                while (index +  s)%2 != 0:
                    index +=1
                t1 = datetime.now() 
                print('### deal',m,v,s,index)
                obj = Encoding(file_uid=1593443692746772480,
                                encode_method=m,
                                segment_length=s,
                                index_length=index,
                                verify_method=v)
                for index in index_dict:
                    if index_dict[index] > segnumber:
                            index = index
                            break
                obj.bit_to_dna()
                t2 = datetime.now()
                print('### final',m,v,s,index,t2-t1)
        elif v == "Hamming":
            for s in range(100,200):
                print('### begin',m,v,s,index)
                if (index + s) < 120:
                    while (index +  s +7)%2 != 0:
                        index +=1
                elif (index + s ) == 120:
                    if (index + s + 7) == 127:
                        index +=2
                else:
                    while (index +  s + 8)%2 != 0:
                        index +=1
                t1 = datetime.now() 
                print('### deal',m,v,s,index)
                obj = Encoding(file_uid=1593443692746772480,
                                encode_method=m,
                                segment_length=s,
                                index_length=index,
                                verify_method=v)
                for index in index_dict:
                    if index_dict[index] > segnumber:
                            index = index
                            break
                obj.bit_to_dna()
                t2 = datetime.now()
                print('### final',m,v,s,index,t2-t1)
        elif v == "ReedSolomon":
            for s in range(100,200):
                print('### begin',m,v,s,index)
                while (index + s) % 8 !=0 :
                    index +=1
                
                t1 = datetime.now() 
                print('### deal',m,v,s,index)
                obj = Encoding(file_uid=1593443692746772480,
                                encode_method=m,
                                segment_length=s,
                                index_length=index,
                                verify_method=v)
                for index in index_dict:
                    if index_dict[index] > segnumber:
                            index = index
                            break
                obj.bit_to_dna()
                t2 = datetime.now()
                print('### final',m,v,s,index,t2-t1)
    
    # obj = Encoding(file_uid=1585911198753361920,
    #                 encode_method='SrcCode',
    #               segment_length=160,
    #               index_length=20,
    #               verify_method='Hamming')
    # obj.encoding()