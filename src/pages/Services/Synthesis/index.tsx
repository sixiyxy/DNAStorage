import { Area } from "@ant-design/charts";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  InputNumber,
  Modal,
  Row,
  Select,
  Slider,
  Tooltip,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import "./index.less";

import axios from "axios";

export class SynthesisProps {
  changeSider;
}

export const Synthesis: React.FC<SynthesisProps> = (props) => {
  const [yieldValue, setYieldValue] = useState(0.98);
  const [cycleValue, setCycleValue] = useState(10);

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
  // const DecimalStep = () => {
  //   return (

  //   );
  // };

  const { Option, OptGroup } = Select;
  const [method, setMethod] = useState("ErrASE");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useMemo(() => {
    return {
      file_uid: 1565536927137009664,
      synthesis_number: cycleValue,
      synthesis_yield: yieldValue,
      synthesis_method: method,
    };
  }, [cycleValue, yieldChange, method]);
  const handleChange = (value: string) => {
    setMethod(value);
  };

  const skipSynthesis = function () {
    props.changeSider("0-2");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log(params);
    axios
      .post("http://127.0.0.1:5000/simu_synthesis", params)
      .then(function (response) {
        console.log(response);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch(
      "https://gw.alipayobjects.com/os/bmw-prod/360c3eae-0c73-46f0-a982-4746a6095010.json"
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  const config = {
    data,
    width: 200,
    height: 300,
    xField: "timePeriod",
    yField: "value",
    xAxis: {
      range: [0, 1],
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
          <Breadcrumb.Item>Synthesis</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Row>
        <Col>
          <Card
            title="Note"
            bordered={false}
            style={{ width: 600, marginLeft: 20, marginTop: 20 }}
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
                <span>Synthesis Cycle:</span>
                <Tooltip title="prompt text">
                  <i
                    className="iconfont icon-wenhao"
                    style={{ verticalAlign: "middle" }}
                  ></i>
                </Tooltip>

                {/* <IntegerStep /> */}
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
                <Tooltip title="prompt text">
                  <i
                    className="iconfont icon-wenhao"
                    style={{ verticalAlign: "middle" }}
                  ></i>
                </Tooltip>
                {/* <DecimalStep /> */}
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
                <Tooltip title="prompt text">
                  <i
                    className="iconfont icon-wenhao"
                    style={{ verticalAlign: "middle" }}
                  ></i>
                </Tooltip>
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
                      High temperature ligation/hybridization based error
                      correction
                    </Option>
                    <Option value="ErrASE(Mic)">ErrASE</Option>
                    <Option value="Nuclease">
                      Nnuclease based error correction
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
                  onOk={skipSynthesis}
                  onCancel={handleCancel}
                  okText="Skip"
                >
                  <i
                    className="iconfont icon-warning-circle"
                    style={{ fontSize: 40, color: "red" }}
                  ></i>
                  <p>
                    Synthesis is the basic process of the error simulation
                    stage.{" "}
                  </p>
                  <p>Skipping this step means skipping the whole stage. </p>
                  <p>Do you still want to skip it?</p>
                </Modal>
              </div>
            </Card>
          </div>
        </Col>
        <Col>
          <Card
            style={{ marginLeft: 10, marginTop: 20, height: 510, width: 530 }}
          >
            <div>
              <span>The parameter settings are referenced from :</span>
            </div>
            <div style={{ margin: "0 0 30px 0" }}>
              After synthesis simulation, the situation of oligonucleotides pool
              as follows:
            </div>
            <Area {...config} />
            <Button style={{ margin: " 40px 200px" }}>Continue</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

Synthesis.defaultProps = new SynthesisProps();
