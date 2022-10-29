import {
  Area,
  Datum,
  FUNNEL_CONVERSATION_FIELD,
  Histogram,
} from "@ant-design/charts";
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

export class SynthesisProps {
  changeSider;
  fileId;
  // setIsSynthesis;
}

export const Synthesis: React.FC<SynthesisProps> = (props) => {
  const { Option, OptGroup } = Select;

  const [yieldValue, setYieldValue] = useState(0.99);
  const [cycleValue, setCycleValue] = useState(30);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState();
  const [method, setMethod] = useState("ErrASE");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alreadyRun, setAlreadyRun] = useState(false);
  const [group, setGroup] = useState();

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
  const handleReset = function () {
    setCycleValue(30);
    setMethod("ErrASE");
    setYieldValue(0.99);
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
    setAlreadyRun(true);
    axios
      .post("http://localhost:5000/simu_synthesis", params)
      .then(function (response) {
        console.log("synthesis response", response);
        setGroup(response?.data?.density_group);
        setData(response?.data?.syn_density);
        setHrefLink(response?.data?.synthesis_method_reference);
        setLoading(false);
      });
    // props.setIsSynthesis(true);
  };
  // const handleContinue = () => {
  //   props.changeSider(["0-1-1"]);
  // };

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
  // const chartData = useMemo(() => {
  //   return data?.map((item) => {
  //     return {
  //       copyNumber: item[0],
  //       density: Number(item[1].toFixed(3)),
  //     };
  //   });
  // }, [data]);
  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      // file_uid: "1565536927137009664",
      synthesis_number: cycleValue,
      synthesis_yield: yieldValue,
      synthesis_method: method,
    };
  }, [cycleValue, yieldChange, method]);
  // console.log("params", params);
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
  }, [data, group]);

  return (
    <div className="synthesis-content">
      <Card
        title="Note"
        bordered={false}
        style={{ marginLeft: 20, marginTop: 20 }}
      >
        <p>
          This stage would simulate error occurrences that happened under the
          real application.
        </p>
        <p>
          You could adjust the parameters for each stage accordingly or simply
          skip some stages.
        </p>
        <p>It is also possible to skip the whole error simulation stage.</p>
      </Card>
      <div className="function-content">
        <Card>
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
              margin: "20px 0",
            }}
          >
            <Button
              size="large"
              style={{ width: 100 }}
              onClick={handleOk}
              disabled={alreadyRun}
            >
              OK
            </Button>
            {/* <Button
              size="large"
              style={{ width: 100 }}
              onClick={showModal}
              disabled={alreadyRun}
            >
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
            <div style={{ margin: "10px 0 0 0" }}>
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
    </div>
  );
};

Synthesis.defaultProps = new SynthesisProps();
