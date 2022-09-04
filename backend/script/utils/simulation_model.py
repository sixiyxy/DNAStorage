import numpy as np
from math import sqrt,log
import copy
#import config ##default config ???
import time

BASE = np.array(['A','C','G','T'])
QUANT = {'A': 0, 'C':1, 'G':2, 'T':3}
qua2str = lambda qua: ''.join(BASE[qua])
str2qua = lambda dna: np.array([QUANT[base] for base in dna],dtype = 'uint8')

class Synthesizer_simu:
    def __init__(self, arg):
        self.Yield      =   arg.syn_yield
        self.n          =   arg.syn_number
        self.probS      =   arg.syn_sub_prob
        self.probD      =   arg.syn_ins_prob
        self.raw_rate   =   arg.syn_raw_rate

        self.del_pattern    =   arg.syn_del_pattern
        self.ins_pattern    =   arg.syn_ins_pattern

        self.syn    =   Syn_D(self.Yield, self.N)
        self.err    =   ErrorAdder_simu(self.probS, self.probD, self.probI, self.raw_rate,self.del_pattern, self.ins_pattern)

    def __call__(self, dnas):
        dnas=self.syn(dnas)
        dnas=self.err(dnas)
        return dnas

class ErrorAdder_simu:
    def __init__(self, probS=0.2/3, probD=0.6, probI=0.2, raw_rate=0.0001, del_pattern=None, ins_pattern=None, TM=None): 
        self.probD  =   probD * raw_rate
        self.probI  =   probI * raw_rate
        self.probS  =   probS * raw_rate

        self.del_pattern    =   del_pattern
        self.ins_pattern    =   ins_pattern

        if TM != None:
            self.TM =   TM
            self.all_equal  =   0
        else:
            self.TM = genTM(self.probS)
            self.all_equal =   1

    def genNewError(self, dna):
        Errors = []
        for i, base in enumerate(['A', 'C', 'G', 'T']):
            Pi = np.where(dna == base)[0]
            subi = np.random.choice(['A', 'C', 'G', 'T'], size=Pi.size, p=self.TM[i])
            subPi = np.where(subi != base)[0]
            for pos in subPi:
                Errors.append((Pi[pos], 's', subi[pos]))
        #delP = np.where(np.random.choice([False, True], size=len(dna), p=[1 - self.probD, self.probD]))[0]
        #insP = np.where(np.random.choice([False, True], size=len(dna), p=[1 - self.probI, self.probI]))[0]

        ##delete
        del_flag=np.random.choice([False,True],size=len(dna),p=[1-self.probD,self.probD])
        del_count=(np.where(del_flag==True)[0]).size
        for i in range(del_count):
                if self.del_pattern:
                    choose_base=np.random.choice(list(self.del_pattern.keys()),p=list(self.del_pattern.values()))
                    count=0
                    while count<=5000:
                        pos=np.random.choice(len(dna))
                        if dna[pos]==choose_base:
                            Errors.append([pos,'-',dna[pos]])
                            continue
                        else:
                            count+=1
                else:
                    pos=np.random.choice(len(dna))
                    Errors.append([pos,'-',dna[pos]])

    
