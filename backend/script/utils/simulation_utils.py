from .simulation_arg import synthMeth, decHost,pcrPoly,seqMeth
from Bio import SeqIO
import script.utils.simulation_model as Model


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
    print("res",res)
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
    print("DEC",left)
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
    with open (ori_save_dir) as f:
                dna=[]
                for line in f:
                    line=str(line).strip('b').strip("'").strip('\\r\\n')
                    if line[0]!=">":
                        dna.append(line.strip('\n'))
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