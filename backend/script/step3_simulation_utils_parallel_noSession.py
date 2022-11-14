from distutils.log import error
import script.utils.simulation_model as Model
import numpy as np
from script.utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
from script.utils.simulation_utils import SynthMeth_arg, DecHost_arg, PcrPoly_arg, Sampler_arg,Seq_arg,fasta_to_dna,funcs_parallel,corresponding_arg
import os
from multiprocessing import Pool
import time
from tqdm import tqdm
import math
from collections import Counter
import Bio
from Bio import SeqIO
import yaml

# import utils.simulation_model as Model
# import numpy as np
# from utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
# from utils.simulation_utils import SynthMeth_arg, DecHost_arg, PcrPoly_arg, Sampler_arg,Seq_arg,fasta_to_dna
funcs_parameter={
    "SYN":["synthesis_method","synthesis_number","synthesis_yield"],
    "DEC":["storage_host","months_of_storage","decay_loss_rate"],
    "PCR":["pcr_polymerase","pcr_cycle","pcr_prob"],
    "SAM":['sam_ratio'],
    "SEQ":['seq_meth',"seq_depth"]
}


def get_info(file_uid,upload_flag,final_parallel=False):
    config = get_config(yaml_path='config')
    backend_dir = config['backend_dir']
    if not upload_flag:
        file_dir=config['file_save_dir']
        file_info_path='{}/{}/{}.yaml'.format(backend_dir,file_dir,file_uid)
        dna_dir =config['encode_dir']
        dna_file = '{}/{}/{}.dna'.format(backend_dir,dna_dir,file_uid)
        with open(dna_file) as f:
            dnas=f.readlines()
        simu_dna=[dna.split('\n')[0] for dna in dnas]
    else:
        file_dir=config['upload_dna_save_dir']
        file_info_path='{}/{}/{}.yaml'.format(backend_dir,file_dir,file_uid)
        file_path='{}/{}/{}.fasta'.format(backend_dir,file_dir,file_uid)
        simu_dna=fasta_to_dna(file_path)
    file_info=get_config(yaml_path=file_info_path)
    funcs_final=[]
    funcs=[]
    try:
        funcs=file_info['simu']
        print('funcs here',funcs)
        for func in funcs:
            func_param_name=funcs_parameter[func]
            func_param=[]
            for name in func_param_name:
                func_param.append(file_info[name])
            func=corresponding_arg(func_param_name[0],func_param[0],func_param[1:])
            funcs_final.append(func)
    except Exception as e:
        print("Error",e)
    if not final_parallel:
        if len(simu_dna)<1000:
                pass
        else:
            simu_dna=simu_dna[:1000]
    else:
        print("funcs in get info",funcs_final)
        print("funcs name in get info",funcs)
        simu_dna=simu_dna
        return simu_dna,file_info_path,funcs_final,funcs,file_uid

    return simu_dna,file_info_path,funcs_final,funcs

def get_simu_synthesis_info(file_uid,
        upload_flag,
        synthesis_number,
        synthesis_yield,
        synthesis_method):
        '''
        Input:
            synthesis_number
            synthesis_yield
            synthesis_method
        '''
        simu_dna,file_info_path,_,_=get_info(file_uid,upload_flag)
        SYN,arg=SynthMeth_arg(synthesis_method,[synthesis_number,synthesis_yield])
        simu_dna=funcs_parallel([SYN],simu_dna,False)
        funcs_name=['SYN']
        syn_info={
            "simu":funcs_name,
            "synthesis_number":int(synthesis_number),
            "synthesis_yield":float(synthesis_yield),
            "synthesis_method":synthesis_method
                }
            
        write_yaml(yaml_path=file_info_path,data=syn_info,appending=True)
        syn_density,group=calculate_density(simu_dna)
        syn_info['syn_density']=syn_density
        syn_info['density_group']=group
        syn_info['error_param']={"sub":arg.syn_sub_prob,"ins":arg.syn_ins_prob,"del":arg.syn_del_prob}
        
        return syn_info

def get_simu_dec_info(file_uid,
        upload_flag,
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
        simu_dna,file_info_path,funcs,funcs_name=get_info(file_uid,upload_flag)
        DEC,arg=DecHost_arg(storage_host,[months_of_storage,loss_rate])
        funcs.append(DEC)
        funcs_name.append("DEC")
        simu_dna=funcs_parallel(funcs,simu_dna,False)
        dec_info={
            "simu":funcs_name,
            "storage_host":storage_host,
            "months_of_storage":months_of_storage,
            "decay_loss_rate":loss_rate,
            "storage_host_parameter_reference":arg.reference
        }
        write_yaml(yaml_path=file_info_path,data=dec_info,appending=True)
        dec_density,group=calculate_density(simu_dna)
        dec_info['dec_density']=dec_density
        dec_info['dec_group']=group
        dec_info['error_param']={"sub":arg.dec_sub_prob,"ins":arg.dec_ins_prob,"del":arg.dec_del_prob}
        return dec_info

def get_simu_pcr_info(
        file_uid,
        upload_flag,
        pcr_cycle,
        pcr_prob,
        pcr_polymerase):

        '''
        Input:
            pcr_cycle
            pcr_prob
            pcr_polymerase
        '''

        simu_dna,file_info_path,funcs,funcs_name=get_info(file_uid,upload_flag)
        PCR,arg=PcrPoly_arg(pcr_polymerase,[pcr_cycle,pcr_prob])
        funcs.append(PCR)
        funcs_name.append("PCR")
        simu_dna=funcs_parallel(funcs,simu_dna,False)
        pcr_info={
            "simu":funcs_name,
            "pcr_polymerase":pcr_polymerase,
            "pcr_cycle":pcr_cycle,
            "pcr_prob":pcr_prob,
            "pcr_method_reference":arg.reference
        }

        write_yaml(yaml_path=file_info_path,data=pcr_info,appending=True)
        density,group=calculate_density(simu_dna)
        pcr_info["pcr_density"]=density
        pcr_info['pcr_group']=group
        pcr_info['error_param']={"sub":arg.pcr_sub_prob,"ins":arg.pcr_ins_prob,"del":arg.pcr_del_prob}

        return pcr_info

def get_simu_sam_info(file_uid,
        upload_flag,
        sam_ratio):

        '''
        Input:
            sam_ratio
        '''
        # file information path
        simu_dna,file_info_path,funcs,funcs_name=get_info(file_uid,upload_flag)
        SAM,_=Sampler_arg(sam_ratio,None)
        funcs.append(SAM)
        funcs_name.append("SAM")
        simu_dna=funcs_parallel(funcs,simu_dna,False)

        density,group=calculate_density(simu_dna)

        sam_info={
            "simu":funcs_name,
            "sam_ratio":sam_ratio,
        }
        write_yaml(yaml_path=file_info_path,data=sam_info,appending=True)
        sam_info["sam_density"]=density
        sam_info['sam_group']=group

        return sam_info

def get_simu_seq_info(file_uid,
        upload_flag,
        seq_depth,
        seq_meth):

        '''
        Input:
            seq_depth
            seq_meth
        '''
        
        simu_dna,file_info_path,funcs,funcs_name=get_info(file_uid,upload_flag)
        SEQ,arg=Seq_arg(seq_meth,[seq_depth])
        funcs.append(SEQ)
        funcs_name.append("SEQ")
        simu_dna=funcs_parallel(funcs,simu_dna,False)
        density,group=calculate_density(simu_dna)
        
        seq_info={
            "simu":funcs_name,
            "seq_depth":seq_depth,
            "seq_meth":seq_meth,
            "seq_method_reference":arg.reference
        }
        write_yaml(yaml_path=file_info_path,data=seq_info,appending=True)
        seq_info["seq_density"]=density
        seq_info['seq_group']=group
        seq_info['error_param']={"sub":arg.seq_sub_prob,"ins":arg.seq_ins_prob,"del":arg.seq_del_prob}
        return seq_info

def get_simu_repo(file_uid,upload_flag):
        simu_repo={}
        simu_dna,file_info_path,funcs,funcs_name,file_uid=get_info(file_uid,upload_flag,final_parallel=True)
        dnas,error_recorder,error_density_final=parallel(simu_dna,funcs,funcs_name)
        simu_repo["Error_Recorder"]=error_recorder
        simu_repo["Error_Density"]=error_density_final

        config = get_config(yaml_path='config')
        backend_dir = config['backend_dir']
        simulation_dir=config['simulation_dir']
        simulation_result_dir=os.path.join(backend_dir+'/'+str(simulation_dir)+'/')
        with open(simulation_result_dir+str(file_uid)+".fasta",'w') as f:
                index=0
                for dna in dnas:
                    for re in dna['re']:
                        for i in range(re[0]):                    
                            f.write('>'+str(index)+"|"+str(re[1])+"\n") #index | errors
                            f.write(str(re[2])+"\n") # dna sequence
                            index+=1
                        

        return simu_repo

def calculate_density(dnas,layer=False):
        nums=[]
        nums_count={}
        total=0
        for dna in dnas:
            for re in dna['re']:
                nums.append({"value":re[0]})
                nums_count[re[0]]=nums_count.get(re[0],0)+1
                total+=re[0]

        n_group=10
        while not layer and n_group!=1:
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
                try:
                    groups.append(nums_count[(i+1)*group][0]-nums_count[i*group][0])
                except:
                    print(str(len(nums_count))+" "+str(i+1)+" "+str(group))
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

   
def parallel(simu_dna,funcs,funcs_names):
        if len(simu_dna)<20000:
            cut=5
        else:
            cut=50
        t1 = time.time()
        cut_file_list = cut_file(simu_dna,cut)
        thread=8
        with Pool(thread) as pool:
                print(funcs)
                print(len(funcs))
                r = list(tqdm(pool.starmap(funcs_parallel,[(funcs,item) for item in cut_file_list])))   
                pool.close()
                pool.join()
                dnas=[]
                print(len(funcs))
                error_recorder=[{'+':0,"-":0,"s":0,"e":0,"n":0} for i in range(len(funcs))]
                print(error_recorder)
                error_density=[{} for i in range(len(funcs))]
                for index,i in enumerate (r):
                    for j in i[0]:
                        dnas.append(j)
                    for index_1 in range (len(i[1])):
                        x,y=Counter(i[1][index_1]),Counter(error_recorder[index_1])
                        error_recorder[index_1]=dict(x+y)
                        error_density[index_1]=dict(Counter(error_density[index_1]) + Counter(i[2][index_1]))
                #for front end data processsing 
                error_recorder_final={}
                print(error_recorder)
                print("fffffuncs_names",funcs_names)
                print("error recorder",(len(error_recorder)))
                for index,i in enumerate (funcs_names):
                        error_recorder_final[i]=error_recorder[index]
                error_density_final=[]
                print("error density",error_density)
                for index,density in enumerate(error_density):
                    density = sorted(density.items(), key=lambda e: e[0])
                    for i in density:
                        error_density_final.append({'type':funcs_names[index],"error":str(i[0]),"count":i[1]})
        print(error_recorder_final)
        print(error_density_final)
        t2 = time.time()
        print('cut size {},threads {}, pool time {}'.format(cut,thread,t2-t1))
        print("Done")
        return dnas,error_recorder_final,error_density_final

def cut_file(simu_dna,cut_size):
    
        # print("Read binary matrix from file: " + self.file_path)
        #dnas=self.simu_dna
        cut_file_data = []
        for i in range(math.ceil(len(simu_dna)/cut_size)):
            if i != len(simu_dna)//cut_size:
                cut_data = simu_dna[i*cut_size:(i+1)*cut_size]
            else:
                cut_data = simu_dna[i*cut_size:]
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
        #simu.parallel_test()
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

