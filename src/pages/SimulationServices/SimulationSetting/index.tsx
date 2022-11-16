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
  // 控制全局和各个步骤是否启用，true 表示启用，false 表示不起用，会被遮罩遮住
  const [okFlag, setOkFlag] = useState(false);
  const [decayFlag, setDecayFlag] = useState(true);
  const [pcrFlag, setPcrFlag] = useState(true);
  const [sampleFlag, setSampleFlag] = useState(true);
  const [sequenceFlag, setSequenceFlag] = useState(true);
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
  const handleEXM = () =>{
    method = [true, true, true, true];
    // setOkFlag(false);
    // setDecayFlag(false);
    // setPcrFlag(false);
    // setSampleFlag(false);
    // setSequenceFlag(false);

  }
  console.log(okFlag, decayFlag, pcrFlag, sampleFlag, sequenceFlag);

  return (
    <div className="page-simulation-setting">
      {/*头部 Card 部分*/}
      <div>
        <Card title="Choose the Simulation steps.">
          <p className="function-bar">
            Please select the following simulation steps. You can choose to skip some of these
            steps,
            but Synthesis cannot.
          </p>
          <div className="button-group">
            <Button className="step" size="large" disabled={dis0}>
              Synthesis
            </Button>
            <Button
              className={`step ${decayFlag ? null : "simulation-button-masked"}`}
              size="large"
              disabled={dis1}
              onClick={handleDecay}
            >
              Decay
            </Button>
            <Button
              className={`step ${pcrFlag ? null : "simulation-button-masked"}`}
              size="large"
              disabled={dis2}
              onClick={handlePCR}
            >
              PCR
            </Button>
            <Button
              className={`step ${sampleFlag ? null : "simulation-button-masked"}`}
              size="large"
              disabled={dis3}
              onClick={handleSampling}
            >
              Sampling
            </Button>
            <Button className={`step ${sequenceFlag ? null : "simulation-button-masked"}`}
                    size="large"
                    disabled={dis4}
                    onClick={handleSequencing}>
              Sequencing
            </Button>
            <Button className="ok" type="primary" shape="round" size="large" onClick={handleOK}>
              OK
            </Button>
            <Button
            className="exm"
            type="primary"
            shape="round"
            size="large"
            onClick={handleEXM}
          >
            Example
          </Button>
          </div>
        </Card>
      </div>
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
      <div className="simulation-footer-buttons">
        <div>
          <Button
            shape="round"
            type="primary"
            size="large"
            disabled={!dis0}
            onClick={handleReport}
          >
            Report
          </Button>
          <Button
            type="primary"
            shape="round"
            size="large"
            disabled={!dis0}
            onClick={handleReset}
          >
            Reset
          </Button>

        </div>
      </div>
    </div>
  );
};

SimulationSetting.defaultProps = new SimulationSetProps();
