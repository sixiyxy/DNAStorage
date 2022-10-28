import { Area, Datum, FUNNEL_CONVERSATION_FIELD } from "@ant-design/charts";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  InputNumber,
  Modal,
  Row,
  Select,
  Slider,
  Spin,
  Tooltip,
} from "antd";
import React, { useContext, useEffect, useMemo, useState } from "react";
import "./index.less";
import { Synthesis } from "../Synthesis";
import { Decay } from "../Decay";
import { Pcr } from "../Pcr";
import { Sampling } from "../Sampling";
import { Sequencing } from "../Sequencing";
const { Option } = Select;

import axios from "axios";

export class SimulationSetProps {
  changeSider;
  fileId;
  setIsSynthesis;
}

export const SimulationSetting: React.FC<SimulationSetProps> = (props) => {
  const [method, setMethod] = useState(["synthesis"]);
  const [alreadyChose, setAlreadyChose] = useState(false);
  const handleChange = (value) => {
    setMethod(value);
  };
  const handleOk = () => {
    setAlreadyChose(true);
  };
  const handleReset = () => {
    setAlreadyChose(false);
  };
  return (
    <div>
      <Card>
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
        <Button onClick={handleOk}>OK</Button>
        <Button onClick={handleReset}>Reset</Button>
      </Card>
      <Synthesis fileId={props.fileId} />
      {method.indexOf("decay") !== -1 ? <Decay fileId={props.fileId} /> : null}
      {method.indexOf("pcr") !== -1 ? <Pcr fileId={props.fileId} /> : null}
      {method.indexOf("sampling") !== -1 ? (
        <Sampling fileId={props.fileId} />
      ) : null}
      {method.indexOf("sequencing") !== -1 ? (
        <Sequencing fileId={props.fileId} />
      ) : null}
    </div>
  );
};

SimulationSetting.defaultProps = new SimulationSetProps();
