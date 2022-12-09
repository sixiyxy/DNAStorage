import os,sys
import re
from datetime import datetime
import pandas as pd
import numpy as np
import copy
from decimal import Decimal
# from multiprocessing import Pool
import billiard as multiprocessing
from numpy import fromfile, array, uint8

from .utils.utils_basic import get_config,write_yaml
from .utils.verify_methods import Hamming,ReedSolomon
from .utils.encoding_methods import BaseCodingAlgorithm,Church,Goldman,Grass,Blawat,DNAFountain,YinYangCode
from .utils.srcode import SrcCode
from .utils.encode_utils import cut_file, gc_homo,download_normal,download_normal_small,download_txt,add_min_free_energydata,tar_file,write_dna_file

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
    "DNA_Fountain":DNAFountain(redundancy=0.2,need_logs=False,need_pre_check=False),
    "Yin_Yang":YinYangCode(need_logs=False)}


display_dict={"Basic":"Vanilla",
    "Church":"Church, et al.",
    "Goldman":"Goldman, Nick, et al.",
    "Grass":"Grass, Robert N., et al.",
    "Blawat":"Blawat, Meinolf, et al.",
    "DNA_Fountain":"Erlich, Yaniv, and Dina Zielinski et al.",
    "Yin_Yang":"Ping, Zhi, et al.",
    "SrcCode":"Zan, Xiangzhen, et al.",
    "WithoutVerifycode":"None",
    "Hamming":"Hamming code",
    "ReedSolomon":"Reed Solomon code"
    }




class get_progress_bar():
    def __init__(self,file_uid,encode_method,verify_method):
        # methods
        print('### Now used file uid is :{}'.format(file_uid))
        self.encode_method = encode_method
        self.verify_method = verify_method

         # file save dir and file information
        self.config = get_config(yaml_path='config')
        self.backend_dir = self.config['backend_dir']
        self.file_dir = '{}/{}'.format(self.backend_dir,self.config['file_save_dir'])
        self.file_info_path = '{}/{}.yaml'.format(self.file_dir,file_uid)
        self.file_info_dict = get_config(yaml_path=self.file_info_path)

        # define info
        self.progress_bar = {"Basic":[100,200],
                        "Church":[100,200],
                        "Goldman":[100,200],
                        "Grass":[100,200],
                        "Blawat":[100,200],
                        "DNA_Fountain":[80,150],
                        "Yin_Yang":[80,150]}

        self.progress_bar_rule = {"Basic":2,
                        "Church":1,
                        "Goldman":8,
                        "Grass":16,
                        "Blawat":8,
                        "DNA_Fountain":1,
                        "Yin_Yang":1}

    def hamming_length(self,segment_length,index_length):
        if segment_length + index_length<=120:
            return 7
        elif segment_length + index_length >120:
            return 8
    def rscode_length(self):
        return 24

    def get_index_length(self,file_size):
        index_dict = {10: 1023, 11: 2047, 12: 4095, 13: 8191,
                    14: 16383, 15: 32767, 16: 65535, 17: 131071, 
                    18: 262143, 19: 524287, 20: 1048575, 21: 2097151, 
                    22: 4194303, 23: 8388607, 24: 16777215, 25: 33554431, 
                    26: 67108863, 27: 99999999}
        bar_star = self.progress_bar[self.encode_method][0]
        segnumber = (file_size*8)/bar_star
        print(file_size,file_size*8,segnumber)
        for size in index_dict:
            if index_dict[size] > segnumber:
                index_length = size
                break  
        return index_length

    def get_bar(self):
        if self.encode_method == 'SrcCode':
            index_length = 0
            progress_bar = {1:' '}
        else:    
            bar_star = self.progress_bar[self.encode_method][0]
            bar_end = self.progress_bar[self.encode_method][1]

            file_size = self.file_info_dict['upload_file_size']
            index_length = self.get_index_length(file_size)
            print('### According the file size, recommend index length is:',index_length)
            
            progress_bar = {}
            method_rule = self.progress_bar_rule[self.encode_method]
            for s in range(bar_star,bar_end):
                if self.verify_method == 'WithoutVerifycode':
                    while (index_length +  s)% method_rule != 0:
                        s +=1
                    if s not in progress_bar:
                        progress_bar[s] = ' '
                elif self.verify_method == "Hamming":
                    while (index_length +s + self.hamming_length(s,index_length))% method_rule !=0:
                        s +=1
                    if s not in progress_bar:
                        progress_bar[s]= ' '
                elif self.verify_method == "ReedSolomon":
                    while ((index_length + s) % 8 !=0) or ((index_length + s + self.rscode_length()) % method_rule !=0) :
                        s +=1
                    if s not in progress_bar:
                        progress_bar[s] = ' '

        return index_length, progress_bar

class Encoding():
    def __init__(self,file_uid,segment_length,index_length,verify_method,encode_method):
        self.file_uid = file_uid
        self.segment_length = segment_length
        self.index_length = index_length
        self.verify_method = verify_method
        self.encode_method = encode_method

        self.config = get_config(yaml_path='config')
        self.backend_dir = self.config['backend_dir']
        self.threads = self.config['threads']

        # file save dir and file information
        self.file_dir = '{}/{}'.format(self.backend_dir,self.config['file_save_dir'])
        self.file_info_path = '{}/{}.yaml'.format(self.file_dir,file_uid)
        self.file_info_dict = get_config(yaml_path=self.file_info_path)
        self.file_name = self.file_info_dict['file_name']
        self.file_path = '{}/{}_{}'.format(self.file_dir,file_uid,self.file_name)

        # file encode dir
        self.dna_dir = self.config['encode_dir']
        self.dna_file = '{}/{}/{}.fasta'.format(self.backend_dir,self.dna_dir,self.file_uid)

        # min free energy
        self.min_free_energy_tools = self.config['min_free_energy']
        self.dna_demo_file = '{}/{}/{}_demo.dna'.format(self.backend_dir,self.dna_dir,self.file_uid)
        self.free_enerfy_file = '{}/{}/{}_min_free_energy.txt'.format(self.backend_dir,self.dna_dir,self.file_uid)
        # self.free_enerfy_file = '{}/{}/{}_min_free_energy.txt'.format(self.backend_dir,self.dna_dir,self.file_uid)

        # user download file
        self.user_download_file = '{}/{}/{}.txt'.format(self.backend_dir,self.dna_dir,self.file_uid)
        
        # prepare for decode
        self.decode_dir = '{}/{}'.format(self.backend_dir,self.config['decode_dir'])
        self.decode_file = '{}/{}.npz'.format(self.decode_dir,self.file_uid)

    def segment_file(self,data):
        # print('segment start')
        matrix, values = [], data
        
        for current, value in enumerate(values):
            matrix += list(map(int, list(str(bin(value))[2:].zfill(8))))

        if len(matrix) % self.segment_length != 0:
            matrix += [0] * (self.segment_length - len(matrix) % self.segment_length)
        
        matrix = array(matrix)
        matrix = matrix.reshape(int(len(matrix) / self.segment_length), self.segment_length)
        bit_segments =matrix.tolist()

        fragment_info = { "original_bit_segments":bit_segments}

        return fragment_info

    def connet_index(self,data):
        # print('connect start')
        fragment_info = self.segment_file(data)
        original_bit_segments = fragment_info["original_bit_segments"]

        connected_bit_segments = []
        record_index = []
        for index in range(len(original_bit_segments)):
            # define index
            index_code = list(map(int, list(str(bin(index))[2:].zfill(self.index_length))))
            record_index.append(index_code)
            add_index_seg = index_code + original_bit_segments[index]
            connected_bit_segments.append(add_index_seg)
        
        fragment_info = { "original_bit_segments":original_bit_segments,
                        "record_index":record_index,
                        "connected_bit_segments":connected_bit_segments}
        return fragment_info
        
    def verify_code(self,data):
        # print('verify code start')
        fragment_info = self.connet_index(data)
        original_bit_segments = fragment_info["original_bit_segments"]
        record_index = fragment_info["record_index"]
        connected_bit_segments = fragment_info["connected_bit_segments"]

        verify_method = verify_methods[self.verify_method]
        if verify_method == False:
            final_bit_segments = connected_bit_segments
        else:
            final_bit_segments = verify_method.insert(connected_bit_segments)

        fragment_info = { "original_bit_segments":original_bit_segments,
                        "record_index":record_index,
                        "connected_bit_segments":connected_bit_segments,
                        "final_bit_segments":final_bit_segments}
        return fragment_info

    def encoding_normal(self,data): 
        # print('encoding start')
        fragment_info = self.verify_code(data)
        original_bit_segments = fragment_info["original_bit_segments"]
        record_index = fragment_info["record_index"]
        connected_bit_segments = fragment_info["connected_bit_segments"]
        final_bit_segments = fragment_info["final_bit_segments"]

        # data information 
        bit_size = len(data)*8
        byte_size = len(data)
        segment_number = len(original_bit_segments)
        if self.verify_method == False:
            error_correction_length = 0
        else:
            error_correction_length = len(final_bit_segments[0]) - len(connected_bit_segments[0])

        # encode to dna sequence
        final_bit_segments_copy = copy.deepcopy(final_bit_segments) 
        encode_method = encoding_methods[self.encode_method]
        
        if self.encode_method == 'Yin_Yang':
            dna_sequences,fail_list = encode_method.encode(final_bit_segments_copy)
            record_dna_sequence = copy.deepcopy(dna_sequences)
            fail_segemnt_number = len(fail_list)
            successful_bit_size = bit_size - self.segment_length*fail_segemnt_number
            successful_byte_size = byte_size - (self.segment_length/8)* fail_segemnt_number
            print('### fail encoding number is {} !'.format(len(fail_list)))

            for id in fail_list:
                print('#### fail encoding number is {} !'.format(len(fail_list)))
                record_dna_sequence.insert(id,'AGCT') 

            fragment_info = { "original_bit_segments":original_bit_segments,
                        "record_index":record_index,
                        "connected_bit_segments":connected_bit_segments,
                        "final_bit_segments":final_bit_segments,
                        "dna_sequences":dna_sequences,
                        "user_record_dna":record_dna_sequence}
        elif self.encode_method == 'DNA_Fountain':
            dna_sequences,dna_idx = encode_method.encode(final_bit_segments_copy)
            successful_bit_size = bit_size
            successful_byte_size = byte_size
            record_dna_sequence = dna_idx
            # print(record_dna_sequence)
            fragment_info = {"original_bit_segments":original_bit_segments,
                        "record_index":record_index,
                        "connected_bit_segments":connected_bit_segments,
                        "final_bit_segments":final_bit_segments,
                        "dna_sequences":dna_sequences,
                        "user_record_dna":record_dna_sequence}            
        else:
            dna_sequences = encode_method.encode(final_bit_segments_copy)
            successful_bit_size = bit_size
            successful_byte_size = byte_size
            fragment_info = {"original_bit_segments":original_bit_segments,
                        "record_index":record_index,
                        "connected_bit_segments":connected_bit_segments,
                        "final_bit_segments":final_bit_segments,
                        "dna_sequences":dna_sequences,
                        "user_record_dna":dna_sequences}

        # record encode value
        nucleotide_count = len(dna_sequences)*len(dna_sequences[0])
        information_density = successful_bit_size/nucleotide_count

        # net information density is wrong do not display
        net_nucleotide_count = len(dna_sequences)*(len(dna_sequences[0]) - self.index_length - error_correction_length)
        net_information_density = successful_bit_size/net_nucleotide_count
        information_density = round(information_density,3)

        # 1ug = 9.03*10^14bp       
        physical_information_density = successful_byte_size/(nucleotide_count/(9.03*10**14))
        physical_information_density_ug = physical_information_density*(10**3)
        physical_information_density_g = physical_information_density*(10**9)

        # together
        record_info = {"bit_size":bit_size,
                        "byte_size":byte_size,
                        "segment_number":segment_number,
                        "segment_length":self.segment_length,
                        "index_length":self.index_length,
                        "verify_method":self.verify_method,
                        "encode_method":self.encode_method,
                        "DNA_sequence_number":len(dna_sequences),
                        "verify_code_length":error_correction_length,
                        "final_segment_bit_length":len(final_bit_segments[0]),
                        "DNA_sequence_length":len(dna_sequences[0]),
                        "nucleotide_counts":nucleotide_count,
                        "information_density":information_density,
                        "net_information_density":net_information_density,
                        "physical_information_density_ug":physical_information_density_ug,
                        "physical_information_density_g":physical_information_density_g}
        
        return record_info,fragment_info

    def contact_result(self,parallel_results):
       
        ### information data
        # sum
        bit_szie_all = 0
        byte_size_all = 0
        dna_sequence_number_all = 0
        segment_number_all = 0
        nucleotide_counts_all = 0
        # original
        verify_code_length = 0
        final_bit_segments_length =0 
        DNA_sequence_length = 0
        # mean
        information_density_all = 0
        net_information_density_all = 0
        physical_information_density_ug_all = 0
        physical_information_density_g_all = 0
        
        ### fragment data
        original_bit_segments_all= []
        record_index_all = []
        connected_bit_segments_all = []
        final_bit_segments_all = []
        dna_sequences_all = []
        user_record_dna_all = []

        result_number = len(parallel_results)
        for result in parallel_results:
            info_result = result[0]
            bit_szie_all += info_result['bit_size']
            byte_size_all += info_result['byte_size']
            segment_number_all += int(info_result['segment_number'])
            dna_sequence_number_all+= info_result['DNA_sequence_number']
            nucleotide_counts_all += info_result['nucleotide_counts']

            verify_code_length = info_result["verify_code_length"]
            DNA_sequence_length = info_result['DNA_sequence_length']
            final_bit_segments_length = info_result["final_segment_bit_length"]
            
            information_density_all += info_result['information_density']
            net_information_density_all += info_result['net_information_density']
            physical_information_density_ug_all += info_result['physical_information_density_ug']
            physical_information_density_g_all += info_result['physical_information_density_g']


            fragment_data_result = result[1]
            original_bit_segments_all += fragment_data_result['original_bit_segments']
            record_index_all += fragment_data_result['record_index']
            connected_bit_segments_all += fragment_data_result['connected_bit_segments']
            final_bit_segments_all += fragment_data_result['final_bit_segments']
            dna_sequences_all += fragment_data_result['dna_sequences']
            user_record_dna_all += fragment_data_result['user_record_dna']

        
        final_record_info = {
                    "bit_size":bit_szie_all,
                    'byte_size':byte_size_all,
                    "segment_number":segment_number_all,
                    "nucleotide_counts":nucleotide_counts_all,
                    "DNA_sequence_number":dna_sequence_number_all,

                    "segment_length":self.segment_length,
                    "index_length":self.index_length,
                    "verify_method":self.verify_method,
                    "encode_method":self.encode_method,

                    "verify_code_length":verify_code_length,
                    "final_segment_bit_length" :final_bit_segments_length,
                    "DNA_sequence_length":DNA_sequence_length,
                    
                    "information_density":round(information_density_all/result_number,3),
                    "net_information_density":round(net_information_density_all/result_number,3),
                    "physical_information_density_ug":physical_information_density_ug_all/result_number,
                    "physical_information_density_g":physical_information_density_g_all/result_number
                    }
        final_data = {"original_bit_segments" : original_bit_segments_all, 
            "record_index" : record_index_all, 
            "connected_bit_segments" : connected_bit_segments_all,
            "final_bit_segments" : final_bit_segments_all,
            "dna_sequences":dna_sequences_all,
            "user_record_dna" : user_record_dna_all}

        return final_record_info,final_data
    
    def record_file(self,info,data,run_time):
        print('record and plot')
        if self.encode_method in encoding_methods:
            # for dowdload file
            
            original_bit_segments = data["original_bit_segments"]
            payload = [''.join(map(str,i)) for i in original_bit_segments]

            record_index = data["record_index"]
            index = [''.join(map(str,i)) for i in record_index]

            connected_bit_segments = data['connected_bit_segments']
            index_payload = [''.join(list(map(str,i))) for i in connected_bit_segments]
            
            
            final_bit_segments = data['final_bit_segments']
            final_bit_sequences = [''.join(list(map(str,i))) for i in final_bit_segments]

            usr_dna_sequences = data["user_record_dna"]
            # usr_dna_sequences = [''.join(map(str,i)) for i in usr_dna_sequences]

            ############################# pre download file ################################
            # total = len(usr_dna_sequences)
            # total_id =range(total)
            # download_dict = {'total':total,
            #                  'payload':dict(zip(total_id,payload)),
            #                  'index':dict(zip(total_id,index)),
            #                  'index_payload':dict(zip(total_id,index_payload)),
            #                  'index_payload_verfiycode':dict(zip(total_id,final_bit_sequences)),
            #                  'DNA_sequence':dict(zip(total_id,usr_dna_sequences))}
            # download_normal_small(self.user_download_file,download_dict)

            print('### Write download file...')
            
            # for simulation enerfy
            demo_dna_sequences = write_dna_file(method=self.encode_method,path=self.dna_file,
            demo_path=self.dna_demo_file,
            info=payload,
            dna_sequences = usr_dna_sequences)


            print('### Write download txt done!')
            dna_sequences = data['dna_sequences']
            dna_sequences = [''.join(list(map(str,i))) for i in dna_sequences]

            save_dict = {'index_payload':index_payload,
                    'bit_sequences':final_bit_sequences,
                    'dna_sequences':dna_sequences}
            np.savez(self.decode_file,**save_dict)

            info['verify_code_length'] = '{} bits'.format(info['verify_code_length'])
            info['final_segment_bit_length'] = '{} bits'.format(info['final_segment_bit_length'])
        elif self.encode_method == 'SrcCode':
            dna_sequences_all = data['dna_sequences']

            # for download file
            original_chracter_segments = data['original_bit_segments']
            index_ori_bit_sequences = data['connected_bit_segments']
            dna_sequences = data["dna_sequences"]
            dna_sequences = dna_sequences_all
            # for decode data
            save_dict = {'index_payload':index_ori_bit_sequences,
                        'dna_sequences':dna_sequences}
            np.savez(self.decode_file,**save_dict)
            # for user
            original_chracter_segments = [i.replace('\n',' <n> ') for i in original_chracter_segments] 
            demo_dna_sequences = write_dna_file(method=self.encode_method,
            path=self.dna_file,demo_path=self.dna_demo_file,
            info=original_chracter_segments,dna_sequences=dna_sequences_all)
            # download_txt(self.user_download_file,dna_sequences,original_chracter_segments)


        # record run time
        run_time = '%.2f'%(run_time)
        info["encoding_time"]=run_time

        # plot data
        gc_data,homo_data = gc_homo(demo_dna_sequences)
        info['gc_data'] = gc_data
        info['homo_data'] = homo_data
        print('### get GC plot and repeated length plot data, Done !')

        energy_info = add_min_free_energydata(self.min_free_energy_tools,
                                              self.dna_demo_file,
                                             self.free_enerfy_file)
        info['min_free_energy'] = energy_info['min_free_energy'] 
        info['min_free_energy_below_30kcal_mol'] = energy_info['min_free_energy_below_30kcal_mol']
        info['energy_plot']=energy_info['energy_plot']
        print('### Free energy plot data, Done !')
        
        # format data
        # filebytes = info['byte_size']
        # filebytes_kb = filebytes/1024
        # filebytes_mb = filebytes_kb/1024
        info['nucleotide_counts'] = '{} nt'.format(info['nucleotide_counts'])
        info['DNA_sequence_length'] = '{} nt'.format(info['DNA_sequence_length'])
        physical_information_density_ug = '{} petabyte/gram'.format('%.2E'%Decimal(info['physical_information_density_ug'])),
        physical_information_density_g = '{} petabyte/ug'.format('%.2E'%Decimal(info['physical_information_density_g']))
        info['physical_information_density_g'] = physical_information_density_g
        info['physical_information_density_ug'] = physical_information_density_ug

        info = write_yaml(yaml_path=self.file_info_path,data=info,appending=True)
        print('### Prepare the download data...')
        tar_file(upload_dir=self.file_dir,encode_dir=self.dna_dir,file_uid=self.file_uid)
        print('### Tar the download data,Done!')

        info["encode_method"] = display_dict[info["encode_method"]]
        info["verify_method"] = display_dict[info["verify_method"]]
        
        return info

    def parallel_run(self):
        file_data = fromfile(file=self.file_path, dtype=uint8)
        file_size = file_data.shape[0]
        start_time = datetime.now()
        print('### Encoding star!')
        ### parallel run 7 method
        if self.encode_method in encoding_methods:
            file_data = fromfile(file=self.file_path, dtype=uint8)
            file_size = file_data.shape[0]
            if file_size > 1000000:
                cut_file_data = cut_file(file_data,self.encode_method)

                with multiprocessing.Pool(self.threads) as pool:
                    parallel_results = list(pool.imap(self.encoding_normal,cut_file_data))
                record_info,record_data = self.contact_result(parallel_results)
            else:
                record_info,record_data = self.encoding_normal(file_data)
            run_time = (datetime.now() - start_time).total_seconds()
            print('### Encoding done,now anaysis plto data(GC content,energy plot..)!')

            record_info = self.record_file(record_info,record_data,run_time)
        ### txt method
        elif self.encode_method == 'SrcCode':
            upload_file = open(self.file_path,"r",encoding='UTF-8')
            encode_class = SrcCode()
            record_data = encode_class.encodeing(file=upload_file)
            dna_sequences =  record_data['dna_sequences']
            original_charater_list = record_data["original_charater_list"]
            index_ori_charater_list = record_data["index_ori_charater_list"]
                      
            # information
            # dna_sequences = list(map(list,dna_sequences))
            bit_size = file_size*8
            nucleotide_count = sum(map(len,dna_sequences))
            information_density = bit_size/nucleotide_count
            information_density = round(information_density,3)

            net_nucleotide_count = nucleotide_count - len(original_charater_list)*30 #index dna length is 30
            net_information_density = bit_size/net_nucleotide_count
            net_information_density = round(net_information_density,3)

            physical_information_density = file_size/(nucleotide_count/(9.03*10**14))
            physical_information_density_ug = physical_information_density*(10**3)
            physical_information_density_g = physical_information_density*(10**9)

            record_info = {"bit_size" : file_size*8,
                    "byte_size":file_size,
                    "segment_length":self.segment_length,
                    "index_length":self.index_length,
                    "verify_method":self.verify_method,
                     "encode_method":self.encode_method,
                    "verify_code_length":"None",
                    "final_bit_segments_length" :"None",
                    "segment_number":len(original_charater_list),
                    "DNA_sequence_length":len(dna_sequences[0]),
                    "DNA_sequence_number":len(dna_sequences),
                    "nucleotide_counts":sum(map(len,dna_sequences)),
                    "information_density":information_density,
                    "net_information_density":net_information_density,
                    "physical_information_density_ug":physical_information_density_ug,
                    "physical_information_density_g":physical_information_density_g
                    }
            record_data = {"original_bit_segments":original_charater_list, 
            "connected_bit_segments" : index_ori_charater_list,
            "dna_sequences":dna_sequences}
            run_time = (datetime.now() - start_time).total_seconds()
            record_info = self.record_file(record_info,record_data,run_time)

        ### waiting for zzy....
        elif self.encode_method == 'xxx':
            run_time = (datetime.now() - start_time).total_seconds()
            record_info = 'None'
        else:
            record_info = 'None'
            return "make sure encode method is right!"    
        print('### Front data is ready, Done!')
        print(record_info)
        return record_info

if __name__ == '__main__':
    # obj = Encoding(file_uid=1594899412327469056,
    #               encode_method='SrcCode',
    #               segment_length=None,
    #               index_length=None,
    #               verify_method=None)
    # print('here')
    # {"file_uid":1565237658387615744,
    # "segment_length":160,
    # "index_length":20,
    # "verify_method":"Hamming",
    # "encode_method":"Basic"}
    # obj = Encoding(file_uid=1565536927137009664,
    #               encode_method='DNA_Fountain',
    #               segment_length=160,
    #               index_length=20,
    #               verify_method="Hamming")
    # encoding_methods = {
    # "Basic":BaseCodingAlgorithm(need_logs=False),
    # "Church":Church(need_logs=False),
    # "Goldman":Goldman(need_logs=False),
    # "Grass":Grass(need_logs=False),
    # "Blawat":Blawat(need_logs=False),
    # "DNA_Fountain":DNAFountain(redundancy=0.5,need_logs=False),
    # "Yin_Yang":YinYangCode(need_logs=False)}
    obj = Encoding(file_uid=1594952553521614848,
                  encode_method='Church',
                  segment_length=120,
                  index_length=16,
                  verify_method="Hamming")
    
    obj.parallel_run()


