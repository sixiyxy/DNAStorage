import os,sys
from utils.utils_basic import get_config,write_yaml


def read_bits_from_file(path, segment_length=120):
    monitor = Monitor()
    print("Read binary matrix from file: " + path)

    matrix, values = [], fromfile(file=path, dtype=uint8)
    for current, value in enumerate(values):
        matrix += list(map(int, list(str(bin(value))[2:].zfill(8))))
        monitor.output(current + 1, len(values))

    if len(matrix) % segment_length != 0:
        matrix += [0] * (segment_length - len(matrix) % segment_length)

    matrix = array(matrix)
    matrix = matrix.reshape(int(len(matrix) / segment_length), segment_length)

    print("There are " + str(len(values) * 8) + " bits in the inputted file. ")
    
    return matrix.tolist(), len(values) * 8

class Encoding():
    def __init__(self,file_uid):
        self.file_uid = file_uid
        self.config = get_config(yaml_path='config')
       
        self.backend_dir = self.config['backend_dir']

        # file save dir and file information
        self.file_dir = '{}/{}'.format(self.backend_dir,self.config['file_save_dir'])
        file_info_path = '{}/{}.yaml'.format(self.file_dir,file_uid)
        self.file_info_dict = get_config(yaml_path=file_info_path)

        # file encode dir
        self.dna_dir = self.config['encode_dir']

    def segment_file(self):
        file_name = self.file_info_dict['file_name']
        file_path = '{}/{}_{}'.format(self.file_dir,self.file_uid,file_name)
        print(self.file_info_dict)

        segment_length = self.file_info_dict['segment_length']
        
        bit_segments,bit_size = read_bits_from_file(file_path,segment_length)
        print(bit_segments,bit_size)

    def connet_index(self):
        pass

    def bit_to_dna(self):
        pass




if __name__ == '__main__':
    obj = Encoding(1565536927137009664)
    obj.segment_file()