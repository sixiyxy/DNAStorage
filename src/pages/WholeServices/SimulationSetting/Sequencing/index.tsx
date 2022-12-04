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
export class SequencingProps {
  changeSider?;
  fileId;
  sequenceFlag;
  okFlag;
  effect5;
  response;
  setSEQRUN;
  seqrun;
  exmSpinFlag;
  setReport;
}

export const Sequencing: React.FC<SequencingProps> = (props) => {
  const {Option, OptGroup} = Select;
  const [countlen, setLen] = useState(0)
  const [sequencingDepth, setSequencingDepth] = useState(1);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [method, setMethod] = useState("ill_PairedEnd");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [densityData, setDensityData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState();

  //处理函数
  const monthChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setSequencingDepth(value);
  };
  const handleChange = (value: string) => {
    setMethod(value);
  };
  const skipDecay = function () {
    props.changeSider(["0-1-5"]);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk = async () => {
    setLoading(true);
    setNoDataTipsShow(false);
    props.setSEQRUN(true);
    const resp: any = await doPost("/simu_seq", {body: params});
    setLen(resp.seq_density.length);
    setDensityData(resp.seq_density);
    setGroup(resp.density_group);
    setLoading(false);
    props.setReport(false)
  };

    useEffect(()=>{
      if (props.effect5 == true){
      setLoading(true);
      setNoDataTipsShow(false);
      props.setSEQRUN(true);
      setLen(props.response.SEQ.density.length);
      setDensityData(props.response.SEQ.density);
      setGroup(props.response.SEQ.group);
      setLoading(false);
      props.setReport(false)
    }else{
        console.log('eff5',props.effect5);
      }
      },[props.effect5])
  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      // file_uid: "1565536927137009664",
      seq_depth: sequencingDepth,
      seq_meth: method,
    };
  }, [sequencingDepth, method, props.fileId]);
  const config = useMemo(() => {
    return {
      data: densityData,
      width: 200,
      height: 300,
      binField: "value",
      binWidth: group,
      // yAxis:{
      //   maxLimit:17000
      // },
      yAxis:{
        title:{
          text:'Percentage',
          offset:60,
        },
        // tickInterval:20
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
            return `${((value / countlen)*100).toFixed(2)}%`;
          }

        }
      }
    };
  }, [group, densityData]);

  const show = props.okFlag && props.sequenceFlag;

  return (
    <div className="simulation-step-content">
      <Card title="Sequencing" className={`${show ? null : "simulation-content-masked"}`} headStyle={{fontSize:"18px"}}>
        <Row>
          <Col span={12}>
            <div className="SEQLeft">
            <div className="simulation-sequencing-function-content">
              <div>
                <div className="simulation-row">
                  <span>Sequencing depth :</span>
                  <Tooltip title="The number of times that a given nucleotide has been read in an experiment.">
                    <i
                      className="iconfont icon-wenhao"
                      style={{verticalAlign: "middle", margin: "0 0 0 5px"}}
                    />
                  </Tooltip>
                  <Row>
                    <Col span={12}>
                      <Slider
                        min={1}
                        max={100}
                        onChange={monthChange}
                        value={
                          typeof sequencingDepth === "number" ? sequencingDepth : 0
                        }
                      />
                    </Col>
                    <Col span={4}>
                      <InputNumber
                        min={1}
                        max={100}
                        style={{
                          margin: "0 16px",
                        }}
                        value={sequencingDepth}
                        onChange={monthChange}
                      />
                    </Col>
                  </Row>
                </div>

                <div className="simulation-row">
                  <span>Sequencing method :</span>
                  <Select
                    className="simulation-selector"
                    onChange={handleChange}
                    value={method}
                  >
                    <OptGroup label="Illumina">
                      <Option value="ill_PairedEnd">PairedEnd</Option>
                      <Option value="ill_SingleEnd">SingleEnd</Option>
                    </OptGroup>

                    <OptGroup label="Nanopore">
                      <Option value="nano_1D">1D</Option>
                      <Option value="nano_2D">2D</Option>
                    </OptGroup>
                    <OptGroup label="PacBio">
                      <Option value="Pac_subread">Subread</Option>
                      <Option value="Pac_CCS">CCS</Option>
                    </OptGroup>
                    <OptGroup label="None">
                      <Option value="None">None</Option>
                    </OptGroup>
                  </Select>
                </div>
                <div className="simulation-buttons">
                  <Button
                    size="large"
                    shape="round"
                    onClick={handleOk}
                    disabled={props.seqrun}
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
                    <p>Do you want to skip Sequencing?</p>
                  </Modal>
                </div>
              </div>
            </div>
            </div>
          </Col>
          <Col span={12}>
            <Card>
            <Spin size="large" spinning={props.exmSpinFlag}>
              {/* <div>
                After Sequencing simulation, the situation of oligonucleotides pool as follows:
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
                  <div>
                    <div style={{marginBottom:"50px",fontSize:"15px"}}>After simulation of sequencing, the sequence number distribution of oligonucleotides pool is as follows:</div>
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

Sequencing.defaultProps = new SequencingProps();
