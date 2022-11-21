import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import React, { useState } from "react";
import { API_PREFIX } from "../../../../../common/Config";
const { Dragger } = Upload;
import "./index.less";

const Uploads: React.FC = (props: any) => {
  //const [fileID,setfileID] = useState(FileValue)
  const Props: UploadProps = {
    name: "file",
    multiple: true,
    action: API_PREFIX + "/file_upload",
    maxCount: 1,
    
    beforeUpload(file, fileList){
      const islt10M = file.size / 1024 /1024 < 10
      const islt100k = file.size /1024 < 100
        if (!islt10M) {
            message.error('The upload file size is too large, please try with a samller file !')
            const index = fileList.indexOf(file)
            fileList.splice(index, 1)
            return false
        }else if(islt100k){
          console.log('文件小于100kb');
          props.setBtn(true);
          props.setUpload100(true)
        }
        else{
          props.setBtn(true);
          props.setUpload100(false)
        }
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log("文件上传后端返回值", info.file);
        if (info.file.response.upload_file_szie >= 2048000) {
          props.setChange(false); //文件大于2M
        }
        props.GetFileID(info.file.response.file_uid);
        props.FileInfoPass(
          info.file.response.file_uid,
          info.file.response.file_name,
          info.file.response.file_type
        );
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      //console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className="encode-uploads">
      <Dragger {...Props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Let's start!</p>
        <p className="ant-upload-hint">Support file types: video, txt, mp3, picture...</p>
      </Dragger>
    </div>
  );
};

export default Uploads;
