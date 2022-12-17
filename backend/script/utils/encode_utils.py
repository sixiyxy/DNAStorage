import numpy as np
from numpy import fromfile
import pandas as pd
import os
import tarfile
import random
from script.utils.utils_basic import get_config
import shutil
import subprocess
import billiard as multiprocessing


def cut_file(file_data,encode_method):
    file_size = file_data.shape[0]
    cut_file_data = []
    if encode_method in ['DNA_Fountain',"Yin_Yang"]:
        cut_size = 20000
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

def write_dna_file(method,path,demo_path,info,dna_sequences):
    with open(path, "a+") as file:
        info_dict = dict(zip(range(len(info)),info))
        ### download fasta file
        if method == 'DNA_Fountain':
            index = 0
            dna_sequences_record = []
            for cut in dna_sequences:
                for dna_sequence,index_many in cut.items(): 
                    payload = '|'.join([info_dict[i] for i in index_many])
                    file.write('>{}|{}\n{}\n'.format(index,payload,''.join(dna_sequence)))
                    index+=1  
                dna_sequences_record += list(cut.keys())           
        elif method == 'Yin_Yang':
            for index,dna_sequence in enumerate(dna_sequences):
                payload = info_dict[index]
                if dna_sequence == 'AGCT':
                    file.write('>{}|{}|fail encode!\n{}\n'.format(index,payload,''.join(dna_sequence)))
                else:
                    file.write('>{}|{}\n{}\n'.format(index,payload,''.join(dna_sequence)))
            dna_sequences_record = dna_sequences
        elif method == 'SrcCode':
            for index,dna_sequence in enumerate(dna_sequences):
                payload = info_dict[index]
                file.write('>{}|{}\n{}\n'.format(index,payload,dna_sequence))
            dna_sequences_record = dna_sequences
        else:
            for index,dna_sequence in enumerate(dna_sequences):
                payload = info_dict[index]
                file.write('>{}|{}\n{}\n'.format(index,payload,''.join(dna_sequence)))
            dna_sequences_record = dna_sequences

    print("### Write fasta DNA sequences for dwonload: {} ".format(path))

    ### demo file
    if len(dna_sequences_record)<=1000:
        demo_dna_sequences =dna_sequences_record
    else:
        demo_dna_sequences = random.sample(dna_sequences_record,1000)
    with open(demo_path, "a+") as demo_file:
        for index, dna_sequence in enumerate(demo_dna_sequences):
            demo_file.write("".join(dna_sequence) + "\n")
    print("### Write 1000 demo DNA sequences for Simulation: {} ".format(demo_path))
    
    return demo_dna_sequences

def parell_write(file,index_list,download_data):
    with open(file,'a+') as f:
        payload_all = download_data['payload']
        index_all = download_data['index']
        index_payload_all = download_data['index_payload']
        index_payload_verfiycode_all =download_data["index_payload_verfiycode"]
        dna_sequences_all = download_data['DNA_sequence']
        for idx in index_list:
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

def download_normal_bk(file,download_data,threads):
    # record dowdload file    
    number = download_data['total']
    if number <= 10000:
        cut_data_all = [list(range(number))]
    else:
        cut_size = 2000
        cut_data_all = []
        index_list_all = list(range(number))
        for i in range(number//cut_size):
            if i+1 != number//cut_size:
                cut_data = index_list_all[i*cut_size:(i+1)*cut_size]
            else:
                cut_data = index_list_all[i*cut_size:]
            # cut_data = cut_data.tolist()
            cut_data_all.append(cut_data)
        print('paralle write, number is {}'.format(len(cut_data_all)))
    with open(file,'w') as f:
        f.write('payload,index,index_payload,index_payload_verfiycode,DNA_sequence\n')
    input_paralle = [(file,i,download_data) for i in cut_data_all]
    with multiprocessing.Pool(threads) as pool:
        pool.imap(parell_write,input_paralle)
    f.close()

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

def download_normal_small(file,download_data):
    # record dowdload file    
    number = download_data['total']
    payload_all = download_data['payload']
    dna_sequences_all = download_data['DNA_sequence']

    f = open(file,'w')
    f.write('payload,DNA_sequence\n')

    for idx in range(number):
        payload = payload_all[idx]

        DNA_sequence= dna_sequences_all[idx]
        f.write('{payload},{DNA_sequence}\n'.format(
                payload=payload,DNA_sequence = DNA_sequence))
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
    config=get_config(yaml_path='config')
    backend_dir=config['backend_dir']
    os.chdir(backend_dir)
    file_info_name='{}.yaml'.format(file_uid)
    fasta_file_name='{}.fasta'.format(file_uid)
    # dna_file_name = '{}.txt'.format(file_uid)
    
    file_info = '{}/{}'.format(upload_dir,file_info_name)
    fasta_file = '{}/{}'.format(encode_dir,fasta_file_name)
    # dna_file='{}/{}'.format(encode_dir,dna_file_name)
    folder_dir='{}/{}'.format(encode_dir,file_uid)
    if not os.path.exists(folder_dir):
        os.mkdir(folder_dir)    
    shutil.copy(fasta_file,folder_dir+"/"+fasta_file_name)
    shutil.copy(file_info,folder_dir+"/"+file_info_name)
    # shutil.copy(dna_file,folder_dir+"/"+dna_file_name)
    downfile_name = '{}/{}.tar.gz'.format(encode_dir,file_uid)
    # subprocess.call(["tar", "zcvf", downfile_name, "-P", folder_dir])
    os.system('tar -cf - {}|pigz -4 -p 16 > {}'.format(folder_dir,downfile_name))
    shutil.rmtree(folder_dir)


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