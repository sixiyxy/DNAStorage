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
    if encode_method == 'DNA_Fountain':
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
    "Basic":BaseCodingAlgorithm(need_logs=True),
    "Church":Church(need_logs=True),
    "Goldman":Goldman(need_logs=True),
    "Grass":Grass(need_logs=True),
    "Blawat":Blawat(need_logs=True),
    "DNA_Fountain":DNAFountain(need_logs=True),
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



    def segment_file(self,data):

        matrix, values = [], data
        self.bit_size = len(values)*8
        for current, value in enumerate(values):
            matrix += list(map(int, list(str(bin(value))[2:].zfill(8))))

        if len(matrix) % self.segment_length != 0:
            matrix += [0] * (self.segment_length - len(matrix) % self.segment_length)

        self.byte_size = len(values)
        
        matrix = array(matrix)
        matrix = matrix.reshape(int(len(matrix) / self.segment_length), self.segment_length)
        bit_segments =matrix.tolist()
        self.segment_number = len(bit_segments)

        return bit_segments

    def connet_index(self,data):

        original_bit_segments = self.segment_file(data)

        connected_bit_segments = []
        record_index = []
        for index in range(len(original_bit_segments)):
            # define index
            index_code = list(map(int, list(str(bin(index))[2:].zfill(self.index_length))))
            record_index.append(index_code)
            add_index_seg = index_code + original_bit_segments[index]
            connected_bit_segments.append(add_index_seg)

        return connected_bit_segments,original_bit_segments,record_index
        
    def verify_code(self,data):

        connected_bit_segments,original_bit_segments,record_index = self.connet_index(data)

        verify_method = verify_methods[self.verify_method]

        if verify_method == False:
            final_bit_segments, error_correction_length = connected_bit_segments,0
        else:
            final_bit_segments, error_correction_length = verify_method.insert(connected_bit_segments)
        
        self.verify_code_length = error_correction_length
        record_info = {"verify_code_length":error_correction_length,
                        "final_segment_bit_length":len(final_bit_segments[0])}

        write_yaml(yaml_path=self.file_info_path,data=record_info,appending=True)

        return original_bit_segments,record_index,connected_bit_segments,final_bit_segments
        # return [1],[22]

    def encoding_normal(self,data): 
        original_bit_segments,record_index,connected_bit_segments,final_bit_segments = self.verify_code(data)
        encode_method = encoding_methods[self.encode_method]
        dna_sequences = encode_method.encode(final_bit_segments)
        return dna_sequences

    def bit_to_dna(self): 
        start_time = datetime.now()
        
        encode_method = encoding_methods[self.encode_method]
        print(self.encode_method)

        file_data = fromfile(file=self.file_path, dtype=uint8)

        cut_file_data = cut_file(file_data,self.encode_method)
        print(len(cut_file_data))

        with Pool(8) as pool:
            parallel_results = list(pool.imap(self.encoding_normal,cut_file_data))
            pool.close()
            pool.join()
        d = [i[-1] for i in parallel_results]


        # print(d[0],d[0][0],type(d[0]),len(d[0]),len(d[0][0]))
        
        # print(final_bit_segments,type(final_bit_segments))



        t = datetime.now()
        print(t-start_time)
        print(len(parallel_results))
        # print(len(parallel_results[0]))
        # print(parallel_results[0][-1])
        # print(parallel_results)
        print('Encode bit segments to DNA sequences by coding scheme.\n')

        
if __name__ == '__main__':
    obj = Encoding(file_uid=1582258845189804032,
                  encode_method='DNA_Fountain',
                  segment_length=160,
                  index_length=20,
                  verify_method="Hamming")
    obj.bit_to_dna()
    
    # obj = Encoding(file_uid=1585911198753361920,
    #                 encode_method='SrcCode',
    #               segment_length=160,
    #               index_length=20,
    #               verify_method='Hamming')
    # obj.encoding()