import os
import json
import time
import yaml
from numpy import fromfile,uint8
from datetime import datetime
from celery import Celery
# from concurrent.futures import ThreadPoolExecutor
# this method can not get the status

from script.step1_get_file_uid import get_file_uid
from script.step2_encoding_celery import Encoding,get_progress_bar
from script.step4_decode_celery import ClusterDecode


backend = 'redis://121.192.180.202:6379/1'
broker = 'redis://121.192.180.202:6379/2'
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
    file_data = fromfile(file=obj.file_path, dtype=uint8)
    file_size = file_data.shape[0]
    start_time = datetime.now()
    encode_status = {'start':0,'segment':1,'index':2,'verify':3,'encode':4,'plot':5,'concat':6}
    total_status = len(encode_status) 
    self.update_state(state = 'ENCODING',
                        meta = {'label':'start',
                                'current':0,
                                'total':total_status})   
    if obj.encode_method == 'SrcCode':
        info = None
        data = None
        step='encode'
        info,data = obj.run(step,file_data,file_size,start_time,info,verify_data)
        self.update_state(state = 'ENCODING',
                            meta = {'label':'encode',
                                    'current':4,
                                    'total':total_status}) 
        step ='record'
        info,data = obj.run(step,file_data,file_size,start_time,info,data)
        self.update_state(state = 'ENCODING',
                            meta = {'label':'record',
                                    'current':5,
                                    'total':total_status}) 
        step = 'plot'
        encode_info = obj.run(step,file_data,file_size,start_time,info,data)
        self.update_state(state = 'ENCODING',
                            meta = {'label':'plot',
                                    'current':6,
                                    'total':total_status})     
    else:     
        info = None
        data = None
        step = 'segment'
        segment_data = obj.run(step,file_data,file_size,start_time,info,data)
        self.update_state(state = 'ENCODING',
                            meta = {'label':'segment_file',
                                    'current':1,
                                    'total':total_status}) 
        step = 'index'
        index_data = obj.run(step,file_data,file_size,start_time,info,segment_data)
        self.update_state(state = 'ENCODING',
                            meta = {'label':'add_index',
                                    'current':2,
                                    'total':total_status}) 
        step = 'verify'
        verify_data = obj.run(step,file_data,file_size,start_time,info,index_data)
        self.update_state(state = 'ENCODING',
                            meta = {'label':'add_verify',
                                    'current':3,
                                    'total':total_status}) 
        step='encode'
        info,data = obj.run(step,file_data,file_size,start_time,info,verify_data)
        self.update_state(state = 'ENCODING',
                            meta = {'label':'encode',
                                    'current':4,
                                    'total':total_status}) 
        step ='record'
        info,data = obj.run(step,file_data,file_size,start_time,info,data)
        self.update_state(state = 'ENCODING',
                            meta = {'label':'record',
                                    'current':5,
                                    'total':total_status}) 
        step = 'plot'
        encode_info = obj.run(step,file_data,file_size,start_time,info,data)
        self.update_state(state = 'ENCODING',
                            meta = {'label':'plot',
                                    'current':6,
                                    'total':total_status}) 
    
    return {'current':total_status,'total':total_status,
            'callback':encode_info,'result':'successful'}

@celery.task(bind=True)
def decode_celery(self,file_uid,clust_method):
    Decode_obj = ClusterDecode(file_uid = file_uid,clust_method= clust_method)
    total_status = 3
    self.update_state(state = 'DECODING',
                        meta = {'label':'start',
                                'current':0,
                                'total':total_status}) 
    clust_dna_sequences,clust_time = Decode_obj.clust()
    self.update_state(state = 'DECODING',
                        meta = {'label':'clustering',
                                'current':1,
                                'total':total_status}) 

    decode_info = Decode_obj.decode(clust_dna_sequences,clust_time)
    self.update_state(state = 'DECODING',
                        meta = {'label':'decode',
                                'current':2,
                                'total':total_status}) 
    return {'current':total_status,'total':total_status,
            'callback':decode_info,'result':'successful'}
