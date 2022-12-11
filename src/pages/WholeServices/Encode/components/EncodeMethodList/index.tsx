import type { RadioChangeEvent } from "antd";
import { Input, Radio, Space, Col, Row, Card } from "antd";
import { Button, notification } from "antd";
import React, { useState,useEffect} from "react";
import axios from "axios";
import {API_PREFIX} from "../../../../../common/Config";
import "./index.less";
import type { NotificationPlacement } from "antd/es/notification";
import { Link } from "react-router-dom";
import { CheckCircleTwoTone,BulbTwoTone} from "@ant-design/icons";

const EncodeMethodList: React.FC = (props: any) => {
  const [count, setCount] = useState(0); //触发标志
 
  const progressParam = {
    file_uid:props.fileId==='1' ? "1565536927137009664" : props.fileId,
    verify_method:props.method,
    encode_method:props.value
  }
  useEffect(()=>{
    axios.post(API_PREFIX + "/progress_bar", progressParam)
    .then(function (response) {
      console.log('ProcessResp:',response);
      props.setprocessRes(response.data)
      props.setIndex(props.Zan && props.value==='SrcCode' ? 0 : response.data.index_length)
    })
  },[props.value,props.method,props.fileID,props.isUpload,props.Zan])

  const onChange = (e: RadioChangeEvent) => {
    props.setValue(e.target.value);
  };
  
  const onChange1 = (e) => {
    setCount(count + 1);
    props.setencodeValue(e.target.value);
    props.setMethod(e.target.value);
  };
  return (
    <div className="encode-method-list-wrapper">
      <Card>
        <h2>
          <CheckCircleTwoTone /> <strong>Encode method</strong>
        </h2>
        <div className="encode-inner">
          <Radio.Group onChange={onChange} value={props.value}>
            <Space direction="vertical">
              <Radio value={"Basic"}>
                <span>Vanilla code</span>
              </Radio>
              <Radio value={"Yin_Yang"} disabled={props.upload100kb}>
                <span>
                  <i>Ping, Zhi, et al.</i> "Towards practical and robust DNA-based data archiving using the
                  yin–yang codec system."<br></br>
                  <span style={{ color: "#748189" }}>
                    <i>Nature Computational Science</i> 2.4 (2022): 234-242.
                  </span>
                </span>
              </Radio>
              <Radio value={"DNA_Fountain"} disabled={props.upload100kb}>
                <span>
                  <i>Erlich, Yaniv, and Dina Zielinski.</i> "DNA Fountain enables a robust and efficient
                  storage architecture." <br></br>
                  <span style={{ color: "#748189" }}><i>Science</i> 355.6328 (2017): 950-954.</span>
                </span>
              </Radio>
              <Radio value={"Church"}>
                <span>
                  <i>George M. Church, et al.</i> "Next-generation digital information storage in DNA."<br></br>
                  <span style={{ color: "#748189" }}><i>Science</i> 337.6102 (2012): 1628-1628.</span>
                </span>
              </Radio>
              <Radio value={"Goldman"}>
                <span>
                  <i>Goldman, Nick, et al.</i> "Towards practical, high-capacity, low-maintenance
                  information storage in synthesized DNA." <br></br>
                  <span style={{ color: "#748189" }}><i>Nature</i> 494.7435 (2013): 77-80.</span>
                </span>
              </Radio>
              <Radio value={"Grass"}>
                <span>
                  <i>Grass, Robert N., et al.</i> "Robust chemical preservation of digital information on
                  DNA in silica with error‐correcting codes." <br></br>
                  <span style={{ color: "#748189" }}>
                    <i>Angewandte Chemie International Edition</i> 54.8 (2015): 2552-2555.
                  </span>
                </span>
              </Radio>
              <Radio value={"Blawat"}>
                <span>
                  <i>Blawat, Meinolf, et al.</i> "Forward error correction for DNA data storage." <br></br>
                  <span style={{ color: "#748189" }}>
                    <i>Procedia Computer Science</i> 80 (2016): 1011-1022.
                  </span>
                </span>
              </Radio>
              <Radio value={"SrcCode"} disabled={props.ZanRadio}>
                <span>
                  <i>Zan, Xiangzhen, et al.</i> "A hierarchical error correction strategy for text DNA
                  storage."<br></br>
                  <span style={{ color: "#748189" }}>
                    <i>Interdisciplinary Sciences: Computational Life Sciences</i> 14.1 (2022): 141-150.
                  </span>
                </span>
              </Radio>
            </Space>
          </Radio.Group>
        </div>
        <p style={{marginLeft:"40px"}}>
          method details please click the <Link to="/methods">method paper</Link>
        </p>

        <div style={{ paddingLeft: "0px", marginTop: "50px", fontSize: "19px" }}>
          <strong>
            <BulbTwoTone /> Verify method{" "}
          </strong>
          <br />
          <div className="slider-inner">
          <Radio.Group
            onChange={onChange1}
            disabled={props.Zan && props.value==='SrcCode' ? true:false}
            value={props.encodevalue}
            defaultValue={"WithoutVerifycode"}
            style={{ marginLeft: "20px", marginTop: "20px" }}
          >
            <Space direction="vertical">
              <Radio value={"WithoutVerifycode"}>
                <span>None</span>
              </Radio>
              <Radio value={"Hamming"}>
                <span>Hamming code</span>
              </Radio>
              <Radio value={"ReedSolomon"}>
                <span>Reed Solomon code</span>
              </Radio>
            </Space>
          </Radio.Group>
          </div>
          <p style={{ marginTop: "10px" }}>
            <span style={{ marginLeft: "20px", fontSize: "14px" }}>
              method details please click the{" "}
            </span>
            <Link to="/methods">
              <span style={{ fontSize: "14px" }}>method paper</span>
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EncodeMethodList;
