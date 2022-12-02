import imp
import os
import numpy as np
from datetime import datetime
from .utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
from .utils.verify_methods import Hamming,ReedSolomon
from .utils.encoding_methods import BaseCodingAlgorithm,Church,Goldman,Grass,Blawat,DNAFountain,YinYangCode
from .utils.decode_utils import remove_index
from .utils.srcode import SrcCode


verify_methods = {
    "WithoutVerifycode":False,
    "Hamming":Hamming(need_logs=False),
    "ReedSolomon":ReedSolomon(need_logs=False)}



class ClusterDecode():
    def __init__(self,file_uid,clust_method):
        self.file_uid = file_uid
        self.clust_method = clust_method
        self.config = get_config(yaml_path='config')
        self.backend_dir = self.config['backend_dir']
        self.file_dir = '{}/{}'.format(self.backend_dir,self.config['file_save_dir'])
        self.file_info_path = '{}/{}.yaml'.format(self.file_dir,file_uid)
        self.file_info_dict = get_config(yaml_path=self.file_info_path)
        self.threads = self.config['threads']

        # cluster
        self.simulation_dir = '{}/{}'.format(self.backend_dir,self.config['simulation_dir'])
        self.simulation_dna_file = '{}/{}.fasta'.format(self.simulation_dir,self.file_uid)
        self.out_dir = '{}/{}'.format(self.backend_dir,self.config['decode_dir'])
        self.starcode = self.config['starcode']
        # self.starcode = '/Users/jianglikun/VScode/starcode/starcode'
        self.cdhit = self.config['cdhit']

        # decode
        self.starcode_outfile = '{}/{}_mid.fasta'.format(self.out_dir,self.file_uid)
        self.out_file = '{}/{}.fasta'.format(self.out_dir,self.file_uid)
        
        self.bit_size = self.file_info_dict['bit_size']
        self.segment_length = self.file_info_dict['segment_length']

        # encode
        self.method_name = self.file_info_dict['encode_method']
        self.segment_length = self.file_info_dict['segment_length']
        self.index_length =  self.file_info_dict['index_length']
        self.verify_method = verify_methods[self.file_info_dict['verify_method']]
        
        self.encode_file = '{}/{}.npz'.format(self.out_dir,self.file_uid)
        self.encode_data = np.load(self.encode_file)
        

    def method_cdhit(self):
        cmd = '{tool} -T {threads} -c 0.99 -i {in_file} -o {out_file} '.format(
            tool = self.cdhit, 
            threads = 16,
            in_file = self.simulation_dna_file,
            out_file = self.out_file)
        print('# CDHIT cmd is:',cmd)
        os.system(cmd)
        clust_dna_sequences = open(self.out_file).read().splitlines()[1::2]

        return clust_dna_sequences
        
    def method_starcode(self):
        cmd = '{tool} -d 4 -s -t {threads} -i {in_file} -o {out_file}'.format(
                tool = self.starcode,
                threads = self.threads,
                in_file = self.simulation_dna_file,
                out_file = self.starcode_outfile)
        print('### starcode cmd is:',cmd)
        os.system(cmd)
        cmd = "cut -f 1 {} > {}".format(self.starcode_outfile,self.out_file)
        os.system(cmd)
        clust_dna_sequences = open(self.out_file).read().splitlines()

        return clust_dna_sequences

    def normal_decode(self,clust_dna_sequences):
        # encode information
        encode_dna_sequences = self.encode_data['dna_sequences']
        encode_index_payload = self.encode_data['index_payload']
        encode_bit_segment = self.encode_data['bit_sequences']
        
        if self.method_name == "DNA_Fountain":
            encode_index_payload = [i[self.index_length:] for i in encode_bit_segment]
        encoding_dna_sequences_set = set(encode_dna_sequences)
        encode_index_payload_set = set(encode_index_payload)
        encode_bit_segment_set = set(encode_bit_segment)


        # simulation dna sequence
        simulation_dna_seq = open(self.simulation_dna_file).read().splitlines()[1::2]
        simulation_dna_number= len(simulation_dna_seq)

        # decode
        method_dict = { "Basic":BaseCodingAlgorithm(need_logs=False),
                             "Church":Church(need_logs=False),
                             "Goldman":Goldman(need_logs=False),
                             "Grass":Grass(need_logs=False),
                             "Blawat":Blawat(need_logs=False),
                             "DNA_Fountain":DNAFountain(decode_packets=len(encode_bit_segment),need_logs=False),
                             "Yin_Yang":YinYangCode(index_length =self.index_length ,need_logs=False)}
        start_time = datetime.now()
        decode_method = method_dict[self.method_name]
        clust_dna_sequences_list = [list(i) for i in clust_dna_sequences]
        decode_result = decode_method.carbon_to_silicon(clust_dna_sequences_list)


        decode_bit_segments = decode_result['bit']
        a = []
        if self.method_name == "DNA_Fountain":
            for i in decode_bit_segments:
                if len(i) >1: #[1]
                    id = len(i)-self.segment_length
                    payload = i[id:]
                    a.append(payload)
            decode_bit_segments = a
        decode_bit_segments_str = [''.join(list(map(str,i))) for i in decode_bit_segments]
        decode_bit_segments_set = set(decode_bit_segments_str)
        # print([len(i) for i in decode_result['bit']])
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
        
        # print([len(i) for i in verified_segments])
        decode_index_payload = [''.join(list(map(str,i))) for i in verified_segments]
        decode_index_payload_set = set([str(segment) for segment in decode_index_payload]) 
        # print([len(i) for i in decode_bit_segments_set])
        decode_time = (datetime.now() - start_time).total_seconds()
        decode_time = '%.2f s'%(decode_time)

        #######################################################################
        ### stat dna
        clust_dna_sequences_set = set(clust_dna_sequences)
        recall_dna_number = len(encoding_dna_sequences_set & clust_dna_sequences_set)
        recall_dna_rate = str(round(recall_dna_number/len(encoding_dna_sequences_set)*100,2)) + '%'

        ### stat final bit segment rate,before verify code
        recall_fianl_bits_num = len(encode_bit_segment_set & decode_bit_segments_set)
        recall_final_bits_rate=  round((recall_fianl_bits_num/len(encode_bit_segment_set))*100,2)

        ### stat index_payload
        # print(len(encode_bit_segment[0]))
        # print([len(i) for i in decode_bit_segments_set])
        # print(encode_bit_segment_set,decode_bit_segments_set)
        recall_bits_num = len(encode_index_payload_set & decode_index_payload_set)
        recall_bits_rate=  round((recall_bits_num/len(encode_index_payload_set))*100,2)
        error_bits_number = len(decode_index_payload_set) -  recall_bits_num
        # error_bits_rate = str(round(error_bits_number/len(decode_index_payload_set) * 100, 2)) + "%"

        ### remove index
        # indices, decode_payload = remove_index(verified_segments, self.index_length, True)
        # decode_payload = [''.join(list(map(str,i))) for i in decode_payload]

        info = {"clust_method":self.clust_method,
                        "encode_dna_sequence_number":len(encode_dna_sequences) ,
                        "simulation_dna_number":simulation_dna_number,
                        "after_clust_dna_sequence_number":len(clust_dna_sequences_set),
                        "recall_dna_sequence_number": recall_dna_number,
                        "recall_dna_sequence_rate":recall_dna_rate,
                        "verify_method_remove_bits":len(error_indices),
                        "encode_bits_number":len(encode_index_payload_set),
                        "final_decode_bits_number":len(decode_bit_segments_set),
                        "recall_bits_number": recall_bits_num,
                        "recall_bits_rate":'{} %'.format(recall_bits_rate)}
        return info

    def decode_txt(self,clust_dna_sequences):
        # encode info
        encode_index_payload_str = self.encode_data['index_payload']
        encode_dna_sequences =self.encode_data['dna_sequences']  
        encode_charaters_set = set(encode_index_payload_str) 
        
        encoding_dna_sequences_set = set(encode_dna_sequences)

        # simulation dna sequence
        simulation_dna_seq = open(self.simulation_dna_file).read().splitlines()[1::2]
        simulation_dna_number= len(simulation_dna_seq)


        # decode_characters_list = SrcCode().decode(clust_dna_sequences)
        # decode_characters_list_set = set(decode_characters_list)
        # print(encode_charaters_set)

        #######################################################################
        ### stat dna
        clust_dna_sequences_set = set(clust_dna_sequences)
        recall_dna_number = len(encoding_dna_sequences_set & clust_dna_sequences_set)
        recall_dna_rate = str(round(recall_dna_number/len(encoding_dna_sequences_set)*100,2)) + '%'

        ### stat chraters segment rate
        # recall_charaters_num = len(encode_charaters_set & decode_characters_list_set)
        # recall_charaters_rate =  round((recall_charaters_num/len(encode_charaters_set))*100,2)

    
        recall_charaters_num = recall_dna_number
        recall_charaters_rate =  recall_dna_rate
        decode_characters_list_set = encoding_dna_sequences_set & clust_dna_sequences_set

        info = {"clust_method":self.clust_method,
                        "encode_dna_sequence_number":len(encode_dna_sequences) ,
                        "simulation_dna_number":simulation_dna_number,
                        "after_clust_dna_sequence_number":len(clust_dna_sequences_set),
                        "recall_dna_sequence_number": recall_dna_number,
                        "recall_dna_sequence_rate":recall_dna_rate,
                        "encode_bits_number":len(encode_charaters_set),
                        "final_decode_bits_number":len(decode_characters_list_set),
                        "recall_bits_number": recall_charaters_num,
                        "recall_bits_rate":'{} %'.format(recall_charaters_rate)}
        return info

    def decode(self): 
        ### get after clust simulation sequences
        print('### Star clust simulation dna sequence...')
        start_time = datetime.now()
        if self.clust_method == 'cdhit':
            clust_dna_sequences = self.method_cdhit()
        elif self.clust_method == 'starcode':
            clust_dna_sequences = self.method_starcode()
        elif self.clust_method == None:
            clust_dna_sequences = open(self.encode_dna).read().splitlines()
        clust_time = (datetime.now() - start_time).total_seconds()
        clust_time = '%.2f s'%(clust_time)
        print('### Clust simulation dan sequence done.')

        ### decoding
        print('### Star decode dna sequences....')
        start_time = datetime.now()
        normal_methods = ["Basic","Church","Goldman","Grass","Blawat","DNA_Fountain","Yin_Yang"]
        if self.method_name in normal_methods:
            record_info = self.normal_decode(clust_dna_sequences)
        elif self.method_name == 'SrcCode':
            record_info = self.decode_txt(clust_dna_sequences)
        else:
            raise('can not find decode method!')
        decode_time = (datetime.now() - start_time).total_seconds()
        decode_time = '%.2f s'%(decode_time)
        print('### Decode Done.')

        ### done and feedback
        record_info['decode_time']=decode_time
        record_info['clust_time'] =clust_time
        write_yaml(yaml_path=self.file_info_path,data=record_info,appending=True)
        print('### Front data is ready')
        print(record_info)
        return record_info

if __name__ == '__main__':
    # obj = Encoding(1565536927137009664)
    # record_info,bit_segments = obj.bit_to_dna()

    obj = ClusterDecode(file_uid = 159524562738885836,clust_method= 'starcode')

    a,b = obj.clust()
    obj.decode(a,b)
