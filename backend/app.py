from distutils.command.config import config
from flask import Flask, render_template
from flask import request
from flask_cors import *
import os
import json

from script.utils import get_config,write_yaml
from script.step11_get_file_uid import get_file_uid



app = Flask(__name__,static_folder="../dist/assets",template_folder="../dist/")
CORS(app,suports_credentials=True)

backend_dir = os.path.dirname(os.path.abspath(__file__))


@app.route('/')
def index():
    return render_template('index.html')  

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

@app.route('/upload',methods=['GET','POST'])
def file_upload():
    f = request.files['picture']
    filename = 'upload_test_picture.jpg'
    filetype = 'picture'
    file_uid = get_file_uid()
    file_rename = '{}_{}'.format(file_uid,filename)
    save_dir = '{}/upload/{}'.format(backend_dir,file_rename)
    f.save(save_dir)
    file_info = {'file_uid':file_uid,
                'file_name':filename,
                'file_rename':file_rename,
                'file_type':filetype}
    yaml_file = '{}/upload/{}.yaml'.format(backend_dir,file_uid)
    write_yaml(yaml_path=yaml_file,data=file_info,appending=False)
    return json.dumps(file_info)

@app.route('/fileinfo',methods=['GET','POST'])
def file_information():
    pass

print(app.url_map)


if __name__ == '__main__':
    app.run('127.0.0.1', port=5000, debug=True)
