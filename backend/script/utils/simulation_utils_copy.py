from .simulation_arg import synthMeth, decHost,pcrPoly,seqMeth
from Bio import SeqIO
import utils.simulation_model as Model
import os
import tarfile
import subprocess
import shutil
from utils.utils_basic import get_config
import glob

class ArgumentPasser:
    """Simple Class for passing arguments in arg object.
        Init all arttributes from a dictionary.
    """
    def __init__(self, dic):
        self.__dict__.update(dic)

def corresponding_arg(param,param_value,left):
    if param=='synthesis_method':
        res,_=SynthMeth_arg(param_value,left)
    elif param=='storage_host':
        res,_=DecHost_arg(param_value,left)
    elif param=='pcr_polymerase':
        res,_=PcrPoly_arg(param_value,left)
    elif param=='sam_ratio':
        res,_=Sampler_arg(param_value,left)
    elif param=='seq_meth':
        res,_=Seq_arg(param_value,left)
    return res


def SynthMeth_arg(synthesis_method,left):
    dic=synthMeth[synthesis_method]
    dic=ArgumentPasser(dic)
    arg=dic
    dic.syn_number=left[0]
    dic.syn_yield=left[1]
    SYN=Model.Synthesizer_simu(dic)
    return SYN,arg

def DecHost_arg(decay_host,left):
    dic=decHost[decay_host]
    dic=ArgumentPasser(dic)
    arg=dic
    dic.months_of_storage=left[0]
    dic.dec_loss_rate=left[1]
    DEC=Model.Decayer_simu(dic)
    return DEC,arg

def PcrPoly_arg(pcr_polymerase,left):
    dic=pcrPoly[pcr_polymerase]
    dic=ArgumentPasser(dic)
    arg=dic
    dic.pcrc=left[0]
    dic.pcrp=left[1]
    PCR=Model.PCRer_simu(dic)
    return PCR,arg

def Sampler_arg(sam_ratio,left=None):
    dic={"sam_ratio":sam_ratio}
    SAM=Model.Sampler_simu(sam_ratio)
    dic=ArgumentPasser(dic)
    return SAM,dic

def Seq_arg(seq_meth,left):
    dic=seqMeth[seq_meth]
    dic=ArgumentPasser(dic)
    arg=dic
    dic.seq_depth=left[0]
    SEQ=Model.Sequencer_simu(dic)
    return SEQ,arg

def tar_file(upload_dir,simulation_dir,file_uid):
    config=get_config(yaml_path='config')
    backend_dir=config['backend_dir']
    os.chdir(backend_dir)
    file_info_name='{}.yaml'.format(file_uid)
    fasta_file_name='{}.fasta'.format(file_uid)
    file_info = '{}/{}'.format(upload_dir,file_info_name)
    fasta_file = '{}/{}'.format(simulation_dir,fasta_file_name)
    folder_dir='{}/{}'.format(simulation_dir,file_uid)
    if not os.path.exists(folder_dir):
        os.mkdir(folder_dir)    
    shutil.copy(fasta_file,folder_dir+"/"+fasta_file_name)
    shutil.copy(file_info,folder_dir+"/"+file_info_name)
    downfile_name = '{}/{}.tar.gz'.format(simulation_dir,file_uid)
    subprocess.call(["tar", "zcvf", downfile_name, "-P", folder_dir])
    shutil.rmtree(folder_dir)



def is_fasta(filename):
    with open(filename,'r') as handle:
        try:
            i=handle.readline()
            if not str(i).startswith(">"): 
                return False      
            fasta = SeqIO.parse(handle, "fasta")
            return any(fasta)  # False when `fasta` is empty, i.e. wasn't a FASTA file
        except:
            return False

def fasta_to_dna(ori_save_dir):
    sri=SeqIO.parse(ori_save_dir,'fasta')
    dna=[]
    for sr in sri:
        dna.append(str(sr.seq))
    return dna

def fasta_to_dna_demo(ori_save_dir):
    sri=SeqIO.parse(ori_save_dir,'fasta')
    dna=[]
    for sr in sri:
        dna.append(str(sr.seq))
        if len(dna)>=1000:
            return dna
    return dna
    
def error_density(dnas):
        dic={}
        total=0
        for dna in dnas:
            for re in dna['re']:
                n=len(re[1])
                dic[n]=dic.get(n,0)+re[0]
                total+=re[0]
        # for i in dic:
        #         dic[i] = dic[i] / total
        #dic = sorted(dic.items(), key=lambda e: e[0])
        return dic


def funcs_parallel(funcs,dna,final=True):
    error_recorders=[]
    error_density_list=[]
    for fun in funcs:
        dna,error_recorder=fun(dna)
        if final:
            error_recorders.append(error_recorder)
            error_density_list.append(error_density(dna))
    if final:
        return dna,error_recorders,error_density_list     
    else:
        return dna

funcs_parameter={
    "SYN":["synthesis_method","synthesis_number","synthesis_yield"],
    "DEC":["storage_host","months_of_storage","decay_loss_rate"],
    "PCR":["pcr_polymerase","pcr_cycle","pcr_prob"],
    "SAM":['sam_ratio'],
    "SEQ":['seq_meth',"seq_depth"]
}