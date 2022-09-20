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
import React, { useEffect, useState } from "react";
import "./index.less";
export class SynthesisProps {
  changeSider;
}

export const Synthesis: React.FC<SynthesisProps> = (props) => {
  const IntegerStep = () => {
    const [inputValue, setInputValue] = useState(10);

    const onChange = (newValue: number) => {
      setInputValue(newValue);
    };

    return (
      <Row>
        <Col span={12}>
          <Slider
            min={10}
            max={50}
            onChange={onChange}
            value={typeof inputValue === "number" ? inputValue : 0}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={10}
            max={50}
            style={{
              margin: "0 16px",
            }}
            value={inputValue}
            onChange={onChange}
          />
        </Col>
      </Row>
    );
  };

  const DecimalStep = () => {
    const [inputValue, setInputValue] = useState(0.98);

    const onChange = (value: number) => {
      if (isNaN(value)) {
        return;
      }

      setInputValue(value);
    };

    return (
      <Row>
        <Col span={12}>
          <Slider
            min={0.98}
            max={0.995}
            onChange={onChange}
            value={typeof inputValue === "number" ? inputValue : 0}
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
            value={inputValue}
            onChange={onChange}
          />
        </Col>
      </Row>
    );
  };

  const { Option } = Select;
  const [Method, setMethod] = useState("Column-Synthesized-Oligos");
  const handleChange = (value: string) => {
    setMethod(value);
  };

  const skipSynthesis = function () {
    props.changeSider("0-2");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
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

                <IntegerStep />
              </div>
              <div className="function-bar">
                <span>Synthesis Yield :</span>
                <Tooltip title="prompt text">
                  <i
                    className="iconfont icon-wenhao"
                    style={{ verticalAlign: "middle" }}
                  ></i>
                </Tooltip>
                <DecimalStep />
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
                  style={{ width: 240, marginLeft: 20 }}
                  onChange={handleChange}
                  value={Method}
                >
                  <Option value="Column-Synthesized-Oligos">
                    Column Synthesized Oligos
                  </Option>
                  <Option value="ErrASE">ErrASE</Option>
                  <Option value="MutS">MutS</Option>
                  <Option value="Consensus-Shuffle">Consensus Shuffle</Option>
                  <Option value="Microarray-based-Ologo-Pools">
                    Microarray based Ologo Pools
                  </Option>
                  <Option value="User-Defined">User Defined</Option>
                </Select>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  margin: "20px 0",
                }}
              >
                <Button size="large" style={{ width: 100 }}>
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
