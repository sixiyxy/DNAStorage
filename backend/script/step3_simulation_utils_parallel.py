# import script.utils.simulation_model as Model
# import numpy as np
# from script.utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
# from script.utils.simulation_utils import SynthMeth_arg, DecHost_arg, PcrPoly_arg, Sampler_arg,Seq_arg,fasta_to_dna
import os
from multiprocessing import Pool
import time
from tqdm import tqdm
import math
from collections import Counter

import utils.simulation_model as Model
import numpy as np
from utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
from utils.simulation_utils import SynthMeth_arg, DecHost_arg, PcrPoly_arg, Sampler_arg,Seq_arg,fasta_to_dna


class Simulation():
    def __init__(self,file_uid=None,upload_flag=False):
        if file_uid!=None:
            self.file_uid   =   file_uid
            self.config = get_config(yaml_path='config')
            self.backend_dir = self.config['backend_dir']
            self.simulation_dir =   self.config['simulation_dir'] #to save simulated files
            
            if not upload_flag:
                self.file_dir=self.config['file_save_dir']
                self.file_info_path='{}/{}/{}.yaml'.format(self.backend_dir,self.file_dir,self.file_uid)
                self.dna_dir = self.config['encode_dir']
                self.dna_file = '{}/{}/{}.dna'.format(self.backend_dir,self.dna_dir,self.file_uid)
            
                with open(self.dna_file) as f:
                    dnas=f.readlines()
                self.simu_dna=[dna.split('\n')[0] for dna in dnas]
                
            else:
                self.file_dir=self.config['upload_dna_save_dir']
                self.file_info_path='{}/{}/{}.yaml'.format(self.backend_dir,self.file_dir,self.file_uid)
                self.file_path='{}/{}/{}.fasta'.format(self.backend_dir,self.file_dir,self.file_uid)
                self.simu_dna=fasta_to_dna(self.file_path)
            
            self.syn_density=0
            self.simu_repo={}
            self.simu_repo["Error_Recorder"]=[]
            self.funcs=[]
            self.simu_dna_ori=self.simu_dna

    def get_simu_synthesis_info(self,synthesis_number,
        synthesis_yield,
        synthesis_method):
        '''
        Input:
            synthesis_number
            synthesis_yield
            synthesis_method
        '''
        # file information path

        arg=SynthMeth_arg(synthesis_method)
        arg.syn_number=synthesis_number
        arg.syn_yield=synthesis_yield

        SYN=Model.Synthesizer_simu(arg)
        self.simu_dna,syn_error_recorder=SYN(self.simu_dna)
        self.funcs.append(SYN)
        print("Syn Error Recorder",syn_error_recorder)
        error_density=self.error_density(self.simu_dna)
        #print("Syn Error Recorder",syn_error_recorder)
        print("Syn Error Density",error_density)
        syn_info={
            "synthesis_number":int(synthesis_number),
            "synthesis_yield":float(synthesis_yield),
            "synthesis_method":synthesis_method,
            "synthesis_error_density":error_density,
            'synthesis_method_reference':arg.reference
        }
        write_yaml(yaml_path=self.file_info_path,data=syn_info,appending=True)
        self.syn_density=self.calculate_density(self.simu_dna)
        
        syn_info['syn_density']=self.syn_density
        syn_info['error_param']={"sub":arg.syn_sub_prob,"ins":arg.syn_ins_prob,"del":arg.syn_del_prob}
        self.simu_repo["synthesis"]=syn_info
        #self.simu_repo["Error_Recorder"].append(syn_error_recorder)
        return syn_info

    def get_simu_dec_info(self,
        months_of_storage,
        loss_rate,
        storage_host):

        '''
        Input:
            months_of_storage,
            loss_rate,
            storage_host,
            dnas
        '''

        # file information path

        arg=DecHost_arg(storage_host)
        arg.months_of_storage=months_of_storage
        arg.dec_loss_rate=loss_rate

        DEC=Model.Decayer_simu(arg)
        self.simu_dna,dec_error_recorder=DEC(self.simu_dna)
        self.funcs.append(DEC)
        #self.simu_dna,dec_error_recorder=self.parallel_test(DEC)
        error_density=self.error_density(self.simu_dna)
        print("Dec Error Recorder",dec_error_recorder)
        dec_info={
            "storage_host":storage_host,
            "months_of_storage":months_of_storage,
            "decay_loss_rate":loss_rate,
            "decay_error_density":error_density,
            "storage_host_parameter_reference":arg.reference
        }
        write_yaml(yaml_path=self.file_info_path,data=dec_info,appending=True)
        dec_density=self.calculate_density(self.simu_dna)
        dec_info['error_param']={"sub":arg.dec_sub_prob,"ins":arg.dec_ins_prob,"del":arg.dec_del_prob}
        self.simu_repo["decay"]=dec_info
        self.simu_repo["Error_Recorder"].append(dec_error_recorder)
        return dec_info,self.syn_density,dec_density

    def get_simu_pcr_info(self,
        pcr_cycle,
        pcr_prob,
        pcr_polymerase):

        '''
        Input:
            pcr_cycle
            pcr_prob
            pcr_polymerase
        '''
        # file information path

        arg=PcrPoly_arg(pcr_polymerase)
        arg.pcrc=pcr_cycle
        arg.pcrp=pcr_prob

        PCR=Model.PCRer_simu(arg)
        self.funcs.append(PCR)
        self.simu_dna,pcr_error_recorder=PCR(self.simu_dna)
        #self.simu_dna,pcr_error_recorder=self.parallel_test(PCR)
        print("PCR Error Recorder",pcr_error_recorder)
        density=self.calculate_density(self.simu_dna)
        error_density=self.error_density(self.simu_dna)

        pcr_info={
            "pcr_polymerase":pcr_polymerase,
            "pcr_cycle":pcr_cycle,
            "pcr_prob":pcr_prob,
            "pcr_error_density":error_density,
            "pcr_method_reference":arg.reference
        }
        write_yaml(yaml_path=self.file_info_path,data=pcr_info,appending=True)
        pcr_info["prc_density"]=density
        pcr_info['error_param']={"sub":arg.pcr_sub_prob,"ins":arg.pcr_ins_prob,"del":arg.pcr_del_prob}
        self.simu_repo["pcr"]=pcr_info
        self.simu_repo["Error_Recorder"].append(pcr_error_recorder)
        return pcr_info

    def get_simu_sam_info(self,
        sam_ratio):

        '''
        Input:
            sam_ratio
        '''
        # file information path
        arg=Sampler_arg(sam_ratio)

        Sam=Model.Sampler_simu(arg=arg)
        self.funcs.append(Sam)
        self.simu_dna,sam_error_recorder=Sam(self.simu_dna)
        print("Sample Error Recorder:",sam_error_recorder)
        density=self.calculate_density(self.simu_dna)
        error_density=self.error_density(self.simu_dna)

        sam_info={
            "sam_ratio":sam_ratio,
            "sam_error_density":error_density
        }
        write_yaml(yaml_path=self.file_info_path,data=sam_info,appending=True)
        sam_info["sam_density"]=density
        self.simu_repo["sample"]=sam_info
        self.simu_repo["Error_Recorder"].append(sam_error_recorder)
        return sam_info

    def get_simu_seq_info(self,
        seq_depth,
        seq_meth):

        '''
        Input:
            seq_depth
            seq_meth
        '''

        arg=Seq_arg(seq_meth)
        arg.seq_depth=seq_depth

        Seq=Model.Sequencer_simu(arg)
        self.funcs.append(Seq)
        self.simu_dna,seq_error_recorder=Seq(self.simu_dna)
        #self.simu_dna,seq_error_recorder=self.parallel_test(Seq)
        seq_reference=0
        print("Seq Error Recorder",seq_error_recorder)
        density=self.calculate_density(self.simu_dna)
        error_density=self.error_density(self.simu_dna)

        seq_info={
            "seq_depth":seq_depth,
            "seq_meth":seq_meth,
            "seq_reference":seq_reference,
            "seq_error_density":error_density,
            "seq_method_reference":arg.reference
        }
        write_yaml(yaml_path=self.file_info_path,data=seq_info,appending=True)
        seq_info["seq_density"]=density
        seq_info['error_param']={"sub":arg.seq_sub_prob,"ins":arg.seq_ins_prob,"del":arg.seq_del_prob}
        self.simu_repo["sequence"]=seq_info
        self.simu_repo["Error_Recorder"].append(seq_error_recorder)
        return seq_info

    def get_simu_repo(self):
        simu_repo=self.simu_repo

        ### for following decoding; do not need to download
        simulation_result_dir=os.path.join(self.backend_dir+'/'+str(self.simulation_dir)+'/'+str(self.file_uid)+".fasta")
        with open(simulation_result_dir,'a+') as f:
            index=0
            for dna in self.simu_dna:
                for re in dna['re']:
                    for i in range(re[0]): 
                        f.write('>'+str(index)+'|'+str(re[1])+"\n") #index | errors
                        index+=1
                        f.write(str(re[2])+"\n") # dna sequence
        

        return simu_repo

    def calculate_density(self,dnas,layer=False):
        nums = {}
        total = 0
        for dna in dnas:
            for re in dna['re']:
                n = re[0]
                nums[n] = nums.get(n, 0) + 1
                total += 1
        self.dna_total=total
        for i in nums:
            nums[i] = nums[i] / total
        
        n_group=10
        while not layer:
            if len(nums.items())>n_group:
                layer=True
                break
            n_group-=1
        nums = sorted(nums.items(), key=lambda e: e[0])
        #print(nums)
        
        if layer: #分层，针对pcr后等数据多样化的阶段
            n=len(nums)
            group=int(n/n_group)
            b={}
            for i in range(0,n,group):
                for j in nums[i:i+group]:
                    b[str(i)+"-"+str(i+group)]=b.get(str(i)+"-"+str(i+group),0)+j[1]
            nums=[]
            for i in b.items():
                nums.append([i[0],float(i[1])])

        return nums

    def error_density(self,dnas):
        dic={}
        total=0
        for dna in dnas:
            for re in dna['re']:
                n=len(re[1])
                dic[n]=dic.get(n,0)+re[0]
                total+=re[0]
        # for i in dic:
        #         dic[i] = dic[i] / total
        dic = sorted(dic.items(), key=lambda e: e[0])
        return dic

    def parallel_test(self,funcs):
        #cuts = [2000,4000,8000,12000,20000,80000]
        #ts = [1,4,8,16,32,64,128]
        cuts = [20,200,4000,8000,10000]
        ts=[4,8]

        for c in cuts:
            '''
            #cut_file_list = self.cut_file(c)
            # t1 = time.time()
            # for data in cut_file_list:
            #     self.simu_dna,syn_error_recorder=func(data)
            # t2 = time.time()
            # print('cut size {}, foring time {}'.format(c, t2 - t1))
            '''
            for t in ts:
                t1 = time.time()
                cut_file_list = self.cut_file(c)
                print(cut_file_list[0][0])
                with Pool(t) as pool:
                    for func in funcs:
                    #r = tqdm(pool.imap(func,cut_file_list),total=len(cut_file_list))
                    #print("r",r)
                        r = pool.imap(func,cut_file_list)
                        #print(r)
                        error_recorder={"+":0,"-":0,"s":0,"e":0,"n":0}
                        dnas=[]
                        for index,i in enumerate (r):
                            dnas +=i[0]
                            x,y=Counter(error_recorder),Counter(i[1])
                            error_recorder=dict(x+y)
                        print("Error recorder",func,error_recorder)
                        cut_file_list=self.cut_file(c,dnas)
                        try:
                            print(cut_file_list[0][0])
                        except:
                            pass
                t2 = time.time()
                print('cut size {},threads {}, pool time {}'.format(c,t,t2-t1))
        print("Done")
    
    def cut_file(self,cut_size,dnas=None):
        # print("Read binary matrix from file: " + self.file_path)
        #dnas=self.simu_dna
        cut_file_data = []
        if dnas is None:
            dnas=self.simu_dna_ori
            n = len(dnas)
            for i in range(math.ceil(n / cut_size)):
                if i != n // cut_size:
                    cut_data = dnas[i * cut_size:(i + 1) * cut_size]

                else:
                    cut_data = dnas[i * cut_size:]
                cut_file_data.append(cut_data)
        else:
                n=self.dna_total
                #cuts_num=math.ceil(n/cut_size)
                dnas_now=dnas
                pass_dna=0
                while dnas_now:
                    cur = 0
                    cut_data=[]
                    for index, dna in enumerate(dnas_now):
                        pass_dna+=1
                        cut_data.append(dna)
                        cur+=len(dna['re'])
                        if cur>=cut_size:
                            break
                    cut_file_data.append(cut_data)
                    dnas_now=dnas[pass_dna:]

        return cut_file_data

if __name__ == "__main__":

    # _,in_dnas=get_simu_synthesis_info(1565536927137009664,
    # 30,0.99,'ErrASE')

    # a=get_simu_dec_info(1565536927137009664,24,0.3,'Ecoli',in_dnas)
    # print(a)
   # files=[1565536927137009664,1582258845189804032,1582352930688864256,1582353780081561600,1582354198287224832,1582354428973944832,1582354513564667904,1582354609735864320,1582354697744945152,1582355179049717760]
   # for file in files:
        simu=Simulation(1582175684011364352,True)
        t1=time.time()
        simu.get_simu_synthesis_info(25,0.99,"ErrASE"),
        simu.get_simu_dec_info(24,0.3,'WhiteGaussian'),
        simu.get_simu_pcr_info( 12,0.8,"Taq"),
        simu.get_simu_sam_info(0.005),
        simu.get_simu_seq_info(15,"ill_PairedEnd"),
        print("Normal:", time.time() - t1)
        simu.parallel_test(simu.funcs)
    # dic={}
    # for dna in simu.simu_dna:
    #     for re in dna['re']:
    #         n=len(re[1])
    #         dic[n]=dic.get(n,0)+re[0]
    # print(dic)



    # with open('simu.txt','w') as f:
    #     for k,v in simu.__dict__.items():
    #         f.write(str(k)+":"+str(v)+"\n")
    #print(simu.get_simu_synthesis_info(30,0.99,'ErrASE'))

