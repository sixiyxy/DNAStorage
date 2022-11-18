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
let method = [false, false, false, false]; //存放选择的方法
export const SimulationSetting: React.FC<SimulationSetProps> = (props) => {
  // const [method, setMethod] = useState(["synthesis"]);
  const [okflag, setOk] = useState(false);
  const [decayflag, setDecay] = useState(false);
  const [pcrflag, setPCR] = useState(false);
  const [sampleflag, setSAM] = useState(false);
  const [sequenceflag, setSequen] = useState(false);
  const [alreadyChose, setAlreadyChose] = useState(false);
  const [dis0, setDis0] = useState(false);
  const [dis1, setDis1] = useState(false);
  const [dis2, setDis2] = useState(false);
  const [dis3, setDis3] = useState(false);
  const [dis4, setDis4] = useState(false);
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
    method = [false, false, false, false];
    props.changeSider(["0-1-1"]);
  };
  const handleDecay = () => {
    method[0] = true;
    setDecay(!decayflag);
  };
  const handlePCR = () => {
    method[1] = true;
    setPCR(!pcrflag);
  };
  const handleSampling = () => {
    method[2] = true;
    setSAM(!sampleflag);
  };
  const handleSequencing = () => {
    method[3] = true;
    setSequen(!sequenceflag);
  };
  const handleOK = () => {
    setOk(true);
    setDis1(true);
    setDis2(true);
    setDis3(true);
    setDis4(true);
    setDis0(true);
  };
  const handleReset = () => {
    method = [false, false, false, false];
    setOk(false);
    setDecay(false);
    setPCR(false);
    setSAM(false);
    setSequen(false);
    setDis0(false);
    setDis1(false);
    setDis2(false);
    setDis3(false);
    setDis4(false);
    window.location.reload();
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div style={{ height: "1000px" }}>
      <Card
        title="Choose the Simulation steps."
        style={{ margin: "20px 0 0 20px", height: "250px" }}
      >
        <p style={{ fontSize: "18px" }}>
          Please select the following simulation steps. You can choose to skip some of these steps,
          but Synthesis cannot.
        </p>
        <div style={{ margin: "20px 0px 0px 0px" }}>
          <Button
            size="large"
            style={{ width: 150, height: 80, backgroundColor: "#264478", color: "White" }}
            disabled={dis0}
          >
            Synthesis
          </Button>
          <Button
            size="large"
            style={{
              width: 150,
              height: 80,
              backgroundColor: "#264478",
              color: "White",
              opacity: decayflag ? 0.7 : 1,
            }}
            disabled={dis1}
            onClick={handleDecay}
          >
            Decay
          </Button>
          <Button
            size="large"
            style={{
              width: 150,
              height: 80,
              backgroundColor: "#264478",
              color: "White",
              opacity: pcrflag ? 0.7 : 1,
            }}
            disabled={dis2}
            onClick={handlePCR}
          >
            PCR
          </Button>
          <Button
            size="large"
            style={{
              width: 150,
              height: 80,
              backgroundColor: "#264478",
              color: "White",
              opacity: sampleflag ? 0.7 : 1,
            }}
            disabled={dis3}
            onClick={handleSampling}
          >
            Sampling
          </Button>
          <Button
            size="large"
            style={{
              width: 150,
              height: 80,
              backgroundColor: "#264478",
              color: "White",
              opacity: sequenceflag ? 0.7 : 1,
            }}
            disabled={dis4}
            onClick={handleSequencing}
          >
            Sequencing
          </Button>
          <Button
            type="primary"
            shape="round"
            size="large"
            style={{ width: 100, marginLeft: "80px" }}
            onClick={handleOK}
          >
            OK
          </Button>
        </div>
      </Card>

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
      <div>
        <Synthesis fileId={props.fileId} setFileId={props.setFileId} okflag={okflag} />
        <Decay fileId={props.fileId} decayflag={decayflag} okflag={okflag} />
        <Pcr fileId={props.fileId} pcrflag={pcrflag} okflag={okflag} />
        <Sampling fileId={props.fileId} sampleflag={sampleflag} okflag={okflag} />
        <Sequencing fileId={props.fileId} sequenceflag={sequenceflag} okflag={okflag} />
      </div>

      {/* {method.indexOf("decay") !== -1 ? <Decay fileId={props.fileId} /> : null}
      {method.indexOf("pcr") !== -1 ? <Pcr fileId={props.fileId} /> : null}
      {method.indexOf("sampling") !== -1 ? (
        <Sampling fileId={props.fileId} />
      ) : null}
      {method.indexOf("sequencing") !== -1 ? (
        <Sequencing fileId={props.fileId} />
      ) : null} */}
      <Button
        shape="round"
        type="primary"
        size="large"
        style={{ width: 100, marginLeft: "400px", marginTop: "30px" }}
        disabled={!dis0}
        onClick={handleReport}
      >
        Report
      </Button>
      <Button
        type="primary"
        shape="round"
        size="large"
        style={{ width: 100, marginLeft: "100px" }}
        disabled={!dis0}
        onClick={handleReset}
      >
        Reset
      </Button>
    </div>
  );
};

SimulationSetting.defaultProps = new SimulationSetProps();
