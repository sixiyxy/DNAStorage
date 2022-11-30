import os
import json
import time
import yaml
from celery import Celery
# from concurrent.futures import ThreadPoolExecutor
# this method can not get the status

from app_celery import encode_celery,decode_celery
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

    


# @app.route('/status/<task_id>',methods=['POST'])

def task_status(task_id,type):
    if type == 'encode':
        task = encode_celery.AsyncResult(task_id)
    elif type == 'simulation':
        pass
    elif type == 'decode':
        task = decode_celery.AsyncResult(task_id) 
    else:
        pass
    print(task.state,task.info)

    # waiting 
    if task.state == 'PENDING':
        response = {'state':task.state,'current':0,'total':1}
    elif task.state != 'FAILURE':
        print(task.state,task.info)
        # running
        response = {'state':task.state,
                    'current':task.info.get('current',0),
                    'total':task.info.get('total',1)}
        # successful
        if 'callback' in task.info:
            response['result'] = task.info['result']
            response['callback'] = task.info['callback']
    else:
        # error
        response = {'state':task.state,'current':1,'total':1}
    return json.dumps(response)



if __name__ == '__main__':
    # task_id = encode_start()
    task_id = decode_start()
    for i in range(200):
        time.sleep(3)
        response = task_status(task_id=task_id,type='decode')
        # print(response)