import os
import json
import time
import yaml
from celery import Celery
# from concurrent.futures import ThreadPoolExecutor
# this method can not get the status

from script.step1_get_file_uid import get_file_uid
from script.step2_encoding_celery import Encoding,get_progress_bar

celery = Celery('dna_storage_designer',
                backend = 'redis://127.0.0.1:6379/1',
                broker ='redis://127.0.0.1:6379/2' 
                )


@celery.task(bing=True)
def enocde_celery(self,file_uid,segment_length,index_length,verify_method,encode_method):
    # file_uid,segment_length,index_length,verify_method,encode_method = args
    obj = Encoding(file_uid=file_uid,
                  encode_method=encode_method,
                  segment_length=segment_length,
                  index_length=index_length,
                  verify_method=verify_method)                
    encode_info= obj.parallel_run()
    # print(encode_info)
    encode_status = {'segment':1,'index':2,'verify':3,'encode':4,'plot':5,'energy':6}
    total_status = len(encode_status)
    print(obj.status)
    self.update_state(status = obj.status,
                        mete = {'label':obj.status,
                            'current':encode_status[obj.status],
                                'total':total_status})
    return {'current':total_status,'total':total_status,
            'callback':encode_info,'result':'successful'}