import { Area, Datum } from "@ant-design/charts";
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

export class DecayProps {
  changeSider;
  fileId;
}

export const Decay: React.FC<DecayProps> = (props) => {
  const { Option, OptGroup } = Select;

  const [lossValue, setLossValue] = useState(0.3);
  const [monthValue, setMonthValue] = useState(24);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState("");
  const [method, setMethod] = useState("Hsapiens");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
    props.changeSider("0-1-2");
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
      .post("http://127.0.0.1:5000/simu_dec", params)
      .then(function (response) {
        //console.log(response);
        setData(response?.data?.density);
        setHrefLink(response?.data?.synthesis_method_reference);
        setLoading(false);
      });
  };
  const handleContinue = () => {
    props.changeSider("0-1-1");
  };

  //数据生成
  const chartData = useMemo(() => {
    return data.map((item) => {
      return {
        copyNumber: item[0],
        density: Number(item[1].toFixed(3)),
      };
    });
  }, [data]);
  const params = useMemo(() => {
    return {
      // file_uid: props.fileId,
      file_uid: "1565536927137009664",
      months_of_storage: monthValue,
      loss_rate: lossValue,
      storage_host: method,
    };
  }, [monthValue, lossValue, method]);
  console.log("params", params);
  const config = {
    data: chartData,
    width: 200,
    height: 300,
    xField: "copyNumber",
    yField: "density",
    autoFit: true,
    xAxis: {
      // range: [0, 200],
      title: {
        text: "Copy Number",
      },
    },
    yAxis: {
      // range: [0, 0.5],
      title: {
        text: "Density",
      },
    },
  };

  return (
    <div className="synthesis-content">
      <div style={{ margin: 20 }}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <a href="/">Home</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/Services">Service</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Simulation</Breadcrumb.Item>
          <Breadcrumb.Item>Decay</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Row wrap={false}>
        <Col>
          <Card
            title="Note"
            bordered={false}
            style={{ marginLeft: 20, marginTop: 20 }}
          >
            <p>
              This stage would simulate error occurrences that happened under
              the real application.
            </p>
            <p>
              You could adjust the parameters for each stage accordingly or
              simply skip some stages.
            </p>
            <p>It is also possible to skip the whole error simulation stage.</p>
          </Card>
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
                  <Col span={12}>
                    <Slider
                      min={1}
                      max={24}
                      onChange={monthChange}
                      value={typeof monthValue === "number" ? monthValue : 0}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      min={1}
                      max={24}
                      style={{
                        margin: "0 16px",
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
                      White Gaussian Noise with an_error probability of 0.5
                      percent
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
                    <Option value="jukes_q1">
                      Jukes-Cantor model with q=1
                    </Option>
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
                <Button size="large" style={{ width: 100 }} onClick={showModal}>
                  Skip
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
        </Col>
        <Col flex="auto">
          <Card style={{ marginLeft: 10, marginTop: 20, height: 560 }}>
            <div>
              <span>The parameter settings are referenced from :</span>
              <a
                style={{ margin: "0 0 0 5px" }}
                href={hrefLink}
                target="_blank"
              >
                Method Paper
              </a>
            </div>
            <div style={{ margin: "0 0 30px 0" }}>
              After synthesis simulation, the situation of oligonucleotides pool
              as follows:
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
                  <Area {...config} />
                </div>
              )}
            </div>

            <Button
              style={{ margin: " 40px 200px" }}
              onClick={handleContinue}
              disabled={noDataTipsShow}
            >
              Continue
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

Decay.defaultProps = new DecayProps();
