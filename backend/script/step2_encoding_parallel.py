from math import inf
import os,sys
import re
from datetime import datetime
from typing import final
import pandas as pd
import numpy as np
from multiprocessing import Pool
from tqdm import tqdm
from numpy import fromfile, array, uint8

from utils.utils_basic import get_config,write_yaml,write_dna_file
from utils.verify_methods import Hamming,ReedSolomon
from utils.encoding_methods import BaseCodingAlgorithm,Church,Goldman,Grass,Blawat,DNAFountain,YinYangCode,SrcCode
from utils.encode_utils import cut_file, gc_homo,download_normal,download_txt,add_min_free_energydata

verify_methods = {
    "WithoutVerifycode":False,
    "Hamming":Hamming(need_logs=False),
    "ReedSolomon":ReedSolomon(need_logs=False)}

encoding_methods = {
    "Basic":BaseCodingAlgorithm(need_logs=False),
    "Church":Church(need_logs=False),
    "Goldman":Goldman(need_logs=False),
    "Grass":Grass(need_logs=False),
    "Blawat":Blawat(need_logs=False),
    "DNA_Fountain":DNAFountain(need_logs=False),
    "Yin_Yang":YinYangCode(need_logs=False)}


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
        if self.encode_method in encoding_methods:
            f.write('payload,index,index_payload,index_payload_verfiycode,DNA_sequence\n')
            f.close()
        elif self.encode_method == 'SrcCode':
            f.write('payload,DNA_sequence\n')
            f.close()
        

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

    def encoding_normal(self,data): 
        original_bit_segments,record_index,connected_bit_segments,final_bit_segments = self.verify_code(data)
        encode_method = encoding_methods[self.encode_method]
        dna_sequences = encode_method.encode(final_bit_segments)

        # record file
        write_dna_file(path=self.dna_file,demo_path=self.dna_demo_file,dna_sequences=dna_sequences)

        # record encode value
        nucleotide_count = len(dna_sequences)*len(dna_sequences[0])
        information_density = self.bit_size/nucleotide_count
        net_nucleotide_count = len(dna_sequences)*(len(dna_sequences[0]) - self.index_length - self.verify_code_length)
        net_information_density = self.bit_size/net_nucleotide_count

        physical_information_density = self.byte_size/nucleotide_count
        physical_information_density_ug = physical_information_density*1000
        physical_information_density_g = physical_information_density*1000000000

        
        # gc contant homology distribution
        gc_distribution,gc_distribution = gc_homo(dna_sequences)
        record_info = {"bit_size":self.bit_size,
                    "segment_number":self.segment_number,
                    "DNA_sequence_length":len(dna_sequences[0]),
                    "nucleotide_counts":nucleotide_count,
                    "information_density":information_density,
                    "net_information_density":net_information_density,
                    "physical_information_density_ug":physical_information_density_ug,
                    "physical_information_density_g":physical_information_density_g
                    }
        record_info['gc_data'] = gc_distribution
        record_info['homo_data'] = gc_distribution
        
        # record dowdload file
        download_normal(self.user_download_file ,original_bit_segments,record_index,connected_bit_segments,final_bit_segments,dna_sequences)

        return record_info

    def contact_result(self,parallel_results):
        bit_szie_all = 0
        segment_number_all = 0
        nucleotide_counts_all = 0
        information_density_all = 0
        net_information_density_all = 0
        DNA_sequence_length = 0
        physical_information_density_ug_all = 0
        physical_information_density_g_all = 0

        gc_dict = {}
        homo_dict = {}

        result_number = len(parallel_results)

        for one_result in parallel_results:  
            bit_szie_all += one_result['bit_size']
            segment_number_all += int(one_result['segment_number'])
            DNA_sequence_length = one_result['DNA_sequence_length']
            nucleotide_counts_all += one_result['nucleotide_counts']
            information_density_all +=one_result['information_density']
            net_information_density_all += one_result['net_information_density']
            physical_information_density_ug_all += one_result['physical_information_density_ug']
            physical_information_density_g_all += one_result['physical_information_density_g']
        
            gc_data = one_result['gc_data']
            for idx in range(len(gc_data)):
                if idx not in gc_dict:
                    gc_dict[idx] = gc_data[idx]
                else:
                    gc_dict[idx] += gc_data[idx]

            homo_data = one_result['homo_data']

            for idx in range(len(homo_data)):
                if idx not in homo_dict:
                    homo_dict[idx] = homo_data[idx]
                else:
                    homo_dict[idx] += homo_data[idx]

        front_gc = [{'x_value':i,'y_value':gc_dict[i]} for i in gc_dict]
        front_homo = [{'x_value':i,'y_value':homo_dict[i]} for i in homo_dict]

        final_record_info = {
                    "bit_size":bit_szie_all,
                    "segment_number":segment_number_all,
                    "segment_length":self.segment_length,
                    "index_length":self.index_length,
                    "verify_method":self.verify_method,
                    "encode_method":self.encode_method,
                    "DNA_sequence_length":DNA_sequence_length,
                    "nucleotide_counts":nucleotide_counts_all,
                    "information_density":round(information_density_all/result_number,3),
                    "net_information_density":round(net_information_density_all/result_number,3),
                    "physical_information_density_ug":round(physical_information_density_ug_all/result_number,3),
                    "physical_information_density_g":round(physical_information_density_g_all/result_number,3)
                    }
        final_record_info['gc_plot']= front_gc
        final_record_info['homo_plot']=front_homo

        return final_record_info

    def parallel_run(self):
        file_data = fromfile(file=self.file_path, dtype=uint8)
        file_size = file_data.shape[0]

        start_time = datetime.now()
        # parallel run 7 method
        if self.encode_method in encoding_methods:
            file_data = fromfile(file=self.file_path, dtype=uint8)
            file_size = file_data.shape[0]
            cut_file_data = cut_file(file_data)

            with Pool(1) as pool:
                parallel_results = list(pool.imap(self.encoding_normal,cut_file_data))
            run_time = (datetime.now() - start_time).total_seconds()
            record_info = self.contact_result(parallel_results)
        # txt method
        elif self.encode_method == 'SrcCode':
            upload_file = open(self.file_path,"r",encoding='UTF-8')
            dna_file = open(self.dna_file,'w',encoding="UTF-8")
            encode_class = SrcCode(upload_file=upload_file)
            dna_sequences,original_chracter_segments = encode_class.encodeing()
            download_txt(self.user_download_file,dna_sequences,original_chracter_segments)

            dna_sequences = map(list,dna_sequences)
            # information
            bit_size = file_size*8
            nucleotide_count = sum(map(len,dna_sequences))
            information_density = bit_size/nucleotide_count
            information_density = round(information_density,3)

            net_nucleotide_count = nucleotide_count - len(original_chracter_segments)*30 #index dna length is 30
            net_information_density = self.bit_size/net_nucleotide_count
            net_information_density = round(net_information_density,3)

            physical_information_density = file_size/nucleotide_count
            physical_information_density_ug = physical_information_density*1000
            physical_information_density_g = physical_information_density*1000000000

            record_info = {"bit_szie" : file_size*8,
                    "segment_number":len(original_chracter_segments),
                    "DNA_sequence_length":len(dna_sequences[0]),
                    "nucleotide_counts":sum(map(len,dna_sequences)),
                    "information_density":information_density,
                    "net_information_density":net_information_density,
                    "physical_information_density_ug":physical_information_density_ug,
                    "physical_information_density_g":physical_information_density_g}
            gc_distribution,gc_distribution = self.gc_homo(dna_sequences)
            record_info['gc_data'] = gc_distribution
            record_info['homo_data'] = gc_distribution
            run_time = (datetime.now() - start_time).total_seconds()
        # image method
        elif self.encode_method == 'xxx':
            run_time = (datetime.now() - start_time).total_seconds()
        else:
            return "make sure encode method is right!"
        
        # final record information
        record_info["byte_size"]=file_size
        record_info["encoding_time"]=run_time
        record_info['physical_information_density_g'] = '{} petabyte_g'.format(record_info['physical_information_density_g'])
        record_info['physical_information_density_ug'] = '{} petabyte_ug'.format(record_info['physical_information_density_ug'])


        record_info,free_energy_plotdata = add_min_free_energydata(self.free_enerfy_file ,record_info)
        write_yaml(yaml_path=self.file_info_path,data=record_info,appending=True)
        record_info['energy_plot']=free_energy_plotdata
        print(record_info)
        
        return record_info

if __name__ == '__main__':
    # 1565536927137009664
    # 1582258845189804032
    obj = Encoding(file_uid=1565536927137009664,
                  encode_method='Basic',
                  segment_length=160,
                  index_length=20,
                  verify_method='Hamming')
    obj.parallel_run()
    # obj.connet_index()
    # obj.verify_code()
    # record_info,bit_segments = obj.bit_to_dna()
    # print(dna_sequences)

