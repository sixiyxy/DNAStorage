
from script.utils.utils_basic import get_config,write_yaml
from script.step11_get_file_uid import get_file_uid
from script.step12_get_file_info import get_file_info
from script.step21_encoding import Encoding
from flask_cors import CORS
from script.step3_simulation_utils import Simulation as Simu
import time

file_uid='1565536927137009664'
simu=Simu(file_uid)
t1=time.time()
a,b=simu.get_simu_synthesis_info(
    synthesis_number=30,
    synthesis_yield=0.99,
    synthesis_method='ErrASE'
)
t2=time.time()
c,d,_=simu.get_simu_dec_info(
    months_of_storage=24,
    loss_rate=0.3,
    storage_host='WhiteGaussian'
)
t3=time.time()
e=simu.get_simu_pcr_info(
    pcr_cycle=12,
    pcr_prob=0.8,
    pcr_polymerase='Taq'
)
t4=time.time()
g=simu.get_simu_sam_info(
    sam_ratio=0.005
)
t5=time.time()
h=simu.get_simu_seq_info(
    seq_depth=15,
    seq_meth='ill_PairedEnd'
)
t6=time.time()
print('synthesis:'+str(t2-t1))
print('decay'+str(t3-t2))
print('pcr:'+str(t4-t3))
print('sam:'+str(t5-t4))
print('seq:'+str(t6-t5))