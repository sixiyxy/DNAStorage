from distutils.command.config import config
import os,sys
from webbrowser import get
import yaml
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

def write_yaml(yaml_path,data,appending):
    if appending==False:
        with open(yaml_path,"w",encoding="utf-8") as f:
            yaml.dump(data,f)
    elif appending==True:
        yaml_data = get_config(yaml_path=yaml_path)
        data_keys = list(data.keys())
        print(data_keys)
        if data_keys[0] not in yaml_data:
            with open(yaml_path,"a",encoding="utf-8") as f:
                yaml.dump(data,f)


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