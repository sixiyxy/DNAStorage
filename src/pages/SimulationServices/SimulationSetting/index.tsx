import {Button, Card} from "antd";
import React, {useState} from "react";
import "./index.less";
import {Synthesis} from "./Synthesis";
import {Decay} from "./Decay";
import {Pcr} from "./Pcr";
import {Sampling} from "./Sampling";
import {Sequencing} from "./Sequencing";

export class SimulationSetProps {
  changeSider;
  fileId;
  // 未使用到的入参，暂时以 ? 形式保留，若无需使用应予以移除
  setIsSynthesis?;
  setFileId;
}

let method = [false, false, false, false]; //存放选择的方法
export const SimulationSetting: React.FC<SimulationSetProps> = (props) => {
  const [okFlag, setOkFlag] = useState(false);
  const [decayFlag, setDecayFlag] = useState(false);
  const [pcrFlag, setPcrFlag] = useState(false);
  const [sampleFlag, setSampleFlag] = useState(false);
  const [sequenceFlag, setSequenceFlag] = useState(false);
  // 未使用的变量：alreadyChose，暂予以注释，同时 Choose 拼写有误，确认无用后移除
  // const [alreadyChose, setAlreadyChose] = useState(false);
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
    setDecayFlag(!decayFlag);
  };
  const handlePCR = () => {
    method[1] = true;
    setPcrFlag(!pcrFlag);
  };
  const handleSampling = () => {
    method[2] = true;
    setSampleFlag(!sampleFlag);
  };
  const handleSequencing = () => {
    method[3] = true;
    setSequenceFlag(!sequenceFlag);
  };
  const handleOK = () => {
    setOkFlag(true);
    setDis1(true);
    setDis2(true);
    setDis3(true);
    setDis4(true);
    setDis0(true);
  };
  const handleReset = () => {
    method = [false, false, false, false];
    setOkFlag(false);
    setDecayFlag(false);
    setPcrFlag(false);
    setSampleFlag(false);
    setSequenceFlag(false);
    setDis0(false);
    setDis1(false);
    setDis2(false);
    setDis3(false);
    setDis4(false);
    window.location.reload();
  };
  return (
    <div className="page-simulation-setting">
      {/*头部 Card 部分*/}
      <Card title="Choose the Simulation steps.">
        <p>
          Please select the following simulation steps. You can choose to skip some of these steps,
          but Synthesis cannot.
        </p>
        <div className="button-group">
          <Button className="step" size="large" disabled={dis0}>
            Synthesis
          </Button>
          <Button
            className={`step ${decayFlag ? "processed" : null}`}
            size="large"
            disabled={dis1}
            onClick={handleDecay}
          >
            Decay
          </Button>
          <Button
            className={`step ${pcrFlag ? "processed" : null}`}
            size="large"
            disabled={dis2}
            onClick={handlePCR}
          >
            PCR
          </Button>
          <Button
            className={`step ${sampleFlag ? "processed" : null}`}
            size="large"
            disabled={dis3}
            onClick={handleSampling}
          >
            Sampling
          </Button>
          <Button className="step" size="large" disabled={dis4} onClick={handleSequencing}>
            Sequencing
          </Button>
          <Button className="ok" type="primary" shape="round" size="large" onClick={handleOK}>
            OK
          </Button>
        </div>
      </Card>
      <div>
        <Synthesis fileId={props.fileId} setFileId={props.setFileId} okFlag={okFlag}/>
        <Decay fileId={props.fileId} decayFlag={decayFlag} okFlag={okFlag}/>
        <Pcr fileId={props.fileId} pcrFlag={pcrFlag} okFlag={okFlag}/>
        <Sampling fileId={props.fileId} sampleFlag={sampleFlag} okFlag={okFlag}/>
        <Sequencing fileId={props.fileId} sequenceFlag={sequenceFlag} okFlag={okFlag}/>
      </div>

      {/* {method.indexOf("decay") !== -1 ? <Decay fileId={props.fileId} /> : null}
      {method.indexOf("pcr") !== -1 ? <Pcr fileId={props.fileId} /> : null}
      {method.indexOf("sampling") !== -1 ? (
        <Sampling fileId={props.fileId} />
      ) : null}
      {method.indexOf("sequencing") !== -1 ? (
        <Sequencing fileId={props.fileId} />
      ) : null} */}
      {/*<Button*/}
      {/*  shape="round"*/}
      {/*  type="primary"*/}
      {/*  size="large"*/}
      {/*  style={{ width: 100, marginLeft: "400px", marginTop: "30px" }}*/}
      {/*  disabled={!dis0}*/}
      {/*  onClick={handleReport}*/}
      {/*>*/}
      {/*  Report*/}
      {/*</Button>*/}
      {/*<Button*/}
      {/*  type="primary"*/}
      {/*  shape="round"*/}
      {/*  size="large"*/}
      {/*  style={{ width: 100, marginLeft: "100px" }}*/}
      {/*  disabled={!dis0}*/}
      {/*  onClick={handleReset}*/}
      {/*>*/}
      {/*  Reset*/}
      {/*</Button>*/}
    </div>
  );
};

SimulationSetting.defaultProps = new SimulationSetProps();
