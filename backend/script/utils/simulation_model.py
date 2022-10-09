from urllib.request import ProxyBasicAuthHandler
import numpy as np
from math import sqrt,log
import copy 
import time
from . import homopolymer
#import homopolymer

BASE = np.array(['A','C','G','T'])
QUANT = {'A': 0, 'C':1, 'G':2, 'T':3}
qua2str = lambda qua: ''.join(BASE[qua])
str2qua = lambda dna: np.array([QUANT[base] for base in dna],dtype = 'uint8')

class Syn_D:
    '''Synthesis Distribution adopter'''
    def __init__(self, Yield = 0.99, N = 30):
        self.Yield = Yield
        self.N = N
        
    def distribution(self):
        return np.random.binomial(self.N, self.p) #伯努利二项分布
    
    def __call__(self,dnas):
        self.L = len(dnas[0])
        self.p = self.Yield ** self.L

        out = []
        for dna in dnas:
            n = self.distribution()
            out.append({'ori':dna, 'num':n,'re':[[n,[]]]})
        return out

class Synthesizer_simu:
    def __init__(self, arg):
        self.Yield = arg.syn_yield
        self.N = arg.syn_number
        self.probS = arg.syn_sub_prob
        self.probD = arg.syn_del_prob
        self.probI = arg.syn_ins_prob
        self.raw_rate=arg.syn_raw_rate

        self.del_pattern=arg.syn_del_pattern
        self.ins_pattern=arg.syn_ins_pattern##对于添加和删除错误而言，不同base所对应的不同概率；例如：对于ErrASE的syn方式，del概率：ACGT：0.4,0.2,0.2,0.2
        if hasattr(arg,'TM_Normal'):
            self.TM_Normal=arg.TM_Normal
        else:
            self.TM_Normal=True

        if hasattr(arg,'syn_sub_pattern'):
            self.TM=arg.syn_sub_pattern
        else:
            self.TM=None

        self.ins_pos=arg.syn_ins_pos
        self.del_pos=arg.syn_del_pos
        self.syn = Syn_D(self.Yield, self.N)
        self.err = ErrorAdder_simu(self.probS, self.probD, self.probI,self.raw_rate,self.del_pattern,self.ins_pattern,TM=self.TM,TM_Normal=self.TM_Normal,ins_pos=self.ins_pos,del_pos=self.del_pos)

    def __call__(self, dnas):
        dnas = self.syn(dnas)
        dnas = self.err(dnas)
        return dnas

class Decayer_simu:
    def __init__(self, arg):
        self.loss_rate = arg.dec_loss_rate
        self.probS = arg.dec_sub_prob
        self.probD = arg.dec_del_prob
        self.probI = arg.dec_ins_prob
        #self.months_of_storage=arg.months_of_storage
        self.raw_rate = arg.dec_raw_rate*int(arg.months_of_storage)
        self.del_pattern=arg.dec_del_pattern
        self.ins_pattern=arg.dec_ins_pattern
        if hasattr(arg,'TM_Normal'):
            self.TM_Normal=arg.TM_Normal
        else:
            self.TM_Normal=True

        if hasattr(arg,'dec_sub_pattern'):
            self.TM=arg.dec_sub_pattern
        else:
            self.TM=None

        self.ins_pos=arg.dec_ins_pos
        self.del_pos=arg.dec_del_pos
        self.sam = Sampler_simu(p=1-self.loss_rate)
        self.err = ErrorAdder_simu(probS=self.probS, probD = self.probD, probI = self.probI, raw_rate=self.raw_rate,del_pattern=self.del_pattern,ins_pattern=self.ins_pattern,TM=self.TM,TM_Normal=self.TM_Normal,ins_pos=self.ins_pos,del_pos=self.del_pos)

    
    def __call__(self, dnas):
        dnas = self.sam(dnas)
        dnas = self.err(dnas)
        return dnas

class Sequencer_simu:
    def __init__(self, arg):
        self.seq_depth = arg.seq_depth

        self.TM = arg.seq_sub_pattern
        self.probS = arg.seq_sub_prob
        self.probD = arg.seq_del_prob
        self.probI = arg.seq_ins_prob
        self.raw_rate = arg.seq_raw_rate

        self.del_pattern = arg.seq_del_pattern
        self.ins_pattern = arg.seq_ins_pattern  ##对于添加和删除错误而言，不同base所对应的不同概率；例如：对于ErrASE的syn方式，del概率：ACGT：0.4,0.2,0.2,0.2

        if hasattr(arg,'TM_Normal'):
            self.TM_Normal=arg.TM_Normal
        else:
            self.TM_Normal=True

        if hasattr(arg,'seq_sub_pattern'):
            self.TM=arg.seq_sub_pattern
        else:
            self.TM=None

        self.ins_pos=arg.seq_ins_pos
        self.del_pos=arg.seq_del_pos
        self.err=ErrorAdder_simu(self.probS, self.probD, self.probI,self.raw_rate,self.del_pattern,self.ins_pattern,self.TM,self.TM_Normal,ins_pos=self.ins_pos,del_pos=self.del_pos)

    def __call__(self, dnas):
        dnas = self.sample(dnas)
        dnas = self.err(dnas)
        return dnas

    def sample(self, dnas):
        rNs = [dna['num'] for dna in dnas]
        average_copies = sum(rNs) / len(rNs)
        ratio = max(self.seq_depth / average_copies,1) #in case too big
        dnas = Sampler_simu(p=ratio)(dnas)
        return dnas

class PCRer_simu:
    def __init__(self,arg=None):
            p = arg.pcrp #pcr_prob
            N = arg.pcrc #pcr_cycle
            pBias = 0.05

            self.probS = arg.pcr_sub_prob
            self.probD = arg.pcr_del_prob
            self.probI = arg.pcr_ins_prob
            self.raw_rate = arg.pcr_raw_rate*N
            self.del_pattern = arg.pcr_del_pattern
            self.ins_pattern = arg.pcr_ins_pattern
            if hasattr(arg,'TM_Normal'):
                self.TM_Normal=arg.TM_Normal
            else:
                self.TM_Normal=True
            if hasattr(arg,'pcr_sub_pattern'):
                self.TM=arg.pcr_sub_pattern
            else:
                self.TM=None
            self.ins_pos=arg.pcr_ins_pos
            self.del_pos=arg.pcr_del_pos
            self.err = ErrorAdder_simu(probS=self.probS, probD=self.probD, probI=self.probI, raw_rate=self.raw_rate,
                                      del_pattern=self.del_pattern, ins_pattern=self.ins_pattern,TM=self.TM,TM_Normal=self.TM_Normal,ins_pos=self.ins_pos,del_pos=self.del_pos)
            
            self.p = float(p)
            self.N = N
            self.pBias = pBias

            self.u0 = (1 + p) ** N
            self.sigma0 = np.sqrt((1 - p) / (1 + p) * ((1 + p) ** (2 * N) - (1 + p) ** N))

    def distribution(self, ori):
        assert ori >= 0
        p = np.random.uniform(self.p - self.pBias, self.p + self.pBias)  # 左闭右开，随机采样
        N = self.N
        u0 = (1 + p) ** N
        sigma0 = np.sqrt((1 - p) / (1 + p) * ((1 + p) ** (2 * N) - (1 + p) ** N))
        return max(int(np.random.normal(u0 * ori, sigma0 * sqrt(ori))), 0)  # 从高斯分布中随机抽取样本，最小为0

    def run(self, re_dnas):
        out = []
        for dna in re_dnas:
           # print("before:"+str(dna[0]))
            if dna[0]>0:
                dna[0] = self.distribution(dna[0])
            #print("after:"+str(dna[0]))
            if dna[0] > 0:
                out.append(dna)
        return out

    def __call__(self, dnas):
        out_dnas=dnas
        out_dnas=self.err(out_dnas)
        for dna in out_dnas:
            dna['re'] = self.run(dna['re'])
            dna['num'] = sum([tp[0] for tp in dna['re']])
        return out_dnas

class Sampler_simu:
    def __init__(self, p=0.01,arg = None):
        if arg: #for sampling
            self.p=float(arg.sam_ratio)
        else: #for decaying
            self.p = p

    def distribution(self,N):
        if self.p>1:
            return N
        return np.random.binomial(int(N),self.p)

    def run(self,re_dnas):
        markers = []
        for i,dna in enumerate(re_dnas):
            dna[0] = self.distribution(dna[0])
            if dna[0] > 0: markers.append(i)
        re_dnas = [re_dnas[i] for i in markers]
        return re_dnas
    
    def __call__(self,dnas):
        out_dnas = dnas
        for dna in out_dnas:
            dna['re'] = self.run(dna['re'])
            dna['num'] = sum([tp[0] for tp in dna['re']])
        return out_dnas
        
class ErrorAdder_simu:
    def __init__(self, probS=0.2, probD=0.6, probI=0.2, raw_rate=0.0001,del_pattern=None,ins_pattern=None,TM=None,TM_Normal=True,ins_pos={"homopolymer":0,"random":1},del_pos={"homopolymer":0,"random":1}):  # 替代substitute，删除delete和插入insert
        self.probD = probD * raw_rate
        self.probI = probI * raw_rate
        self.probS = probS * raw_rate

        self.del_pattern=del_pattern
        self.ins_pattern=ins_pattern
        self.TM_Normal=TM_Normal

        if TM != None:
            self.TM = TM
            self.all_equal = 0
        else:
            self.TM = genTm(self.probS/3)  # 生成替换概率矩阵，A-CGT
            self.all_equal = 1
        
        self.ins_pos_random=ins_pos['random']
        self.ins_pos_homo=ins_pos['homopolymer']
        self.del_pos_random=del_pos['random']
        self.del_pos_homo=del_pos['homopolymer']

    def genNewError(self, dna):
        Errors = []
        if self.TM_Normal:
            for i, base in enumerate(['A', 'C', 'G', 'T']):
                Pi = np.where(dna == base)[0]
                subi = np.random.choice(['A', 'C', 'G', 'T'], size=Pi.size, p=list(self.TM[base].values())) ###
                subPi = np.where(subi != base)[0]
                for pos in subPi:
                    Errors.append((Pi[pos], 's', subi[pos]))
                    
        else:
            TM_keys=list(self.TM.keys())
            for key in TM_keys:
                index=indexstr(dna,key)
                for i in index:
                    prob_try=np.random.uniform(0,1)
                    if prob_try > self.probS:
                        change=False
                        break
                    else:
                        change=True
                        prob=list(self.TM[key].values())
                        if len(prob)==1:    
                            sub=list(self.TM[key].keys())[0]
                        else:
                            sub=np.random.choice(list(self.TM[key].keys()),p=prob)

                    if change==True:
                        diff_index=np.array(list(key))!=np.array(list(sub))
                        for j,diff in enumerate(diff_index):
                            if diff:
                                Errors.append([i+j,'s',sub[j]])
                        

        ##delete
        del_flag=np.random.choice([False,True],size=len(dna),p=[1-self.probD,self.probD])
        del_count=(np.where(del_flag==True)[0]).size
        del_random_count=int(del_count*self.del_pos_random)
        del_homo_count=del_count-del_random_count
        for i in range(del_random_count):
                if self.del_pattern:
                    choose_base=np.random.choice(list(self.del_pattern.keys()),p=list(self.del_pattern.values()))
                    count=0
                    while count<=5000:
                        pos=np.random.choice(len(dna))
                        if dna[pos]==choose_base:
                            Errors.append([pos,'-',dna[pos]])
                            break
                        else:
                            count+=1
                else:
                    pos=np.random.choice(len(dna))
                    Errors.append([pos,'-',dna[pos]])
        for i in range(del_homo_count):
            homos=homopolymer.homopolymer(dna)
            homos_pos=[[i['startpos'],i['endpos']] for i in homos]
            if self.del_pattern:
                choose_base=choose_base=np.random.choice(list(self.del_pattern.keys()),p=list(self.del_pattern.values()))
                count=0
                while count<=5000:
                    pos=randomPicker(homos_pos)
                    if dna[pos]==choose_base:
                        Errors.append([pos,'-',dna[pos]])
                        break
                    else:
                        count+=1
            else:
                pos=randomPicker(homos_pos)
                Errors.append([pos,'-',dna[pos]])


        #insert
        ins_flag=np.random.choice([False,True],size=len(dna),p=[1-self.probI,self.probI])
        ins_count=(np.where(ins_flag==True)[0]).size
        ins_random_count=int(ins_count*self.ins_pos_random)
        ins_homo_count=ins_count-ins_random_count
        for i in range(ins_random_count):
            if self.ins_pattern:
                choose_base=np.random.choice(list(self.ins_pattern.keys()),p=list(self.ins_pattern.values()))
                count=0
                while count<=5000:
                    pos=np.random.choice((len(dna)))
                    if dna[pos]==choose_base:
                        Errors.append([pos,'+',np.random.choice(['A','C','G','T'])])
                        break
                    else:
                        count+=1
            else:
                pos=np.random.choice(len(dna))
                Errors.append([pos,'+',np.random.choice(['A','C','G','T'])])
        for i in range(ins_homo_count):
            homos=homopolymer.homopolymer(dna)
            homos_pos=[[i['startpos'],i['endpos']] for i in homos]
            if self.del_pattern:
                choose_base=choose_base=np.random.choice(list(self.ins_pattern.keys()),p=list(self.ins_pattern.values()))
                count=0
                while count<=5000:
                    pos=randomPicker(homos_pos)
                    if dna[pos]==choose_base:
                        Errors.append([pos,'+',dna[pos]])
                        break
                    else:
                        count+=1
            else:
                pos=randomPicker(homos_pos)
                Errors.append([pos,'+',dna[pos]])
        
        return Errors

    def run(self, ori_dna, re_dnas):
        ori_dna = np.array(list(ori_dna))
        new_types = []
        for re_dna in re_dnas:
            for i in range(re_dna[0]):
                new_error = self.genNewError(ori_dna)
                if len(new_error) > 0:
                    new_types.append([1, re_dna[1] + new_error])
                    re_dna[0] -= 1
        return re_dnas + new_types

    def __call__(self, dnas, apply=True):
        out_dnas=dnas
        t_err_out=time.time()
        for dna in out_dnas:
            dna['re'] = self.run(dna['ori'], dna['re'])
        t_err_mid=time.time()
        if apply:
            out_dnas = self.apply_batch(out_dnas)
        t_err_batch=time.time()
        print("Err out:"+str(t_err_mid-t_err_out))
        print("Err apply:"+str(t_err_batch-t_err_mid))
        return out_dnas

    # apply errors to dnas
    def apply(self, ori_dna, errors):
        dna = list(ori_dna)
        errors.sort(key=lambda x: x[0])
        # substitutions
        for error in errors:
            pos, tp, base = error
            if tp == 's':
                dna[pos] = base
        # del / insertions
        for error in errors:
            bias = 0
            pos, tp, base = error
            if tp == '-':
                try:
                    dna.pop(pos + bias)
                except:
                    # print('pop index error:', pos + bias)
                    break
                bias -= 1
            elif tp == '+':
                dna.insert(pos, base)
                bias += 1
        dna = ''.join(dna)
        return dna

    def apply_batch(self, dnas):
        for dna in dnas:
            ori_dna = dna['ori']
            re = []
            for re_dna in dna['re']:
                if re_dna[0] == 0: pass
                re.append([re_dna[0], re_dna[1], self.apply(ori_dna, re_dna[1])])
            dna['re'] = re
        return dnas

#生成替换概率矩阵，[[0.9997, 0.0001, 0.0001, 0.0001], [0.0001, 0.9997, 0.0001, 0.0001], [0.0001, 0.0001, 0.9997, 0.0001], [0.0001, 0.0001, 0.0001, 0.9997]]
def genTm(prob):
    tm = dict()
    for i,base in enumerate(['A','C','G','T']):
        row=dict()
        for i,oli in enumerate(['A','C','G','T']):
            row[oli]=prob
        row[base] = 1 - 3* prob
        tm[base]=row
    return tm

def indexstr(str1,str2):
    '''查找指定字符串str1包含指定子字符串str2的全部位置，
    以列表形式返回'''
    lenth2=len(str2)
    lenth1=len(str1)
    indexstr2=[]
    i=0
    while str2 in str1[i:]:
        indextmp = str1.index(str2, i, lenth1)
        indexstr2.append(indextmp)
        i = (indextmp + lenth2)
    return indexstr2

def randomPicker(ranges):
    nums=[]
    for range in ranges:
        for i in range:
            nums.append(i)
    return random.choice(nums)

if __name__ == '__main__':

    # arg_synthesis={
    #         "syn_sub_prob":0.2,
    #         "syn_ins_prob":0.2,
    #         "syn_del_prob":0.2,
    #         "syn_raw_rate":0.000025,
    #         "syn_del_pattern":{"A":0.4,"C":0.2,"G":0.2,"T":0.2},
    #         "syn_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
    #         "syn_del_pos":{"homopolymer":0,"random":1},
    #         "syn_ins_pos":{"homopolymer":0,"random":1},
    #         "TM_Normal":True,
    #         "syn_number": 30,
    #         "syn_yield": 0.99,
    #      }

    
    # arg=ArgumentPasser(arg)
    # dnas=Synthesizer_simu(arg)
    arg_pcr={
         
            "pcr_sub_prob":0.99,
            "pcr_ins_prob":0,
            "pcr_del_prob":0.01,
            "pcr_raw_rate":0.000043,
            "pcr_del_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "pcr_ins_pattern":{"A":0.25,"C":0.25,"G":0.25,"T":0.25},
            "pcr_sub_pattern":{
                                "A":{"C":0.02,"G":0.97,"T":0.01},
                                "C":{"A":0,"G":0,"T":1},
                                "G":{"A":1,"C":0,"T":0},
                                "T":{"A":0.01,"C":0.97,"G":0.02}
                                },
            "pcr_del_pos":{"homopolymer":0,"random":1},
            "pcr_ins_pos":{"homopolymer":0,"random":1},
            "pcr_cycle":12,
            "pcr_prob":0.8
        
    }
    arg=ArgumentPasser(arg_pcr)
    PCR=PCRer_simu(arg)
    dnas=PCR(dnas)
    print(dnas)

