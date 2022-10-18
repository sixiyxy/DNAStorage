from symbol import pass_stmt
import script.utils.simulation_model as Model
import numpy as np
from script.utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
from script.utils.simulation_utils import SynthMeth_arg, DecHost_arg, PcrPoly_arg, Sampler_arg,Seq_arg,fasta_to_dna
import os
# import utils.simulation_model as Model
# import numpy as np
# from utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
# from utils.simulation_utils import SynthMeth_arg, DecHost_arg, PcrPoly_arg, Sampler_arg,Seq_arg


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
        self.simu_dna,self.syn_error_recorder=SYN(self.simu_dna)
        print(self.syn_error_recorder)
        syn_info={
            "synthesis_number":int(synthesis_number),
            "synthesis_yield":float(synthesis_yield),
            "synthesis_method":synthesis_method,
            'synthesis_method_reference':arg.reference
        }
        write_yaml(yaml_path=self.file_info_path,data=syn_info,appending=True)
        self.syn_density=self.calculate_density(self.simu_dna)
        self.syn_info=syn_info
        self.syn_info['syn_density']=self.syn_density
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
        self.simu_dna,self.dec_error_recorder=DEC(self.simu_dna)
        dec_info={
            "storage_host":storage_host,
            "months_of_storage":months_of_storage,
            "decay_loss_rate":loss_rate,
            "storage_host_parameter_reference":arg.reference
        }
        write_yaml(yaml_path=self.file_info_path,data=dec_info,appending=True)
        dec_density=self.calculate_density(self.simu_dna)
        #self.dec_info=dec_info
        #self.dec_info['dec_density']=dec_density
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
        self.simu_dna,self.pcr_error_recorder=PCR(self.simu_dna)

        density=self.calculate_density(self.simu_dna,True)
        error_density=self.error_density(self.simu_dna)

        pcr_info={
            "pcr_polymerase":pcr_polymerase,
            "pcr_reference_link":0,
            "pcr_cycle":pcr_cycle,
            "pcr_prob":pcr_prob,
            "prc_density":density,
            "pcr_error_density":error_density,
            "pcr_method_reference":arg.reference
        }
        self.pcr_info=pcr_info
        write_yaml(yaml_path=self.file_info_path,data=pcr_info,appending=True)

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
        self.simu_dna,error_recorder=Sam(self.simu_dna)
        print("sample:",error_recorder)
        density=self.calculate_density(self.simu_dna)
        error_density=self.error_density(self.simu_dna)

        sam_info={
            "sam_ratio":sam_ratio,
            "sam_density":density,
            "sam_error_density":error_density
        }
        self.sample_info=sam_info
        write_yaml(yaml_path=self.file_info_path,data=sam_info,appending=True)

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
        self.simu_dna,self.seq_error_decorder=Seq(self.simu_dna)
        seq_reference=0
        
        density=self.calculate_density(self.simu_dna,True)
        error_density=self.error_density(self.simu_dna)

        seq_info={
            "seq_depth":seq_depth,
            "seq_meth":seq_meth,
            "seq_reference":seq_reference,
            "seq_density":density,
            "seq_error_density":error_density,
            "seq_method_reference":arg.reference
        }
        self.sequence_info=seq_info
        write_yaml(yaml_path=self.file_info_path,data=seq_info,appending=True)

        return seq_info

    def get_simu_repo(self):
        simu_repo={}
        #file_name
        # try:
        #     simu_repo['Synthesis']=self.syn_info
        # except:
        #     pass
        # try:
        #     simu_repo['Decay']=self.dec_info
        # except:
        #     pass
        # try:
        #     simu_repo['PCR']=self.pcr_info
        # except:
        #     pass
        # try:
        #     simu_repo['Sampling']=self.sample_info
        # except:
        #     pass
        # try:
        #     simu_repo['Sequencing']=self.sequence_info
        # except:
        #     pass
        simu_repo={"111:222"}
        simulation_repo_dir=os.path.join(self.backend_dir+'/'+str(self.simulation_dir)+'/'+str(self.file_uid)+".fasta")
        with open(simulation_repo_dir,'a+') as f:
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

        for i in nums:
            nums[i] = nums[i] / total
        
        n_group=10
        if len(nums.items())>n_group:
            layer=True
        nums = sorted(nums.items(), key=lambda e: e[0])
        #print(nums)
        
        if layer: #分层，针对pcr后等数据多样化的阶段
            n=len(nums)
            group=int(n/n_group)
            b={}
            for i in range(0,n,group):
                for j in nums[i:i+group]:
                    b[str(i)+"-"+str(i+group)]=b.get(str(i)+"-"+str(i+group),0)+j[1]
            nums=b

        return nums

    def error_density(self,dnas):
        dic={}
        total=0
        for dna in dnas:
            for re in dna['re']:
                n=len(re[1])
                dic[n]=dic.get(n,0)+re[0]
                total+=re[0]
        for i in dic:
                dic[i] = dic[i] / total
        dic = sorted(dic.items(), key=lambda e: e[0])
        return dic

    
if __name__ == "__main__":

    # _,in_dnas=get_simu_synthesis_info(1565536927137009664,
    # 30,0.99,'ErrASE')

    # a=get_simu_dec_info(1565536927137009664,24,0.3,'Ecoli',in_dnas)
    # print(a)
    simu=Simulation(1565536927137009664)
    simu.get_simu_synthesis_info(25,0.99,"ErrASE")
    simu.get_simu_dec_info(24,0.3,'WhiteGaussian')
    simu.get_simu_pcr_info( 12,0.8,"Taq")
    simu.get_simu_sam_info(0.005)
    simu.get_simu_seq_info(15,"ill_PairedEnd")
    dic={}
    for dna in simu.simu_dna:
        for re in dna['re']:
            n=len(re[1])
            dic[n]=dic.get(n,0)+re[0]
    print(dic)



    # with open('simu.txt','w') as f:
    #     for k,v in simu.__dict__.items():
    #         f.write(str(k)+":"+str(v)+"\n")
    #print(simu.get_simu_synthesis_info(30,0.99,'ErrASE'))

