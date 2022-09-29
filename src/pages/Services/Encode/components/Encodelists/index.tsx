import type { RadioChangeEvent } from "antd";
import { Input, Radio, Space } from "antd";
import React, { useState } from "react";
import axios from "axios";
import "./index.less";
import { Link } from "react-router-dom";

var encodeMethod = "";
var requests = { bit_size: "", byte_size: "", segment_number: "" };

const Encodelists: React.FC = (props: any) => {
  const [value, setValue] = useState("");
  const onChange = (e: RadioChangeEvent) => {
    //console.log("radio checked", e.target.value);
    encodeMethod = e.target.value;
    setValue(e.target.value);
  };

  var params = {
    file_uid: "1565536927137009664",
    segment_length: 160,
    index_length: 20,
    verify_method: "Hamming",
    encode_method: "Basic",
  };
  //console.log(props);

  const handleClick = () => {
    //console.log("encodelists", props);
    params.file_uid = props.fileId;
    params.segment_length = props.index;
    params.index_length = props.seg;
    params.verify_method = props.method;
    params.encode_method = encodeMethod;

    axios
      .post("http://127.0.0.1:5000/fileinfo", params)
      .then(function (response) {
        console.log("response: ", response);
        requests.bit_size = response.data.bit_size;
        requests.segment_number = response.data.segment_number;
        console.log('编码方法后端返回值',requests);

        //以下均为后端返回的data中的值
        // console.log(response.data.byte_size)
        // console.log(response.data.bit_size)
        // console.log(response.data.encode_method)
        // console.log(response.data.index_length)
        // console.log(response.data.segment_length)
        // console.log(response.data.segment_number)
        // console.log(response.data.verify_method)
        // console.log(response.data.encode_method)
      })
      .catch((err) => console.log("前端", err));
  };

  return (
    <div className="todo-container">
      <div>
        <h2>Choose Decode Method</h2>
        <div style={{ paddingLeft: "20px" }}>
          <Radio.Group onChange={onChange} value={value}>
            <Space direction="vertical">
              <Radio value={"Basic"}>Basic</Radio>
              <Radio value={"Church"}>Church</Radio>
              <Radio value={"Goldman"}>Goldman</Radio>
              <Radio value={"Grass"}>Grass</Radio>
              <Radio value={"Zan"}>Zan</Radio>
              <Radio value={"CompositeDNA"}>CompositeDNA</Radio>
              <Radio value={"Blawat"}>Blawat</Radio>
              <Radio value={"DNA_Fountain"}>DNA_Fountain</Radio>
              <Radio value={"Yin_Yang"}>Yin_Yang</Radio>
              {/* <Radio value={4}>
            More...
            {value === 4 ? <Input style={{ width: 100, marginLeft: 10 }} /> : null}
            </Radio> */}
            </Space>
          </Radio.Group>
        </div>
        <div>
        <div style={{ marginTop: "20px"}}>
          Method details please click the :{" "}
          <Link to="/methods">Method Paper</Link>
        </div>
        <button 
          className="btn btn-danger" 
          style={{ marginLeft: "650px"}}
          onClick={handleClick}
        >
          Run
        </button>
        
        </div>
      </div>

      {/* <div>
      JobID:{props.fileID[0].fileuid}
      Filetype:{props.fileID[3].filetype}
      Filename:{props.fileID[1].filename}
      Filebites:{requests.bit_size}
      Segment number:{requests.segment_number}
    </div> */}
    </div>
  );
};

export default Encodelists;
