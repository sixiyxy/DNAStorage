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
  pcrFlag;
  setReport;
}

export const Sampling: React.FC<SamplingProps> = (props) => {
  const [samplingRatio, setSamplingRatio] = useState(0.005);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [countLen, setCountLen] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [densityData, setDensityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState();
  useEffect(() => {
    if (!props.pcrFlag){
      setSamplingRatio(0.5)
    }
  }, [props.pcrFlag]);
  
  //处理函数
  const lossChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setSamplingRatio(value);
  };
  console.log('samp',samplingRatio);
  
  const handleOk = async () => {
    setLoading(true);
    setNoDataTipsShow(false);
    props.setSAMRUN(true);
    const resp: any = await doPost("/simu_sam", {body: params});
    setCountLen(resp.sam_density.length);
    setGroup(resp.sam_group);
    setDensityData(resp.sam_density);
    setLoading(false);

    if(!props.method1[3]){
      props.setSEQRUN(false)
    }else{
     props.setReport(false)
    }
  };
  useEffect(()=>{
    if (props.effect4 == true){
    setLoading(true);
    setNoDataTipsShow(false);
    props.setSAMRUN(true);
    setCountLen(props.response.SAM.density.length);
    setGroup(props.response.SAM.group);
    setDensityData(props.response.SAM.density);
    setLoading(false);
  }
  },[props.effect4])

  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      sam_ratio: samplingRatio,
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
