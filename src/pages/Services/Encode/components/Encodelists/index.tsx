import type { RadioChangeEvent } from "antd";
import { Input, Radio, Space } from "antd";
import { Button,notification } from 'antd';
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
  const handleClick = () => {
    console.log("加载中");
    props.setIsSynthesis(true)
    props.changeSider(["0-0-1"]); 
    props.setSpin(true)
    params1.file_uid = props.fileId;
    params1.segment_length = props.seg;
    params1.index_length = props.index;
    params1.verify_method = props.method;
    params1.encode_method = encodeMethod;

    axios.post('http://localhost:5000/encode',params1)
      .then(function (response) {
          console.log("Encode-response: ",response.data);
          props.InfoPass1(
            response.data.bit_size,
            response.data.byte_size,
            response.data.encode_method,
            response.data.index_length,
            response.data.segment_length,
            response.data.segment_number,
            response.data.verify_method
          )
          props.GCPass(response.data.gc_plot);
          props.HomoPass(response.data.homo_plot);
          props.DNAInfoPass(
          response.data.DNA_sequence_length,
          response.data.encoding_time,
          response.data.information_density,
          response.data.nucleotide_counts
        );
        props.setSpin(false)
      })
        .catch(function (error) {
          console.log(error)
      })  
    }
    const scrollToAnchor = () => {
      const args = {
        message: 'Please make sure you complete the uploading and selection above!',
        description:
          'Confirm whether the file is uploaded and whether the encoding method is selected.',
        duration: 4.5,
      };
      notification.open(args);
      if ('uploads') {
          let anchorElement = document.getElementById('uploads');
          if (anchorElement) { anchorElement.scrollIntoView(); }
      }
  }

  return (
    <div className="todo-container">
      <div>
        <h2>Choose Encode Method</h2>
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
          <div style={{ marginTop: "20px" }}>
            Method details please click the :{" "}
            <Link to="/methods">Method Paper</Link>
        </div>
          <Button type="primary" onClick={props.btnflag?handleClick:scrollToAnchor} style={{marginLeft:"400px"}}>Run</Button>
        </div>
      </div>
    </div>
  );
};

export default Encodelists;
