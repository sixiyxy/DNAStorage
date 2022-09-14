from distutils.command.config import config
from flask import Flask, render_template
from flask import request
from flask_cors import *
import os
import json

from script.utils.utils_basic import get_config,write_yaml
from script.step11_get_file_uid import get_file_uid
from script.step12_get_file_info import get_file_info
import script.step3_simulation as Simu



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

@app.route('/upload',methods=['GET','POST'])
def file_upload():
    f = request.files['picture']
    filename = 'upload_test_picture.jpg'
    filetype = 'picture'
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

@app.route('/fileinfo',methods=['GET','POST'])
def file_information():
    front_data = request.data
    front_data = json.loads(front_data)

    #### Postman test json ####
    {"file_uid":1565237658387615744,
    "segment_length":160,
    "index_length":20,
    "verify_method":"Hamming",
    "encode_method":"Basic"}

    file_uid = front_data['file_uid']
    segment_length = front_data['segment_length']
    index_length = front_data['index_length']
    verify_method = front_data['verify_method']
    encode_method = front_data['encode_method']

    file_info = get_file_info(file_uid=file_uid,
    segment_length=segment_length,
    index_length=index_length,
    verify_method=verify_method,
    encode_method=encode_method
    )

    return json.dumps(file_info)

simu_dna=[]
@app.route('/simu_synthesis',methods=['GET','POST'])
def simu_synthesis():
    front_data = request.data
    front_data = json.loads(front_data)

    #### Postman test json ####
    {"file_uid":1565536927137009664,
    "synthesis_number":30,
    "synthesis_yield":0.99,
    "synthesis_method":'ErrASE'}

    file_uid=front_data['file_uid']
    synthesis_number = front_data['synthesis_number']
    synthesis_yield = front_data['synthesis_yield']
    synthesis_method = front_data['synthesis_method']

    simu_synthesis_settings,dnas_syn=Simu.get_simu_synthesis_info(
        file_uid=file_uid,
        synthesis_number=synthesis_number,
        synthesis_yield=synthesis_yield,
        synthesis_method=synthesis_method
    )

    global simu_dna
    simu_dna=dnas_syn

    return json.dumps(simu_synthesis_settings)

@app.route('/simu_dec',methods=['GET','POST'])
def simu_decay():
    front_data = request.data
    front_data = json.loads(front_data)

    #### Postman test json ####
    {"file_uid":1565536927137009664,
    "months_of_storage":24,
    "loss_rate":0.3,
    "storage_host":'Ecoli'}

    file_uid=front_data['file_uid']
    months_of_storage = front_data['months_of_storage']
    loss_rate = front_data['loss_rate']
    storage_host = front_data['storage_host']

    simu_dec_settings,dnas_dec=Simu.get_simu_dec_info(
        file_uid=file_uid,
        months_of_storage=months_of_storage,
        loss_rate=loss_rate,
        storage_host=storage_host,
        dnas=simu_dna
    )
    
    global simu_dna
    simu_dna=dnas_dec

    return json.dumps(simu_dec_settings)

@app.route('/simu_pcr',methods=['GET','POST'])
def simu_pcr():
    front_data = request.data
    front_data = json.loads(front_data)

    #### Postman test json ####
    {"file_uid":1565536927137009664,
    "pcr_cycle":12,
    "pcr_prob":0.8,
    "pcr_polymerase":'Taq'}

    file_uid=front_data['file_uid']
    pcr_cycle = front_data['pcr_cycle']
    pcr_prob = front_data['pcr_prob']
    pcr_polymerase = front_data['pcr_polymerase']

    simu_pcr_settings,dnas_pcr=Simu.get_simu_pcr_info(
        file_uid=file_uid,
        pcr_cycle=pcr_cycle,
        pcr_prob=pcr_prob,
        pcr_polymerase=pcr_polymerase,
        dnas=simu_dna
    )
    
    global simu_dna
    simu_dna=dnas_pcr

    return json.dumps(simu_pcr_settings)

@app.route('/simu_sam',methods=['GET','POST'])
def simu_sam():
    front_data = request.data
    front_data = json.loads(front_data)

    #### Postman test json ####
    {"file_uid":1565536927137009664,
    "sam_ratio":0.005
    }

    file_uid=front_data['file_uid']
    sam_ratio =front_data['sam_ratio'] 

    simu_sam_settings,dnas_sam=Simu.get_simu_sam_info(
        file_uid=file_uid,
        sam_ratio=sam_ratio,
        dnas=simu_dna
    )
    
    global simu_dna
    simu_dna=dnas_sam

    return json.dumps(simu_sam_settings)

@app.route('/simu_seq',methods=['GET','POST'])
def simu_seq():
    front_data = request.data
    front_data = json.loads(front_data)

    #### Postman test json ####
    {"file_uid":1565536927137009664,
    "sam_ratio":0.005
    }

    file_uid=front_data['file_uid']
    sam_ratio =front_data['sam_ratio'] 

    simu_sam_settings,dnas_sam=Simu.get_simu_sam_info(
        file_uid=file_uid,
        sam_ratio=sam_ratio,
        dnas=simu_dna
    )
    
    global simu_dna
    simu_dna=dnas_sam

    return json.dumps(simu_sam_settings)

print('test github')
print(app.url_map)


if __name__ == '__main__':
    app.run('127.0.0.1', port=5000, debug=True)