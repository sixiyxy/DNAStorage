import imp
import os
import numpy as np
from datetime import datetime
from .utils.cd_hit  import CD_HIT
from .utils.cd_hit import read_fasta
from .utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
from .utils.verify_methods import Hamming,ReedSolomon
from .utils.encoding_methods import BaseCodingAlgorithm,Church,Goldman,Grass,Blawat,DNAFountain,YinYangCode
from .utils.decode_utils import remove_index


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

class ClusterDecode():
    def __init__(self,file_uid,clust_method):
        self.file_uid = file_uid
        self.clust_method = clust_method
        self.config = get_config(yaml_path='config')
        self.backend_dir = self.config['backend_dir']
        self.file_dir = '{}/{}'.format(self.backend_dir,self.config['file_save_dir'])
        self.file_info_path = '{}/{}.yaml'.format(self.file_dir,file_uid)
        self.file_info_dict = get_config(yaml_path=self.file_info_path)
        self.threas = self.config['threads']

        # cluster
        self.simulation_dir = '{}/{}'.format(self.backend_dir,self.config['simulation_dir'])
        self.simulation_dna_file = '{}/{}.fasta'.format(self.simulation_dir,self.file_uid)
        self.out_dir = '{}/{}'.format(self.backend_dir,self.config['decode_dir'])
        self.starcode = self.config['starcode_local']

        # decode
        self.out_file = '{}/{}_cdhit.fasta'.format(self.out_dir,self.file_uid)
        self.index_length =  self.file_info_dict['index_length']
        self.verify_method = verify_methods[self.file_info_dict['verify_method']]
        self.decode_method = encoding_methods[self.file_info_dict['encode_method']]
        self.bit_size = self.file_info_dict['bit_size']
        self.segment_length = self.file_info_dict['segment_length']

        # encode
        self.encode_file = '{}/{}.npz'.format(self.out_dir,self.file_uid)
        self.encode_data = np.load(self.encode_file)
        

    def method_cdhit(self):
        cdh=CD_HIT(max_memory=320000,throw_away_sequences_length=60,
            length_difference_cutoff=0.7,amino_acid_length_difference_cutoff=60, 
            long_seq_alignment_coverage=0.7,long_seq_alignment_coverage_control=60,
            short_seq_alignment_coverage=0.7,short_seq_alignment_coverage_control=70,
            nthreads=512)       
        
        cdh.from_file(self.simulation_dna_file,self.out_file,threshold=0.99)

        clust_dna_sequences = open(self.out_file).read().splitlines()[1::2]

        return clust_dna_sequences
        
    def method_starcode(self):
        os.system('{tool} -d 4 -s -t {threads} -i {in_file} -o {out_file}'.format(
            tool = self.starcode,
            threads = self.threads,
            in_file = self.simulation_dna_file,
            out_file = self.out_file))
        
        clust_dna_sequences = open(self.out_file).read().splitlines()[1::2]

        return clust_dna_sequences

    def run_clust(self):
        if self.clust_method == 'cdhit':
            dna_sequences = self.method_cdhit()
        elif self.clust_method == 'starcode':
            dna_sequences = self.method_starcode()
        elif self.clust_method == None:
            dna_sequences = open(self.encode_dna).read().splitlines()
        return dna_sequences

    def decode_to_bits(self):
        pass

    def decode_stat(self):
        # encode information
        encode_dna_sequences = self.encode_data['dna_sequences']
        encode_index_payload = self.encode_data['index_payload']
        encode_bit_segment = self.encode_data['bit_sequences']

        # simulation dna sequence
        simulation_dna_seq = open(self.simulation_dna_file).read().splitlines()[1::2]
        simulation_dna_number= len(simulation_dna_seq)

        # get after clust simulation sequences
        start_time = datetime.time()
        clust_dna_sequences = self.run_clust()
        clust_dna_sequences_list = [list(i) for i in clust_dna_sequences]
        clust_time = datetime.time() - start_time
        # report dna sequence
        encoding_dna_sequences_set = set(encode_dna_sequences)
        clust_dna_sequences_set = set(clust_dna_sequences)
        right_dna_number = len(encoding_dna_sequences_set & clust_dna_sequences_set)

        right_dna_rate = str(round(right_dna_number/len(encoding_dna_sequences_set)*100,2)) + '%'

        # dna to 01
        decode_result = self.decode_method.carbon_to_silicon(clust_dna_sequences_list,)
        decode_bit_segments = decode_result['bit']

        decode_bit_segments_length = len(decode_bit_segments[0])
        encode_bit_segments_length = len(encode_bit_segment[0])

        decode_bit_segments_str = [''.join(list(map(str,i))) for i in decode_bit_segments]
        decode_bit_segments_str = set(decode_bit_segments_str)
        encode_bit_segment_str = set(encode_bit_segment)
        in_label = len(decode_bit_segments_str&encode_bit_segment_str)
        if decode_bit_segments_length == encode_bit_segments_length and in_label>0:
            print('#'*10,'decode success!!!')

        decoding_time = decode_result['t']


        print(self.verify_method,'####')
        # remove verify code
        if self.verify_method == False:
            error_rate = 0
            error_indices = []
            verified_segments = decode_bit_segments
        else:
            verified_data = self.verify_method.remove(decode_bit_segments)
            verified_segments = verified_data['bit']
            error_indices = verified_data["e_bit"]
            error_rate = str(round(verified_data["e_r"] * 100, 2)) + "%"
        
        # decode index with payload
        decode_index_payload = [''.join(list(map(str,i))) for i in verified_segments]

        decode_remove_verify_len = len(verified_segments[0])
        encode_index_payload_len = len(encode_index_payload[0])
        if decode_remove_verify_len == encode_index_payload_len:
            print('#'*10,'remove verify code success!!!')

        # remove index
        # indices, decode_payload = remove_index(verified_segments, self.index_length, True)
        # decode_payload = [''.join(list(map(str,i))) for i in decode_payload]
        
        # report file data  
        encode_bits = set([str(segment) for segment in encode_index_payload])
        decode_bits = set([str(segment) for segment in decode_index_payload]) 
        # after set，so number is less than dna sequence number - error indeice number


        recall_bits = encode_bits & decode_bits
        error_bits_number = len(decode_bits) -  len(recall_bits)
        error_bits_rate = str(round(error_bits_number/len(decode_bits) * 100, 2)) + "%"

        # record
        record_info = {"decode_time":decoding_time,
                        "clust_method":self.clust_method,
                        "clust_time":clust_time,
                        "encode_dna_sequence_number":len(encode_dna_sequences) ,
                        "simulation_dna_number":simulation_dna_number,
                        "after_clust_dna_sequence_number":len(clust_dna_sequences_set),
                        "recall_dna_sequence_number": right_dna_number,
                        "recall_dna_sequence_rate":right_dna_rate,
                        "verify_method_remove_bits":len(error_indices),
                        "encode_bits_number":len(encode_bits),
                        "final_decode_bits_number":len(decode_bits),
                        "recall_bits_number": len(recall_bits),
                        "error_bits_number":error_bits_number,
                        "error_bits_rate":error_bits_rate,
                        "recall_bits_rate":'{} %'.format(round(recall_bits/encode_bit_segment,2))}
        write_yaml(yaml_path=self.file_info_path,data=record_info,appending=True)
        print(record_info)
        print('Decoding Done!')

        return record_info

if __name__ == '__main__':
    # obj = Encoding(1565536927137009664)
    # record_info,bit_segments = obj.bit_to_dna()

    obj = ClusterDecode(file_uid = 1593806601213579264,clust_method= 'cdhit')

    obj.decode_stat()
