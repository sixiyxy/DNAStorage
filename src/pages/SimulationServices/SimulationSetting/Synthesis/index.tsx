import { Area, Datum, Histogram } from "@ant-design/charts";
import { InboxOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
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
} from "antd";
import React, { useContext, useEffect, useMemo, useState } from "react";
import "./index.less";

import axios from "axios";
import Dragger from "antd/lib/upload/Dragger";

export class SynthesisProps {
  changeSider;
  fileId;
  setIsSynthesis;
  setFileId;
}

export const Synthesis: React.FC<SynthesisProps> = (props) => {
  const { Option, OptGroup } = Select;

  const [yieldValue, setYieldValue] = useState(0.99);
  const [cycleValue, setCycleValue] = useState(30);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState("");
  const [method, setMethod] = useState("ErrASE");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOkDisable, setIsOkDisable] = useState(true);
  const [group, setGroup] = useState();
  const [alreadyRun, setAlreadyRun] = useState(false);

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
    axios
      .post("http://localhost:5000/simu_synthesis", params)
      .then(function (response) {
        //console.log(response);
        //console.log("syn_density", response?.data?.syn_density);
        setData(response?.data?.syn_density);
        setGroup(response?.data?.density_group);
        setHrefLink(response?.data?.synthesis_method_reference);
        setAlreadyRun(true);
        setLoading(false);
      });
    props.setIsSynthesis(true);
  };

  const handleExample = () => {
    setLoading(true);
    setNoDataTipsShow(false);
    axios
      .post("http://localhost:5000/simu_synthesis", {
        file_uid: "1582175684011364352", //待确认
        synthesis_number: 30,
        synthesis_yield: 0.99,
        synthesis_method: "ErrASE",
        upload_flag: "True",
      })
      .then(function (response) {
        //console.log(response);
        //console.log("syn_density", response?.data?.syn_density);
        setData(response?.data?.syn_density);
        setHrefLink(response?.data?.synthesis_method_reference);
        setLoading(false);
      });
    props.setIsSynthesis(true);
  };
  // const handleContinue = () => {
  //   props.changeSider(["0-1-1"]);
  // };

  const uploadProps = {
    name: "file",
    multiple: true,
    action: "http://localhost:5000/dna_upload",
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
  //数据生成
  // const chartData = useMemo(() => {
  //   return data?.map((item) => {
  //     return {
  //       copyNumber: item[0],
  //       density: Number(item[1].toFixed(3)),
  //     };
  //   });
  // }, [data]);
  const handleReset = function () {
    console.log('ressssssss....');
    
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
      upload_flag: "True",
    };
  }, [cycleValue, yieldChange, method]);
  //console.log("params", params);
  // const config = {
  //   data: chartData,
  //   width: 200,
  //   height: 300,
  //   xField: "copyNumber",
  //   yField: "density",
  //   autoFit: true,
  //   smooth: true,
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
      data,
      width: 200,
      height: 300,
      binField: "value",
      binWidth: group,
    };
  }, [group, data]);
  return (
    <div className="synthesis-content">
      <Card
        title="Upload Dna File"
        bordered={false}
        style={{ marginLeft: 20, marginTop: 20,width:"1100px" }}
      >
        <Dragger
          {...uploadProps}
          beforeUpload={beforeUpload}
          accept=".fasta"
          maxCount={1}
          onRemove={() => {
            setIsOkDisable(true);
          }}
          style={{ width: 800 ,marginLeft:"110px",paddingTop:"30px"}}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </Dragger>
      </Card>
      
      <div className="function-content" >
     
        <Card title="Synthesis" style={{width:"1100px"}}>
        <Row gutter={16}>
        <Col span={8}>
              <Card style={{width:"500px"}}>
              <div className="function-bar">
                <span>Synthesis Cycle:</span>
                <Tooltip title="The copied number of each oligo you want it to have.">
                  <i
                    className="iconfont icon-wenhao"
                    style={{ verticalAlign: "middle", margin: "0 0 0 5px" }}
                  ></i>
                </Tooltip>
                <Row>
                  <Col span={12}>
                    <Slider
                      min={10}
                      max={50}
                      onChange={cycleChange}
                      value={typeof cycleValue === "number" ? cycleValue : 0}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      min={10}
                      max={50}
                      style={{
                        margin: "0 16px",
                      }}
                      value={cycleValue}
                      onChange={cycleChange}
                    />
                  </Col>
                </Row>
              </div>
              <div className="function-bar">
                <span>Synthesis Yield :</span>
                <Tooltip title="The possibility of adding one nucleoside to the current synthesizing strand is defined as coupling efficiency. The process might be terminated because of unsuccessful coupling so imperfect coupling efficiency limits the length of the final sequence. Typically, it ranges about 98-99.5.">
                  <i
                    className="iconfont icon-wenhao"
                    style={{ verticalAlign: "middle", margin: "0 0 0 5px" }}
                  ></i>
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
                      min={0.98}
                      max={0.995}
                      style={{
                        margin: "0 16px",
                      }}
                      step={0.001}
                      value={yieldValue}
                      onChange={yieldChange}
                    />
                  </Col>
                </Row>
              </div>
              <div className="function-bar">
                <span>Synthesis Method :</span>
                {/* <Tooltip title="prompt text">
                      <i
                        className="iconfont icon-wenhao"
                        style={{ verticalAlign: "middle", margin: "0 0 0 5px" }}
                      ></i>
                    </Tooltip> */}
                <Select
                  style={{ width: 320, marginLeft: 20 }}
                  onChange={handleChange}
                  value={method}
                >
                  <OptGroup label="Column Synthesized Oligos">
                    <Option value="ErrASE">ErrASE</Option>
                    <Option value="MutS">MutS</Option>
                    <Option value="ConsensusShuffle">Consensus Shuffle</Option>
                  </OptGroup>

                  <OptGroup label="Microarray based Oligo Pools">
                    <Option value="Oligo">
                      Oligo Hybridization based error correction
                    </Option>
                    <Option value="HighTemperature">
                      High temperature ligation/hybridization based error correction
                    </Option>
                    <Option value="ErrASE(Mic)">ErrASE</Option>
                    <Option value="Nuclease">
                      Nuclease based error correction
                    </Option>
                    <Option value="NGS">NGS based error correction</Option>
                  </OptGroup>
                  <OptGroup label="None">
                    <Option value="None">None</Option>
                  </OptGroup>
                </Select>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  margin: "30px 0",
                }}
              >
                <Button size="large" style={{ width: 100 }} onClick={handleExample}>
                  Example
                </Button>
                <Button
                  size="large"
                  style={{ width: 100 }}
                  onClick={handleOk}
                  disabled={isOkDisable || alreadyRun}
                >
                  OK
                </Button>
                {/* <Button size="large" style={{ width: 100 }} onClick={showModal}>
                      Skip
                    </Button> */}
                <Button size="large" style={{ width: 100 }} onClick={handleReset}>
                  Reset
                </Button>
                <Modal
                  title="Warning"
                  visible={isModalOpen}
                  onOk={skipSynthesis}
                  onCancel={handleCancel}
                  okText="Skip"
                >
                  <i
                    className="iconfont icon-warning-circle"
                    style={{ fontSize: 40, color: "red" }}
                  ></i>
                  <p>
                    Synthesis is the basic process of the error simulation stage.
                  </p>
                  <p>Skipping this step means skipping the whole stage. </p>
                  <p>Do you still want to skip it?</p>
                </Modal>
              </div>
              </Card>
         </Col>
              <Col span={8}> 
              <Card style={{ marginLeft: 155, height: 500,width:"530px"}}>
        <div>
          <span>The parameter settings are referenced from :</span>
          <a style={{ margin: "0 0 0 5px" }} href={hrefLink} target="_blank">
            Method Paper
          </a>
        </div>
        <div style={{ margin: "0 0 30px 0" }}>
          After synthesis simulation, the situation of oligonucleotides pool as
          follows:
        </div>
        <div>
          {noDataTipsShow ? (
            <Empty
              style={{ textAlign: "center", margin: "155px 0" }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              imageStyle={{
                height: 60,
              }}
              description={
                <span>No simulation result, please select parameter</span>
              }
            ></Empty>
          ) : loading ? (
            <div
              style={{
                textAlign: "center",
                margin: "155px 0",
              }}
            >
              <Spin size={"large"} />
            </div>
          ) : (
            <div style={{ margin: "60px 0 0 0" }}>
              <div style={{ margin: "0 0 20px 0" }}>copies:</div>
              {/* <Area {...config} /> */}
              <Histogram {...config} />
            </div>
          )}
        </div>

        {/* <Button
          style={{ margin: " 40px 200px" }}
          onClick={handleContinue}
          disabled={noDataTipsShow}
        >
          Continue
        </Button> */}
              </Card>
              </Col>
        </Row>
        </Card>
        
      </div>
{/*图的部分开始 */}
      
    </div>
  );
};

Synthesis.defaultProps = new SynthesisProps();
