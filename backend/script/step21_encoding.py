from math import inf
import os,sys
from datetime import datetime
from numpy import fromfile, array, uint8
from utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
from utils.verify_methods import Hamming,ReedSolomon
from utils.encoding_methods import BaseCodingAlgorithm,Church,Goldman,Grass,Blawat,DNAFountain,YinYangCode

verify_methods = {
    "None":False,
    "Hamming":Hamming(),
    "RS":ReedSolomon()
}

encoding_methods = {
    "Basic":BaseCodingAlgorithm(need_logs=True),
    "Church":Church(need_logs=True),
    "Goldman":Goldman(need_logs=True),
    "Grass":Grass(need_logs=True),
    "Blawat":Blawat(need_logs=True),
    "DNAFountain":DNAFountain(need_logs=True),
    "YinYang":YinYangCode(need_logs=True)
}


class Encoding():
    def __init__(self,file_uid):
        self.file_uid = file_uid
        self.config = get_config(yaml_path='config')
       
        self.backend_dir = self.config['backend_dir']

        # file save dir and file information
        self.file_dir = '{}/{}'.format(self.backend_dir,self.config['file_save_dir'])
        self.file_info_path = '{}/{}.yaml'.format(self.file_dir,file_uid)
        self.file_info_dict = get_config(yaml_path=self.file_info_path)

        # file encode dir
        self.dna_dir = self.config['dna_dir']
        self.dna_file = '{}/{}/{}.dna'.format(self.backend_dir,self.dna_dir,self.file_uid)

        # other utils
        self.monitor = Monitor()

    def segment_file(self):
        file_name = self.file_info_dict['file_name']
        file_path = '{}/{}_{}'.format(self.file_dir,self.file_uid,file_name)
        segment_length = self.file_info_dict['segment_length']
        print("Read binary matrix from file: " + file_path)

        matrix, values = [], fromfile(file=file_path, dtype=uint8)
        for current, value in enumerate(values):
            matrix += list(map(int, list(str(bin(value))[2:].zfill(8))))
            self.monitor.output(current + 1, len(values))

        if len(matrix) % segment_length != 0:
            matrix += [0] * (segment_length - len(matrix) % segment_length)

        matrix = array(matrix)
        matrix = matrix.reshape(int(len(matrix) / segment_length), segment_length)
        bit_segments =matrix.tolist()

        print('Segment the unload file....')
        print("There are " + str(len(values) * 8) + " bits in the inputted file. ")
        print("There are " + str(len(bit_segments)) + " bits sequences.\n ")

        return bit_segments

    def connet_index(self):
        bit_segments = self.segment_file()
        index_length = self.file_info_dict['index_length']

        connected_bit_segments = []
        for index in range(len(bit_segments)):
            # define index
            index_code = list(map(int, list(str(bin(index))[2:].zfill(index_length))))
            add_index_seg = index_code + bit_segments[index]
            connected_bit_segments.append(add_index_seg)
            self.monitor.output(index + 1, len(bit_segments))
        print('After segment,add index to the bit sequences.\n')

        return connected_bit_segments
        
    def verify_code(self):
        connected_bit_segments = self.connet_index()
        verify_method = self.file_info_dict['verify_method']
        verify_method = verify_methods[verify_method]
        if verify_method == False:
            bit_segments, error_correction_length = connected_bit_segments,0
        else:
            bit_segments, error_correction_length = verify_method.insert(connected_bit_segments)
        
        verify_code_length = len(bit_segments[0]) - len(connected_bit_segments[0])
        record_info = {"verify_code_length":verify_code_length,
                        "final_segment_bit_length":len(bit_segments[0])
        }
        write_yaml(yaml_path=self.file_info_path,data=record_info,appending=True)
        print('After add index,add verify code to the bit sequences.\n')
        
        return bit_segments

    def bit_to_dna(self):
        
        start_time = datetime.now()
        bit_segments = self.verify_code()
        encode_method = encoding_methods[self.file_info_dict['encode_method']]
        dna_sequences = encode_method.encode(bit_segments)
        print('Encode bit segments to DNA sequences by coding scheme.\n')

        run_time = (datetime.now() - start_time).total_seconds()
        nucleotide_count = len(dna_sequences)*len(dna_sequences[0])

        information_density = self.file_info_dict['bit_size']/nucleotide_count
        information_density = round(information_density,3)
        record_info = {"DNA_sequence_length":len(dna_sequences[0]),
                       "nucleotide_counts":nucleotide_count,
                       "encoding_time":run_time,
                    "information_density":information_density
        }

        write_yaml(yaml_path=self.file_info_path,data=record_info,appending=True)
        write_dna_file(path=self.dna_file,dna_sequences=dna_sequences,need_logs=True)
        return dna_sequences





if __name__ == '__main__':
    obj = Encoding(1565536927137009664)
    # obj.segment_file()
    # obj.connet_index()
    # obj.verify_code()
    obj.bit_to_dna()