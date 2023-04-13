import {Histogram} from "@ant-design/charts";

import {
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
  Upload,
} from "antd";
import React, {useEffect, useMemo, useState} from "react";
import "./index.less";
import {doPost} from "../../../../utils/request";
import axios from "axios";
import {API_PREFIX} from "../../../../common/Config";



export class SynthesisProps {
  changeSider?;
  fileId;
  setIsSynthesis?;
  setFileId;
  okFlag;
  effect1;
  response;
  setAlreadyRun;
  alreadyRun;
  setDECRUN;
  setPCRRUN;
  setSAMRUN;
  setSEQRUN
  method1;
  exmSpinFlag;
 
}

export const Synthesis: React.FC<SynthesisProps> = (props) => {
  const {Option, OptGroup} = Select;
  const [countLen, setCountLen] = useState(0);
  const [yieldValue, setYieldValue] = useState(0.99);
  const [cycleValue, setCycleValue] = useState(10);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState("");
  const [method, setMethod] = useState("ErrASE");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [group, setGroup] = useState();
 

  //处理函数
  const cycleChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setCycleValue(value);
  };
  const yieldChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setYieldValue(value);
  };
  const handleChange = (value: string) => {
    setMethod(value);
  };
  const skipSynthesis = function () {
    props.changeSider(["0-2"]);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk = () => {
    setLoading(true);
    setNoDataTipsShow(false);
    props.setAlreadyRun(true);
    axios.post(API_PREFIX + "/simu_synthesis", params).then(function (response) {
      setCountLen(response?.data?.syn_density.length);
      console.log("synthesis response", response);
      setGroup(response?.data?.density_group);
      setData(response?.data?.syn_density);
      setHrefLink(response?.data?.synthesis_method_reference);
      setLoading(false);
      if (!props.method1[0]){
        props.setDECRUN(false)
      }else if(!props.method1[1]){
        props.setPCRRUN(false)
      }else if(!props.method1[2]){
        props.setSAMRUN(false)
      }else if(!props.method1[3]){
        props.setSEQRUN(false)
      }else{
        console.log('just synthesis'); 
      }
      
    });
    // props.setIsSynthesis(true);
  };
  const param1 = {
    file_uid: "1582175684011364352", //待确认
    synthesis_number: 30,
    synthesis_yield: 0.99,
    synthesis_method: "ErrASE",
    upload_flag:"True"
  };

  useEffect(()=>{
    // setLoading(true);
    if (props.effect1 == true){
    setNoDataTipsShow(false);
    props.setAlreadyRun(true);
    console.log('SYN',props.response);
    setCountLen(props.response.SYN.density.length);
    setGroup(props.response.SYN.group);
    setData(props.response.SYN.density);
    

  }else{
    console.log('eff1',props.effect1);
  }
  },[props.effect1])
  
  const handleReset = function () {
    console.log("ressssssss....");

    setCycleValue(30);
    setMethod("ErrASE");
    setYieldValue(0.99);
  };
  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      //file_uid: "1565536927137009664",
      synthesis_number: cycleValue,
      synthesis_yield: yieldValue,
      synthesis_method: method,
      upload_flag:"True"
    };
  }, [cycleValue, yieldChange, method]);
  

  const config = useMemo(() => {
    return {
      data,
      width: 200,
      height: 300,
      binField: "value",
      binWidth: group,
      yAxis:{
        title:{
          text:'Percentage',
          offset:60,
        }
      },
      xAxis: {
        title:{
          text:'Copies Number',
          offset:50,
        },
      },
      meta: {
        count: {
          alias: "percentage",
          formatter: (value: any) => {
            return `${((value / countLen)*100).toFixed(2)}%`;
          },
        },
      },
    };
  }, [group, data, countLen]);

  const show = props.okFlag;

  return (
    <div>
      

      <div className="simulation-step-content">
        <Card title="Synthesis" className={`${show ? null : "simulation-content-masked"}`} headStyle={{fontSize:"18px"}}>
          <Row>
            <Col span={12}>
            <div className="simulationLeft">
              <div className="simulation-bar">
                <span>Synthesis cycles :</span>
                <Tooltip title="The copied number of each oligo you want it to have.">
                  <i
                    className="iconfont icon-wenhao"
                    style={{verticalAlign: "middle", margin: "0 0 0 5px"}}
                  />
                </Tooltip>
                <Row>
                  <Col span={12}>
                    <Slider
                      min={1}
                      max={20}
                      onChange={cycleChange}
                      value={typeof cycleValue === "number" ? cycleValue : 0}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      className="simulation-input"
                      min={1}
                      max={20}
                      value={cycleValue}
                      onChange={cycleChange}
                    />
                  </Col>
                </Row>
              </div>
              <div className="SynthesisYield">
                <span>Synthesis yield :</span>
                <Tooltip
                  title="The possibility of adding one nucleoside to the current synthesizing strand is defined as coupling efficiency. The process might be terminated because of unsuccessful coupling so imperfect coupling efficiency limits the length of the final sequence. Typically, it ranges about 98-99.5.">
                  <i
                    className="iconfont icon-wenhao"
                    style={{verticalAlign: "middle", margin: "0 0 0 5px"}}
                  />
                </Tooltip>
                <Row>
                  <Col span={12}>
                    <Slider
                      min={0.98}
                      max={0.995}
                      onChange={yieldChange}
                      value={typeof yieldValue === "number" ? yieldValue : 0}
                      step={0.001}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      className="simulation-input"
                      min={0.98}
                      max={0.995}
                      step={0.001}
                      value={yieldValue}
                      onChange={yieldChange}
                    />
                  </Col>
                </Row>
              </div>
              <div className="simulation-row">
                <span>Synthesis method :&nbsp;</span>
                <Select
                  className="simulation-selector"
                  onChange={handleChange}
                  value={method}
                  listHeight={400}
                >
                  <OptGroup label="Column Synthesized Oligos">
                    <Option value="ErrASE">ErrASE</Option>
                    <Option value="MutS">MutS</Option>
                    <Option value="ConsensusShuffle">Consensus Shuffle</Option>
                  </OptGroup>

                  <OptGroup label="Microarray based Oligo Pools">
                    <Option value="Oligo">Oligo Hybridization based error correction</Option>
                    <Option value="HighTemperature">
                      High temperature ligation/hybridization based error correction
                    </Option>
                    <Option value="ErrASE(Mic)">ErrASE</Option>
                    <Option value="Nuclease">Nuclease based error correction</Option>
                    <Option value="NGS">NGS based error correction</Option>
                  </OptGroup>
                  <OptGroup label="None">
                    <Option value="None">None</Option>
                  </OptGroup>
                </Select>
              </div>
              <div className="simulation-buttons">
                <Button size="large" shape="round" onClick={handleOk} disabled={props.alreadyRun}>
                  OK
                </Button>
                {/* <Button shape="round" size="large" onClick={handleReset}>
                  Reset
                </Button> */}
              </div>
              <Modal
                title="Warning"
                visible={isModalOpen}
                onOk={skipSynthesis}
                onCancel={handleCancel}
                okText="Skip"
              >
                <i
                  className="iconfont icon-warning-circle"
                />
                <p>Synthesis is the basic process of the error simulation stage.</p>
                <p>Skipping this step means skipping the whole stage. </p>
                <p>Do you still want to skip it?</p>
              </Modal>
              </div>
            </Col>
            <Col span={12}>
              <Card>
                <Spin size="large" spinning={props.exmSpinFlag}>
                <div>
                  {noDataTipsShow ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      imageStyle={{
                        height: 60,
                      }}
                      description={<span>No simulation result, please set the parameters.</span>}
                    />
                  ) : loading ? (
                    <div>
                      <Spin size={"large"}/>
                    </div>
                  ) : (
                    <div>
                      <div style={{marginBottom:"50px",fontSize:"15px"}}>After simulation of synthesis, the sequence number distribution of oligonucleotides pool is as follows(sequences with x  count account for y%  of all oligos):</div>
                      <Histogram {...config} />
                    </div>
                  )}
                </div>
                </Spin>
              </Card>
            </Col>
          </Row>
          <div className="common-masker" hidden={show}/>
        </Card>
      </div>

    </div>
  );
};

Synthesis.defaultProps = new SynthesisProps();
