import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import React, { useState } from "react";
import {API_PREFIX} from "../../../../../common/Config";
const { Dragger } = Upload;

const Uploads: React.FC = (props: any) => {
  //const [fileID,setfileID] = useState(FileValue)
  const Props: UploadProps = {
    name: "file",
    multiple: true,
    // action: "http://127.0.0.1:5000//file_upload",
    action: API_PREFIX + "/file_upload",
    maxCount:1,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log('文件上传后端返回值',info.file);
        props.setBtn(true);
        if(info.file.response.upload_file_szie >= 2048000) {
          props.setChange(false) //文件大于2M
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
    <div>
      <Dragger {...Props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Let's start!</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading
          company data or other band files
        </p>
      </Dragger>
    </div>
  );
};

export default Uploads;
