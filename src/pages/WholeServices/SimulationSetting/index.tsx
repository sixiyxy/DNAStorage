import { Button, Card, Image, Row, Col, Upload, message, Breadcrumb } from "antd";
import React, { useState, useEffect } from "react";
import "./index.less";
import { Synthesis } from "./Synthesis";
import { Decay } from "./Decay";
import { Pcr } from "./Pcr";
import { Sampling } from "./Sampling";
import { Sequencing } from "./Sequencing";
import axios from "axios";
import { doPost } from "../../../utils/request";
import { API_PREFIX } from "../../../common/Config";
import simu from "../../../assets/service/simu.png";
import { InboxOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { createAsyncStepRequest } from "../../../utils/request-util";
export class SimulationSetProps {
  changeSider;
  fileId;
  setIsSynthesis?;
  setFileId?;
  needUploader: boolean;
  clickEXM?;
  setSimuRepo;
  SimuRepo;
  setDeSet;
  setSimulationSpin;
  setSynthesisData;
  setDacayData;
  setPcrData;
  setSamplingData;
  setSequenceingData;
  setErrorRecode;
  setErrorDensity;
  setStrand;
  encodeInfo;
  setSimuSet;
  info;
  dnainfo;
  simuStrand;
  setSimuStrand;
}

const sequenceNumTable = [5000, 10000, 100000];
const intervalTimeTable = [1000, 2000, 5000, 10000];

const getIntervalTimeBySequenceNum = (sequenceNum) => {
  const len = sequenceNumTable.length;

  for (let i = 0; i < len; i++) {
    if (sequenceNum < sequenceNumTable[i]) {
      return intervalTimeTable[i];
    }
  }
  return intervalTimeTable[len];
};

let method = [false, false, false, false]; //存放选择的方法


export const SimulationSetting: React.FC<SimulationSetProps> = (props) => {
  // 控制全局和各个步骤是否启用，true 表示启用，false 表示不起用，会被遮罩遮住
  const [okFlag, setOkFlag] = useState(false);
  const [examFlag, setExamFlag] = useState(false);
  const [decayFlag, setDecayFlag] = useState(true);
  const [pcrFlag, setPcrFlag] = useState(true);
  const [sampleFlag, setSampleFlag] = useState(true);
  const [sequenceFlag, setSequenceFlag] = useState(true);
  const [exmSpinFlag, setexmSpinFlag] = useState(false);
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
  
  //控制report按钮是否禁用，true表示禁用
  const [reportFlag, setReport] = useState(true);
  const { Dragger } = Upload;
  useEffect(() => {
    window.scrollTo(0, 0);
    method = [false, false, false, false];
  }, []);

  const { encodeInfo } = props;

  const paramsRepo = {
    file_uid: props.fileId,
  };
  const handleReport = async () => {
    method = [false, false, false, false];
    props.setSimuRepo(true);
    props.setSimuSet(false)
    props.changeSider(["0-1-1"]);
    const body = paramsRepo;
    const intervalTime = getIntervalTimeBySequenceNum(encodeInfo.DNA_sequence_number);
    await createAsyncStepRequest(
      "simulation",
      body,
      props.setSimulationSpin,
      intervalTime,
      null,
      (resp) => {
        console.log('simu-report-response:',resp);
        props.setSynthesisData(resp.SYN);
        props.setDacayData(resp.DEC);
        props.setPcrData(resp.PCR);
        props.setSamplingData(resp.SAM);
        props.setSequenceingData(resp.SEQ);
        props.setErrorRecode(resp.Error_Recorder);
        props.setErrorDensity(resp.Error_Density);
        props.setStrand(resp.Strand_Count);
        props.setDeSet(true);
      }
    );
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

    setExamFlag(true);
    setOkFlag(true);
    setDis1(true);
    setDis2(true);
    setDis3(true);
    setDis4(true);
    setDis0(true);
  };

  const paramExm = {
    file_uid: props.fileId,
    type:"whole"
  };
  function GotoCard(){
    if ("Simu-btn") {
      let anchorElement = document.getElementById("Simu-btn");
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  }
  const handleEXM = () => {
    setexmSpinFlag(true);
    setExamFlag(true);
    GotoCard();
    method = [true, true, true, true];
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
    //控制每个步骤的useEffect
    console.log("开始请求");
    let strands = props.info.DNA_sequence_number
    strands = strands*10*(0.99**props.dnainfo.DNA_sequence)
    strands = strands*0.7
    strands = strands*(2**0.8)*0.005
    let a = strands/props.info.DNA_sequence_number
    strands = strands*a
    console.log('exm',strands);
    props.setSimuStrand(strands)
    axios.post(API_PREFIX + "/simu_default_run", paramExm).then(function (response) {
      console.log('exm',response);
      
      setexmSpinFlag(false);
      setEffct1(true);
      setEffct2(true);
      setEffct3(true);
      setEffct4(true);
      setEffct5(true);
      setRes(response.data);
    });
  };


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


  return (
    <div className="page-simulation-setting">
      <div>
        <Card>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/services">Services</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/services/wholeprocess">Simulation</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Setting</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card>
          <Row>
            <Col span={10}>
              <div className="decode-button-group">
                <div className="Whole-summary-word">
                  <p>
                    The simulation service allows user to upload their own fasta DNA file to proceed
                    error simulation stage. It covers the five stages of DNA storage, namely,
                    synthesis, storage decay, PCR, sampling, and sequencing. Except for synthesis,
                    all the other stages are optional, users could simply skip some based on their
                    real needs. They could directly get feedback about how the density changes after
                    setting up each stage and have a detailed report about how errors are introduced
                    and occur at the end.
                  </p>
                </div>
                <Button
                  shape="round"
                  size="large"
                  onClick={handleEXM}
                  disabled={examFlag}
                >
                  Default
                </Button>
              </div>
            </Col>
            <Col span={10}>
              <div style={{ marginLeft: "150px" }} className="summary-img">
                <Image
                  width={"130%"}
                  src={simu}
                />
              </div>
            </Col>
          </Row>
        </Card>


        {props.needUploader && (
          <div className="simulation-step-content">
            <Card
              className="simulation-card"
              bordered={false}
              title="Upload Dna File"
              headStyle={{ fontSize: "18px" }}
            >
              <Dragger
                className="simulation-synthesis-uploader"
                {...uploadProps}
                accept=".FASTA"
                maxCount={1}
                onRemove={() => {
                  setIsOkDisable(true);
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click this area to upload</p>
                <p className="ant-upload-hint">Support file types: video, txt, mp3, picture...</p>
              </Dragger>
            </Card>
          </div>
        )}

        <Card
          title="Choose the simulation steps"
          headStyle={{ fontSize: "18px", backgroundColor: "#cccfd4", textAlign: "center" }}
        >
          <p className="function-bar" style={{ fontSize: "16px" }}>
            <strong>
              Please select the following simulation steps. You can choose to skip some of these
              steps, but Synthesis is a must.
            </strong>
          </p>
          <div className="simulation-setting-header-button-group">
            <div id="Simu-btn">
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
          exmSpinFlag={exmSpinFlag}
          setSimuStrand={props.setSimuStrand}
          info={props.info}
          dnainfo={props.dnainfo}
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
          exmSpinFlag={exmSpinFlag}
          setReport={setReport}
          setSimuStrand={props.setSimuStrand}
          simuStrand={props.simuStrand}
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
          exmSpinFlag={exmSpinFlag}
          setReport={setReport}
          setSimuStrand={props.setSimuStrand}
          simuStrand={props.simuStrand}
          info={props.info}
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
          exmSpinFlag={exmSpinFlag}
          pcrFlag={pcrFlag}
          setReport={setReport}
          setSimuStrand={props.setSimuStrand}
          simuStrand={props.simuStrand}
        />
        <Sequencing
          fileId={props.fileId}
          sequenceFlag={sequenceFlag}
          okFlag={okFlag}
          effect5={effect5}
          response={response}
          setSEQRUN={setSEQRUN}
          seqrun={seqrun}
          exmSpinFlag={exmSpinFlag}
          setReport={setReport}
          info={props.info}
          simuStrand={props.simuStrand}
          setSimuStrand={props.setSimuStrand} 
        />
      </div>
      <div className="simulation-setting-footer-buttons">
        <Card>
          <div className="simulation-setting-footer-buttons-group">
            <Button
              shape="round"
              type="primary"
              size="large"
              disabled={reportFlag}
              onClick={handleReport}
            >
              Report
            </Button>
            {/* <Button
              type="primary"
              shape="round"
              size="large"
              disabled={!dis0}
              onClick={handleReset}
            >
              Reset
            </Button> */}
          </div>
        </Card>
      </div>
    </div>
  );
};

SimulationSetting.defaultProps = new SimulationSetProps();
