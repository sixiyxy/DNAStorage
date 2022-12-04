import { Bar, DualAxes, Pie } from "@ant-design/charts";
import { Breadcrumb, Button, Card, Select, Tabs, Table, Spin } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import "./index.less";
import { doPost } from "../../../utils/request";
import { DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_PREFIX } from "../../../common/Config";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
export class SimulationReportProps {
  changeSider?;
  fileId;
  spinflags;
  synthesisData;
  decayData;
  pcrData;
  samplingData;
  sequencingData;
  errorRecoder;
  errorDensity;
  strand;
  setDeSet;
  encodeInfo;
  setdecodeRepoNext;
  decodeRepoNext;
  // controlReport;
  // setControl;
}
interface DataType {
  key: string;
  name1: string;
  value1: any;
}
export const SimulationReport: React.FC<SimulationReportProps> = (props) => {
  const [isClickDown, setDown] = useState(false);
  const downinfo = {
    file_uid: props.fileId,
    type: "simulation",
  };
  const { Option, OptGroup } = Select;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //数据生成

  //环形图数据以及配置
  const synthesisErrorParamData = useMemo(() => {
    return [
      {
        type: "substitute",
        value: Number(props.synthesisData?.error_param?.sub).toFixed(3) * 100,
      },
      {
        type: "insertion",
        value: Number(props.synthesisData?.error_param?.ins).toFixed(3) * 100,
      },
      {
        type: "deletion",
        value: Number(props.synthesisData?.error_param?.del).toFixed(3) * 100,
      },
    ];
  }, [props.synthesisData]);
  const decayErrorParamData = useMemo(() => {
    return [
      {
        type: "substitute",
        value: Number(props.decayData?.error_param?.sub).toFixed(3) * 100,
      },
      {
        type: "insertion",
        value: Number(props.decayData?.error_param?.ins).toFixed(3) * 100,
      },
      {
        type: "deletion",
        value: Number(props.decayData?.error_param?.del).toFixed(3) * 100,
      },
    ];
  }, [props.decayData]);
  const pcrErrorParamData = useMemo(() => {
    return [
      {
        type: "substitute",
        value: Number(props.pcrData?.error_param?.sub).toFixed(3) * 100,
      },
      {
        type: "insertion",
        value: Number(props.pcrData?.error_param?.ins).toFixed(3) * 100,
      },
      {
        type: "deletion",
        value: Number(props.pcrData?.error_param?.del).toFixed(3) * 100,
      },
    ];
  }, [props.pcrData]);
  const sequenceingErrorParamData = useMemo(() => {
    return [
      {
        type: "substitute",
        value: Number(props.sequencingData?.error_param?.sub).toFixed(3) * 100,
      },
      {
        type: "insertion",
        value: Number(props.sequencingData?.error_param?.ins).toFixed(3) * 100,
      },
      {
        type: "deletion",
        value: Number(props.sequencingData?.error_param?.del).toFixed(3) * 100,
      },
    ];
  }, [props.sequencingData]);
  const samplingErrorParamData = useMemo(() => {
    return [
      {
        name: "Percentage",
        value:
          props.samplingData?.sam_ratio <= 0.1
            ? props.samplingData?.sam_ratio * 1000
            : props.samplingData?.sam_ratio * 100,
        type: "Ratio",
      },

      {
        name: "Percentage",
        value:
          props.samplingData?.sam_ratio <= 0.1
            ? 100 - props.samplingData?.sam_ratio * 1000
            : 100 - props.samplingData?.sam_ratio * 100,
        type: "Rest",
      },
    ];
  }, [props.samplingData]);
  const synthesisErrorParamConfig = {
    data: synthesisErrorParamData,
    appendPadding: 10,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
    },
    meta: {
      value: {
        formatter: (val) => {
          return `${val} %`;
        },
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };
  const decayErrorParamConfig = {
    data: decayErrorParamData,
    appendPadding: 10,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
    },
    meta: {
      value: {
        formatter: (val) => {
          return `${val} %`;
        },
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };
  const pcrErrorParamConfig = {
    data: pcrErrorParamData,
    appendPadding: 10,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
    },
    meta: {
      value: {
        formatter: (val) => {
          return `${val} %`;
        },
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };
  const sequenceErrorParamConfig = {
    data: sequenceingErrorParamData,
    appendPadding: 10,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
    },
    meta: {
      value: {
        formatter: (val) => {
          return `${val} %`;
        },
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };
  const samplingErrorParamConfig = {
    data: samplingErrorParamData,
    isStack: true,
    xField: "value",
    yField: "name",
    seriesField: "type",
    maxBarWidth: 50,
    height: 200,
    label: {
      // 可手动配置 label 数据标签位置
      position: "middle",
      // 'left', 'middle', 'right'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: "interval-adjust-position",
        }, // 数据标签防遮挡
        {
          type: "interval-hide-overlap",
        }, // 数据标签文颜色自动调整
        {
          type: "adjust-color",
        },
      ],
    },
    meta: {
      value: {
        formatter: (value: any) => {
          return `${value}%`;
        },
      },
    },
  };

  const columnData = useMemo(() => {
    return [
      {
        step: "synthesis",
        value: props.errorRecoder?.SYN ? Math.log(props.errorRecoder?.SYN.n) : 0,
        type: "correct sequence",
      },
      {
        step: "synthesis",
        value: props.errorRecoder?.SYN ? Math.log(props.errorRecoder?.SYN.e) : 0,
        type: "error sequence",
      },
      {
        step: "decay",
        value: props.errorRecoder?.DEC ? Math.log(props.errorRecoder?.DEC.n) : null,
        type: "correct sequence",
      },
      {
        step: "decay",
        value: props.errorRecoder?.DEC ? Math.log(props.errorRecoder?.DEC.e) : null,
        type: "error sequence",
      },
      {
        step: "pcr",
        value: props.errorRecoder?.PCR ? Math.log(props.errorRecoder?.PCR.n) : null,
        type: "correct sequence",
      },
      {
        step: "pcr",
        value: props.errorRecoder?.PCR ? Math.log(props.errorRecoder?.PCR.e) : null,
        type: "error sequence",
      },
      {
        step: "sample",
        value: props.errorRecoder?.SAM ? Math.log(props.errorRecoder?.SAM.n) : null,
        type: "correct sequence",
      },
      {
        step: "sample",
        value: props.errorRecoder?.SAM ? Math.log(props.errorRecoder?.SAM.e) : null,
        type: "error sequence",
      },
      {
        step: "sequence",
        value: props.errorRecoder?.SEQ ? Math.log(props.errorRecoder?.SEQ.n) : null,
        type: "correct sequence",
      },
      {
        step: "sequence",
        value: props.errorRecoder?.SEQ ? Math.log(props.errorRecoder?.SEQ.e) : null,
        type: "error sequence",
      },
    ];
  }, [props.errorRecoder]);

  const lineData = useMemo(() => {
    return [
      {
        step: "synthesis",
        count: props.errorRecoder?.SYN ? Math.log(props.errorRecoder?.SYN["+"]) : 0,
        name: "insert",
      },
      {
        step: "synthesis",
        count: props.errorRecoder?.SYN ? Math.log(props.errorRecoder?.SYN["-"]) : 0,
        name: "delete",
      },
      {
        step: "synthesis",
        count: props.errorRecoder?.SYN ? Math.log(props.errorRecoder?.SYN.s) : 0,
        name: "substitute",
      },
      {
        step: "decay",
        count: props.errorRecoder?.DEC ? Math.log(props.errorRecoder?.DEC["+"]) : null,
        name: "insert",
      },
      {
        step: "decay",
        count: props.errorRecoder?.DEC ? Math.log(props.errorRecoder?.DEC["-"]) : null,
        name: "delete",
      },
      {
        step: "decay",
        count: props.errorRecoder?.DEC ? Math.log(props.errorRecoder?.DEC.s) : null,
        name: "substitute",
      },
      {
        step: "pcr",
        count: props.errorRecoder?.PCR ? Math.log(props.errorRecoder?.PCR["+"]) : null,
        name: "insert",
      },
      {
        step: "pcr",
        count: props.errorRecoder?.PCR ? Math.log(props.errorRecoder?.PCR["-"]) : null,
        name: "delete",
      },
      {
        step: "pcr",
        count: props.errorRecoder?.PCR ? Math.log(props.errorRecoder?.PCR.s) : null,
        name: "substitute",
      },
      {
        step: "sample",
        count: props.errorRecoder?.SAM ? Math.log(props.errorRecoder?.SAM["+"]) : null,
        name: "insert",
      },
      {
        step: "sample",
        count: props.errorRecoder?.SAM ? Math.log(props.errorRecoder?.SAM["-"]) : null,
        name: "delete",
      },
      {
        step: "sample",
        count: props.errorRecoder?.SAM ? Math.log(props.errorRecoder?.SAM.s) : null,
        name: "substitute",
      },
      {
        step: "sequence",
        count: props.errorRecoder?.SEQ ? Math.log(props.errorRecoder?.SEQ["+"]) : null,
        name: "insert",
      },
      {
        step: "sequence",
        count: props.errorRecoder?.SEQ ? Math.log(props.errorRecoder?.SEQ["-"]) : null,
        name: "delete",
      },
      {
        step: "sequence",
        count: props.errorRecoder?.SEQ ? Math.log(props.errorRecoder?.SEQ.s) : null,
        name: "substitute",
      },
    ];
  }, [props.errorRecoder]);
  console.log(lineData);
  const dualConfig = {
    data: [columnData, lineData],
    xField: "step",
    yField: ["value", "count"],
    // yAxis: {
    //   value: {
    //     tickMethod: "log",
    //   },
    //   count: {

    //   },
    // },
    yAxis: {
      value: {
        title: {
          text: "ln(y1)",
          offset: 60,
          // rotate:14.13
        },
      },
      count: {
        title: {
          text: "ln(y2)",
          offset: 60,
          // rotate:14.10
        },
      },
    },
    xAxis: {
      title: {
        text: "Stage",
        offset: 50,
      },
    },
    meta: {
      value: {
        formatter: (value: any) => {
          return `${value.toFixed(2)}`;
        },
      },
      count: {
        formatter: (value: any) => {
          return `${value.toFixed(2)}`;
        },
      },
    },
    geometryOptions: [
      {
        geometry: "column",
        isStack: true,
        seriesField: "type",
        columnWidthRatio: 0.4,
      },
      {
        geometry: "line",
        seriesField: "name",
      },
    ],
  };

  const errorDensityConfig = {
    data: props.errorDensity || [],
    isStack: true,
    isPercent: true,
    xField: "count",
    yField: "type",
    seriesField: "error",
    maxBarWidth: 100,
    height: 400,
    barWidthRatio: 0.4,
    yAxis: {
      title: {
        text: "Stage",
        offset: 80,
        rotate: 17.26,
      },
      label: {
        formatter: (val) => {
          if (val === "SYN") {
            return "Synthesis";
          } else if (val === "DEC") {
            return "Decay";
          } else if (val === "PCR") {
            return "PCR";
          } else if (val === "SAM") {
            return "Sampling";
          } else {
            return "Sequencing";
          }
        },
      },
    },
    xAxis: {
      title: {
        text: "Percentage",
        offset: 50,
      },
    },
    // isPercent: true,
    label: {
      // 可手动配置 label 数据标签位置
      position: "left",
      // 'left', 'middle', 'right'
      // 可配置附加的布局方法
      content: (item: any) => {
        return item.value.toFixed(2);
      },
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: "interval-adjust-position",
        }, // 数据标签防遮挡
        {
          type: "interval-hide-overlap",
        }, // 数据标签文颜色自动调整
        {
          type: "adjust-color",
        },
      ],
    },
    // tooltip:{
    //   position:'bottom',
    //   customContent:(title,data)=>{
    //     return (`<div>
    //     </br>
    //     <h3>Erro counts</h3>
    //     </br>
    //       <h3>0 : ${props.errorDensity} </h3>
    //       </br>
    //       <h3>1 : ${props.index} </h3>
    //       </br>
    //       <h3>2 : ${veri} </h3>
    //       </br>
    //       <h3>3 : ${props.seg} </h3>
    //       </br>
    //       <h3>4 : ${props.index} </h3>
    //       </br>
    //       <h3>5 : ${veri} </h3>
    //       </br>
    //       <h3>6 : ${veri} </h3>
    //     </div>`)
    //   }
    // }
    // tooltip: {
    //   type: {
    //     formatter: (value: any) => {
    //       return `${value}个`;
    //     },
    //   },
    // },
  };

  const DownloadURL = () => {
    setDown(true);
    axios
      .post(API_PREFIX + "/download", downinfo, { responseType: "blob" })
      .then(function (response) {
        console.log(response.data);
        const link = document.createElement("a"); //创建一个a标签
        const blob = new Blob([response.data]); //实例化一个blob出来
        link.style.display = "none";
        link.href = URL.createObjectURL(blob); //将后端返回的数据通过blob转换为一个地址
        //设置下载下来后文件的名字以及文件格式
        link.setAttribute(
          "download",
          `SimulationReport-${props.fileId}.` + `${"zip"}` //upload为下载的文件信息 可以在外层包一个函数 将upload作为参数传递进来
        );
        document.body.appendChild(link);
        link.click(); //下载该文件
        document.body.removeChild(link);
      })
      .catch(function (error) {
        console.log(error);
      });
    setDown(false);
  };
  const handleNext = () => {
    props.setDeSet(true);
    props.setdecodeRepoNext(true)
    props.changeSider(["0-2-0"]);
  };
  const columns1: ColumnsType<DataType> = [
    {
      title: "Setting",
      dataIndex: "name1",
      // width: "55%",
      align: "center",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "Information",
      dataIndex: "value1",
      align: "center",
    },
  ];
  const data1: DataType[] = [
    {
      key: "1",
      name1: "Synthesis number",
      value1: props.synthesisData?.synthesis_number,
    },
    {
      key: "2",
      name1: "Synthesis yield",
      value1: props.synthesisData?.synthesis_yield,
    },
    {
      key: "3",
      name1: "Synthesis method",
      value1: props.synthesisData?.synthesis_method,
    },
  ];
  const data2: DataType[] = [
    {
      key: "1",
      name1: "Storage host",
      value1: props.decayData?.storage_host,
    },
    {
      key: "2",
      name1: "Months of storage",
      value1: props.decayData?.months_of_storage,
    },
    {
      key: "3",
      name1: "Decay loss rate",
      value1: props.decayData?.decay_loss_rate,
    },
  ];
  const data3: DataType[] = [
    {
      key: "1",
      name1: "Pcr polymerase",
      value1: props.pcrData?.pcr_polymerase,
    },
    {
      key: "2",
      name1: "Pcr cycle",
      value1: props.pcrData?.pcr_cycle,
    },
    {
      key: "3",
      name1: "Pcr prob",
      value1: props.pcrData?.pcr_prob,
    },
  ];
  const data4: DataType[] = [
    {
      key: "1",
      name1: "Sequencing depth",
      value1: props.sequencingData?.seq_depth,
    },
    {
      key: "2",
      name1: "Sequencing method",
      value1: props.sequencingData?.seq_meth,
    },
  ];

  return (
    <div className="simulation-report-wrapper">
      <div className="simulation-report-nav-wrapper">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to="/home">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/services">Services</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/services/wholeprocess">Simulation</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Report</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="simulation-report-content-wrapper">
        <Spin tip="Loading..." size="large" spinning={props.spinflags}>
          <Card
            title="Steps Review"
            headStyle={{ backgroundColor: "#99CCFF", fontSize: "18px" }}
          >
            <Tabs defaultActiveKey="1" size={"large"} type="card">
              <Tabs.TabPane tab="Synthesis" key="1" disabled={props.synthesisData === undefined}>
                <div className="TabSYN">
                  <Table
                    columns={columns1}
                    dataSource={data1}
                    size={"small"}
                    pagination={{ position: ["none"] }}
                  />
                </div>
                <Pie className="pie" {...synthesisErrorParamConfig} />
                <p id="illstr">
                  <strong>Error rate distribution of synthesis</strong>
                </p>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Decay" key="2" disabled={props.decayData === undefined}>
                <div className="TabSYN">
                  <Table
                    columns={columns1}
                    dataSource={data2}
                    size={"small"}
                    // showHeader={false}
                    pagination={{ position: ["none"] }}
                  />
                  <br />
                </div>

                <Pie className="pie" {...decayErrorParamConfig} />
                <p id="illstr">
                  <strong>Error rate distribution of decay</strong>
                </p>
              </Tabs.TabPane>
              <Tabs.TabPane tab="PCR" key="3" disabled={props.pcrData === undefined}>
                <div className="TabSYN">
                  <Table
                    columns={columns1}
                    dataSource={data3}
                    size={"small"}
                    // showHeader={false}
                    pagination={{ position: ["none"] }}
                  />
                </div>

                <Pie className="pie" {...pcrErrorParamConfig} />
                <p id="illstr">
                  <strong>Error rate distribution of PCR</strong>
                </p>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Sampling" key="4" disabled={props.samplingData === undefined}>
                {/* sam_ratio: {props.samplingData?.sam_ratio} */}
                <p style={{ margin: "10px 0 0 0px" }}>The sampling ratio you chose is:</p>
                <div style={{ margin: "40px 80px 0 80px" }}>
                  <Bar {...samplingErrorParamConfig} />
                </div>
                <br />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Sequencing" key="5" disabled={props.sequencingData === undefined}>
                <div className="TabSYN">
                  <Table
                    columns={columns1}
                    dataSource={data4}
                    size={"small"}
                    // showHeader={false}
                    pagination={{ position: ["none"] }}
                  />
                </div>

                <Pie className="pie" {...sequenceErrorParamConfig} />
                <p id="illstr">
                  <strong>Error rate distribution of sequencing</strong>
                </p>
              </Tabs.TabPane>
            </Tabs>
          </Card>
          <Card
            title="Simulation Result"
            headStyle={{ backgroundColor: "#99CCFF", fontSize: "18px" }}
          >
            <p style={{ textAlign: "justify" }}>
              During simulation, sequence density, distribution and error occurrance vary from
              stages.Down below, we provide a Sequence distribution and a Error counts diagram to
              illustrate these change tendency. Simple explanation are provided beneath the diagrams
              and more details could be found in tutorial.{" "}
            </p>

            <h3>
              <strong>Sequences distribution</strong>
            </h3>
            <div style={{ padding: "50px 150px 0 150px" }}>
              <DualAxes {...dualConfig} />
            </div>
            <div
              style={{
                textAlign: "justify",
                fontSize:"16px",
                color: "#748189",
                padding: "20px 200px 0 180px",
              }}
            >
              <br></br>
              <strong>
                After simulation, the number of strands in oligo pool is : {props.strand}
              </strong>
              <br></br>
              <br></br>
              During the whole process, the number of sequences, causes of erors and proposrtions of
              different types of errors change from time to time. Therefore, we counted and compared
              the numbers of DNA strands with errors and the left 100% correct DNA strands for each
              stage using stacked column chart, as well as showed the changes of the strands numbers
              that contained different types of errors using line chart. Since the difference
              between the data is too large, each data y here is percented using ln(y).
            </div>
        
            <h3><strong>Error counts</strong> </h3>
            <div style={{padding:"30px 200px 0 150px"}}>
            <p style={{paddingBottom:"1px",fontSize:"14px",color: "#748189"}}>Error number in a strand: </p>
              <Bar {...errorDensityConfig} />
            </div>
            <div
              style={{
                textAlign: "justify",

                color: "#748189",
                padding: "30px 200px 50px 190px",
              }}
            >
              <p>
                Because the effects of occurred errors are cumulative, It is reasonable that as the
                simulation proceeds, both the percentage of strands with errors as well as the
                average error number for all strands will increase. Thus, we count the number of
                strands with a different number of errors for the different stages as shown above.
                As we could see, the later the stage is, the higher the number of chains with errors
                is.
              </p>
              <div className="simulation-report-button-group">
                <Button
                  shape="round"
                  size="large"
                  type="primary"
                  icon={<DownloadOutlined />}
                  style={{ backgroundColor: isClickDown ? "#99CCFF" : " " }}
                  onClick={DownloadURL}
                >
                  Download
                </Button>
                <Button
                  shape="round"
                  size="large"
                  type="primary"
                  onClick={handleNext}
                  disabled={props.decodeRepoNext}
                  style={{ marginLeft: "100px", width: "100px" }}
                >
                  Next
                </Button>
                {/* <Button shape="round" size="large" type="primary" onClick={handleBack} style={{marginLeft:"100px",width:"100px"}}>
                  Back
                </Button> */}
              </div>
            </div>
          </Card>
        </Spin>
      </div>
    </div>
  );
};

SimulationReport.defaultProps = new SimulationReportProps();
