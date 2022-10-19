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

export class SamplingProps {
  changeSider;
  fileId;
}

export const Sampling: React.FC<SamplingProps> = (props) => {
  const [samplingRatio, setSamplingRatio] = useState(0.005);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState("");
  const [method, setMethod] = useState("Taq");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [densityData, setDensityData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [loading, setLoading] = useState(false);

  //处理函数

  const lossChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setSamplingRatio(value);
  };
  const handleChange = (value: string) => {
    setMethod(value);
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
  const handleOk = () => {
    setLoading(true);
    setNoDataTipsShow(false);
    axios
      .post("http://localhost:5000/simu_sam", params)
      .then(function (response) {
        //console.log("sampling response", response);
        setErrorData(response?.data?.sam_error_density);
        setDensityData(response?.data?.sam_density);
        setHrefLink(response?.data?.synthesis_method_reference);
        setLoading(false);
      });
  };
  const handleContinue = () => {
    props.changeSider(["0-1-4"]);
  };

  //数据生成
  const densityChartData = useMemo(() => {
    return densityData?.map((item) => {
      return {
        copyNumber: item[0],
        density: Number(item[1].toFixed(3)),
      };
    });
  }, [densityData]);
  const errorChartData = useMemo(() => {
    return errorData?.map((item) => {
      return {
        copyNumber: item[0],
        density: Number(item[1].toFixed(3)),
      };
    });
  }, [errorData]);
  const params = useMemo(() => {
    return {
      // file_uid: props.fileId,
      file_uid: "1565536927137009664",
      sam_ratio: samplingRatio,
    };
  }, [samplingRatio, method]);
  // console.log("params", params);
  const densityConfig = {
    data: densityChartData,
    width: 200,
    height: 150,
    xField: "copyNumber",
    yField: "density",
    autoFit: true,
    smooth: true,
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
  const errorConfig = {
    data: errorChartData,
    width: 200,
    height: 150,
    xField: "copyNumber",
    yField: "density",
    autoFit: true,
    smooth: true,
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
    <div className="sampling-content">
      <div style={{ margin: 20 }}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <a href="/">Home</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/Services">Service</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Simulation</Breadcrumb.Item>
          <Breadcrumb.Item>Sampling</Breadcrumb.Item>
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
                <span>Sampling Ratio:</span>
                <Tooltip title="The ratio of each oligo to be sampled.">
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
                      value={
                        typeof samplingRatio === "number" ? samplingRatio : 0
                      }
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
                  <p>Do you want to skip Sampling?</p>
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
                  <Area {...densityConfig} />
                  <Area {...errorConfig} />
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

Sampling.defaultProps = new SamplingProps();
