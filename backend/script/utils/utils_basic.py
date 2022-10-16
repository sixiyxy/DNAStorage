from distutils.command.config import config
import imp
import os,sys
from webbrowser import get
import yaml
import random
from datetime import datetime


def get_config(yaml_path=''):
    now_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(os.path.dirname(now_dir))
    print(yaml_path)
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

def write_yaml(yaml_path,data,appending):
    if appending==False:
        with open(yaml_path,"w",encoding="utf-8") as f:
            yaml.dump(data,f)
    elif appending==True:
        print(yaml_path)
        yaml_data = get_config(yaml_path=yaml_path)
        data_keys = list(data.keys())
        # print(data_keys)
        if data_keys[0] not in yaml_data:
            with open(yaml_path,"a",encoding="utf-8") as f:
                yaml.dump(data,f)

def write_dna_file(path, dna_sequences, need_logs=False):
    monitor = Monitor()

    with open(path, "w") as file:
        for index, dna_sequence in enumerate(dna_sequences):
            file.write("".join(dna_sequence) + "\n")

            if need_logs:
                monitor.output(index + 1, len(dna_sequences))
        if need_logs:
            print("Write DNA sequences to file: " + path + '\n')
    return True

def write_dna_sample_file(path, dna_sequences, need_logs=False):
    monitor = Monitor()
    demo_dna_sequences = random.sample(dna_sequences,1000)
    with open(path, "w") as file:
        for index, dna_sequence in enumerate(demo_dna_sequences):
            file.write("".join(dna_sequence) + "\n")

            if need_logs:
                monitor.output(index + 1, len(dna_sequences))
        if need_logs:
            print("Write 1000 demo DNA sequences to file: " + path + '\n')
    return True

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