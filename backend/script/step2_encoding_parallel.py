from math import inf
import os,sys
from datetime import datetime
import pandas as pd
import numpy as np
from multiprocessing import Pool
from tqdm import tqdm
from numpy import fromfile, array, uint8

from .utils.utils_basic import get_config,write_yaml,write_dna_file
from .utils.verify_methods import Hamming,ReedSolomon
from .utils.encoding_methods import BaseCodingAlgorithm,Church,Goldman,Grass,Blawat,DNAFountain,YinYangCode

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
    "DNAFountain":DNAFountain(need_logs=False),
    "YinYang":YinYangCode(need_logs=False)}


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

    def segment_file(self,data):
        matrix, values = [], data
        for current, value in enumerate(values):
            matrix += list(map(int, list(str(bin(value))[2:].zfill(8))))

        if len(matrix) % self.segment_length != 0:
            matrix += [0] * (self.segment_length - len(matrix) % self.segment_length)

        self.byte_size = len(values)
        self.bit_size = len(matrix)
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

    def bit_to_dna(self,data): 
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
        
        record_info = {"bit_size":self.bit_size,
                    "segment_number":self.segment_number,
                    "DNA_sequence_length":len(dna_sequences[0]),
                    "nucleotide_counts":nucleotide_count,
                    "information_density":information_density,
                    "net_information_density":net_information_density}


        # record plot data
        gc_distribution = [0 for _ in range(101)]
        homo_distribution = [0 for _ in range(max(list(map(len, dna_sequences))))]
        

        for dna_sequence in dna_sequences:
            dna_segment = "".join(dna_sequence)
            gc_content = int(((dna_segment.count("C") + dna_segment.count("G")) / len(dna_segment) * 100) + 0.5)
            gc_distribution[gc_content] += 1
            for homo_length in [homo + 1 for homo in range(len(dna_sequence))][::-1]:
                is_find = False
                missing_segments = ["A" * homo_length, "C" * homo_length, "G" * homo_length, "T" * homo_length]
                for missing_segment in missing_segments:
                    if missing_segment in dna_segment:
                        is_find = True
                        homo_distribution[homo_length-1] += 1
                        break
                    if is_find:
                        break

        record_info['gc_data'] = gc_distribution
        record_info['homo_data'] = gc_distribution

        # record dowdload file
        f = open(self.user_download_file,'a+')
        for idx in range(self.segment_number):
            payload = ''.join(map(str,original_bit_segments[idx]))
            index = ''.join(map(str,record_index[idx]))
            index_payload  = ''.join(map(str,connected_bit_segments[idx]))
            index_payload_verfiycode= ''.join(map(str,final_bit_segments[idx]))
            DNA_sequence= ''.join(map(str,dna_sequences[idx]))
            f.write('{payload},{index},{index_payload},{index_payload_verfiycode},{DNA_sequence}\n'.format(
                payload=payload,index=index,index_payload=index_payload,
                index_payload_verfiycode=index_payload_verfiycode,
                DNA_sequence = DNA_sequence))
        f.close()

        return record_info,original_bit_segments

    def add_min_free_energydata(self,final_record_info):
         # min free energy
        min_free_energy_list = []
        min_free_energy_30 = []
        with open(self.free_enerfy_file) as f:
            for line in f.readlines():
                if '(' in line:
                    value = line.split('(')[-1]
                    value = float(value.replace(')',''))
                    min_free_energy_list.append(value)
                    if value < -30:
                        min_free_energy_30.append(value)
        avg_free_energy = round(np.mean(min_free_energy_list),2)
        free_energy_30 = round(len(min_free_energy_30)/len(min_free_energy_list)*100,2)
        bins = np.linspace(min(min_free_energy_list),max(min_free_energy_list),31)

        interval = pd.cut(min_free_energy_list,bins)
        interval_cate = interval.categories
        interval_value = interval.value_counts().values


        bins = [round(i,1) for i in bins]
        free_energy_plotdata = []
        for idx in range(len(interval_cate)):
            x_value = interval_cate[idx].mid
            x_value = str(round(x_value,1))
            range_label = '{} : {}'.format(interval_cate[idx].left,interval_cate[idx].right)
            data = {'x_value':x_value,'y_value':str(interval_value[idx]),'range':range_label}
            free_energy_plotdata.append(data)

        final_record_info['min_free_energy'] = float(avg_free_energy)
        final_record_info['min_free_energy_below_30kcal_mol'] = str(free_energy_30)+'%'
        
        return final_record_info,free_energy_plotdata

    def parallel_run(self):
        file_data = fromfile(file=self.file_path, dtype=uint8)
        file_size = file_data.shape[0]
        
        if file_size <= 1000000000:
            cut_size = 4000
        else:
            cut_size = 12000 

        cut_file_data = []

        if file_size <= cut_size:
            cut_file_data.append(list(file_data))
        else:
            for i in range(file_size//cut_size):
                if i+1 != file_size//cut_size:
                    cut_data = file_data[i*cut_size:(i+1)*cut_size]
                else:
                    cut_data = file_data[i*cut_size:]
                cut_file_data.append(cut_data)

        start_time = datetime.now()
        with Pool(8) as pool:
            parallel_results = list(tqdm(pool.imap(self.bit_to_dna,cut_file_data),total=len(cut_file_data)))

        bit_szie_all = 0
        segment_number_all = 0
        nucleotide_counts_all = 0
        information_density_all = 0
        net_information_density_all = 0
        DNA_sequence_length = 0

        gc_dict = {}
        homo_dict = {}

        original_bit_segments = []

        result_number = len(parallel_results)

        for one_result,one_original_bit_segments in parallel_results:  
            original_bit_segments += one_original_bit_segments
            bit_szie_all += one_result['bit_size']
            segment_number_all += int(one_result['segment_number'])
            DNA_sequence_length = one_result['DNA_sequence_length']
            nucleotide_counts_all += one_result['nucleotide_counts']
            information_density_all +=one_result['information_density']
            net_information_density_all += one_result['net_information_density']
        
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

        run_time = (datetime.now() - start_time).total_seconds()


        final_record_info = {"byte_size":file_size,
                    "bit_size":bit_szie_all,
                    "segment_number":segment_number_all,
                    "segment_length":self.segment_length,
                    "index_length":self.index_length,
                    "verify_method":self.verify_method,
                    "encode_method":self.encode_method,
                    "encoding_time":run_time,
                    "DNA_sequence_length":DNA_sequence_length,
                    "nucleotide_counts":nucleotide_counts_all,
                    "information_density":round(information_density_all/result_number,3),
                    "net_information_density":round(net_information_density_all/result_number,3)}
        final_record_info,free_energy_plotdata = self.add_min_free_energydata(final_record_info)
        write_yaml(yaml_path=self.file_info_path,data=final_record_info,appending=True)

        final_record_info['gc_plot']= front_gc
        final_record_info['homo_plot']=front_homo
        final_record_info['energy_plot']=free_energy_plotdata
        
        return final_record_info,original_bit_segments

if __name__ == '__main__':
    # 1565536927137009664
    # 1582258845189804032
    obj = Encoding(file_uid=1584030833663152128,
                  encode_method='Basic',
                  segment_length=160,
                  index_length=20,
                  verify_method='Hamming')
    obj.parallel_run()
    # obj.connet_index()
    # obj.verify_code()
    # record_info,bit_segments = obj.bit_to_dna()
    # print(dna_sequences)