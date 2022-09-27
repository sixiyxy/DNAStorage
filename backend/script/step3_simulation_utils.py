import script.utils.simulation_model as Model
import numpy as np
from script.utils.utils_basic import get_config,write_yaml,write_dna_file,Monitor
from script.utils.simulation_utils import SynthMeth_arg, DecHost_arg, PcrPoly_arg, Sampler_arg


class Simulation():
    def __init__(self,file_uid=None):
        if file_uid!=None:
            self.file_uid   =   file_uid
            self.config = get_config(yaml_path='config')
            self.backend_dir = self.config['backend_dir']
            self.file_dir=self.config['file_save_dir']

            self.file_info_path='{}/{}/{}.yaml'.format(self.backend_dir,self.file_dir,self.file_uid)

            self.dna_dir = self.config['dna_dir']
            self.dna_file = '{}/{}/{}.dna'.format(self.backend_dir,self.dna_dir,self.file_uid)
        
            with open(self.dna_file) as f:
                dnas=f.readlines()
            self.simu_dna=[dna.split('\n')[0] for dna in dnas]

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
        self.simu_dna=SYN(self.simu_dna)

        reference_link='0'

        syn_info={
            "synthesis_number":int(synthesis_number),
            "synthesis_yield":float(synthesis_yield),
            "synthesis_method":synthesis_method,
            'synthesis_method_reference':reference_link
        }
        write_yaml(yaml_path=self.file_info_path,data=syn_info,appending=True)
        density=self.calculate_density(self.simu_dna)

        return syn_info,density

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
        self.simu_dna=DEC(self.simu_dna)

        dec_info={
            "storgae_host":storage_host,
            "decay_reference_link":0,
            "months_of_storage":months_of_storage,
            "decay_loss_rate":loss_rate
        }
        write_yaml(yaml_path=self.file_info_path,data=dec_info,appending=True)

        return dec_info

    def get_simu_pcr_info(self,file_uid,
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

        arg=PcrPoly_arg(pcr_polymerase)
        arg.pcrc=pcr_cycle
        arg.pcrp=pcr_prob

        PCR=Model.PCRer_simu(arg)
        self.simu_dna=PCR(self.simu_dna)

        pcr_info={
            "pcr_polymerase":pcr_polymerase,
            "pcr_reference_link":0,
            "pcr_cycle":pcr_cycle,
            "pcr_prob":pcr_prob
        }
        write_yaml(yaml_path=self.file_info_path,data=pcr_info,appending=True)

        return pcr_info

    def get_simu_sam_info(self,file_uid,
        sam_ratio,
        in_dnas):

        '''
        Input:
            file_uid
            sam_ratio
            in_dnas
        '''
        # file information path
        arg=Sampler_arg(sam_ratio)

        Sam=Model.Sampler_simu(arg)
        self.simu_dna=Sam(self.simu_dna)

        sam_info={
            "sam_ratio":sam_ratio
        }
        write_yaml(yaml_path=self.file_info_path,data=sam_info,appending=True)

        return sam_info

    def get_simu_seq_info(self,file_uid,
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

        arg=Seq_arg(seq_meth)
        arg.seq_depth=seq_depth

        Seq=Model.Sequencer_simu(arg)
        self.simu_dna=Seq(self.simu_dna)

        seq_info={
            "seq_depth":seq_depth,
            "seq_meth":seq_meth,
            "seq_reference":seq_reference
        }
        write_yaml(yaml_path=self.file_info_path,data=seq_info,appending=True)

        return seq_info

    def calculate_density(self,dnas):
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

    # _,in_dnas=get_simu_synthesis_info(1565536927137009664,
    # 30,0.99,'ErrASE')

    # a=get_simu_dec_info(1565536927137009664,24,0.3,'Ecoli',in_dnas)
    # print(a)
    simu=Simulation(1565536927137009664)
    print(simu.get_simu_synthesis_info(30,0.99,'ErrASE'))

