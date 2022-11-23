import copy
import os,sys
import re
import yaml
import random
import tarfile
from datetime import datetime

def get_config(yaml_path=''):
    now_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(os.path.dirname(now_dir))

    # read file yaml
    if yaml_path !='config':
        f = open(yaml_path)
        config_data = f.read()
        config = yaml.load(config_data,Loader=yaml.FullLoader)
    # read config yaml
    elif yaml_path == 'config':
        config_file = '{}/script/config.yaml'.format(backend_dir)
        f = open(config_file)
        config_data = f.read()
        config = yaml.load(config_data,Loader=yaml.FullLoader)
        config['backend_dir'] = backend_dir
    return config

def is_txt(file):
    try:
        upload_file = open(file,"r",encoding='UTF-8')
        upload_file.read()
        return True
    except:
        return False


def write_yaml(yaml_path,data,appending):
    display_data = copy.deepcopy(data)
    if appending==False:
        with open(yaml_path,"w",encoding="utf-8") as f:
            yaml.dump(data,f)
    elif appending==True:
        yaml_data = get_config(yaml_path=yaml_path)
        data_keys = list(data.keys())
        # print(data_keys)
        # if "energy_plot" in data_keys:
        #     del data['energy_plot']
        # if "gc_data" in data_keys:
        #     del data['gc_data']
        # if "homo_data" in data_keys:
        #     del data['homo_data']

        if data_keys[0] not in yaml_data:
            with open(yaml_path,"a",encoding="utf-8") as f:
                yaml.dump(data,f)
        elif data_keys[0]=="simu":
            with open(yaml_path,encoding="utf-8") as f:
                yaml_ori=yaml.load(f,Loader=yaml.FullLoader)
                yaml_ori['simu']=data['simu']
            with open(yaml_path,"w",encoding="utf-8") as f:
                del data['simu']
                yaml.dump(data,f)
                yaml.dump(yaml_ori,f)
                
    return display_data

def write_dna_file(path,demo_path, dna_sequences):
   
    with open(path, "a+") as file:
        for index, dna_sequence in enumerate(dna_sequences):
            file.write("".join(dna_sequence) + "\n")
    
    if not os.path.exists(demo_path):
        if len(dna_sequences)<=1000:
            demo_dna_sequences =dna_sequences
        else:
            demo_dna_sequences = random.sample(dna_sequences,1000)
        
        with open(demo_path, "a+") as demo_file:
            for index, dna_sequence in enumerate(demo_dna_sequences):
                demo_file.write("".join(dna_sequence) + "\n")
        print("### Write 1000 demo DNA sequences for Simulation:\n {} ".format(path))
    return demo_dna_sequences

def get_download_path(type,file_uid):
    current_dir = os.getcwd()
    config = get_config(yaml_path='config')
    backend_dir = config['backend_dir']
    
    if type == 'encode':
        # file save dir and file information
        file_dir = os.path.join(backend_dir,config['file_save_dir'])
        file_info_name = '{}.yaml'.format(file_uid)

        # file encode dir
        dna_dir = os.path.join(backend_dir,config['encode_dir'])
        dna_file = '{}.txt'.format(file_uid)

    elif type =='simulation':
        file_dir = os.path.join(backend_dir,config['upload_dna_save_dir'])
        file_info_name = '{}.yaml'.format(file_uid)

        dna_dir =   os.path.join(backend_dir,config['simulation_dir'])
        dna_file = '{}.fasta'.format(file_uid)
    
    
    os.chdir(dna_dir)
    downfile_name = '{}.tar.gz'.format(file_uid)
    file_obj = tarfile.open(downfile_name,'w:gz')
    file_obj.add(dna_file)
    os.chdir(file_dir)
    file_obj.add(file_info_name)
    os.chdir(current_dir)
    file_obj.close()
    downloadfile_path = os.path.join(dna_dir,downfile_name)
    print(dna_dir,downfile_name)
    return dna_dir,downfile_name


def example_plot(segment_length):
    n = 1
    data = []
    while 2**n <= segment_length:
        sub = {'name':'Hamming{}'.format(n-1),
               'method':'Hamming',
               'value':2**n }
        data.append(sub)
        check = {'name':'check{}'.format(n-1),
                  'method':'Hamming',
                  'value':1}
        data.append(check)
        n +=1
    
    info = {'name':'Info',
            'method':'Hamming',
            'value':segment_length-2**(n-1)}
    data.append(info)
        
    return data

class Monitor:

    def __init__(self):
        self.last_time = None

    def output(self, current_state, total_state, extra=None):
        if self.last_time is None:
            self.last_time = datetime.now()

        position = int(current_state / total_state * 100)

        string = "|"

        for index in range(0, 100, 5):
            if position >= index:
                string += "█"
            else:
                string += " "

        string += "|"

        current_state = max(current_state, 1)

        pass_time = (datetime.now() - self.last_time).total_seconds()
        wait_time = int(pass_time * (total_state - current_state) / current_state)

        string += " " * (3 - len(str(position))) + str(position) + "% ("

        string += " " * (len(str(total_state)) - len(str(current_state))) + str(current_state) + "/" + str(total_state)

        if current_state != total_state:
            minute, second = divmod(wait_time, 60)
            hour, minute = divmod(minute, 60)
            string += ") wait " + "%04d:%02d:%02d" % (hour, minute, second)
        else:
            minute, second = divmod(pass_time, 60)
            hour, minute = divmod(minute, 60)
            string += ") used " + "%04d:%02d:%02d" % (hour, minute, second)

        if extra is not None:
            string += " " + str(extra).replace("\'", "").replace("{", "(").replace("}", ")") + "."
        else:
            string += "."

        print("\r" + string, end="", flush=True)

        if current_state == total_state:
            self.last_time = None
            print()


if __name__ == '__main__':
    # get_download_path(type='encode',file_uid=1565536927137009664)
    a = example_plot(160)
    print(a)