import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;
const props = {
  name: 'file',
  multiple: true,
  action: 'http://127.0.0.1:5000/upload',

  onChange(info:any) {
    const { status } = info.file;

    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
      console.log(info.file.response.file_uid);
      
    }

    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },

  onDrop(e:any) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const Uploads = () => (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Let's Start!</p>
    <p className="ant-upload-hint">
      Click or drag file to this area to upload. (File type:picture、music、txt、pdf、video and so on.)
    </p>
  </Dragger>
);

export default Uploads;