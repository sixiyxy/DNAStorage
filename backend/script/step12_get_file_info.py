import os,sys
from numpy import fromfile, array, uint8
from utils import get_config,Monitor



def read_bits_from_file(path, segment_length=120, need_logs=True):
    monitor = Monitor()
    if need_logs:
        print("Read binary matrix from file: " + path)

    matrix, values = [], fromfile(file=path, dtype=uint8)
    print(values,len(values),len(values)*8)
    print(len(matrix))
    for current, value in enumerate(values):

        matrix += list(map(int, list(str(bin(value))[2:].zfill(8))))

        if need_logs:
            monitor.output(current + 1, len(values))
    
    print(len(matrix))
    if len(matrix) % segment_length != 0:
        matrix += [0] * (segment_length - len(matrix) % segment_length)

    matrix = array(matrix)
    matrix = matrix.reshape(int(len(matrix) / segment_length), segment_length)
    print(matrix.shape)

    if need_logs:
        print("There are " + str(len(values) * 8) + " bits in the inputted file. "
              + "Please keep this information in mind if you do not consider storing the model in serialization!")

    return matrix.tolist(), len(values) * 8

'''
input:
    file_uid,
    segment_length,
    index_length,
    varify_method
'''
def get_file_info(file_uid,
    segment_length,
    index_length,
    varify_method):

    config = get_config()
    backend_dir = config['backend_dir']
    file_dir = config['file_save_dir']
    file_path = '{}/{}/{}_{}'.format(backend_dir,file_dir,file_uid,file_name)
    original_bit_segments, bit_size = read_bits_from_file(file_path,
    segment_length=segment_length,need_logs=True)

    print(bit_size)




if __name__ =='__main__':
    get_file_info(file_uid=1564988971384180736,
                  segment_length=160,
                  index_length=20,
                  varify_method='Hamming')
