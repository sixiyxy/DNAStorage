import numpy as np
from numpy import fromfile
import pandas as pd

def cut_file(file_data):
    file_size = file_data.shape[0]
    cut_file_data = []
    if file_size <= 1000000000:
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
    return gc_distribution,gc_distribution

def add_min_free_energydata(free_enerfy_file,final_record_info):
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
        data = {'x_value':x_value,'y_value':str(interval_value[idx]),'range':range_label}
        free_energy_plotdata.append(data)

    final_record_info['min_free_energy'] = float(avg_free_energy)
    final_record_info['min_free_energy_below_30kcal_mol'] = str(free_energy_30)+'%'
    # print(str(free_energy_30)+'%')
        
    return final_record_info,free_energy_plotdata



def download_normal(file,original_bit_segments,record_index,connected_bit_segments,final_bit_segments,dna_sequences):
    # record dowdload file
    f = open(file,'a+')
    for idx in range(len(dna_sequences)):
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


def download_txt(file,dna_sequences,original_chracter_segments):
    f = open(file,'a+')
    for idx in range(len(dna_sequences)):
        payload = original_chracter_segments[idx]
        DNA_sequence= dna_sequences[idx]
        f.write('{payload},{DNA_sequence}\n'.format(
                payload=payload,
                DNA_sequence = DNA_sequence))
    f.close()

