import { Area, Datum, FUNNEL_CONVERSATION_FIELD } from "@ant-design/charts";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Slider,
  Spin,
  Tooltip,
} from "antd";
import React, { useContext, useEffect, useMemo, useState } from "react";
import "./index.less";
import { Synthesis } from "./Synthesis";
import { Decay } from "./Decay";
import { Pcr } from "./Pcr";
import { Sampling } from "./Sampling";
import { Sequencing } from "./Sequencing";
const { Option } = Select;

import axios from "axios";

export class SimulationSetProps {
  changeSider;
  fileId;
  setIsSynthesis;
  setFileId;
}

export const SimulationSetting: React.FC<SimulationSetProps> = (props) => {
  // const [method, setMethod] = useState(["synthesis"]);
  const [alreadyChose, setAlreadyChose] = useState(false);
  // const handleChange = (value) => {
  //   if (value.indexOf("synthesis") === -1) {
  //     value.unshift("synthesis");
  //     message.error("synthesis is a required step");
  //   }
  //   setMethod(value);
  // };
  // const handleOk = () => {
  //   setAlreadyChose(true);
  // };
  // const handleReset = () => {
  //   setAlreadyChose(false);
  // };
  const handleReport = () => {
    props.changeSider(["0-1-1"]);
  };
  return (
    <div>
      
      <p style={{fontSize:"20px",margin:"20px 0px 0px 20px"}}>Please select the following simulation steps. You can choose to skip some of these steps, but Synthesis cannot.</p>
      <div style={{margin:"20px 0px 0px 20px"}}>
      <Button   size="large" style={{backgroundColor:"#81ada0"}}>Synthesis</Button>
      <Button   size="large" style={{backgroundColor:"#83c5b7"}}>Decay</Button>
      <Button   size="large" style={{backgroundColor:"#ecbdd1"}}>PCR</Button>
      <Button   size="large" style={{backgroundColor:"#77c3e3"}}>Sampling</Button>
      <Button  size="large" style={{backgroundColor:"#E7D7C9"}}>Sequencing</Button>
      </div>
      {/* <Card>
        <Select
          mode="multiple"
          allowClear
          style={{
            width: "100%",
          }}
          placeholder="Please select"
          onChange={handleChange}
          value={method}
          disabled={alreadyChose}
        >
          <Option value="synthesis">Synthesis</Option>
          <Option value="decay">Decay</Option>
          <Option value="pcr">Pcr</Option>
          <Option value="sampling">Sampling</Option>
          <Option value="sequencing">Sequencing</Option>
        </Select>
        
      </Card> */}
      <Synthesis fileId={props.fileId} setFileId={props.setFileId} />
      <Decay fileId={props.fileId} />
      <Pcr fileId={props.fileId}/>
      <Sampling fileId={props.fileId} />
      <Sequencing fileId={props.fileId} />
      {/* {method.indexOf("decay") !== -1 ? <Decay fileId={props.fileId} /> : null}
      {method.indexOf("pcr") !== -1 ? <Pcr fileId={props.fileId} /> : null}
      {method.indexOf("sampling") !== -1 ? (
        <Sampling fileId={props.fileId} />
      ) : null}
      {method.indexOf("sequencing") !== -1 ? (
        <Sequencing fileId={props.fileId} />
      ) : null} */}
      <Button onClick={handleReport}>Report</Button>
    </div>
  );
};

SimulationSetting.defaultProps = new SimulationSetProps();
