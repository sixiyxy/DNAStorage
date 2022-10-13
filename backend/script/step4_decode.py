from re import S
from utils.cd_hit  import CD_HIT
from utils.cd_hit import read_fasta
from utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
from utils.verify_methods import Hamming,ReedSolomon
from utils.encoding_methods import BaseCodingAlgorithm,Church,Goldman,Grass,Blawat,DNAFountain,YinYangCode

verify_methods = {
    "WithoutVerifycode":False,
    "Hamming":Hamming(),
    "ReedSolomon":ReedSolomon()
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

class ClusterDecode():
    def __init__(self,file_uid,clust_method):
        self.file_uid = file_uid
        self.clust_method = clust_method
        self.config = get_config(yaml_path='config')
        self.backend_dir = self.config['backend_dir']
        self.file_dir = '{}/{}'.format(self.backend_dir,self.config['file_save_dir'])
        self.file_info_path = '{}/{}.yaml'.format(self.file_dir,file_uid)
        self.file_info_dict = get_config(yaml_path=self.file_info_path)

        # cluster
        self.simulation_dir = '{}/{}'.format(self.backend_dir,self.config['simulation_dir'])
        self.simulation_dna_file = '{}/{}.fasta'.format(self.simulation_dir,self.file_uid)
        self.out_dir = '{}/{}'.format(self.backend_dir,self.config['decode_dir'])

        # encode
        self.encode_dir = '{}/{}'.format(self.backend_dir,self.config['encode_dir'])
        self.encode_dna = '{}/{}.dna'.format(self.encode_dir,self.file_uid)

        # decode
        self.index_length =  self.file_info_dict['index_length']
        self.verify_method = verify_methods[self.file_info_dict['verify_method']]
        self.decode_method = encoding_methods[self.file_info_dict['encode_method']]
        self.bit_size = self.file_info_dict['bit_size']
        self.segment_length = self.file_info_dict['segment_length']

    def method_cdhit(self):
        cdh=CD_HIT(max_memory=320000,throw_away_sequences_length=60,
            length_difference_cutoff=0.7,amino_acid_length_difference_cutoff=60, 
            long_seq_alignment_coverage=0.7,long_seq_alignment_coverage_control=60,
            short_seq_alignment_coverage=0.7,short_seq_alignment_coverage_control=70,
            nthreads=512)       
        out_file = '{}/{}_cdhit.fasta'.format(self.out_dir,self.file_uid)
        cdh.from_file(self.simulation_dna_file,out_file,threshold=0.97)

        clust_dna_sequences = open(out_file).read().splitlines()[1::2]

        return clust_dna_sequences
        
    def method_xx(self):
        return 'xx'

    def run_clust(self):
        if self.clust_method == 'cdhit':
            dna_sequences = self.method_cdhit()
        elif self.clust_method == 'xx':
            dna_sequences = self.method_xx()
        elif self.clust_method == None:
            dna_sequences = open(self.encode_dna).read().splitlines()
        return dna_sequences

    def decode(self):
        # get encode sequences
        encoding_dna_sequences = open(self.encode_dna).read().splitlines()

        # get after clust simulation sequences
        clust_dna_sequences = self.run_clust()
        clust_dna_sequences_list = [list(i) for i in clust_dna_sequences]

        # dna to 01
        decode_result = self.decode_method.carbon_to_silicon(clust_dna_sequences_list,self.bit_size,self.segment_length)
        decode_bit_segments = decode_result['bit']
        decoding_time = decode_result['t']

        # remove verify code
        if self.verify_method == False:
            error_rate = None
            error_indices = None
            error_bit_segments = None
        else:
            verify_data = self.verify_method.remove(decode_bit_segments)
            verified_segment_01 = verify_data['bit']
        
        # report dna sequence
        encoding_dna_sequences_set = set(encoding_dna_sequences)
        clust_dna_sequences_set = set(clust_dna_sequences)
        right_dna_number = len(encoding_dna_sequences_set & clust_dna_sequences_set)

        right_dna_rate = round(right_dna_number/len(encoding_dna_sequences_set),2)
        print(len(encoding_dna_sequences_set),len(clust_dna_sequences_set),right_dna_number,right_dna_rate)

        # report file data  
        

        # record
        record_info = {"decode_time":decoding_time,
                        "clust_method":self.clust_method,
                        "encode_dna_sequence_number":len(encoding_dna_sequences) ,
                        "after_clust_dna_sequence_number":len(clust_dna_sequences_set) ,
                        "recall_dna_sequence_number": right_dna_number,
                        "recall_dna_sequence_rate":right_dna_rate,
                        "": }
        print(record_info)
        write_yaml(yaml_path=self.file_info_path,data=record_info,appending=True)
        print('Decoding Done!')

        return record_info

if __name__ == '__main__':
    obj = ClusterDecode(file_uid = 1565536927137009664,
                          clust_method= 'cdhit')
    # obj.run_clust()
    obj.decode()
