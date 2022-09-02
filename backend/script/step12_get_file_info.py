import imp
import os,sys
sys.path.append('./')
sys.path.append('../')
import json
from numpy import fromfile, array, uint8

from .utils.utils_basic import get_config,write_yaml


'''
input:
    file_uid,
    segment_length,
    index_length,
    verify_method,
    encode_method
'''
def get_file_info(file_uid,
    segment_length,
    index_length,
    verify_method,
    encode_method):

    # file information path
    config = get_config(yaml_path='config')
    backend_dir = config['backend_dir']
    file_dir = config['file_save_dir']

    file_info_path = '{}/{}/{}.yaml'.format(backend_dir,file_dir,file_uid)
    file_info_dict = get_config(yaml_path=file_info_path)

    file_name = file_info_dict['file_name']
    file_path = '{}/{}/{}_{}'.format(backend_dir,file_dir,file_uid,file_name)

    # compute file size
    matrix, values = [], fromfile(file=file_path, dtype=uint8)
    byte_size = len(values)
    bit_size_initial = byte_size*8
    supplyment_bit = segment_length - bit_size_initial%segment_length 
    bit_size_final = bit_size_initial + supplyment_bit
    segment_number = bit_size_final/segment_length
    segment_number = int(segment_number)

    file_info = {"byte_size":byte_size,
                "bit_size":bit_size_final,
                "segment_length":segment_length,
                "segment_number":segment_number,
                "index_length":index_length,
                "verify_method":verify_method,
                "encode_method":encode_method}
    write_yaml(yaml_path=file_info_path,data=file_info,appending=True)

    return file_info



if __name__ =='__main__':
    a = get_file_info(file_uid=1565226758242963456,
                  segment_length=160,
                  index_length=20,
                  verify_method='x')
    print(a)