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
      props.setIndex(props.Zan ? 0 : response.data.index_length)
      console.log(Number(Object.keys(response.data.bar)[Object.keys(response.data.bar).length-1]));
      
    })
  },[props.value,props.method,props.fileID,props.isUpload])

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
                  Ping, Zhi, et al. "Towards practical and robust DNA-based data archiving using the
                  yin–yang codec system."<br></br>
                  <span style={{ color: "#748189" }}>
                    Nature Computational Science 2.4 (2022): 234-242.
                  </span>
                </span>
              </Radio>
              <Radio value={"DNA_Fountain"} disabled={props.upload100kb}>
                <span>
                  Erlich, Yaniv, and Dina Zielinski. "DNA Fountain enables a robust and efficient
                  storage architecture." <br></br>
                  <span style={{ color: "#748189" }}>Science 355.6328 (2017): 950-954.</span>
                </span>
              </Radio>
              <Radio value={"Church"}>
                <span>
                  Church, et al. "Next-generation digital information storage in DNA."<br></br>
                  <span style={{ color: "#748189" }}>Science 337.6102 (2012): 1628-1628.</span>
                </span>
              </Radio>
              <Radio value={"Goldman"}>
                <span>
                  Goldman, Nick, et al. "Towards practical, high-capacity, low-maintenance
                  information storage in synthesized DNA." <br></br>
                  <span style={{ color: "#748189" }}>Nature 494.7435 (2013): 77-80.</span>
                </span>
              </Radio>
              <Radio value={"Grass"}>
                <span>
                  Grass, Robert N., et al. "Robust chemical preservation of digital information on
                  DNA in silica with error‐correcting codes." <br></br>
                  <span style={{ color: "#748189" }}>
                    Angewandte Chemie International Edition 54.8 (2015): 2552-2555.
                  </span>
                </span>
              </Radio>
              <Radio value={"Blawat"}>
                <span>
                  Blawat, Meinolf, et al. "Forward error correction for DNA data storage." <br></br>
                  <span style={{ color: "#748189" }}>
                    Procedia Computer Science 80 (2016): 1011-1022.
                  </span>
                </span>
              </Radio>
              <Radio value={"SrcCode"} disabled={props.ZanRadio}>
                <span>
                  Zan, Xiangzhen, et al. "A hierarchical error correction strategy for text DNA
                  storage."<br></br>
                  <span style={{ color: "#748189" }}>
                    Interdisciplinary Sciences: Computational Life Sciences 14.1 (2022): 141-150.
                  </span>
                </span>
              </Radio>
            </Space>
          </Radio.Group>
        </div>
        <p style={{marginLeft:"40px"}}>
          Method details please click the <Link to="/methods">Method Paper</Link>
        </p>

        <div style={{ paddingLeft: "0px", marginTop: "50px", fontSize: "19px" }}>
          <strong>
            <BulbTwoTone /> Verify method{" "}
          </strong>
          <br />
          <div className="slider-inner">
          <Radio.Group
            onChange={onChange1}
            disabled={props.Zan?true:false}
            value={props.encodevalue}
            defaultValue={"WithoutVerifycode"}
            style={{ marginLeft: "20px", marginTop: "20px" }}
          >
            <Space direction="vertical">
              <Radio value={"WithoutVerifycode"}>
                <span>WithoutVerifycode</span>
              </Radio>
              <Radio value={"Hamming"}>
                <span>Hamming</span>
              </Radio>
              <Radio value={"ReedSolomon"}>
                <span>ReedSolomon</span>
              </Radio>
            </Space>
          </Radio.Group>
          </div>
          <p style={{ marginTop: "10px" }}>
            <span style={{ marginLeft: "20px", fontSize: "14px" }}>
              Method details please click the{" "}
            </span>
            <Link to="/methods">
              <span style={{ fontSize: "14px" }}>Method Paper</span>
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EncodeMethodList;
