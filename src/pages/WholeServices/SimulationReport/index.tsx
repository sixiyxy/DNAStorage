import { Area, Datum, Pie } from "@ant-design/charts";
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
  Tabs,
  Tooltip,
} from "antd";
import React, { useContext, useEffect, useMemo, useState } from "react";
import "./index.less";

import axios from "axios";

export class SimulationReportProps {
  changeSider;
  fileId;
}

export const SimulationReport: React.FC<SimulationReportProps> = (props) => {
  const { Option, OptGroup } = Select;

  const [sequencingDepth, setSequencingDepth] = useState(1);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState();
  const [method, setMethod] = useState("ill_PairedEnd");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [densityData, setDensityData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [synthesisData, setSynthesisData] = useState();
  const [decayData, setDacayData] = useState();
  const [pcrData, setPcrData] = useState();
  const [samplingData, setSamplingData] = useState();
  const [sequencingData, setSequenceingData] = useState();
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
      .post("http://localhost:5000//simu_repo", params)
      .then(function (response) {
        console.log("report", response);
        setSynthesisData(response?.data?.synthesis);
        setDacayData(response?.data?.decay);
        setPcrData(response?.data?.pcr);
        setSamplingData(response?.data?.sample);
        setSequenceingData(response?.data?.sequence);
        setLoading(false);
      });
  };
  const handleContinue = () => {
    props.changeSider(["0-2"]);
  };

  //数据生成

  const synthesisErrorParamData = useMemo(() => {
    return [
      {
        type: "sub",
        value: Number(synthesisData?.error_param?.sub).toFixed(3) * 100,
      },
      {
        type: "ins",
        value: Number(synthesisData?.error_param?.ins).toFixed(3) * 100,
      },
      {
        type: "del",
        value: Number(synthesisData?.error_param?.del).toFixed(3) * 100,
      },
    ];
  }, [synthesisData]);

  const decayErrorParamData = useMemo(() => {
    return [
      {
        type: "sub",
        value: Number(decayData?.error_param?.sub).toFixed(3) * 100,
      },
      {
        type: "ins",
        value: Number(decayData?.error_param?.ins).toFixed(3) * 100,
      },
      {
        type: "del",
        value: Number(decayData?.error_param?.del).toFixed(3) * 100,
      },
    ];
  }, [decayData]);

  const pcrErrorParamData = useMemo(() => {
    return [
      {
        type: "sub",
        value: Number(pcrData?.error_param?.sub).toFixed(3) * 100,
      },
      {
        type: "ins",
        value: Number(pcrData?.error_param?.ins).toFixed(3) * 100,
      },
      {
        type: "del",
        value: Number(pcrData?.error_param?.del).toFixed(3) * 100,
      },
    ];
  }, [pcrData]);
  const sequenceingErrorParamData = useMemo(() => {
    return [
      {
        type: "sub",
        value: Number(sequencingData?.error_param?.sub).toFixed(3) * 100,
      },
      {
        type: "ins",
        value: Number(sequencingData?.error_param?.ins).toFixed(3) * 100,
      },
      {
        type: "del",
        value: Number(sequencingData?.error_param?.del).toFixed(3) * 100,
      },
    ];
  }, [sequencingData]);

  const synthesisErrorParamConfig = {
    data: synthesisErrorParamData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    width: 200,
    height: 200,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}%",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: "Error\nParam",
      },
    },
  };
  const decayErrorParamConfig = {
    data: decayErrorParamData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    width: 200,
    height: 200,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}%",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: "Error\nParam",
      },
    },
  };
  const pcrErrorParamConfig = {
    data: pcrErrorParamData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    width: 200,
    height: 200,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}%",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: "Error\nParam",
      },
    },
  };
  const sequenceErrorParamConfig = {
    data: sequenceingErrorParamData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    width: 200,
    height: 200,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}%",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: "Error\nParam",
      },
    },
  };

  const params = useMemo(() => {
    return {
      simulation_key: props.fileId,
      // file_uid: "1565536927137009664",
    };
  }, []);

  return (
    <div className="sequencing-content">
      <div style={{ margin: 20 }}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <a href="/">Home</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/Services">Service</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Simulation</Breadcrumb.Item>
          <Breadcrumb.Item>Report</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Button size="large" style={{ width: 100 }} onClick={handleOk}>
        OK
      </Button>
      <Card style={{ width: 800, height: 500 }}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane
            tab="Synthesis"
            key="1"
            disabled={synthesisData === undefined}
          >
            synthesis_number: {synthesisData?.synthesis_number}
            <br />
            synthesis_yield: {synthesisData?.synthesis_yield}
            <br />
            synthesis_method: {synthesisData?.synthesis_method}
            <br />
            synthesis_method_reference:
            <br />
            {synthesisData?.synthesis_method_reference?.map((link, index) => {
              return (
                <>
                  <a
                    style={{ margin: "0 0 0 5px" }}
                    href={link}
                    target="_blank"
                  >
                    {link}
                  </a>
                  <br />
                </>
              );
            })}
            <Pie
              {...synthesisErrorParamConfig}
              style={{ margin: "20px 0 0 0" }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Decay" key="2" disabled={decayData === undefined}>
            storage_host: {decayData?.storage_host}
            <br />
            months_of_storage: {decayData?.months_of_storage}
            <br />
            decay_loss_rate: {decayData?.decay_loss_rate}
            <br />
            storage_host_parameter_reference:
            <br />
            {decayData?.storage_host_parameter_reference?.map((link, index) => {
              return (
                <>
                  <a
                    style={{ margin: "0 0 0 5px" }}
                    href={link}
                    target="_blank"
                  >
                    {link}
                  </a>
                  <br />
                </>
              );
            })}
            <Pie {...decayErrorParamConfig} style={{ margin: "20px 0 0 0" }} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="PCR" key="3" disabled={pcrData === undefined}>
            pcr_polymerase: {pcrData?.pcr_polymerase}
            <br />
            pcr_cycle: {pcrData?.pcr_cycle}
            <br />
            pcr_prob: {pcrData?.pcr_prob}
            <br />
            pcr_method_reference:
            <br />
            {pcrData?.pcr_method_reference?.map((link, index) => {
              return (
                <>
                  <a
                    style={{ margin: "0 0 0 5px" }}
                    href={link}
                    target="_blank"
                  >
                    {link}
                  </a>
                  <br />
                </>
              );
            })}
            <Pie {...pcrErrorParamConfig} style={{ margin: "20px 0 0 0" }} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Sampling"
            key="4"
            disabled={samplingData === undefined}
          >
            sam_ratio: {samplingData?.sam_ratio}
            <br />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Sequencing"
            key="5"
            disabled={sequencingData === undefined}
          >
            seq_depth: {sequencingData?.seq_depth}
            <br />
            seq_method: {sequencingData?.seq_meth}
            <br />
            seq_method_reference
            <br />
            {sequencingData?.seq_method_reference?.map((link, index) => {
              return (
                <>
                  <a
                    style={{ margin: "0 0 0 5px" }}
                    href={link}
                    target="_blank"
                  >
                    {link}
                  </a>
                  <br />
                </>
              );
            })}
            <Pie
              {...sequenceErrorParamConfig}
              style={{ margin: "20px 0 0 0" }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* <Card style={{ width: 800, height: 500 }}></Card> */}
    </div>
  );
};

SimulationReport.defaultProps = new SimulationReportProps();
