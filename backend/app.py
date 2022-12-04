import os
import json
import time
import yaml

from flask import Flask, render_template,session
from flask import request,send_from_directory
from flask_cors import CORS

from script.step1_get_file_uid import get_file_uid
from script.step2_encoding_aysnc import Encoding,get_progress_bar
import script.step3_simulation_aysnc as simu_utils
from script.step4_decode_aysnc import ClusterDecode
from script.utils.simulation_utils import is_fasta,fasta_to_dna
from script.utils.utils_basic import get_config,write_yaml,get_download_path,is_txt
from app_utils import set_session,get_session

app = Flask(__name__,static_folder="../dist/assets",template_folder="../dist/")
CORS(app, resources=r'/*')
backend_dir = os.path.dirname(os.path.abspath(__file__))
print("----------------------------------------------------------------",backend_dir)


@app.route('/')
def index():
    return render_template('index.html')  

@app.route('/file_upload',methods=['GET','POST'])
def file_upload():
    print('\n','#'*25,'File Uploading','#'*25,'\n','#'*60)
    # don not allow big file than 10M
    # file size samll than 100kb can not use fundation and yin-yang
    f = request.files['file']
    filename = f.filename
    filetype = f.mimetype

    file_uid = get_file_uid()
    file_rename = '{}_{}'.format(file_uid,filename)
    save_dir = '{}/upload/{}'.format(backend_dir,file_rename)
    f.save(save_dir)
     
    if filetype == 'text/plain':
        label = is_txt(save_dir)
    else:
        label = False
        
    file_base_info = {'file_uid':file_uid,
                'file_name':filename,
                'file_rename':file_rename,
                'upload_file_size':os.path.getsize(save_dir),
                'file_type':filetype,
                'eight_can':label}
    print('### Upload file info:',file_base_info)
    yaml_file = '{}/upload/{}.yaml'.format(backend_dir,file_uid)
    write_yaml(yaml_path=yaml_file,data=file_base_info,appending=False)
    print(file_base_info)
    return json.dumps(file_base_info)

@app.route('/progress_bar',methods=['GET','POST'])
def progress_bar():
    print('\n','#'*25,'Progress bar','#'*25,'\n','#'*60)
    #### Postman test json ####
    # {"file_uid":1565237658387615744,
    # "verify_method":"Hamming",
    # "encode_method":"Basic"}

    front_data = request.data
    front_data = json.loads(front_data)
    file_uid = front_data['file_uid'] #'1566....'
    verify_method = front_data['verify_method'] #'HammingCode'
    encode_method = front_data['encode_method'] #'Basic'

    obj = get_progress_bar(file_uid,encode_method,verify_method)
    index_length,bar = obj.get_bar()
    info = {'index_length':index_length,'bar':bar}

    return json.dumps(info)


@app.route('/encode',methods=['GET','POST'])
def file_encode():
    print('\n','#'*25,'Encoding','#'*25,'\n','#'*60)

    front_data = request.data
    front_data = json.loads(front_data)
    print('### Encoding parameters:',front_data)
    #### Postman test json ####
    # {"file_uid":1565237658387615744,
    # "segment_length":160,
    # "index_length":20,
    # "verify_method":"Hamming",
    # "encode_method":"Basic"}

    file_uid = front_data['file_uid'] #'1566....'
    segment_length = front_data['segment_length'] #4
    index_length = front_data['index_length'] #128
    verify_method = front_data['verify_method'] #'HammingCode'
    encode_method = front_data['encode_method'] #'Basic'

    obj = Encoding(file_uid=file_uid,
                  encode_method=encode_method,
                  segment_length=segment_length,
                  index_length=index_length,
                  verify_method=verify_method)                
    encode_info= obj.parallel_run()

    return json.dumps(encode_info)

#if user wants to upload his own dna file instead of generating by us
@app.route('/dna_upload',methods=['GET','POST'])
def dna_upload():
    print('\n','#'*25,'Simulation Upload DNA','#'*25,'\n','#'*60)

    f=request.files['file']
    filename=f.filename
    file_uid=get_file_uid()
    file_rename=file_uid+".fasta"
    ori_save_dir='{}/upload_dna/{}'.format(backend_dir,file_rename)
    f.save(ori_save_dir)
    flag=is_fasta(ori_save_dir)
    # except:
    #     os.remove(ori_save_dir)
    #     return "Invalid"
    if flag:
        strand_count=0
        print("Fasta upload successfully!")
        with open(ori_save_dir,'r') as fp:
            for i in fp:
                if i[0]=='>':
                    strand_count+=1
        print("strand_count",strand_count)

        if strand_count>=200000: 
            file_basic_info={"file_uid":file_uid,
                "overCount":True}
            os.remove(ori_save_dir)
            return json.dumps(file_basic_info)

        if strand_count>150000:
            time=True
        else:
            time=False

        file_basic_info={
            "file_uid":file_uid,
            "file_name":filename,
            "file_rename":file_rename,
            'upload':True,
            'time':time
            }
        yaml_file='{}/upload_dna/{}.yaml'.format(backend_dir,file_uid)
        write_yaml(yaml_path=yaml_file,data=file_basic_info,appending=False)

        return json.dumps(file_basic_info)
    else:
        file_basic_info={
            "file_uid":file_uid,
            "format":False
            }
        os.remove(ori_save_dir)
        return json.dumps(file_basic_info)

#now_simu=Simu()
@app.route('/simu_synthesis',methods=['GET','POST'])
def simu_synthesis():
    print('\n','#'*25,'Simulation File Encode DNA','#'*25,'\n','#'*60)
    t1=time.time()
    front_data = request.data
    front_data = json.loads(front_data)
    '''
    #### Postman test json ####
    #### for normal files
     { "file_uid":1565536927137009664,
         "synthesis_number":30,
         "synthesis_yield":0.99,
         "synthesis_method":"ErrASE"
         }
     #### for upload dna file
     {
        "file_uid":1582175684011364352,
        "synthesis_number":30,
        "synthesis_yield":0.99,
        "synthesis_method":"ErrASE",
        "upload_flag":"True"
     }
    '''
    try:
        upload_flag=front_data['upload_flag']
    except:
        upload_flag=False
    
    file_uid=front_data['file_uid']
    synthesis_number = front_data['synthesis_number']
    synthesis_yield = front_data['synthesis_yield']
    synthesis_method = front_data['synthesis_method']

    simu_synthesis_settings=simu_utils.get_simu_synthesis_info(file_uid=file_uid,
        upload_flag=upload_flag,
        synthesis_number=synthesis_number,
        synthesis_yield=synthesis_yield,
        synthesis_method=synthesis_method)
    
    print("Simulation Synthesis time:"+str(time.time()-t1))
    return json.dumps(simu_synthesis_settings)

@app.route('/simu_dec',methods=['GET','POST'])
def simu_dec():
    t1=time.time()
    front_data = request.data
    front_data = json.loads(front_data)

    try:
        upload_flag=front_data['upload_flag']
    except:
        upload_flag=False

    '''
    #### Postman test json ####
     {  "file_uid":1582175684011364352,
        "months_of_storage":24,
        "decay_loss_rate":0.3,
        "storage_host":"Hsapiens",
        "upload_flag":"True"
        }
    '''
    file_uid=front_data['file_uid']
    months_of_storage = front_data['months_of_storage']
    loss_rate = front_data['decay_loss_rate']
    storage_host = front_data['storage_host']

    simu_dec_settings=simu_utils.get_simu_dec_info(
        file_uid=file_uid,
        upload_flag=upload_flag,
        months_of_storage=months_of_storage,
        loss_rate=loss_rate,
        storage_host=storage_host)

    print("Simulation Decay time:"+str(time.time()-t1))

    return json.dumps(simu_dec_settings)

@app.route('/simu_pcr',methods=['GET','POST'])
def simu_pcr():
    t1=time.time()
    front_data = request.data
    front_data = json.loads(front_data)

    try:
        upload_flag=front_data['upload_flag']
    except:
        upload_flag=False
    '''
    #### Postman test json ####
     {  "file_uid":1582175684011364352,
        "pcr_cycle":12,
        "pcr_prob":0.8,
        "pcr_polymerase":"Taq",
        "upload_flag":"True"
        }
    '''
    pcr_cycle = front_data['pcr_cycle']
    pcr_prob = front_data['pcr_prob']
    pcr_polymerase = front_data['pcr_polymerase']
    file_uid=front_data['file_uid']
    # upload_flag=front_data['upload_flag']

    simu_pcr_settings=simu_utils.get_simu_pcr_info(
        file_uid=file_uid,
        upload_flag=upload_flag,
        pcr_cycle=pcr_cycle,
        pcr_prob=pcr_prob,
        pcr_polymerase=pcr_polymerase)

    print("Simulation PCR time:"+str(time.time()-t1))
    return json.dumps(simu_pcr_settings)

@app.route('/simu_sam',methods=['GET','POST'])
def simu_sam():
    t1=time.time()
    front_data = request.data
    front_data = json.loads(front_data)

    try:
        upload_flag=front_data['upload_flag']
    except:
        upload_flag=False
    '''
    #### Postman test json ####
    {"sam_ratio":0.005,
     "file_uid":1582175684011364352,
     "upload_flag":"True" 
     }
    '''
    sam_ratio =front_data['sam_ratio'] 
    file_uid=front_data['file_uid']
    # upload_flag=front_data['upload_flag']

    simu_sam_settings=simu_utils.get_simu_sam_info(
        sam_ratio=sam_ratio,
        file_uid=file_uid,
        upload_flag=upload_flag
        )

    print("Simalation Sample time:"+str(time.time()-t1))
    return json.dumps(simu_sam_settings)

@app.route('/simu_seq',methods=['GET','POST'])
def simu_seq():
    t1=time.time()
    front_data = request.data
    front_data = json.loads(front_data)

    try:
        upload_flag=front_data['upload_flag']
    except:
        upload_flag=False

    '''
    #### Postman test json ####
     { "seq_depth":15,
      "seq_meth":"ill_PairedEnd",
      "file_uid":1582175684011364352,
     "upload_flag":"True" }
    '''
    seq_depth =front_data['seq_depth'] 
    seq_meth=front_data['seq_meth']
    file_uid=front_data['file_uid']
    # upload_flag=front_data['upload_flag']

    simu_seq_settings=simu_utils.get_simu_seq_info(
        seq_depth=seq_depth,
        seq_meth=seq_meth,
        file_uid=file_uid,
        upload_flag=upload_flag)

    print("Simulation Sequence time:"+str(time.time()-t1))
    return json.dumps(simu_seq_settings)

@app.route('/simu_repo',methods=['GET','POST'])
def simu_repo():
    
    '''
     ##Postman test json
     {
        "file_uid":1582175684011364352,
        "upload_flag":"True" 
        }
    '''
    front_data = request.data
    front_data = json.loads(front_data)
    try:
        upload_flag=front_data['upload_flag']
    except Exception as e:
        upload_flag=False
    
    file_uid=front_data['file_uid']
    #upload_flag=front_data['upload_flag']
    simu_repo=simu_utils.get_simu_repo(file_uid,upload_flag)
    return json.dumps(simu_repo)
    
@app.route('/decode',methods=['GET','POST'])
def decode():
    #### Postman test json ####
    # {"file_uid":1565536927137009664,
    # "clust_method":"cdhit"}
    # "clust_method":'starcode'}
    print('\n','#'*25,'Decoding','#'*25,'\n','#'*60)

    front_data = request.data
    front_data = json.loads(front_data)
    file_uid = front_data['file_uid'] 
    clust_method = front_data['clust_method']
    print('### Decode parameters is:',front_data)

    Decode_obj = ClusterDecode(file_uid = file_uid,clust_method= clust_method)
    decode_info = Decode_obj.decode()
    print(decode_info)
    return json.dumps(decode_info)

@app.route('/download',methods=['GET','POST'])
def download():
    #### test postman ####
    # {{"file_uid":1565536927137009664,"type":"encode"}
    # {"file_uid":1582175684011364352,"type":"simulation"}
    print('\n','#'*25,'Downloading Files','#'*25,'\n','#'*60)
    front_data = json.loads(request.data)
    file_uid = front_data['file_uid']
    type = front_data['type']
    print('### Download parameters:',front_data)
    if type == 'encode':
        dna_dir,downfile_name = get_download_path(type='encode',file_uid=file_uid)
        print(dna_dir,downfile_name)
        response = send_from_directory(dna_dir,downfile_name,as_attachment=True)
        return response
    elif type == 'simulation':
        dna_dir,downfile_name = get_download_path(type='simulation',file_uid=file_uid)
        response = send_from_directory(dna_dir,downfile_name.encode('utf-8').decode('utf-8'),as_attachment=True)
        return response
    else:
        return "Please make sure the uid has been encoded or simulated!"

@app.route('/example',methods=['GET','POST'])
def example():
    print('\n','#'*25,'display example','#'*25,'\n','#'*60)
    front_data = json.loads(request.data)
    type = front_data['type']
    if type == 'encode':
        yaml_path = '{}/upload/example.yaml'.format(backend_dir)
        f = open(yaml_path)
        config_data = f.read()
        config = yaml.load(config_data,Loader=yaml.FullLoader)
        return json.dumps(config)
    elif type == 'simulation':
        yaml_path= '{}/upload_dna/example_1.yaml'.format(backend_dir)
        f = open(yaml_path)
        config_data = f.read()
        config = yaml.load(config_data,Loader=yaml.FullLoader)
        return json.dumps(config)
    elif type == 'decode':
        yaml_path = '{}/upload/example.yaml'.format(backend_dir)
        f = open(yaml_path)
        config_data = f.read()
        config = yaml.load(config_data,Loader=yaml.FullLoader)
        return json.dumps(config)
    else:
        return 'wrong request!'

@app.route('/example_whole_simu',methods=['GET','POST'])
def whole_simu_example():
    print('\n','#'*25,'display example','#'*25,'\n','#'*60)
    front_data = json.loads(request.data)
    file_uid=front_data['file_uid']
    result=simu_utils.run_default_settings(file_uid)
    return json.dumps(result)

#############################################
###############  long task #################
from celery_task import encode_celery,simulation_celery,decode_celery

@app.route('/encode_start',methods=['GET','POST'])
def encode_start():
    print('\n','#'*25,'Encoding Start','#'*25,'\n','#'*60)
    front_data = request.data
    front_data = json.loads(front_data)

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

@app.route('/simulation_start',methods=['GET','POST'])
def simulation_start():
    print('\n','#'*25,'Simulation Start','#'*25,'\n','#'*60)
    front_data = request.data
    front_data = json.loads(front_data)
    try:
        upload_flag=front_data['upload_flag']
    except Exception as e:
        upload_flag=False
    
    file_uid=front_data['file_uid']
    print("File uid is ", file_uid)
    args = [file_uid,upload_flag]
    simulation_task = simulation_celery.apply_async(args=args)
    task_id= simulation_task.id
    return task_id

@app.route('/decode_start',methods=['GET','POST'])
def decode_start():
    print('\n','#'*25,'Encoding Start','#'*25,'\n','#'*60)
    front_data = request.data
    front_data = json.loads(front_data)
    file_uid = front_data['file_uid'] 
    clust_method = front_data['clust_method']
    print('### Decode parameters is:',front_data)

    args = [file_uid,clust_method]
    decode_task = decode_celery.apply_async(args=args)
    task_id = decode_task.id
    print(task_id)
    return task_id

@app.route('/task_status',methods=['GET','POST'])
def task_status():
    front_data = request.data
    front_data = json.loads(front_data)
    task_id = front_data['task_id']
    type = front_data['type']
    print('\n','#'*25,'Request {} {}'.format(type,task_id),'#'*25,'\n')

    if type == 'encode':
        task = encode_celery.AsyncResult(task_id)
    elif type == 'simulation':
        task = simulation_celery.AsyncResult(task_id)
    elif type == 'decode':
        task = decode_celery.AsyncResult(task_id) 
    else:
        'Wrong type request!'
    print(task.state,task.info)

    if task.state == 'PENDING':   # waiting
        response = {'state':task.state}
    elif task.state != 'FAILURE': 
        print(task.state,task.info) # running
        response = {'state':task.state}
        if 'result' in task.info:    # successful
            response['result'] = task.info['result']
    else:                            # error bug
        response = {'state':task.state}
    return json.dumps(response)




if __name__ == '__main__':
    CORS(app,supports_credentials=True)
    app.run('0.0.0.0', port=5000, debug=True)
   