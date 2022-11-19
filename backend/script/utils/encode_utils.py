import numpy as np
from numpy import fromfile
import pandas as pd
import os

def cut_file(file_data,encode_method):
    file_size = file_data.shape[0]
    cut_file_data = []
    print('file size:',file_size)
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
    front_gc = []
    front_homo = []

    for i in range(101):
        plot_dict = {'x_value':i,'y_value':gc_distribution[i]}
        front_gc.append(plot_dict)
    

    # for i in range(max(list(map(len, dna_sequences)))):
    front_homo.append({'x_value':1,'y_value':0})
    front_homo.append({'x_value':2,'y_value':0})
    for i in range(3,51):
        plot_dict = {'x_value':i,'y_value':homo_distribution[i]}
        front_homo.append(plot_dict)

    return front_gc,front_homo

def add_min_free_energydata(tools,dna_demo_file,free_enerfy_file,final_record_info):

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

    final_record_info['min_free_energy'] = float(avg_free_energy)
    final_record_info['min_free_energy_below_30kcal_mol'] = float(free_energy_30)

        
    return final_record_info,free_energy_plotdata

def download_normal(file,original_bit_segments,record_index,connected_bit_segments,final_bit_segments,dna_sequences):
    # record dowdload file
    f = open(file,'w')
    f.write('payload,index,index_payload,index_payload_verfiycode,DNA_sequence\n')
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
    f = open(file,'w')
    f.write('payload,DNA_sequence\n')
    for idx in range(len(dna_sequences)):
        payload = original_chracter_segments[idx]
        DNA_sequence= dna_sequences[idx]
        f.write('{payload},{DNA_sequence}\n'.format(
                payload=payload,
                DNA_sequence = DNA_sequence))
    f.close()

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

def save_decode_file(file_dir,payload,bit_sequences,dna_sequences):
    save_dict = {
        'index_payload':payload,
        'bit_sequences':bit_sequences,
         'dna_sequences':dna_sequences
    }
    np.savez(file_dir,**save_dict)