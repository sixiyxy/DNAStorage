from distutils.command.config import config
from imp import reload
from flask import Flask, render_template
from flask import request
from flask_cors import *
import os
import json

from script.utils.utils_basic import get_config,write_yaml
from script.step11_get_file_uid import get_file_uid
from script.step12_get_file_info import get_file_info
from script.step21_encoding import Encoding

import script.step3_simulation_utils as Simu


app = Flask(__name__,static_folder="../dist/assets",template_folder="../dist/")
CORS(app,suports_credentials=True)

backend_dir = os.path.dirname(os.path.abspath(__file__))


@app.route('/')
def index():
    return render_template('index.html')  

####################################################
#### test route ####
@app.route('/test_args')
def get_student():
    student_name = request.args.get('student')
    return 'show:{}'.format(student_name)

@app.route('/test_json')
def get_json():
    json_data = {'one':1,'two':'xxx'}
    return json.dumps(json_data)

@app.route('/test_front',methods=["GET","POST"])
def get_front():
    front_data = request.data
    print(front_data)
    return "success"
#### test route ####
######################################################

@app.route('/file_upload',methods=['GET','POST'])
def file_upload():
    f = request.files['file']
    filename = f.filename
    filetype = f.mimetype
    file_uid = get_file_uid()
    file_rename = '{}_{}'.format(file_uid,filename)
    save_dir = '{}/upload/{}'.format(backend_dir,file_rename)
    f.save(save_dir)
    file_base_info = {'file_uid':file_uid,
                'file_name':filename,
                'file_rename':file_rename,
                'file_type':filetype}
    yaml_file = '{}/upload/{}.yaml'.format(backend_dir,file_uid)
    write_yaml(yaml_path=yaml_file,data=file_base_info,appending=False)

    return json.dumps(file_base_info)

@app.route('/file_info',methods=['GET','POST'])
def file_information():
    front_data = request.data
    front_data = json.loads(front_data)

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

    file_info = get_file_info(file_uid=file_uid,
    segment_length=segment_length,
    index_length=index_length,
    verify_method=verify_method,
    encode_method=encode_method
    )

    return json.dumps(file_info)


@app.route('/file_encode',methods=['GET','POST'])
def file_encode():
    front_data = request.data
    front_data = json.loads(front_data)

    #### Postman test json ####
    # {"file_uid":1565237658387615744}

    file_uid = front_data['file_uid']
    obj = Encoding(file_uid)
    encode_info = obj.bit_to_dna()

    return json.dumps(encode_info)

#if user wants to upload his own dna file instead of generating by us
@app.route('/dna_upload',methods=['GET','POST'])
def dna_upload():
    f=request.files['file']
    filename=f.filename
    filetype=f.mimetype
    file_uid=get_file_uid()
    file_rename='{}_{}'.format(file_uid,filename)

now_simu=Simu()
@app.route('/simu_synthesis',methods=['GET','POST'])
def simu_synthesis():
    front_data = request.data
    front_data = json.loads(front_data)

    #### Postman test json ####
    # {"file_uid":1565536927137009664,
    # "synthesis_number":30,
    # "synthesis_yield":0.99,
    # "synthesis_method":"ErrASE"}

    file_uid=front_data['file_uid']
    synthesis_number = front_data['synthesis_number']
    synthesis_yield = front_data['synthesis_yield']
    synthesis_method = front_data['synthesis_method']

    global now_simu
    now_simu=Simu(file_uid)
    simu_synthesis_settings,density=now_simu.get_simu_synthesis_info(synthesis_number=synthesis_number,
        synthesis_yield=synthesis_yield,
        synthesis_method=synthesis_method
    )
    simu_synthesis_settings['density']=density
    return json.dumps(simu_synthesis_settings)


@app.route('/simu_dec',methods=['GET','POST'])
def simu_dec():
    front_data = request.data
    front_data = json.loads(front_data)

    #### Postman test json ####
    # {"file_uid":1565536927137009664,
    # "months_of_storage":24,
    # "loss_rate":0.3,
    # "storage_host":"Ecoli"}

    file_uid=front_data['file_uid']
    months_of_storage = front_data['months_of_storage']
    loss_rate = front_data['loss_rate']
    storage_host = front_data['storage_host']
    global now_simu
    simu_dec_settings=now_simu.get_simu_dec_info(
        months_of_storage=months_of_storage,
        loss_rate=loss_rate,
        storage_host=storage_host,
    )

    return json.dumps(simu_dec_settings)

@app.route('/simu_pcr',methods=['GET','POST'])
def simu_pcr():
    front_data = request.data
    front_data = json.loads(front_data)

    #### Postman test json ####
    # {"file_uid":1565536927137009664,
    # "pcr_cycle":12,
    # "pcr_prob":0.8,
    # "pcr_polymerase":"Taq"}

    file_uid=front_data['file_uid']
    pcr_cycle = front_data['pcr_cycle']
    pcr_prob = front_data['pcr_prob']
    pcr_polymerase = front_data['pcr_polymerase']

    simu_pcr_settings,dnas_pcr=Simu(file_uid).get_simu_pcr_info(
        pcr_cycle=pcr_cycle,
        pcr_prob=pcr_prob,
        pcr_polymerase=pcr_polymerase,
        dnas=simu_dna
    )

    return json.dumps(simu_pcr_settings)

@app.route('/simu_sam',methods=['GET','POST'])
def simu_sam():
    front_data = request.data
    front_data = json.loads(front_data)

    #### Postman test json ####
    # {"file_uid":1565536927137009664,
    # "sam_ratio":0.005
    # }

    file_uid=front_data['file_uid']
    sam_ratio =front_data['sam_ratio'] 

    simu_sam_settings,dnas_sam=Simu(file_uid).get_simu_sam_info(
        file_uid=file_uid,
        sam_ratio=sam_ratio,
        dnas=simu_dna
    )
    simu_dna=[]
    simu_dna=dnas_sam

    return json.dumps(simu_sam_settings)

@app.route('/simu_seq',methods=['GET','POST'])
def simu_seq():
    front_data = request.data
    front_data = json.loads(front_data)

    #### Postman test json ####
    # {"file_uid":1565536927137009664,
    # "seq_depth":5,
    # "seq_meth":"ill_PairedEnd"
    # }

    file_uid=front_data['file_uid']
    seq_depth =front_data['seq_depth'] 
    seq_meth=front_data['seq_meth']

    simu_seq_settings,dnas_seq=Simu.get_simu_seq_info(
        file_uid=file_uid,
        seq_depth=seq_depth,
        seq_meth=seq_meth,
        in_dnas=simu_dna
    )
    simu_dna=[]
    simu_dna=dnas_seq

    return json.dumps(simu_seq_settings)

print('test github')
print(app.url_map)


if __name__ == '__main__':
    app.run('127.0.0.1', port=5000, debug=True)
    