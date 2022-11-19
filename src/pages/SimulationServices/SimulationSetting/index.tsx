import { Button, Card, Image, Row, Col, Upload, message,Breadcrumb} from "antd";
import React, { useState, useEffect } from "react";
import "./index.less";
import { Synthesis } from "./Synthesis";
import { Decay } from "./Decay";
import { Pcr } from "./Pcr";
import { Sampling } from "./Sampling";
import { Sequencing } from "./Sequencing";
import axios from "axios";
import { API_PREFIX } from "../../../common/Config";
import simu from "./simu.png";
import { InboxOutlined } from "@ant-design/icons";

export class SimulationSetProps {
  changeSider;
  fileId;
  // 未使用到的入参，暂时以 ? 形式保留，若无需使用应予以移除
  setIsSynthesis?;
  setFileId?;
  setclickEXM?;
  setIsdisabled?;
  needUploader: boolean;
  clickEXM?;
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
  //控制步骤Effect的状态,一开始为false不执行
  const [effect1, setEffct1] = useState(false);
  const [effect2, setEffct2] = useState(false);
  const [effect3, setEffct3] = useState(false);
  const [effect4, setEffct4] = useState(false);
  const [effect5, setEffct5] = useState(false);
  const [isOkDisable, setIsOkDisable] = useState(true);
  const [response, setRes] = useState({});
  //控制每个步骤按钮disabled状态
  const [alreadyRun, setAlreadyRun] = useState(false);
  const [decrun, setDECRUN] = useState(true);
  const [pcrrun, setPCRRUN] = useState(true);
  const [samrun, setSAMRUN] = useState(true);
  const [seqrun, setSEQRUN] = useState(true);
  const { Dragger } = Upload;
  useEffect(() => {
    if (props.setIsdisabled) {
      props.setIsdisabled(true);
    }
    props.setclickEXM(false);
  }, []);
  const paramExm = {
    type: "simulation",
  };
  //控制每个步骤完成的状态
  // const [ok1,setOK1] = useState(false);
  // const [ok2,setOK2] = useState(false);
  // const [ok3,setOK3] = useState(false);
  // const [ok4,setOK4] = useState(false);
  // const [ok5,setOK5] = useState(false);

  const handleReport = () => {
    method = [false, false, false, false];
    props.setIsdisabled(false);
    props.changeSider(["0-1-1"]);
  };
  const handleDecay = () => {
    method[0] = !method[0];
    setDecayFlag(!decayFlag);
  };
  const handlePCR = () => {
    method[1] = !method[1];
    setPcrFlag(!pcrFlag);
  };
  const handleSampling = () => {
    method[2] = !method[2];
    setSampleFlag(!sampleFlag);
  };
  const handleSequencing = () => {
    method[3] = !method[3];
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

  const handleEXM = () => {
    method = [true, true, true, true];
    //点击Example后按钮全部禁掉 默认id"1582175684011364352"
    setOkFlag(true);
    setDecayFlag(true);
    setPcrFlag(true);
    setSampleFlag(true);
    setSequenceFlag(true);
    setDis0(true);
    setDis1(true);
    setDis2(true);
    setDis3(true);
    setDis4(true);
    props.setclickEXM(true);
    props.setFileId("1582175684011364352");
    //控制每个步骤的useEffect
    console.log("开始请求");
    axios.post(API_PREFIX + "/example", paramExm).then(function (response) {
      console.log("请求中");
      console.log("example-simu", response);
      setEffct1(true);
      setEffct2(true);
      setEffct3(true);
      setEffct4(true);
      setEffct5(true);
      setRes(response.data);

      // props.setEffct1(false)
    });
  };

  console.log(okFlag, decayFlag, pcrFlag, sampleFlag, sequenceFlag);
  console.log("method", method);
  const uploadProps = {
    name: "file",
    multiple: true,
    action: API_PREFIX + "/dna_upload",
    disabled: props.clickEXM,
    onChange(info) {
      const { status, response } = info.file;
      console.log("status", info);
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        props.setFileId(response.file_uid);

        setIsOkDisable(false);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      //console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const beforeUpload = (file) => {
    const { name } = file;
    const type = name.split(".")[1];

    const isFasta = type === "fasta";
    if (!isFasta) {
      message.error("You can only upload fasta file!");
    }

    return isFasta;
  };
  return (
    <div className="page-simulation-setting">
      {/*头部 Card 部分*/}
      <div>
      <Card>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <a href="/home">Home</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Services</Breadcrumb.Item>
            <Breadcrumb.Item>Simulation</Breadcrumb.Item>
            <Breadcrumb.Item>Setting</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card>
          <Row>
            <Col span={10}>
              <div className="decode-button-group">
                <div className="summary-word">
                  <p>
                    You could upload your own fasta DNA file to proceed this seperate error simulation stage. It covers the five stages of DNA storage, namely,
                    synthesis, storage decay, PCR, sampling, and sequencing. Except for synthesis,
                    all the other stages are optional, you could simply skip some based on your
                    needs. What's more, you could directly get feedback about how the density changes after
                    setting up each stage and have a detailed report about how errors are introduced
                    and occur at the end.
                  </p>
                  </div>
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
            </Col>
            <Col span={10}>
              <div style={{ marginLeft: "150px" }}>
                <Image
                  width={"130%"}
                  // height={"50%"}
                  src={simu}
                />
              </div>
            </Col>
          </Row>
          {/* </div> */}
        </Card>

        {/*据说不要 Note 了但以防该需求先把代码留着*/}
        {/*{!props.needUploader && (*/}
        {/*  <Card title="Note" bordered={false}>*/}
        {/*    <p>*/}
        {/*      This stage would simulate error occurrences that happened under the real*/}
        {/*      application.You could adjust the parameters for each stage accordingly or simply skip*/}
        {/*      some stages.It is also possible to skip the whole error simulation stage.*/}
        {/*    </p>*/}
        {/*  </Card>*/}
        {/*)}*/}

        {props.needUploader && (
          <div className="simulation-step-content">
            <Card
              className="simulation-card"
              bordered={false}
              title="Upload DNA File"
              headStyle={{ fontSize: "18px" }}
            >
              <Dragger
                className="simulation-synthesis-uploader"
                {...uploadProps}
                beforeUpload={beforeUpload}
                accept=".fasta"
                maxCount={1}
                onRemove={() => {
                  setIsOkDisable(true);
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click this area to upload</p>
                <p className="ant-upload-hint">Only FASTA files are supported</p>
              </Dragger>
            </Card>
          </div>
        )}

        <Card title="Choose the Simulation Steps" headStyle={{ fontSize: "18px" }}>
          <p className="function-bar" style={{ fontSize: "17px" }}>
            Please select the following simulation steps. You can choose to skip some of these
            steps, but Synthesis is the must.
          </p>
          <div className="simulation-setting-header-button-group">
            <div>
              <Button
                className="simulation-setting-header-button-step"
                size="large"
                disabled={dis0}
              >
                Synthesis
              </Button>
              <Button
                className={`simulation-setting-header-button-step ${
                  decayFlag ? null : "simulation-button-masked"
                }`}
                size="large"
                disabled={dis1}
                onClick={handleDecay}
              >
                Decay
              </Button>
              <Button
                className={`simulation-setting-header-button-step ${
                  pcrFlag ? null : "simulation-button-masked"
                }`}
                size="large"
                disabled={dis2}
                onClick={handlePCR}
              >
                PCR
              </Button>
              <Button
                className={`simulation-setting-header-button-step ${
                  sampleFlag ? null : "simulation-button-masked"
                }`}
                size="large"
                disabled={dis3}
                onClick={handleSampling}
              >
                Sampling
              </Button>
              <Button
                className={`simulation-setting-header-button-step ${
                  sequenceFlag ? null : "simulation-button-masked"
                }`}
                size="large"
                disabled={dis4}
                onClick={handleSequencing}
              >
                Sequencing
              </Button>
            </div>

            <div>
              <Button
                className="simulation-setting-header-button-ok"
                type="primary"
                shape="round"
                size="large"
                onClick={handleOK}
                disabled={okFlag}
              >
                OK
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <div>
        <Synthesis
          fileId={props.fileId}
          setFileId={props.setFileId}
          okFlag={okFlag}
          effect1={effect1}
          response={response}
          setAlreadyRun={setAlreadyRun}
          alreadyRun={alreadyRun}
          setDECRUN={setDECRUN}
          setPCRRUN={setPCRRUN}
          setSAMRUN={setSAMRUN}
          setSEQRUN={setSEQRUN}
          method1={method}
        />
        <Decay
          fileId={props.fileId}
          decayFlag={decayFlag}
          okFlag={okFlag}
          effect2={effect2}
          response={response}
          setDECRUN={setDECRUN}
          decrun={decrun}
          setPCRRUN={setPCRRUN}
          setSAMRUN={setSAMRUN}
          setSEQRUN={setSEQRUN}
          method1={method}
        />
        <Pcr
          fileId={props.fileId}
          pcrFlag={pcrFlag}
          okFlag={okFlag}
          effect3={effect3}
          response={response}
          setPCRRUN={setPCRRUN}
          pcrrun={pcrrun}
          setSAMRUN={setSAMRUN}
          setSEQRUN={setSEQRUN}
          method1={method}
        />
        <Sampling
          fileId={props.fileId}
          sampleFlag={sampleFlag}
          okFlag={okFlag}
          effect4={effect4}
          response={response}
          setSAMRUN={setSAMRUN}
          samrun={samrun}
          setSEQRUN={setSEQRUN}
          method1={method}
        />
        <Sequencing
          fileId={props.fileId}
          sequenceFlag={sequenceFlag}
          okFlag={okFlag}
          effect5={effect5}
          response={response}
          setSEQRUN={setSEQRUN}
          seqrun={seqrun}
        />
      </div>
      <div className="simulation-setting-footer-buttons">
        <Card>
          <div className="simulation-setting-footer-buttons-group">
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
        </Card>
      </div>
    </div>
  );
};

SimulationSetting.defaultProps = new SimulationSetProps();