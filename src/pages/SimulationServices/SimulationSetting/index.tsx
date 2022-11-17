import {Button, Card,Image,Row,Col,Upload,message} from "antd";
import React, {useState,useEffect} from "react";
import "./index.less";
import {Synthesis} from "./Synthesis";
import {Decay} from "./Decay";
import {Pcr} from "./Pcr";
import {Sampling} from "./Sampling";
import {Sequencing} from "./Sequencing";
import axios from "axios";
import {API_PREFIX} from "../../../common/Config";
import simu from './simu.png';
import {InboxOutlined} from "@ant-design/icons";

export class SimulationSetProps {
  changeSider;
  fileId;
  // 未使用到的入参，暂时以 ? 形式保留，若无需使用应予以移除
  setIsSynthesis?;
  setFileId;
  setclickEXM;
  setIsdisabled;
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
  const [effect1,setEffct1] = useState(false);
  const [effect2,setEffct2] = useState(false);
  const [effect3,setEffct3] = useState(false);
  const [effect4,setEffct4] = useState(false);
  const [effect5,setEffct5] = useState(false);
  const [isOkDisable, setIsOkDisable] = useState(true);
  const [response,setRes] = useState({})
  const {Dragger} = Upload;
  useEffect(() => {
    props.setIsdisabled(true)
  }, []);
  var paramExm ={
    type : "simulation"
  }
  //控制每个步骤完成的状态
  // const [ok1,setOK1] = useState(false);
  // const [ok2,setOK2] = useState(false);
  // const [ok3,setOK3] = useState(false);
  // const [ok4,setOK4] = useState(false);
  // const [ok5,setOK5] = useState(false);

  const handleReport = () => {
    method = [false, false, false, false];
    props.setIsdisabled(false)
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
    props.setclickEXM(true)
    props.setFileId("1582175684011364352")
    //控制每个步骤的useEffect
    console.log("开始请求");
    axios
      .post(API_PREFIX + "/example",paramExm)
      .then(function (response){
        console.log("请求中");
        console.log('example-simu',response);
        setEffct1(true);
        setEffct2(true);
        setEffct3(true);
        setEffct4(true);
        setEffct5(true);
        setRes(response.data)
       
        // props.setEffct1(false)
  })
  }

  console.log(okFlag, decayFlag, pcrFlag, sampleFlag, sequenceFlag);

  const uploadProps = {
    name: "file",
    multiple: true,
    action: API_PREFIX + "/dna_upload",
    onChange(info) {
      const {status, response} = info.file;
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
    const {name} = file;
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
      <div style={{width:"100%"}} className="example-setting">
        <Card title="Run Example!">
           <Row gutter={15}>
            <Col span={10}>
              <Image
              width={"100%"}
              // height={"50%"}
              src={simu}      
              />
            </Col>
            <Col span={5}>
                <div >
                  {/* <p style={{fontSize:"18px"}}>
                      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br></br>xxxxxxxxxxxxxxxxx
                    </p> */}
                    <p style={{textAlign:"justify"}}>
                      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                  <div style={{margin:"50px 0 0 150px"}}>
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
                </div>
                </Col>
                </Row>
        </Card>
        </div>
        <div className="simulation-step-content">
        <Card className="simulation-card" bordered={false} title="Upload Dna File">
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
              <InboxOutlined/>
            </p>
            <p className="ant-upload-text">Click this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from uploading company data or
              other band files
            </p>
          </Dragger>
        </Card>
      </div>

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
            
            <Button className="ok" type="primary" shape="round" size="large" onClick={handleOK} style={{marginLeft:"50px"}}>
              OK
            </Button>
            
          </div>
        </Card>
      </div>
      <div>
        <Synthesis fileId={props.fileId} setFileId={props.setFileId} okFlag={okFlag} effect1={effect1} response={response} />
        <Decay fileId={props.fileId} decayFlag={decayFlag} okFlag={okFlag} effect2={effect2} response={response}/>
        <Pcr fileId={props.fileId} pcrFlag={pcrFlag} okFlag={okFlag} effect3={effect3} response={response}/>
        <Sampling fileId={props.fileId} sampleFlag={sampleFlag} okFlag={okFlag} effect4={effect4} response={response}/>
        <Sequencing fileId={props.fileId} sequenceFlag={sequenceFlag} okFlag={okFlag} effect5={effect5} response={response}/>
      </div>
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
