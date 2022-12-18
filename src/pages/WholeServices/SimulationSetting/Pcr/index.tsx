import {Histogram} from "@ant-design/charts";
import {
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
import React, {useMemo, useState,useEffect} from "react";
import "./index.less";
import {doPost} from "../../../../utils/request";
import axios from "axios";
import {API_PREFIX} from "../../../../common/Config";
export class PcrProps {
  changeSider?;
  fileId;
  pcrFlag;
  okFlag;
  effect3;
  response;
  setPCRRUN;
  pcrrun;
  setSAMRUN;
  setSEQRUN;
  method1;
  exmSpinFlag;
  setReport;
  setSimuStrand;
  simuStrand;
  info;
}

export const Pcr: React.FC<PcrProps> = (props) => {
  const {Option, OptGroup} = Select;
  const [countLen, setCountLen] = useState(0)
  const [pcrProbability, setPcrProbability] = useState(0.8);
  const [pcrCycleValue, setPcrCycleValue] = useState(2);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [method, setMethod] = useState("Taq");
  const [densityData, setDensityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState();

  //处理函数
  const monthChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setPcrCycleValue(value);
  };
  const lossChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setPcrProbability(value);
  };
  const handleChange = (value: string) => {
    setMethod(value);
  };

  const handleOk = async () => {
    setLoading(true);
    setNoDataTipsShow(false);
    props.setPCRRUN(true);
    let strand = props.simuStrand*(2**pcrCycleValue)
    props.setSimuStrand(strand)
    console.log('strand',strand);
    console.log('props.stradn',props.simuStrand);
    
    
    // todo 将请求接口 ts 化，否则无法移除警告
    const resp: any = await doPost("/simu_pcr", {body: params});
    setCountLen(resp.pcr_density.length);
    setGroup(resp.pcr_group);
    setDensityData(resp.pcr_density);
    setLoading(false);

    if(!props.method1[2]){
      props.setSAMRUN(false)
    }else if(!props.method1[3]){
      props.setSEQRUN(false)
    }else{
      props.setReport(false)
    }
  };
  useEffect(()=>{
    if (props.effect3 == true){
    setLoading(true);
    setNoDataTipsShow(false);
    props.setPCRRUN(true);
    setCountLen(props.response.PCR.density.length);
    setGroup(props.response.PCR.group);
    setDensityData(props.response.PCR.density);
    setLoading(false);
  
  }
  },[props.effect3])

  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      // file_uid: "1565536927137009664",
      pcr_cycle: pcrCycleValue,
      pcr_prob: pcrProbability,
      pcr_polymerase: method,
      // upload_flag:"True"
    };
  }, [pcrCycleValue, pcrProbability, method, props.fileId]);
  
  const config = useMemo(() => {
    return {
      data: densityData,
      width: 200,
      height: 300,
      binField: "value",
      binWidth: group,
      yAxis:{
        title:{
          text:'Percentage',
          offset:60,
        },
       // maxLimit:countLen
      },
      xAxis: {
        title:{
          text:'Copies Number',
          offset:50,
        },
      },
      meta: {
        count: {
          alias: 'percentage',
          formatter: (value: any) => {
            return `${((value / countLen)*100).toFixed(2)}%`
          }

        }
      }
    };
  }, [group, densityData]);

  const show = props.okFlag && props.pcrFlag;

  return (
    <div className="simulation-step-content">
      <Card title="PCR" className={`${show ? null : "simulation-content-masked"}`} headStyle={{fontSize:"18px"}}>
        <Row>
          <Col span={12}>
            <div className="PCRLeft">
            <div className="simulation-row">
              <span>PCR cycle : </span>
              <Tooltip title="Cycle number of the PCR process.">
                <i
                  className="iconfont icon-wenhao"
                  style={{verticalAlign: "middle", margin: "0 0 0 5px"}}
                />
              </Tooltip>
              <Row>
                <Col span={12}>
                  <Slider
                    min={1}
                    max={5}
                    onChange={monthChange}
                    value={typeof pcrCycleValue === "number" ? pcrCycleValue : 0}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={1}
                    max={5}
                    style={{
                      margin: "0 16px",
                    }}
                    value={pcrCycleValue}
                    onChange={monthChange}
                  />
                </Col>
              </Row>
            </div>
            <div className="simulation-row">
              <span>PCR probability : </span>
              <Tooltip
                title="In each PCR cycle, a sequence has a possibility of p being amplified. ">
                <i
                  className="iconfont icon-wenhao"
                  style={{verticalAlign: "middle", margin: "0 0 0 5px"}}
                />
              </Tooltip>
              <Row>
                <Col span={12}>
                  <Slider
                    min={0.5}
                    max={1.0}
                    onChange={lossChange}
                    value={
                      typeof pcrProbability === "number" ? pcrProbability : 0
                    }
                    step={0.1}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={0.5}
                    max={1.0}
                    style={{
                      margin: "0 16px",
                    }}
                    step={0.1}
                    value={pcrProbability}
                    onChange={lossChange}
                  />
                </Col>
              </Row>
            </div>
            <div className="simulation-row">
              <span>Storage host :</span>
              <Select className="simulation-selector"
                      onChange={handleChange}
                      value={method}
              >
                <OptGroup label="None">
                  <Option value="None">None</Option>
                </OptGroup>
                <OptGroup label="Polymerases">
                  <Option value="Phusion">Phusion</Option>
                  <Option value="Taq">Taq</Option>
                  <Option value="Pwo">Pwo</Option>
                  <Option value="Pfu">Pfu</Option>
                </OptGroup>
              </Select>
            </div>
            <div className="simulation-buttons">
              <Button
                size="large"
                shape="round"
                onClick={handleOk}
                disabled={props.pcrrun}
              >
                OK
              </Button>
             
            
            </div>
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
                    description={
                      <span>No simulation result, please select parameter</span>
                    }
                  />
                ) : loading ? (
                  <div>
                    <Spin size={"large"}/>
                  </div>
                ) : (
                  <div >
                    <div style={{marginBottom:'50px',fontSize:"15px"}}>After simulation of PCR，the sequence number distribution of oligonucleotides pool is as follows:</div>
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
  );
};

Pcr.defaultProps = new PcrProps();
