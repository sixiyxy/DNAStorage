import numpy as np
from numpy import fromfile
import pandas as pd
import os
import tarfile
import random

def cut_file(file_data,encode_method):
    file_size = file_data.shape[0]
    cut_file_data = []
    if encode_method in ['DNA_Fountain',"Yin_Yang"]:
        cut_size = 1000000
    else:
        if file_size <= 1000000:
            cut_size = 4000
        else:
            cut_size = 12000 

    if file_size <= cut_size:
        cut_file_data.append(list(file_data))
    else:
        for i in range(file_size//cut_size):
            if i+1 != file_size//cut_size:
                cut_data = file_data[i*cut_size:(i+1)*cut_size]
            else:
                cut_data = file_data[i*cut_size:]
            cut_data = cut_data.tolist()
            cut_file_data.append(cut_data)
    
    return cut_file_data

def gc_homo(dna_sequences):
    # record plot data
    gc_distribution = [0 for _ in range(101)]
    homo_distribution = [0 for _ in range(max(list(map(len, dna_sequences))))]

    for dna_sequence in dna_sequences:
        dna_segment = "".join(dna_sequence)
        # print(dna_segment)
        gc_content = int(((dna_segment.count("C") + dna_segment.count("G")) / len(dna_segment) * 100) + 0.5)
        gc_distribution[gc_content] += 1
        # print([homo + 1 for homo in range(len(dna_sequence))][::-1])
        for homo_length in [homo + 1 for homo in range(len(dna_sequence))][::-1]:
            # print(homo_length)
            is_find = False
            missing_segments = ["A" * homo_length, "C" * homo_length, "G" * homo_length, "T" * homo_length]
            for missing_segment in missing_segments:
                if missing_segment in dna_segment:
                    is_find = True
                    # print(missing_segment,homo_length)
                    homo_distribution[homo_length] += 1
                    break
                if is_find:
                    break
    front_gc = []
    front_homo = []

    for i in range(101):
        plot_dict = {'x_value':i,'y_value':gc_distribution[i]}
        front_gc.append(plot_dict)
    

    # for i in range(max(list(map(len, dna_sequences)))):
    # front_homo.append({'x_value':1,'y_value':0})
    # front_homo.append({'x_value':2,'y_value':0})
    for i in range(1,20):
        plot_dict = {'x_value':i,'y_value':homo_distribution[i]}
        front_homo.append(plot_dict)

    return front_gc,front_homo

def add_min_free_energydata(tools,dna_demo_file,free_enerfy_file):

    # run tools
    os.system("{tools} --noPS --noGU --noconv -T 59.1"
          " < {demo_dna} > {outfile}".format(tools=tools,demo_dna=dna_demo_file,outfile=free_enerfy_file))
    
    # min free energy
    min_free_energy_list = []
    min_free_energy_30 = []
    with open(free_enerfy_file) as f:
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
        data = {'x_value':x_value,'y_value':int(interval_value[idx]),'range':range_label}
        free_energy_plotdata.append(data)
    info = {}
    info['min_free_energy'] = float(avg_free_energy)
    info['min_free_energy_below_30kcal_mol'] = float(free_energy_30)
    info['energy_plot']=free_energy_plotdata
    return info

def write_dna_file(path,demo_path, dna_sequences):
    with open(path, "a+") as file:
        for index, dna_sequence in enumerate(dna_sequences):
            file.write('>{}\n{}\n'.format(index,dna_sequence))
    
    if len(dna_sequences)<=1000:
        demo_dna_sequences =dna_sequences
    else:
        demo_dna_sequences = random.sample(dna_sequences,1000)
        
    with open(demo_path, "a+") as demo_file:
        for index, dna_sequence in enumerate(demo_dna_sequences):
            demo_file.write("".join(dna_sequence) + "\n")
    print("### Write 1000 demo DNA sequences for Simulation:\n {} ".format(path))
    return demo_dna_sequences

def download_normal(file,download_data):
    # record dowdload file    
    number = download_data['total']
    payload_all = download_data['payload']
    index_all = download_data['index']
    index_payload_all = download_data['index_payload']
    index_payload_verfiycode_all =download_data["index_payload_verfiycode"]
    dna_sequences_all = download_data['DNA_sequence']

    f = open(file,'w')
    f.write('payload,index,index_payload,index_payload_verfiycode,DNA_sequence\n')

    for idx in range(number):
        payload = payload_all[idx]
        index = index_all[idx]
        index_payload  = index_payload_all[idx]
        index_payload_verfiycode= index_payload_verfiycode_all[idx]
        DNA_sequence= dna_sequences_all[idx]
        f.write('{payload},{index},{index_payload},{index_payload_verfiycode},{DNA_sequence}\n'.format(
                payload=payload,index=index,index_payload=index_payload,
                index_payload_verfiycode=index_payload_verfiycode,
                DNA_sequence = DNA_sequence))
    f.close()

def download_txt(file,dna_sequences,original_chracter_segments):
    f = open(file,'w')
    f.write('payload,DNA_sequence\n')
    for idx,dna_sequence in enumerate(dna_sequences):
        payload = original_chracter_segments[idx]
        f.write('{payload},{DNA_sequence}\n'.format(
                payload=payload,
                DNA_sequence = dna_sequence))
    f.close()

def tar_file(upload_dir,encode_dir,file_uid):
    current_dir = os.getcwd()
    
    # file save dir and file information
    file_info_name = '{}.yaml'.format(file_uid)
    # file encode dir
    dna_file = '{}.txt'.format(file_uid)
    # fasta file
    fasta_file = '{}.fasta'.format(file_uid)

    os.chdir(encode_dir)
    downfile_name = '{}.tar.gz'.format(file_uid)
    file_obj = tarfile.open(downfile_name,'w:gz')
    file_obj.add(dna_file)
    file_obj.add(fasta_file)
    os.chdir(upload_dir)
    file_obj.add(file_info_name)
    os.chdir(current_dir)
    file_obj.close()

def contact_result(self,parallel_results):
        bit_szie_all = 0
        segment_number_all = 0
        nucleotide_counts_all = 0
        information_density_all = 0
        net_information_density_all = 0
        DNA_sequence_length = 0
        physical_information_density_ug_all = 0
        physical_information_density_g_all = 0
        original_bit_segments_all= []
        record_index_all = []
        connected_bit_segments_all = []
        final_bit_segments_all = []
        dna_sequences_all = []

        gc_dict = {}
        homo_dict = {}

        result_number = len(parallel_results)

        for one_result in parallel_results:  
            bit_szie_all += one_result['bit_size']
            segment_number_all += int(one_result['segment_number'])
            DNA_sequence_length = one_result['DNA_sequence_length']
            nucleotide_counts_all += one_result['nucleotide_counts']
            information_density_all +=one_result['information_density']
            net_information_density_all += one_result['net_information_density']
            physical_information_density_ug_all += one_result['physical_information_density_ug']
            physical_information_density_g_all += one_result['physical_information_density_g']
            original_bit_segments_all += one_result['original_bit_segments']
            record_index_all += one_result['record_index']
            connected_bit_segments_all += one_result['connected_bit_segments']
            final_bit_segments_all += one_result['final_bit_segments']
            dna_sequences_all += one_result['dna_sequences']
        
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

        final_record_info = {
                    "bit_size":bit_szie_all,
                    "segment_number":segment_number_all,
                    "segment_length":self.segment_length,
                    "index_length":self.index_length,
                    "verify_method":self.verify_method,
                    "encode_method":self.encode_method,
                    "DNA_sequence_length":DNA_sequence_length,
                    "nucleotide_counts":nucleotide_counts_all,
                    "information_density":round(information_density_all/result_number,3),
                    "net_information_density":round(net_information_density_all/result_number,3),
                    "physical_information_density_ug":round(physical_information_density_ug_all/result_number,3),
                    "physical_information_density_g":round(physical_information_density_g_all/result_number,3)
                    }
        final_record_info['gc_plot']= front_gc
        final_record_info['homo_plot']=front_homo

        return final_record_info

def save_decode_txt(file_dir,payload,bit_sequences,dna_sequences):
    save_dict = {
        'index_payload':payload,
        'bit_sequences':bit_sequences,
         'dna_sequences':dna_sequences}
    np.savez(file_dir,**save_dict)