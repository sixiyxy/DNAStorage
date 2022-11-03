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
var method=[false,false,false,false] //存放选择的方法
export const SimulationSetting: React.FC<SimulationSetProps> = (props) => {
  // const [method, setMethod] = useState(["synthesis"]);
  
  const [decayflag,setDecay]=useState(true)
  const [pcrflag,setPCR]=useState(true)
  const [sampleflag,setSAM]=useState(true)
  const [sequenceflag,setSequen]=useState(true)
  const [alreadyChose, setAlreadyChose] = useState(false);
  const [dis1,setDis1]=useState(false)
  const [dis2,setDis2]=useState(false)
  const [dis3,setDis3]=useState(false)
  const [dis4,setDis4]=useState(false)
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
  
  const handleReport = () => {
    method=[false,false,false,false]
    props.changeSider(["0-1-1"]);
  };
  const handleDecay=()=>{
    setDis1(true)
    method[0]=true
  }
  const handlePCR=()=>{
    setDis2(true)
    method[1]=true
  }
  const handleSampling=()=>{
    setDis3(true)
    method[2]=true
  }
  const handleSequencing=()=>{
    setDis4(true)
    method[3]=true
  }
  const handleOK=()=>{
    console.log(method);
      if (method[0]){
        console.log("decayok");
        setDecay(false)
      }
      if (method[1]){
        setPCR(false)
      }
      if (method[2]){
        setSAM(false)
      }
      if (method[3]){
        setSequen(false)
      }
  }
  const handleReset=()=>{
    method=[false,false,false,false]
    setDecay(true)
    setPCR(true)
    setSAM(true)
    setSequen(true)
    setDis1(false)
    setDis2(false)
    setDis3(false)
    setDis4(false)
  }
  return (
    <div>
      
      <p style={{fontSize:"20px",margin:"20px 0px 0px 20px"}}>Please select the following simulation steps. You can choose to skip some of these steps, but Synthesis cannot.</p>
      <div style={{margin:"20px 0px 0px 20px"}}>
      <Button   size="large" style={{backgroundColor:"#81ada0"}} disabled={true}>Synthesis</Button>
      <Button   size="large" style={{backgroundColor:"#83c5b7"}} disabled={dis1} onClick={handleDecay}>Decay</Button>
      <Button   size="large" style={{backgroundColor:"#ecbdd1"}} disabled={dis2} onClick={handlePCR}>PCR</Button>
      <Button   size="large" style={{backgroundColor:"#77c3e3"}} disabled={dis3} onClick={handleSampling}>Sampling</Button>
      <Button  size="large" style={{backgroundColor:"#E7D7C9"}} disabled={dis4} onClick={handleSequencing}>Sequencing</Button>
      <Button  type="primary" shape="round" size="large" style={{marginLeft:"80px"}} onClick={handleOK}>OK</Button>
      <Button  type="primary" shape="round" size="large" style={{marginLeft:"20px"}} onClick={handleReset}>Reset</Button>
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
      <Decay fileId={props.fileId} decayflag={decayflag}/>
      <Pcr fileId={props.fileId} pcrflag={pcrflag}/>
      <Sampling fileId={props.fileId} sampleflag={sampleflag}/>
      <Sequencing fileId={props.fileId} sequenceflag={sequenceflag}/>
      {/* {method.indexOf("decay") !== -1 ? <Decay fileId={props.fileId} /> : null}
      {method.indexOf("pcr") !== -1 ? <Pcr fileId={props.fileId} /> : null}
      {method.indexOf("sampling") !== -1 ? (
        <Sampling fileId={props.fileId} />
      ) : null}
      {method.indexOf("sequencing") !== -1 ? (
        <Sequencing fileId={props.fileId} />
      ) : null} */}
      <Button shape="round" type="primary" size="large" style={{ width: 100,marginLeft:"500px",marginTop:"30px"}} onClick={handleReport}>Report</Button>
      
    </div>
  );
};

SimulationSetting.defaultProps = new SimulationSetProps();
