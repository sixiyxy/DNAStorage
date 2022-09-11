from utils import simulation_model as Model
import numpy as np
from utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
from utils.simulation_utils import SynthMeth_arg

'''
Input:
    file_uid
    synthesis_number
    synthesis_yield
    synthesis_method
'''
def get_simu_synthesis_info(file_uid,
    synthesis_number,
    synthesis_yield,
    synthesis_method):

    # file information path
    config = get_config(yaml_path='config')
    backend_dir = config['backend_dir']
    dna_dir = config['dna_dir']
    dna_file = '{}/{}/{}.dna'.format(backend_dir,dna_dir,file_uid)

    with open(dna_file) as f:
        dnas=f.readlines()
    in_dnas=[dna.split('\n')[0] for dna in dnas]

    arg=SynthMeth_arg(synthesis_method)
    arg.syn_number=synthesis_number
    arg.syn_yield=synthesis_yield

    SYN=Model.Synthesizer_simu(arg)
    dnas_syn=SYN(in_dnas)

    print(dnas_syn)


if __name__ == "__main__":

    get_simu_synthesis_info(1565536927137009664,
    30,0.99,'ErrASE')