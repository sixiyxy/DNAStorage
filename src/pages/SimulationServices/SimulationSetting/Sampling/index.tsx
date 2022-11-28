import {Histogram} from "@ant-design/charts";
import {Button, Card, Col, Empty, InputNumber, Modal, Row, Slider, Spin, Tooltip,} from "antd";
import React, {useMemo, useState,useEffect} from "react";
import "./index.less";
import {doPost} from "../../../../utils/request";
import axios from "axios";
import {API_PREFIX} from "../../../../common/Config";
export class SamplingProps {
  changeSider?;
  fileId;
  sampleFlag;
  okFlag;
  effect4;
  response;
  setSAMRUN;
  samrun;
  setSEQRUN;
  method1;
  exmSpinFlag;
  
}

export const Sampling: React.FC<SamplingProps> = (props) => {
  const [samplingRatio, setSamplingRatio] = useState(0.005);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState([]);
  const [countLen, setCountLen] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [densityData, setDensityData] = useState([]);
  // 未使用变量，暂予以注释
  // const [errorData, setErrorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alreadyRun, setAlreadyRun] = useState(false);
  const [group, setGroup] = useState();

  //处理函数
  const lossChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setSamplingRatio(value);
  };
  const handleReset = function () {
    setSamplingRatio(0.005);
  };
  const skipDecay = function () {
    props.changeSider(["0-1-4"]);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk = async () => {
    setLoading(true);
    setNoDataTipsShow(false);
    props.setSAMRUN(true);
    // todo 对请求接口 ts 化
    const resp: any = await doPost("/simu_sam", {body: params});
    setCountLen(resp.sam_density.length);
    setGroup(resp.sam_group);
    setDensityData(resp.sam_density);
    setHrefLink(resp.synthesis_method_reference);
    setLoading(false);

    if(!props.method1[3]){
      props.setSEQRUN(false)
    }else{
      console.log('just synthesis'); 
    }
  };
  const param1 = {
  sam_ratio:0.005,
  file_uid:"1582175684011364352",
  upload_flag:"True"
  }
  useEffect(()=>{
    if (props.effect4 == true){
    setLoading(true);
    setNoDataTipsShow(false);
    props.setSAMRUN(true);
    setCountLen(props.response.SAM.sam_density.length);
    setGroup(props.response.SAM.sam_group);
    setDensityData(props.response.SAM.sam_density);
    // setHrefLink(props.response.SAM.synthesis_method_reference);
    setLoading(false);
  }else{
    console.log('eff4',props.effect4);
  }
  },[props.effect4])
  // const handleContinue = () => {
  //   props.changeSider(["0-1-4"]);
  // };

  // 未使用代码段，暂予以注释
  // const methodLink = useMemo(() => {
  //   return hrefLink?.map((link, index) => {
  //     return (
  //       <>
  //         <a style={{margin: "0 0 0 5px"}} href={link} target="_blank" rel="noreferrer">
  //           {link}
  //         </a>
  //         <br/>
  //       </>
  //     );
  //   });
  // }, [hrefLink]);

  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      // file_uid: "1565536927137009664",
      sam_ratio: samplingRatio,
      upload_flag:"True"
    };
  }, [samplingRatio, props.fileId]);

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
          formatter: (value) => {
            return `${((value / countLen)*100).toFixed(2)}%`;
          }
        }
      }
    };
  }, [group, densityData]);

  const show = props.okFlag && props.sampleFlag;

  return (
    <div className="simulation-step-content">
      <Card title="Sampling" className={`${show ? null : "simulation-content-masked"}`} headStyle={{fontSize:"18px"}}>
        <Row>
          <Col span={12}>
            <div className="SAMLeft">
            <div className="simulation-row">
              <span>Sampling ratio :</span>
              <Tooltip title="The ratio of each oligo to be sampled.">
                <i
                  className="iconfont icon-wenhao"
                  style={{verticalAlign: "middle", margin: "0 0 0 5px"}}
                />
              </Tooltip>
              <Row>
                <Col span={12}>
                  <Slider
                    min={0}
                    max={1.0}
                    onChange={lossChange}
                    value={typeof samplingRatio === "number" ? samplingRatio : 0}
                    step={0.001}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={0}
                    max={1.0}
                    style={{
                      margin: "0 16px",
                    }}
                    step={0.001}
                    value={samplingRatio}
                    onChange={lossChange}
                  />
                </Col>
                
              </Row>
              
            </div>

            <div className="simulation-buttons">
              <Button
                size="large"
                shape="round"
                onClick={handleOk}
                disabled={props.samrun}
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
                  style={{fontSize: 40, color: "red"}}
                />
                <p>Do you want to skip Sampling?</p>
              </Modal>
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
                  <div>
                    <div style={{marginBottom:"50px",fontSize:"15px"}}> After simulation of sampling, the sequence number distribution of oligonucleotides pool is as follows:</div>
                    <Histogram {...config} />
                  </div>
                )}
              </div>
            </Spin>
            </Card>
          </Col>
          <div className="common-masker" hidden={show}/>
        </Row>
      </Card>
    </div>
  );
};

Sampling.defaultProps = new SamplingProps();
