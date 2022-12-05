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
export class DecayProps {
  changeSider?;
  fileId;
  decayFlag;
  okFlag;
  effect2;
  response;
  setDECRUN;
  decrun;
  setPCRRUN;
  setSAMRUN;
  setSEQRUN;
  method1;
  exmSpinFlag;
  setReport;
}

export const Decay: React.FC<DecayProps> = (props) => {
  const {Option, OptGroup} = Select;
  const [countLen, setCountLen] = useState(0);
  const [lossValue, setLossValue] = useState(0.3);
  const [monthValue, setMonthValue] = useState(24);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [method, setMethod] = useState("Hsapiens");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState();

  //处理函数
  const monthChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setMonthValue(value);
  };
  const lossChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setLossValue(value);
  };
  const handleChange = (value: string) => {
    setMethod(value);
  };
  const handleOk = async () => {
    setLoading(true);
    setNoDataTipsShow(false);
    props.setDECRUN(true);
    
    const resp: any = await doPost("/simu_dec", {body: params});

    setCountLen(resp.dec_density.length);
    setGroup(resp.dec_group);
    setData(resp.dec_density);
    setLoading(false);

    if(!props.method1[1]){
      props.setPCRRUN(false)
    }else if(!props.method1[2]){
      props.setSAMRUN(false)
    }else if(!props.method1[3]){
      props.setSEQRUN(false)
    }else{
      props.setReport(false)
    }
  };

  useEffect(()=>{
    if (props.effect2 == true){
    setLoading(true);
    setNoDataTipsShow(false);
    props.setDECRUN(true);
    setCountLen(props.response.DEC.density.length);
    setGroup(props.response.DEC.group);
    setData(props.response.DEC.density);
    setLoading(false);
    
  }
  },[props.effect2])

  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      months_of_storage: monthValue,
      decay_loss_rate: lossValue,
      storage_host: method,
    };
  }, [monthValue, lossValue, method, props.fileId]);

  const config = useMemo(() => {
    return {
      data: data,
      width: 200,
      height: 300,
      binField: "value",
      binWidth: group,
      yAxis:{
        title:{
          text:'Percentage',
          offset:60,
        },
        maxLimit:countLen
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
            return `${((value / countLen)*100).toFixed(2)}%` //记得乘以100 并且设置y轴最大值
          },
        },
      },
    };
  }, [group, data]);

  const show = props.okFlag && props.decayFlag
  return (
    <div className={`simulation-step-content`}>
      <Card title="Decay" className={`${show ? null : "simulation-content-masked"}`} headStyle={{fontSize:"18px"}}>
        <Row>
          <Col span={12}>
            <div className="decayLeft">
            <div className="simulation-row">
              <span>Month of storage : </span>
              <Tooltip
                title="During storage, depurination and deamination are the two main factors of the decay of strands, where the ratio could be computed with temperature, PH, and storage time. Other factors relate to the storage host you choose. ">
                <i
                  className="iconfont icon-wenhao"
                />
              </Tooltip>
              <InputNumber
                className="simulation-input"
                min={1}
                value={monthValue}
                onChange={monthChange}
              />
            </div>
            <div className="simulation-row">
              <div style={{paddingTop:'10px'}}>
                <span>Loss rate : </span>
                <Tooltip title="Total loss rate during storage. ">
                  <i
                    className="iconfont icon-wenhao"
                  />
                </Tooltip>
              
              <Row>
                <Col span={12}>
                  <Slider
                    min={0}
                    max={1.0}
                    onChange={lossChange}
                    value={typeof lossValue === "number" ? lossValue : 0}
                    step={0.1}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    className="simulation-input"
                    min={0}
                    max={1.0}
                    step={0.1}
                    value={lossValue}
                    onChange={lossChange}
                  />
                </Col>
              </Row>
              </div>
            </div>
            <div className="simulation-row">
              <div style={{paddingTop:'15px'}}>
              <span>Storage host :</span>
              <Select onChange={handleChange} value={method} className="simulation-selector">
                <OptGroup label="Eukaryotic">
                  <Option value="Hsapiens">H sapiens</Option>
                  <Option value="Mmusculus">M musculus </Option>
                  <Option value="Dmelanogaster">D melanogaster</Option>
                  <Option value="Scerevisiae">S cerevisiae</Option>
                </OptGroup>

                <OptGroup label="In-vitro">
                  <Option value="Erasure">
                    Erasure Channel with an error probability of 0.5 percent
                  </Option>
                  <Option value="WhiteGaussian">
                    White Gaussian Noise with an error probability of 0.5 percent
                  </Option>
                  <Option value="Dep_ph8_293.15k">Depurination at pH 8 and 293.15K</Option>
                  <Option value="Dep_ph8_253.15k">Depurination at pH 8 and 253.15K</Option>
                  <Option value="Dep_ph8_193.15k">Depurination at pH 8 and 193.15K</Option>
                  <Option value="Dep_ph7_193.15k">Depurination at pH 7 and 193.15K</Option>
                  <Option value="Dep_ph7_253.15k">Depurination at pH 7 and 253.15K</Option>
                  <Option value="jukes_q1">Jukes-Cantor model with q=1</Option>
                </OptGroup>
                <OptGroup label="Prokaryotes">
                  <Option value="Ecoli">E Coli</Option>
                </OptGroup>
              </Select>
              </div>
            </div>
            <div className="simulation-buttons">
              <Button size="large" shape="round" onClick={handleOk} disabled={props.decrun}>
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
                    description={<span>No simulation result, please select parameter</span>}
                  />
                ) : loading ? (
                  <div>
                    <Spin size={"large"}/>
                  </div>
                ) : (
                  <div>
                    <div style={{marginBottom:"50px",fontSize:"15px"}}>After simulation of decay, the sequence number distribution of oligonucleotides pool is as follows:</div>
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

Decay.defaultProps = new DecayProps();
