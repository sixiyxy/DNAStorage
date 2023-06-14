import os
import json
import time
import yaml
from numpy import fromfile,uint8
from datetime import datetime
from celery import Celery


from script.step2_encoding_aysnc_time import Encoding
import script.step3_simulation_aysnc as simu_utils
from script.step4_decode_aysnc import ClusterDecode


# backend = 'redis://121.192.180.202:6379/1'
# broker = 'redis://121.192.180.202:6379/2'
backend = 'redis://10.26.56.2:6379/1'
broker = 'redis://10.26.56.2:6379/2'
# backend = 'redis://127.0.0.1:6379/1'
# broker ='redis://127.0.0.1:6379/2' 

celery = Celery('dna_storage_designer',
                backend = backend,
                broker =broker)

@celery.task(bind=True)
def encode_celery(self,file_uid,segment_length,index_length,verify_method,encode_method):
    # file_uid,segment_length,index_length,verify_method,encode_method = args
    obj = Encoding(file_uid=file_uid,
                  encode_method=encode_method,
                  segment_length=segment_length,
                  index_length=index_length,
                  verify_method=verify_method)   
    encode_info = obj.parallel_run()
    return {'result':encode_info}

@celery.task(bind=True)
def simulation_celery(self,file_uid,upload_flag):
    print("simulation celery~")
    simu_repo=simu_utils.get_simu_repo(file_uid,upload_flag)
    return {'result':simu_repo}
    
@celery.task(bind=True)
def decode_celery(self,file_uid,clust_method):
    Decode_obj = ClusterDecode(file_uid = file_uid,clust_method= clust_method)
    decode_info = Decode_obj.decode()
    return {'result':decode_info}




##### pre waste time verison #####
# from script.step2_encoding_celery import Encoding,get_progress_bar
# @celery.task(bind=True)
# def encode_celery_waste_time(self,file_uid,segment_length,index_length,verify_method,encode_method):
#     # file_uid,segment_length,index_length,verify_method,encode_method = args
#     obj = Encoding(file_uid=file_uid,
#                   encode_method=encode_method,
#                   segment_length=segment_length,
#                   index_length=index_length,
#                   verify_method=verify_method)  
#     file_data = fromfile(file=obj.file_path, dtype=uint8)
#     file_size = file_data.shape[0]
#     start_time = datetime.now()
#     encode_status = {'start':0,'segment':1,'index':2,'verify':3,'encode':4,'plot':5,'record':6}
#     total_status = len(encode_status) 
#     self.update_state(state = 'ENCODING',
#                         meta = {'label':'start',
#                                 'current':0,
#                                 'total':total_status})   
#     if obj.encode_method == 'SrcCode':
#         info = None
#         data = None
#         step='encode'
#         info,data = obj.run(step,file_data,file_size,start_time,info,verify_data)
#         self.update_state(state = 'ENCODING',
#                             meta = {'label':'encode',
#                                     'current':4,
#                                     'total':total_status}) 
#         step ='record'
#         info,data = obj.run(step,file_data,file_size,start_time,info,data)
#         self.update_state(state = 'ENCODING',
#                             meta = {'label':'record',
#                                     'current':5,
#                                     'total':total_status}) 
#         step = 'plot'
#         encode_info = obj.run(step,file_data,file_size,start_time,info,data)
#         self.update_state(state = 'ENCODING',
#                             meta = {'label':'plot',
#                                     'current':6,
#                                     'total':total_status})     
#     else:     
#         info = None
#         data = None
#         step = 'segment'
#         segment_data = obj.run(step,file_data,file_size,start_time,info,data)
#         self.update_state(state = 'ENCODING',
#                             meta = {'label':'segment_file',
#                                     'current':1,
#                                     'total':total_status}) 
#         step = 'index'
#         index_data = obj.run(step,file_data,file_size,start_time,info,segment_data)
#         self.update_state(state = 'ENCODING',
#                             meta = {'label':'add_index',
#                                     'current':2,
#                                     'total':total_status}) 
#         step = 'verify'
#         verify_data = obj.run(step,file_data,file_size,start_time,info,index_data)
#         self.update_state(state = 'ENCODING',
#                             meta = {'label':'add_verify',
#                                     'current':3,
#                                     'total':total_status}) 
#         step='encode'
#         info,data = obj.run(step,file_data,file_size,start_time,info,verify_data)
#         self.update_state(state = 'ENCODING',
#                             meta = {'label':'encode',
#                                     'current':4,
#                                     'total':total_status}) 
#         step ='record'
#         info,data = obj.run(step,file_data,file_size,start_time,info,data)
#         self.update_state(state = 'ENCODING',
#                             meta = {'label':'record',
#                                     'current':5,
#                                     'total':total_status}) 
#         step = 'plot'
#         encode_info = obj.run(step,file_data,file_size,start_time,info,data)
#         self.update_state(state = 'ENCODING',
#                             meta = {'label':'plot',
#                                     'current':6,
#                                     'total':total_status}) 
    
#     return {'current':total_status,'total':total_status,
#             'callback':encode_info,'result':'successful'}



if __name__ == '__main__':
    # /opt/anaconda3/bin/celery -A celery_task worker -l info
    pass