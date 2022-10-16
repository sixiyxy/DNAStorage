from distutils.command.config import config
from imp import reload
import os
import json
import time

from flask import Flask, render_template,session
from flask import request
from flask_cors import CORS
from flask_session import Session
from script.utils.simulation_utils import is_fasta,fasta_to_dna

from script.utils.utils_basic import get_config,write_yaml
from script.step1_get_file_uid import get_file_uid
from script.step2_encoding import Encoding
from script.step3_simulation_utils import Simulation as Simu
from script.step4_decode import ClusterDecode
from app_utils import set_session,get_session

app = Flask(__name__,static_folder="../dist/assets",template_folder="../dist/")
app.config['SESSION_TYPE']='filesystem'
app.config['SECRET_KEY'] = 'XXXXX'
app.secret_key='xxxxxxx'
Session(app)
CORS(app, resources=r'/*')

backend_dir = os.path.dirname(os.path.abspath(__file__))
print("----------------------------------------------------------------",backend_dir)

@app.route('/')
def index():
    return render_template('index.html')  

@app.route('/file_upload',methods=['GET','POST'])
def file_upload():
    print('\n','#'*25,'File Uploading','#'*25,'\n','#'*60)
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

@app.route('/encode',methods=['GET','POST'])
def file_encode():
    print('\n','#'*25,'Encoding','#'*25,'\n','#'*60)

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

    obj = Encoding(file_uid=file_uid,
                  encode_method=encode_method,
                  segment_length=segment_length,
                  index_length=index_length,
                  verify_method=verify_method)
                  
    encode_info,encode_bits = obj.bit_to_dna()
    encode_key = 'encode_{}'.format(file_uid)
    session['encode_key'] = encode_key
    set_session(encode_key,encode_bits)

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

    '''
    Postman Test Content
    1. a .fasta file with key 'file'
    2. json with key 'data'
    {  "synthesis_number":30,
        "synthesis_yield":0.99,
        "synthesis_method":"ErrASE"
        }
    '''
    
    try:
        flag=is_fasta(ori_save_dir)
    except:
        os.remove(ori_save_dir)
        return "Invalid"

    if flag:
        file_basic_info={
            "file_uid":file_uid,
            "file_name":filename,
            "file_rename":file_rename,
            'upload':True
            }
        yaml_file='{}/upload_dna/{}.yaml'.format(backend_dir,file_uid)
        write_yaml(yaml_path=yaml_file,data=file_basic_info,appending=False)

        dna=fasta_to_dna(ori_save_dir)
        front_data=json.loads(request.form.get('data'))
        synthesis_number = front_data['synthesis_number']
        synthesis_yield = front_data['synthesis_yield']
        synthesis_method = front_data['synthesis_method']
        
        now_simu=Simu(file_uid=file_uid,upload_flag=True,dna=dna)
        simu_synthesis_settings,density=now_simu.get_simu_synthesis_info(synthesis_number=synthesis_number,
        synthesis_yield=synthesis_yield,
        synthesis_method=synthesis_method)
    
        simulation_key = 'simulation_{}'.format(file_uid)
        session['simulation_key'] = simulation_key
        set_session(simulation_key,now_simu)
        simu_synthesis_settings['density']=density
    else:
        os.remove(ori_save_dir)
        return "Invalid"
    file_basic_info['synthesis_info']=simu_synthesis_settings
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
     { "file_uid":1565536927137009664,
         "synthesis_number":30,
         "synthesis_yield":0.99,
         "synthesis_method":"ErrASE"}
    '''
    file_uid=front_data['file_uid']
    synthesis_number = front_data['synthesis_number']
    synthesis_yield = front_data['synthesis_yield']
    synthesis_method = front_data['synthesis_method']

    #global now_simu
    now_simu=Simu(file_uid)
    simu_synthesis_settings,density=now_simu.get_simu_synthesis_info(synthesis_number=synthesis_number,
        synthesis_yield=synthesis_yield,
        synthesis_method=synthesis_method)
    
    simulation_key = 'simulation_{}'.format(file_uid)
    session['simulation_key'] = simulation_key
    set_session(simulation_key,now_simu)
    simu_synthesis_settings['density']=density
    print("Simulation Synthesis time:"+str(time.time()-t1))
    return json.dumps(simu_synthesis_settings)

@app.route('/simu_dec',methods=['GET','POST'])
def simu_dec():
    t1=time.time()
    front_data = request.data
    front_data = json.loads(front_data)

    '''
    #### Postman test json ####
     {"months_of_storage":24,
     "loss_rate":0.3,
     "storage_host":"WhiteGaussian"}
    '''
    months_of_storage = front_data['months_of_storage']
    loss_rate = front_data['loss_rate']
    storage_host = front_data['storage_host']

    if 'simulation_key' not in session:
        return 'session invalid, simulation_key not found'

    now_simu=get_session(session['simulation_key'])
    if now_simu is None:
        return 'session invalid'

    simu_dec_settings,syn_density,dec_density=now_simu.get_simu_dec_info(
        months_of_storage=months_of_storage,
        loss_rate=loss_rate,
        storage_host=storage_host)

    simu_dec_settings["syn_density"]=syn_density
    simu_dec_settings["dec_density"]=dec_density

    print("Simulation Decay time:"+str(time.time()-t1))
    return json.dumps(simu_dec_settings)

@app.route('/simu_pcr',methods=['GET','POST'])
def simu_pcr():
    t1=time.time()
    front_data = request.data
    front_data = json.loads(front_data)
    '''
    #### Postman test json ####
     {"pcr_cycle":12,
     "pcr_prob":0.8,
     "pcr_polymerase":"Taq"}
    '''
    pcr_cycle = front_data['pcr_cycle']
    pcr_prob = front_data['pcr_prob']
    pcr_polymerase = front_data['pcr_polymerase']

    if 'simulation_key' not in session:
        return 'session invalid, simulation_key not found'

    now_simu=get_session(session['simulation_key'])
    if now_simu is None:
        return 'session invalid'

    simu_pcr_settings=now_simu.get_simu_pcr_info(
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

    #### Postman test json ####
    # {"sam_ratio":0.005 }

    sam_ratio =front_data['sam_ratio'] 

    if 'simulation_key' not in session:
        return 'session invalid, simulation_key not found'

    now_simu=get_session(session['simulation_key'])
    if now_simu is None:
        return 'session invalid'

    simu_sam_settings=now_simu.get_simu_sam_info(
        sam_ratio=sam_ratio)

    print("Simalation Sample time:"+str(time.time()-t1))
    return json.dumps(simu_sam_settings)

@app.route('/simu_seq',methods=['GET','POST'])
def simu_seq():
    t1=time.time()
    front_data = request.data
    front_data = json.loads(front_data)

    #### Postman test json ####
    # { "seq_depth":15,
    #  "seq_meth":"ill_PairedEnd"}

    seq_depth =front_data['seq_depth'] 
    seq_meth=front_data['seq_meth']

    if 'simulation_key' not in session:
        return 'session invalid, simulation_key not found'

    now_simu=get_session(session['simulation_key'])
    if now_simu is None:
        return 'session invalid'

    simu_seq_settings=now_simu.get_simu_seq_info(
        seq_depth=seq_depth,
        seq_meth=seq_meth)

    print("Simulation Sequence time:"+str(time.time()-t1))
    return json.dumps(simu_seq_settings)


@app.route('/decode',methods=['GET','POST'])
def decode():
    print('\n','#'*25,'Decoding','#'*25,'\n','#'*60)
    
    front_data = request.data
    front_data = json.loads(front_data)

    #### Postman test json ####
    # {"file_uid":1565536927137009664,
    # "clust_method":"cdhit"}

    file_uid = front_data['file_uid'] 
    clust_method = front_data['clust_method']
    
    if 'encode_key' not in session:
        return 'session invalid, encode_key not found'

    encode_bits=get_session(session['encode_key'])
    if encode_bits is None:
        return 'please make sure file encoded!!!'
    else:
        Decode_obj = ClusterDecode(file_uid = file_uid,
                                    encode_bit_segment=encode_bits,
                                    clust_method= 'cdhit')
        decode_info = Decode_obj.decode()
        return json.dumps(decode_info)


print(app.url_map)

if __name__ == '__main__':
    app.run('127.0.0.1', port=5000, debug=True)
   