from .simulation_arg import synthMeth, decHost,pcrPoly,seqMeth
from Bio import SeqIO


class ArgumentPasser:
    """Simple Class for passing arguments in arg object.
        Init all arttributes from a dictionary.
    """
    def __init__(self, dic):
        self.__dict__.update(dic)

def SynthMeth_arg(synthesis_method):
    dic=synthMeth[synthesis_method]
    return ArgumentPasser(dic)

def DecHost_arg(decay_host):
    dic=decHost[decay_host]
    return ArgumentPasser(dic)

def PcrPoly_arg(pcr_polymerase):
    dic=pcrPoly[pcr_polymerase]
    return ArgumentPasser(dic)

def Sampler_arg(sam_ratio):
    dic={"sam_ratio":sam_ratio}
    return ArgumentPasser(dic)

def Seq_arg(seq_meth):
    dic=seqMeth[seq_meth]
    return ArgumentPasser(dic)

def is_fasta(filename):
    with open(filename,'r') as handle:
        fasta = SeqIO.parse(handle, "fasta")
        return any(fasta)  # False when `fasta` is empty, i.e. wasn't a FASTA file

def fasta_to_dna(ori_save_dir):

    with open (ori_save_dir) as f:
                dna=[]
                for line in f:
                    line=str(line).strip('b').strip("'").strip('\\r\\n')
                    if line[0]!=">":
                        dna.append(line.strip('\n'))
    return dna