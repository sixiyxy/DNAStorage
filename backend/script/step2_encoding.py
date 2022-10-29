from math import inf
import os,sys
from datetime import datetime
import pandas as pd
import numpy as np
from numpy import fromfile, array, uint8

from utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
from utils.verify_methods import Hamming,ReedSolomon
from utils.encoding_methods import BaseCodingAlgorithm,Church,Goldman,Grass,Blawat,DNAFountain,YinYangCode,SrcCode

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

        return original_bit_segments,record_index,connected_bit_segments,final_bit_segments

    def bit_to_dna(self): 
        start_time = datetime.now()
        original_bit_segments,record_index,connected_bit_segments,final_bit_segments = self.verify_code()
        encode_method = encoding_methods[self.encode_method]
        dna_sequences = encode_method.encode(final_bit_segments)
        print('Encode bit segments to DNA sequences by coding scheme.\n')

        # record encode value
        run_time = (datetime.now() - start_time).total_seconds()
        nucleotide_count = len(dna_sequences)*len(dna_sequences[0])
        information_density = self.bit_size/nucleotide_count
        information_density = round(information_density,3)

        net_nucleotide_count = len(dna_sequences)*(len(dna_sequences[0]) - self.index_length - self.verify_code_length)
        net_information_density = self.bit_size/net_nucleotide_count
        net_information_density = round(net_information_density,3)

        record_info = {"byte_size":self.byte_size,
                    "bit_size":self.bit_size,
                    "segment_length":self.segment_length,
                    "segment_number":self.segment_number,
                    "index_length":self.index_length,
                    "verify_method":self.verify_method,
                    "encode_method":self.encode_method,
                    "DNA_sequence_length":len(dna_sequences[0]),
                    "nucleotide_counts":nucleotide_count,
                    "encoding_time":run_time,
                    "information_density":information_density,
                    "net_information_density":net_information_density}


        write_yaml(yaml_path=self.file_info_path,data=record_info,appending=True)
        write_dna_file(path=self.dna_file,demo_path=self.dna_demo_file,dna_sequences=dna_sequences)

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
                        homo_distribution[homo_length] += 1
                        break
                    if is_find:
                        break

        front_gc = []
        front_homo = []

        for i in range(101):
            plot_dict = {'x_value':i,'y_value':gc_distribution[i]}
            front_gc.append(plot_dict)
        for i in range(max(list(map(len, dna_sequences)))):
            plot_dict = {'x_value':i,'y_value':homo_distribution[i]}
            front_homo.append(plot_dict)

        record_info['gc_plot'] = front_gc
        record_info['homo_plot'] = front_homo

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
            x_value = round(x_value,1)
            range_label = '{} - {}'.format(interval_cate[idx].left,interval_cate[idx].right)
            data = {'x':x_value,'y':int(interval_value[idx]),'range':range_label}
            free_energy_plotdata.append(data)

        record_info['min_free_energy'] = avg_free_energy
        record_info['min_free_energy_below_30kal_mol'] = str(free_energy_30)+'%'
        record_info['energy_plot'] =free_energy_plotdata

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
    
    def encoding(self):
        if self.encode_method in encoding_methods:
            record_info,original_bit_segments = self.bit_to_dna()
        elif self.encode_method == 'SrcCode':
            print(self.file_path)
            upload_file = open(self.file_path,"r",encoding='UTF-8')
            dna_file = open(self.dna_file,'w',encoding="UTF-8")
            encode_class = SrcCode(upload_file=upload_file)
            dna_sequences,original_chracter_segments = encode_class.encodeing()
            print(dna_sequences)
            print(original_chracter_segments)
            print([len(i) for i in dna_sequences])
            print(len(dna_sequences),len(original_chracter_segments))

            os.path.getsize(save_dir)

        elif self.encode_method == 'xx':
            pass
        else:
            return 'wrong encoding method!'


if __name__ == '__main__':
    # obj = Encoding(file_uid=1565536927137009664,
    # encode_method='Basic',
    #               segment_length=160,
    #               index_length=20,
    #               verify_method='Hamming')
    # # obj.connet_index()
    # # obj.verify_code()
    # record_info,bit_segments = obj.bit_to_dna()
    # # print(dna_sequences)

    
    obj = Encoding(file_uid=1585911198753361920,
                    encode_method='SrcCode',
                  segment_length=160,
                  index_length=20,
                  verify_method='Hamming')
    obj.encoding()