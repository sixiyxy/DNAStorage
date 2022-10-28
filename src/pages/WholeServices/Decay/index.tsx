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
import { group } from "console";

export class DecayProps {
  changeSider;
  fileId;
}

export const Decay: React.FC<DecayProps> = (props) => {
  const { Option, OptGroup } = Select;

  const [lossValue, setLossValue] = useState(0.3);
  const [monthValue, setMonthValue] = useState(24);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState();
  const [method, setMethod] = useState("Hsapiens");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alreadyRun, setAlreadyRun] = useState(false);
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
  const skipDecay = function () {
    props.changeSider(["0-1-2"]);
  };
  const handleReset = function () {
    setMethod("Hsapiens");
    setLossValue(0.3);
    setMonthValue(24);
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
      .post("http://localhost:5000/simu_dec", params)
      .then(function (response) {
        console.log("decay-response", response);
        setGroup(response?.data?.dec_group);
        setData(response?.data?.dec_density);
        setHrefLink(response?.data?.storage_host_parameter_reference);
        setLoading(false);
      });
  };
  const handleContinue = () => {
    props.changeSider(["0-1-2"]);
  };

  //数据生成
  // const chartData = useMemo(() => {
  //   return data?.map((item) => {
  //     return {
  //       type: item[0],
  //       copyNumber: item[1],
  //       density: Number(item[2].toFixed(3)),
  //     };
  //   });
  // }, [data]);
  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      //file_uid: "1565536927137009664",
      months_of_storage: monthValue,
      loss_rate: lossValue,
      storage_host: method,
    };
  }, [monthValue, lossValue, method]);
  //console.log("params", params);
  // const config = {
  //   data: chartData,
  //   width: 200,
  //   height: 300,
  //   xField: "copyNumber",
  //   yField: "density",
  //   autoFit: true,
  //   smooth: true,
  //   seriesField: "type",
  //   isStack: false,
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
      data: data,
      width: 200,
      height: 300,
      binField: "value",
      binWidth: group,
    };
  }, [group, data]);

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
  return (
    <div className="decay-content">
      <div className="function-content">
        <Card>
          <div className="function-bar">
            <span>Month of Storage:</span>
            <Tooltip title="During storage, depurination and deamination are the two main factors of the decay of strands, where the ratio could be computed with temperature, PH, and storage time. Other factors relate to the storage host you choose. ">
              <i
                className="iconfont icon-wenhao"
                style={{ verticalAlign: "middle", margin: "0 0 0 5px" }}
              ></i>
            </Tooltip>
            <Row>
              <Col>
                <InputNumber
                  min={1}
                  style={{
                    margin: "5px 0px",
                    width: "150px",
                  }}
                  value={monthValue}
                  onChange={monthChange}
                />
              </Col>
            </Row>
          </div>
          <div className="function-bar">
            <span>Loss Rate: </span>
            <Tooltip title="Total loss rate during storage. ">
              <i
                className="iconfont icon-wenhao"
                style={{ verticalAlign: "middle", margin: "0 0 0 5px" }}
              ></i>
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
                  min={0}
                  max={1.0}
                  style={{
                    margin: "0 16px",
                  }}
                  step={0.1}
                  value={lossValue}
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
                <Option value="Dep_ph8_293.15k">
                  Depurination at pH 8 and 293.15K
                </Option>
                <Option value="Dep_ph8_253.15k">
                  Depurination at pH 8 and 253.15K
                </Option>
                <Option value="Dep_ph8_193.15k">
                  Depurination at pH 8 and 193.15K
                </Option>
                <Option value="Dep_ph7_193.15k">
                  Depurination at pH 7 and 193.15K
                </Option>
                <Option value="Dep_ph7_253.15k">
                  Depurination at pH 7 and 253.15K
                </Option>
                <Option value="jukes_q1">Jukes-Cantor model with q=1</Option>
              </OptGroup>
              <OptGroup label="Prokaryotes">
                <Option value="Ecoli">E Coli</Option>
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
              <p>Do you want to skip Decay?</p>
            </Modal>
          </div>
        </Card>
      </div>

      <Card
        style={{ marginLeft: 20, marginTop: 10, marginBottom: 20, height: 560 }}
      >
        <div>
          <span>The parameter settings are referenced from :</span>
          <br />
          {methodLink}
        </div>
        <div style={{ margin: "0 0 0 0" }}>
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
            <div style={{ margin: "15px 0 0 0" }}>
              <div style={{ margin: "0 0 20px 0" }}>copies:</div>
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
    </div>
  );
};

Decay.defaultProps = new DecayProps();
