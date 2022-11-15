import type { RadioChangeEvent } from "antd";
import { Input, Radio, Space,Col, Row} from "antd";
import { Button, notification } from "antd";
import React, { useState } from "react";

import "./index.less";
import type { NotificationPlacement } from 'antd/es/notification';
import { Link } from "react-router-dom";
import { CheckCircleTwoTone } from "@ant-design/icons";

var encodeMethod = "";

const Encodelists: React.FC = (props: any) => {
  const onChange = (e: RadioChangeEvent) => {
    //console.log("radio checked", e.target.value);
    encodeMethod = e.target.value;
    props.setValue(e.target.value);
  };
  return (
    <div className="todo-container" >
      <div>
        <h2 
        style={{
              fontSize: "19px",
            }}
        >
          {" "}
          <CheckCircleTwoTone /> <strong>Choose Encode Method</strong>
        </h2>
        <div style={{ margin: "20px 0 0 20px"}}>
          <Radio.Group onChange={onChange} value={props.value}>
            <Space direction="vertical">
              <Radio value={"Basic"}><span>Basic</span></Radio>
              <Radio value={"Church"}><span>Church</span></Radio>
              <Radio value={"Goldman"}><span>Goldman</span></Radio>
              <Radio value={"Grass"}><span>Grass</span></Radio>
              <Radio value={"Blawat"}><span>Blawat</span></Radio>
              <Radio value={"DNA_Fountain"}><span>DNA_Fountain</span></Radio>
              <Radio value={"Yin_Yang"}><span>Yin_Yang</span></Radio>
            </Space>
          </Radio.Group>
        </div>
        <div>
          <div style={{ margin:"10px 0 30px 20px",fontSize:"16px"}}>
            Method details please click the :{" "}
            <Link to="/methods">Method Paper</Link>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default Encodelists;
