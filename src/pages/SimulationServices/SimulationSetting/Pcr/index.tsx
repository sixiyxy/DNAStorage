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
  
}

export const Pcr: React.FC<PcrProps> = (props) => {
  const {Option, OptGroup} = Select;
  const [countLen, setCountLen] = useState(0)
  const [pcrProbability, setPcrProbability] = useState(0.8);
  const [pcrCycleValue, setPcrCycleValue] = useState(12);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState([]);
  const [method, setMethod] = useState("Taq");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [densityData, setDensityData] = useState([]);
  // 未使用的变量，暂予以注释
  // const [errorData, setErrorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alreadyRun, setAlreadyRun] = useState(false);
  const [group, setGroup] = useState();

  //处理函数
  const monthChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setPcrCycleValue(value);
  };
  const handleReset = function () {
    setPcrCycleValue(12);
    setPcrProbability(0.8);
    setMethod("Taq");
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
  const skipDecay = function () {
    props.changeSider(["0-1-3"]);
  };
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    setLoading(true);
    setNoDataTipsShow(false);
    setAlreadyRun(true);
    // todo 将请求接口 ts 化，否则无法移除警告
    const resp: any = await doPost("/simu_pcr", {body: params});
    setCountLen(resp.pcr_density.length);
    // setErrorData(response?.data?.pcr_error_density);
    setGroup(resp.pcr_group);
    setDensityData(resp.pcr_density);
    setHrefLink(resp.synthesis_method_reference);
    setLoading(false);
  };

  const param1 = {  
      file_uid:"1582175684011364352",
      pcr_cycle:12,
      pcr_prob:0.8,
      pcr_polymerase:"Taq",
      upload_flag:"True"
  }
  useEffect(()=>{
    if (props.effect3 == true){
    setLoading(true);
    setNoDataTipsShow(false);
    axios
      .post(API_PREFIX + "/simu_pcr", param1)
      .then(function (response){
        setCountLen(response.data.pcr_density.length);
    // setErrorData(response?.data?.pcr_error_density);
        setGroup(response.data.pcr_group);
        setDensityData(response.data.pcr_density);
        setHrefLink(response.data.synthesis_method_reference);
        setLoading(false);
  })}else{
    console.log('eff3',props.effect3);
  }
  },[props.effect3])

  const methodLink = useMemo(() => {
    return hrefLink?.map((link, index) => {
      return (
        <>
          <a style={{margin: "0 0 0 5px"}} href={link} target="_blank" rel="noreferrer">
            {link}
          </a>
          <br/>
        </>
      );
    });
  }, [hrefLink]);

  //数据生成
  // const chart1Data = useMemo(() => {
  //   return densityData?.map((item) => {
  //     return {
  //       copyNumber: item[0],
  //       density: Number(item[1].toFixed(3)),
  //     };
  //   });
  // }, [densityData]);
  // const chart2Data = useMemo(() => {
  //   return errorData?.map((item) => {
  //     return {
  //       copyNumber: item[0],
  //       density: Number(item[1].toFixed(3)),
  //     };
  //   });
  // }, [errorData]);
  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      // file_uid: "1565536927137009664",
      pcr_cycle: pcrCycleValue,
      pcr_prob: pcrProbability,
      pcr_polymerase: method,
      upload_flag:"True"
    };
  }, [pcrCycleValue, pcrProbability, method, props.fileId]);
  //console.log("params", params);
  // const config1 = {
  //   data: chart1Data,
  //   width: 200,
  //   height: 300,
  //   xField: "copyNumber",
  //   yField: "density",
  //   autoFit: true,
  //   xAxis: {
  //     // range: [0, 200],
  //     title: {
  //       text: "Copy Number",
  //     },
  //   },
  //   yAxis: {
  //     // range: [0, 0.5],
  //     title: {
  //       text: "Density",
  //     },
  //   },
  // };

  // const config2 = {
  //   data: chart2Data,
  //   width: 200,
  //   height: 150,
  //   xField: "copyNumber",
  //   yField: "density",
  //   autoFit: true,
  //   xAxis: {
  //     // range: [0, 200],
  //     title: {
  //       text: "Copy Number",
  //     },
  //   },
  //   yAxis: {
  //     // range: [0, 0.5],
  //     title: {
  //       text: "Density",
  //     },
  //   },
  // };
  
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
      <Card title="PCR" className={`${show ? null : "simulation-content-masked"}`}>
        <Row>
          <Col span={12}>
            <div className="PCRLeft">
            <div className="simulation-row">
              <span>PCR Cycle : </span>
              <Tooltip title="Cycle number of the PCR process.">
                <i
                  className="iconfont icon-wenhao"
                  style={{verticalAlign: "middle", margin: "0 0 0 5px"}}
                />
              </Tooltip>
              <Row>
                <Col span={12}>
                  <Slider
                    min={0}
                    max={20}
                    onChange={monthChange}
                    value={typeof pcrCycleValue === "number" ? pcrCycleValue : 0}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={0}
                    max={20}
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
              <span>PCR Probability : </span>
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
              <span>Storage Host :</span>
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
                disabled={alreadyRun}
              >
                OK
              </Button>
              {/* <Button shape="round" size="large"
                      onClick={handleReset}>
                Reset
              </Button> */}
              <Modal
                title="Warning"
                visible={isModalOpen}
                onOk={skipDecay}
                onCancel={handleCancel}
                okText="Skip"
              >
                <i
                  className="iconfont icon-warning-circle"
                />
                <p>Do you want to skip PCR?</p>
              </Modal>
            </div>
            </div>
          </Col>
          <Col span={12}>
            <Card>
              {/* <div>
                After Decay simulation, the situation of oligonucleotides pool as
                follows:
              </div> */}
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
            </Card>
          </Col>
        </Row>
        <div className="common-masker" hidden={show}/>
      </Card>
    </div>
  );
};

Pcr.defaultProps = new PcrProps();
