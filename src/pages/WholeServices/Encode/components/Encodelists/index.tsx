import type { RadioChangeEvent } from "antd";
import { Input, Radio, Space,Col, Row} from "antd";
import { Button, notification } from "antd";
import React, { useState } from "react";
import axios from "axios";
import "./index.less";
import { Link } from "react-router-dom";
import { CheckCircleTwoTone } from "@ant-design/icons";

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
    index_length: 16,
    verify_method: "WithoutVerifycode",
    encode_method: "Basic",
  };
  const handleClick = () => {
    //console.log("加载中");
    props.setIsSynthesis(true);
    props.changeSider(["0-0-1"]);
    props.setSpin(true);
    params1.file_uid = props.fileId;
    params1.segment_length = props.seg;
    params1.index_length = props.index;
    params1.verify_method = props.method;
    params1.encode_method = encodeMethod;

    axios
      .post("http://localhost:5000/encode", params1)
      .then(function (response) {
        console.log("Encode-response: ", response.data);
        props.InfoPass1(
          response.data.bit_size,
          response.data.byte_size,
          response.data.encode_method,
          response.data.index_length,
          response.data.segment_length,
          response.data.segment_number,
          response.data.verify_method
        );
        props.GCPass(response.data.gc_plot);
        props.HomoPass(response.data.homo_plot);
        props.EnergyPass(response.data.energy_plot);
        props.EncodeURLPass(response.data.user_encode_file);
        props.FileURLPass(response.data.user_file_infofile);
        props.DNAInfoPass(
          response.data.DNA_sequence_length,
          response.data.encoding_time,
          response.data.information_density,
          response.data.nucleotide_counts,
          response.data.min_free_energy,
          //response.data.min_free_energy_below_30kj_mol
        );
        props.setSpin(false);
      })
      .catch(function (error) {
        //console.log(error);
      });
  };
  const scrollToAnchor = () => {
    const args = {
      message:
        "Please make sure you complete the uploading and selection above!",
      description:
        "Confirm whether the file is uploaded and whether the encoding method is selected.",
      duration: 4.5,
    };
    notification.open(args);
    if ("uploads") {
      let anchorElement = document.getElementById("uploads");
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  };
  const handleExm=()=>{
    props.setIsSynthesis(true);
    props.changeSider(["0-0-1"]);
    props.setSpin(true);
    props.setExam(true);
    axios
      .post("http://localhost:5000/encode", params1)
      .then(function (response) {
        //console.log("Encode-response: ", response.data);
        props.InfoPass1(
          response.data.bit_size,
          response.data.byte_size,
          response.data.encode_method,
          response.data.index_length,
          response.data.segment_length,
          response.data.segment_number,
          response.data.verify_method
        );
        props.GCPass(response.data.gc_plot);
        props.HomoPass(response.data.homo_plot);
        props.EnergyPass(response.data.energy_plot);
        props.EncodeURLPass(response.data.user_encode_file);
        props.FileURLPass(response.data.user_file_infofile);
        props.DNAInfoPass(
          response.data.DNA_sequence_length,
          response.data.encoding_time,
          response.data.information_density,
          response.data.nucleotide_counts
        );
        props.setSpin(false);
      })
      .catch(function (error) {
        console.log(error);
      }); 
  }
  const handlereset=()=>{
    props.setSeg(160)
    props.SetSegvalue(160)
    props.Setindexment(20)
    props.setIndex(20)
    props.setMethod("WithoutVerifycode")
    props.setValue("WithoutVerifycode")
  }
  return (
    <div className="todo-container" >
      <div>
        <h2>
          {" "}
          <CheckCircleTwoTone /> Choose Encode Method
        </h2>
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
          <div style={{ marginTop: "20px",marginLeft:"15px"}}>
            Method details please click the :{" "}
            <Link to="/methods">Method Paper</Link>
          </div>
          <div style={{marginTop:"30px",marginLeft:"15px"}}>
        <Row >
          <Col span={8} >
              <Button
                type="primary"
                size={"large"}
                onClick={props.btnflag ? handleClick : scrollToAnchor}
              >
                Run
              </Button>
          </Col>
          <Col span={8}>
              <Button
               type="primary"
               size={"large"}
                onClick={handleExm}
              >
                Example
              </Button>
          </Col>
          <Col span={8}>
              <Button
              type="primary"
              size={"large"}
              onClick={handlereset}
              >
                Reset
              </Button>
          </Col>
        </Row>  
        </div>
        </div>
      </div>
    </div>
  );
};

export default Encodelists;
