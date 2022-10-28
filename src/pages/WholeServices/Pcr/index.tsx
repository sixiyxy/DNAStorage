import { Area, Datum, Histogram } from "@ant-design/charts";
import {
  Breadcrumb,
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
import React, { useContext, useEffect, useMemo, useState } from "react";
import "./index.less";
import axios from "axios";

export class PcrProps {
  changeSider;
  fileId;
}

export const Pcr: React.FC<PcrProps> = (props) => {
  const { Option, OptGroup } = Select;

  const [pcrProbability, setPcrProbability] = useState(0.8);
  const [pcrCycleValue, setPcrCycleValue] = useState(12);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState();
  const [method, setMethod] = useState("Taq");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [densityData, setDensityData] = useState([]);
  const [errorData, setErrorData] = useState([]);
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
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setLoading(true);
    setNoDataTipsShow(false);
    setAlreadyRun(true);
    axios
      .post("http://localhost:5000/simu_pcr", params)
      .then(function (response) {
        console.log("pcr response", response);
        // setErrorData(response?.data?.pcr_error_density);
        setGroup(response?.data?.pcr_group);
        setDensityData(response?.data?.pcr_density);
        setHrefLink(response?.data?.synthesis_method_reference);
        setLoading(false);
      });
  };
  const handleContinue = () => {
    props.changeSider(["0-1-3"]);
  };

  const methodLink = useMemo(() => {
    return hrefLink?.map((link, index) => {
      return (
        <>
          <a style={{ margin: "0 0 0 5px" }} href={link} target="_blank">
            {link}
          </a>
          <br />
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
    };
  }, [pcrCycleValue, pcrProbability, method]);
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
    };
  }, [group, densityData]);

  return (
    <div className="pcr-content">
      <div className="function-content">
        <Card>
          <div className="function-bar">
            <span>PCR Cycle: </span>
            <Tooltip title="Cycle number of the PCR process.">
              <i
                className="iconfont icon-wenhao"
                style={{ verticalAlign: "middle", margin: "0 0 0 5px" }}
              ></i>
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
          <div className="function-bar">
            <span>PCR Probability: </span>
            <Tooltip title="In each PCR cycle, a sequence has a possibility of p being amplified. ">
              <i
                className="iconfont icon-wenhao"
                style={{ verticalAlign: "middle", margin: "0 0 0 5px" }}
              ></i>
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
          <div className="function-bar">
            <span>Storage Host :</span>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "20px 0",
            }}
          >
            <Button size="large" style={{ width: 100 }} onClick={handleOk}>
              OK
            </Button>
            <Button
              size="large"
              style={{ width: 100 }}
              onClick={showModal}
              disabled={alreadyRun}
            >
              Skip
            </Button>
            <Button size="large" style={{ width: 100 }} onClick={handleReset}>
              Reset
            </Button>
            <Modal
              title="Warning"
              visible={isModalOpen}
              onOk={skipDecay}
              onCancel={handleCancel}
              okText="Skip"
            >
              <i
                className="iconfont icon-warning-circle"
                style={{ fontSize: 40, color: "red" }}
              ></i>
              <p>Do you want to skip PCR?</p>
            </Modal>
          </div>
        </Card>
      </div>

      <Card style={{ marginLeft: 20, marginTop: 20, height: 560 }}>
        <div>
          <span>The parameter settings are referenced from :</span>
          <br />
          {methodLink}
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
              {/* <Area {...config1} /> */}
              <Histogram {...config} />

              <div style={{ margin: "0 0 20px 0" }}>copies:</div>
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
    </div>
  );
};

Pcr.defaultProps = new PcrProps();
