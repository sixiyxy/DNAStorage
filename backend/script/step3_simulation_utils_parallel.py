from distutils.log import error
import script.utils.simulation_model as Model
import numpy as np
from script.utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
from script.utils.simulation_utils import SynthMeth_arg, DecHost_arg, PcrPoly_arg, Sampler_arg,Seq_arg,fasta_to_dna,funcs_parallel
import os
from multiprocessing import Pool
import time
from tqdm import tqdm
import math
from collections import Counter

# import utils.simulation_model as Model
# import numpy as np
# from utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
# from utils.simulation_utils import SynthMeth_arg, DecHost_arg, PcrPoly_arg, Sampler_arg,Seq_arg,fasta_to_dna


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

            self.simu_dna_ori=self.simu_dna

            if len(self.simu_dna)<1000:
                pass
            else:
                self.simu_dna=self.simu_dna[:1000]
            self.syn_density=0
            self.simu_repo={}
            self.simu_repo["Error_Density"]=[]

            self.funcs=[]
            self.funcs_names=[]
            

    def get_simu_synthesis_info(self,synthesis_number,
        synthesis_yield,
        synthesis_method):
        '''
        Input:
            synthesis_number
            synthesis_yield
            synthesis_method
        '''

        arg=SynthMeth_arg(synthesis_method)
        arg.syn_number=synthesis_number
        arg.syn_yield=synthesis_yield

        SYN=Model.Synthesizer_simu(arg)
        self.simu_dna , _ = SYN(self.simu_dna)

        self.funcs.append(SYN)
        self.funcs_names.append("SYN")

        syn_info={
            "synthesis_number":int(synthesis_number),
            "synthesis_yield":float(synthesis_yield),
            "synthesis_method":synthesis_method,
            'synthesis_method_reference':arg.reference
        }
        write_yaml(yaml_path=self.file_info_path,data=syn_info,appending=True)
        self.syn_density,group=self.calculate_density(self.simu_dna)
        syn_info['syn_density']=self.syn_density
        syn_info['density_group']=group
        syn_info['error_param']={"sub":arg.syn_sub_prob,"ins":arg.syn_ins_prob,"del":arg.syn_del_prob}
        self.simu_repo["synthesis"]=syn_info
        
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

        arg=DecHost_arg(storage_host)
        arg.months_of_storage=months_of_storage
        arg.dec_loss_rate=loss_rate

        DEC=Model.Decayer_simu(arg)
        self.simu_dna,_=DEC(self.simu_dna)
        self.funcs.append(DEC)
        self.funcs_names.append("DEC")

        dec_info={
            "storage_host":storage_host,
            "months_of_storage":months_of_storage,
            "decay_loss_rate":loss_rate,
            "storage_host_parameter_reference":arg.reference
        }
        write_yaml(yaml_path=self.file_info_path,data=dec_info,appending=True)
        dec_density,group=self.calculate_density(self.simu_dna)
        dec_info['dec_density']=dec_density
        dec_info['dec_group']=group
        dec_info['error_param']={"sub":arg.dec_sub_prob,"ins":arg.dec_ins_prob,"del":arg.dec_del_prob}
        self.simu_repo["decay"]=dec_info

        return dec_info

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

        arg=PcrPoly_arg(pcr_polymerase)
        arg.pcrc=pcr_cycle
        arg.pcrp=pcr_prob

        PCR=Model.PCRer_simu(arg)
        self.funcs.append(PCR)
        self.funcs_names.append("PCR")
        self.simu_dna,_=PCR(self.simu_dna)
        density,group=self.calculate_density(self.simu_dna)

        pcr_info={
            "pcr_polymerase":pcr_polymerase,
            "pcr_cycle":pcr_cycle,
            "pcr_prob":pcr_prob,
            "pcr_method_reference":arg.reference
        }
        write_yaml(yaml_path=self.file_info_path,data=pcr_info,appending=True)
        pcr_info["pcr_density"]=density
        pcr_info['pcr_group']=group
        pcr_info['error_param']={"sub":arg.pcr_sub_prob,"ins":arg.pcr_ins_prob,"del":arg.pcr_del_prob}
        self.simu_repo["pcr"]=pcr_info

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
        self.funcs_names.append("SAM")
        self.simu_dna,_=Sam(self.simu_dna)
        density,group=self.calculate_density(self.simu_dna)

        sam_info={
            "sam_ratio":sam_ratio,
        }
        write_yaml(yaml_path=self.file_info_path,data=sam_info,appending=True)
        sam_info["sam_density"]=density
        sam_info['sam_group']=group
        self.simu_repo["sample"]=sam_info

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
        self.funcs_names.append("SEQ")
        self.simu_dna,_=Seq(self.simu_dna)
        density,group=self.calculate_density(self.simu_dna)
        

        seq_info={
            "seq_depth":seq_depth,
            "seq_meth":seq_meth,
            "seq_method_reference":arg.reference
        }
        write_yaml(yaml_path=self.file_info_path,data=seq_info,appending=True)
        seq_info["seq_density"]=density
        seq_info['seq_group']=group
        seq_info['error_param']={"sub":arg.seq_sub_prob,"ins":arg.seq_ins_prob,"del":arg.seq_del_prob}
        self.simu_repo["sequence"]=seq_info

        return seq_info

    def get_simu_repo(self):
        simu_repo=self.simu_repo
        dnas,error_recorder,error_density_final=self.parallel()
        simu_repo["Error_Recorder"]=error_recorder
        simu_repo["Error_Density"]=error_density_final
        simulation_result_dir=os.path.join(self.backend_dir+'/'+str(self.simulation_dir)+'/'+str(self.file_uid)+".fasta")
        with open(simulation_result_dir,'w+') as f:
            index=0
            for dna in dnas:
                print(dna)
                for re in dna['re']:
                    for i in range(re[0]): 
                        f.write('>'+str(index)+'|'+str(re[1])+"\n") #index | errors
                        index+=1
                        f.write(str(re[2])+"\n") # dna sequence

        return simu_repo

    def calculate_density(self,dnas,layer=False):
        nums=[]
        nums_count={}
        for dna in dnas:
            for re in dna['re']:
                nums.append({"value":re[0]})
                nums_count[re[0]]=nums_count.get(re[0],0)+1

        n_group=10
        while not layer:
            if len(nums_count.items())>n_group:
                layer=True
                break
            n_group-=1
        nums_count = sorted(nums_count.items(), key=lambda e: e[0])
        
        group=int(len(nums_count)/n_group)
        print(group)
        if group>10:
            groups=[]
            for i in range(0,len(nums_count)//group):
                groups.append(nums_count[(i+1)*group][0]-nums_count[i*group][0])
            try:   
                group=int(sum(groups)/len(groups))
            except:
                pass

        return nums,group
        '''
        # nums = {}
        # total = 0
        # for dna in dnas:
        #     for re in dna['re']:
        #         n = re[0]
        #         nums[n] = nums.get(n, 0) + 1
        #         total += 1

        # for i in nums:
        #     nums[i] = nums[i] / total
        
        # n_group=10
        # while not layer:
        #     if len(nums.items())>n_group:
        #         layer=True
        #         break
        #     n_group-=1
        # nums = sorted(nums.items(), key=lambda e: e[0])
        # group=int(len(nums)/n_group)
        # print(nums)
        # nums_final=[]
        # for i in nums:
        #     nums_final.append({'x':i[0],'y':i[1]})
        # print(nums_final)
        # print("group",group)
        #print(nums)
        
        # if layer: #分层，针对pcr后等数据多样化的阶段
        #     n=len(nums)
        #     group=int(n/n_group)
        #     b={}
        #     for i in range(0,n,group):
        #         for j in nums[i:i+group]:
        #             b[str(i)+"-"+str(i+group)]=b.get(str(i)+"-"+str(i+group),0)+j[1]
        #     nums=[]
        #     for i in b.items():
        #         nums.append([i[0],float(i[1])])
        '''

   
    def parallel(self):
        if len(self.simu_dna_ori)<20000:
            cut=5
        else:
            cut=50
        print(self.funcs)
        t1 = time.time()
        cut_file_list = self.cut_file(cut)
        thread=8
        with Pool(thread) as pool:
                r = list(tqdm(pool.starmap(funcs_parallel,[(self.funcs,item) for item in cut_file_list])))
                pool.close()
                pool.join()
                dnas=[]
                error_recorder=[{'+':0,"-":0,"s":0,"e":0,"n":0} for i in range(len(self.funcs))]
                error_density=[{} for i in range(len(self.funcs))]
                for index,i in enumerate (r):
                    for j in i[0]:
                        dnas.append(j)
                    for index_1 in range (len((i[1]))):
                        x,y=Counter(i[1][index_1]),Counter(error_recorder[index_1])
                        error_recorder[index_1]=dict(x+y)
                        error_density[index_1]=dict(Counter(error_density[index_1]) + Counter(i[2][index_1]))
                
                #for front end data processsing 
                error_recorder_final={}
                for index,i in enumerate (self.funcs_names):
                    error_recorder_final[i]=error_recorder[index]
                error_density_final=[]
                for index,density in enumerate(error_density):
                    density = sorted(density.items(), key=lambda e: e[0])
                    for i in density:
                        error_density_final.append({'type':self.funcs_names[index],"error":i[0],"count":i[1]})

        print(error_recorder_final)
        print(error_density_final)
        t2 = time.time()
        print('cut size {},threads {}, pool time {}'.format(cut,thread,t2-t1))
        print("Done")
        return dnas,error_recorder_final,error_density_final

    def cut_file(self,cut_size):
    
        # print("Read binary matrix from file: " + self.file_path)
        #dnas=self.simu_dna
        cut_file_data = []
        for i in range(math.ceil(len(self.simu_dna_ori)/cut_size)):
            if i != len(self.simu_dna_ori)//cut_size:
                cut_data = self.simu_dna_ori[i*cut_size:(i+1)*cut_size]
            else:
                cut_data = self.simu_dna_ori[i*cut_size:]
            cut_file_data.append(cut_data)

        return cut_file_data





if __name__ == "__main__":

    # _,in_dnas=get_simu_synthesis_info(1565536927137009664,
    # 30,0.99,'ErrASE')

    # a=get_simu_dec_info(1565536927137009664,24,0.3,'Ecoli',in_dnas)
    # print(a)
    files=[1584069747073486848,1584070962381459456]
    for file in files:
        simu=Simulation(file)
        t1=time.time()
        simu.get_simu_synthesis_info(25,0.99,"ErrASE")
        simu.get_simu_dec_info(24,0.3,'WhiteGaussian')
        simu.get_simu_pcr_info( 12,0.8,"Taq")
        simu.get_simu_sam_info(0.005)
        simu.get_simu_seq_info(15,"ill_PairedEnd")
        print("Normal:", time.time() - t1)
        simu.parallel_test()
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

