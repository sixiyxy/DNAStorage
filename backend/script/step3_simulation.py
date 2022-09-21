import utils.simulation_model as Model
import numpy as np
from utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
from utils.simulation_utils import SynthMeth_arg, DecHost_arg, PcrPoly_arg, Sampler_arg


def get_simu_synthesis_info(file_uid,
    synthesis_number,
    synthesis_yield,
    synthesis_method):

    '''
    Input:
        file_uid
        synthesis_number
        synthesis_yield
        synthesis_method
    '''
    # file information path
    config = get_config(yaml_path='config')
    backend_dir = config['backend_dir']
    file_dir=config['file_save_dir']

    file_info_path='{}/{}/{}.yaml'.format(backend_dir,file_dir,file_uid)

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

    reference_link='0'

    syn_info={
        "synthesis_number":synthesis_number,
        "synthesis_yield":synthesis_yield,
        "synthesis_method":synthesis_method,
        'synthesis_method_reference':reference_link
    }
    write_yaml(yaml_path=file_info_path,data=syn_info,appending=True)
    ##error_occur_number???
    ##diagram settings???
    return syn_info,dnas_syn

def get_simu_dec_info(file_uid,
    months_of_storage,
    loss_rate,
    storage_host,
    in_dnas):

    '''
    Input:
        file_uid
        months_of_storage,
        loss_rate,
        storage_host,
        dnas
    '''

    # file information path
    config = get_config(yaml_path='config')
    backend_dir = config['backend_dir']
    file_dir=config['file_save_dir']

    file_info_path='{}/{}/{}.yaml'.format(backend_dir,file_dir,file_uid)

    arg=DecHost_arg(storage_host)
    arg.months_of_storage=months_of_storage
    arg.dec_loss_rate=loss_rate

    DEC=Model.Decayer_simu(arg)
    dnas_dec=DEC(in_dnas)

    dec_info={
        "storgae_host":storage_host,
        "decay_reference_link":0,
        "months_of_storage":months_of_storage,
        "decay_loss_rate":loss_rate
    }
    write_yaml(yaml_path=file_info_path,data=dec_info,appending=True)

    return dec_info,dnas_dec

def get_simu_pcr_info(file_uid,
    pcr_cycle,
    pcr_prob,
    pcr_polymerase,
    in_dnas):

    '''
    Input:
        file_uid
        pcr_cycle
        pcr_prob
        pcr_polymerase
        in_dnas
    '''
    # file information path
    config = get_config(yaml_path='config')
    backend_dir = config['backend_dir']
    file_dir=config['file_save_dir']

    file_info_path='{}/{}/{}.yaml'.format(backend_dir,file_dir,file_uid)

    arg=PcrPoly_arg(pcr_polymerase)
    arg.pcrc=pcr_cycle
    arg.pcrp=pcr_prob

    PCR=Model.PCRer_simu(arg)
    dnas_pcr=PCR(in_dnas)

    pcr_info={
        "pcr_polymerase":pcr_polymerase,
        "pcr_reference_link":0,
        "pcr_cycle":pcr_cycle,
        "pcr_prob":pcr_prob
    }
    write_yaml(yaml_path=file_info_path,data=pcr_info,appending=True)

    return pcr_info,dnas_pcr

def get_simu_sam_info(file_uid,
    sam_ratio,
    in_dnas):

    '''
    Input:
        file_uid
        sam_ratio
        in_dnas
    '''
    # file information path
    config = get_config(yaml_path='config')
    backend_dir = config['backend_dir']
    file_dir=config['file_save_dir']

    file_info_path='{}/{}/{}.yaml'.format(backend_dir,file_dir,file_uid)

    arg=Sampler_arg(sam_ratio)

    Sam=Model.Sampler_simu(arg)
    dnas_sam=Sam(in_dnas)

    sam_info={
        "sam_ratio":sam_ratio
    }
    write_yaml(yaml_path=file_info_path,data=sam_info,appending=True)

    return sam_info,dnas_sam

def get_simu_seq_info(file_uid,
    seq_depth,
    seq_meth,
    in_dnas):

    '''
    Input:
        file_uid
        seq_depth
        seq_meth
        in_dnas
    '''
    # file information path
    config = get_config(yaml_path='config')
    backend_dir = config['backend_dir']
    file_dir=config['file_save_dir']

    file_info_path='{}/{}/{}.yaml'.format(backend_dir,file_dir,file_uid)

    arg=Seq_arg(seq_meth)
    arg.seq_depth=seq_depth

    Seq=Model.Sequencer_simu(arg)
    dnas_seq=Seq(in_dnas)

    seq_info={
        "seq_depth":seq_depth,
        "seq_meth":seq_meth,
        "seq_reference":seq_reference
    }
    write_yaml(yaml_path=file_info_path,data=seq_info,appending=True)

    return seq_info,dnas_seq

def calculate_density(dnas):
    nums = {}
    total = 0
    for dna in dnas:
        for re in dna['re']:
            n = re[0]
            nums[n] = nums.get(n, 0) + 1
            total += 1
    print(nums)
    print(total)
    for i in nums:
        nums[i] = nums[i] / total
    nums = sorted(nums.items(), key=lambda e: e[0])
    return nums

if __name__ == "__main__":

    _,in_dnas=get_simu_synthesis_info(1565536927137009664,
    30,0.99,'ErrASE')

    a=get_simu_dec_info(1565536927137009664,24,0.3,'Ecoli',in_dnas)
    print(a)

