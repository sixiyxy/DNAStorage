import type { RadioChangeEvent } from "antd";
import { Input, Radio, Space } from "antd";
import React, { useState } from "react";
import axios from "axios";
import "./index.less";
import { Link } from "react-router-dom";

var encodeMethod = "";

const Encodelists: React.FC = (props: any) => {
  const [value, setValue] = useState("");
  const onChange = (e: RadioChangeEvent) => {
    //console.log("radio checked", e.target.value);
    encodeMethod = e.target.value;
    setValue(e.target.value);
  };

  var params1 = {
    file_uid: "1565536927137009664",
    segment_length: 160,
    index_length: 20,
    verify_method: "Hamming",
    encode_method: "Basic",
  };
  var params2 ={
    file_uid:'1565536927137009664'
  }
  //console.log(props);

  function Request_fileInfo(){
    params1.file_uid = props.fileId;
    params1.segment_length = props.seg;
    params1.index_length = props.index;
    params1.verify_method = props.method;
    params1.encode_method = encodeMethod;
    console.log(params1);
    return axios.post("http://127.0.0.1:5000//file_info", params1)
  }

  function Request_fileEncode(){
    params2.file_uid = props.fileId;
    console.log(params2);
    return axios.post("http://127.0.0.1:5000//file_encode",params2)
  }

  const handleClick = () => {
    props.changeSider("0-0-1");
    axios.all([Request_fileInfo(),Request_fileEncode()])
    .then(axios.spread(function(response_Info,response_Encode){
        console.log('response1',response_Info);
        console.log('response2',response_Encode);

        props.InfoPass1(response_Info.data)
        props.GCPass(response_Encode.data.gc_plot)
        props.HomoPass(response_Encode.data.homo_plot)
        props.DNAInfoPass(response_Encode.data.DNA_sequence_length,response_Encode.data.encoding_time,response_Encode.data.information_density,response_Encode.data.nucleotide_counts)
    })); 
    
  }

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
              <Radio value={"Blawat"}>Blawat</Radio>
              <Radio value={"DNA_Fountain"}>DNA_Fountain</Radio>
              <Radio value={"Yin_Yang"}>Yin_Yang</Radio>
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
    </div>
  );
};

export default Encodelists;
