import os
import json
import time
import yaml
from celery import Celery
# from concurrent.futures import ThreadPoolExecutor
# this method can not get the status

from app_celery import encode_celery,encode_celery_2,decode_celery
from script.step1_get_file_uid import get_file_uid
from script.step2_encoding_celery import Encoding,get_progress_bar


def encode_start():
    print('\n','#'*25,'Encoding Start','#'*25,'\n','#'*60)
    front_data = {"file_uid":1582258845189804032,
                    "segment_length":160,
                    "index_length":20,
                    "verify_method":"Hamming",
                    "encode_method":"Basic"}

    # front_data = {"file_uid":1565536927137009664,
    #                 "segment_length":160,
    #                 "index_length":20,
    #                 "verify_method":"Hamming",
    #                 "encode_method":"Basic"}

    file_uid = front_data['file_uid'] #'1566....'
    segment_length = front_data['segment_length'] #4
    index_length = front_data['index_length'] #128
    verify_method = front_data['verify_method'] #'HammingCode'
    encode_method = front_data['encode_method'] #'Basic'
    args = [file_uid,segment_length,index_length,verify_method,encode_method]
    encode_task = encode_celery.apply_async(args=args)
    task_id = encode_task.id
    print(task_id)
    return task_id

def decode_start():
    print('\n','#'*25,'Encoding Start','#'*25,'\n','#'*60)
    front_data = {"file_uid":'example',
                    # "clust_method":"cdhit"}
                    "clust_method":'starcode'}
    file_uid = front_data['file_uid'] 
    clust_method = front_data['clust_method']
    print('### Decode parameters is:',front_data)

    args = [file_uid,clust_method]
    decode_task = decode_celery.apply_async(args=args)
    task_id = decode_task.id
    print(task_id)
    return task_id

    






if __name__ == '__main__':
    task_id = encode_start()
    # task_id = decode_start()
    n = 0
    for i in range(200):
        time.sleep(3)
        n +=1
        print(n*3)
        # response = task_status(task_id=task_id,type='decode')
        response = task_status(task_id=task_id,type='encode')
        # print(response)