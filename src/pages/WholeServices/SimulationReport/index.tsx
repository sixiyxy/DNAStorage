import { Bar, DualAxes, Pie } from "@ant-design/charts";
import { Breadcrumb, Button, Card, Select, Tabs, Table, Spin } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import "./index.less";
import { doPost } from "../../../utils/request";
import axios from "axios";
import { API_PREFIX } from "../../../common/Config";
import type { ColumnsType } from "antd/es/table";
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
  // controlReport;
  // setControl;
}

export const SimulationReport: React.FC<SimulationReportProps> = (props) => {
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
        value: props.samplingData?.sam_ratio <= 0.1? props.samplingData?.sam_ratio * 1000 : props.samplingData?.sam_ratio*100,
        type: "Ratio",
      },

      {
        name: "Percentage",
        value: props.samplingData?.sam_ratio <= 0.1? (100 - props.samplingData?.sam_ratio * 1000): 100-props.samplingData?.sam_ratio*100,
        type: "Rest",
      },
    ];
  }, [props.samplingData]);
  const synthesisErrorParamConfig = {
    data: synthesisErrorParamData,
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  const decayErrorParamConfig = {
    data: decayErrorParamData,
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  const pcrErrorParamConfig = {
    data: pcrErrorParamData,
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  const sequenceErrorParamConfig = {
    data: sequenceingErrorParamData,
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  const samplingErrorParamConfig = {
    data: samplingErrorParamData,
    isStack: true,
    xField: "value",
    yField: "name",
    seriesField: "type",
    maxBarWidth: 60,
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
        type: "left",
      },
      {
        step: "synthesis",
        value: props.errorRecoder?.SYN ? Math.log(props.errorRecoder?.SYN.e) : 0,
        type: "error",
      },
      {
        step: "decay",
        value: props.errorRecoder?.DEC ? Math.log(props.errorRecoder?.DEC.n) : null,
        type: "left",
      },
      {
        step: "decay",
        value: props.errorRecoder?.DEC ? Math.log(props.errorRecoder?.DEC.e) : null,
        type: "error",
      },
      {
        step: "pcr",
        value: props.errorRecoder?.PCR ? Math.log(props.errorRecoder?.PCR.n) : null,
        type: "left",
      },
      {
        step: "pcr",
        value: props.errorRecoder?.PCR ? Math.log(props.errorRecoder?.PCR.e) : null,
        type: "error",
      },
      {
        step: "sample",
        value: props.errorRecoder?.SAM ? Math.log(props.errorRecoder?.SAM.n) : null,
        type: "left",
      },
      {
        step: "sample",
        value: props.errorRecoder?.SAM ? Math.log(props.errorRecoder?.SAM.e) : null,
        type: "error",
      },
      {
        step: "sequence",
        value: props.errorRecoder?.SEQ ? Math.log(props.errorRecoder?.SEQ.n) : null,
        type: "left",
      },
      {
        step: "sequence",
        value: props.errorRecoder?.SEQ ? Math.log(props.errorRecoder?.SEQ.e) : null,
        type: "error",
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
          rotate:14.13
        },
      },
      count: {
        title: {
          text: "ln(y2)",
          offset: 60,
          rotate:14.10
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
        // lineStyle: ({ name }) => {
        //   if (name === 'a') {
        //     return {
        //       lineDash: [1, 4],
        //       opacity: 1,
        //     };
        //   }

        //   return {
        //     opacity: 0.5,
        //   };
        // },
      },
    ],
  };

  // //气泡图数据以及配置
  // const scatterConfig = {
  //   // width: 800,
  //   // height: 200,
  //   autoFit: true,
  //   appendPadding: 16,
  //   data: props.errorDensity || [],
  //   xField: "error",
  //   yField: "type",
  //   sizeField: "count",
  //   size: [5, 50],
  //   shape: "circle",
  //   colorField: "type",
  //   color: ["#ffd500", "#82cab2", "#193442", "#d18768", "#7e827a"],
  //   pointStyle: {
  //     fillOpacity: 0.8,
  //     stroke: "#bbb",
  //   },
  //   tooltip: {
  //     showTitle: false,
  //     showMarkers: false,
  //     fields: ["count", "error", "type"],
  //   },
  //   xAxis: {
  //     grid: {
  //       line: {
  //         style: {
  //           stroke: "#eee",
  //         },
  //       },
  //     },
  //     line: null,
  //   },
  //   label: {
  //     formatter: (item) => {
  //       return item.city;
  //     },
  //     offsetY: 12,
  //     style: {
  //       fontSize: 12,
  //     },
  //   },
  //   yAxis: {
  //     min: 0,
  //     line: null,
  //   },
  // };
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
        offset: 50,
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
  const handleBack=()=>{
    window.history.back()
  }
  //接口配置


  const DownloadURL = () => {
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
  };
  const handleNext=()=>{
    props.setDeSet(true)
    props.changeSider(["0-2-0"])
  }
  return (
    <div className="simulation-report-wrapper">
      <div className="simulation-report-nav-wrapper">
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
      <div className="simulation-report-content-wrapper">
        <Spin tip="Loading..." size="large" spinning={props.spinflags}>
          <Card title="Stage summary" headStyle={{ backgroundColor: "#99CCFF" }}>
          <p style={{
                textAlign: "justify",
              }}>This part reviews user settings.</p>
            <Tabs defaultActiveKey="1" size={"large"}>
              <Tabs.TabPane tab="Synthesis" key="1" disabled={props.synthesisData === undefined}>
                <div className="TabSYN" id='table'>
                  Synthesis number : {props.synthesisData?.synthesis_number}
                  <br />
                  Synthesis yield : {props.synthesisData?.synthesis_yield}
                  <br />
                  Synthesis method : {props.synthesisData?.synthesis_method}
                  <br />
                </div>
                <p id='illstr'>The error rate distribution of your chosen synthesis method is as follows:</p>
              
                <Pie className="pie" {...synthesisErrorParamConfig} />
              
              </Tabs.TabPane>
              <Tabs.TabPane tab="Decay" key="2" disabled={props.decayData === undefined}>
                <div className="TabDEC">
                  Storage host : {props.decayData?.storage_host}
                  <br />
                  Months of storage : {props.decayData?.months_of_storage}
                  <br />
                  Decay loss rate : {props.decayData?.decay_loss_rate}
                  <br />
                  {/* storage_host_parameter_reference :
            <br />
            {props.decayData?.storage_host_parameter_reference?.map((link, index) => {
              return (
                <>
                  <a style={{ margin: "0 0 0 5px" }} href={link} target="_blank" rel="noreferrer">
                    {link}
                  </a>
                  <br />
                </>
              );
            })} */}
                </div>
                <p id='illstr'>The error rate distribution of your chosen storage host is as follows:</p>
                <Pie className="pie" {...decayErrorParamConfig} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="PCR" key="3" disabled={props.pcrData === undefined}>
                <div className="TabPCR">
                  Pcr polymerase : {props.pcrData?.pcr_polymerase}
                  <br />
                  Pcr cycle : {props.pcrData?.pcr_cycle}
                  <br />
                  Pcr prob : {props.pcrData?.pcr_prob}
                  <br />
                  {/* pcr_method_reference : */}
                  {/* <br />
                  {props.pcrData?.pcr_method_reference?.map((link, index) => {
                    return (
                      <>
                        <a
                          style={{ margin: "0 0 0 5px" }}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link}
                        </a>
                        <br />
                      </>
                    );
                  })} */}
                </div>
                <p id='illstr'>The error rate distribution of your chosen pcr polymerase is as follows:</p>
                <Pie className="pie" {...pcrErrorParamConfig} />
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
                <div className="TabSEQ">
                  Sequencing depth : {props.sequencingData?.seq_depth}
                  <br />
                  Sequencing method : {props.sequencingData?.seq_meth}
                  <br />
                  {/* seq_method_reference :
            <br />
            {props.sequencingData?.seq_method_reference?.map((link, index) => {
              return (
                <>
                  <a style={{ margin: "0 0 0 5px" }} href={link} target="_blank" rel="noreferrer">
                    {link}
                  </a>
                  <br />
                </>
              );
            })} */}
                </div>
                <p id='illstr'>The error rate distribution of your chosen sequencing method is as follows:</p>
                <Pie className="pie" {...sequenceErrorParamConfig} />
              </Tabs.TabPane>
            </Tabs>
          </Card>
          <Card title="Simulation result" headStyle={{ backgroundColor: "#99CCFF" }}>
          <p style={{"textAlign":"justify"}}>During simulation, sequence density, distribution and error occurrance vary from stages.Down below, we provide a Sequence distribution and a Error counts diagram to illustrate these change tendency. Simple explanation are provided beneath the diagrams and more details could be found in tutorial. </p>
            {/* <h3>Sequences Distribution</h3> */}
            <h3>Sequences distribution</h3>
            <div style={{padding:"50px 150px 0 150px"}}>
              {/* <h3>Sequences Distribution</h3> */}
              <DualAxes {...dualConfig} />
            </div>
            <div
              style={{
                textAlign: "justify",
                
                color: "#748189",
                padding:"20px 200px 0 180px"
              }}
            >
              <br></br>
              <strong>After simulation, the number of strands in oligo pool is : {props.strand}</strong><br></br><br></br>
              During the whole process, the number of sequences, causes of erors and proposrtions of
              different types of errors change from time to time. Therefore, we counted and compared
              the numbers of DNA strands with errors and the left 100% correct DNA strands for each
              stage using stacked column chart, as well as showed the changes of the strands numbers
              that contained different types of errors using line chart. Since the difference
              between the data is too large, each data y here is percented using ln(y).
            </div>
          {/* </Card> */}
          {/* <Card> */}
            {/* <h3>Error Counts </h3> */}
            <h3>Error counts </h3>
            <div style={{padding:"50px 200px 0 150px"}}>
              
              <Bar {...errorDensityConfig} />
            </div>
            <div
              style={{
                textAlign: "justify",
                
                color: "#748189",
                padding:"20px 200px 50px 180px"
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
                <Button shape="round" size="large" type="primary" onClick={DownloadURL}>
                  Download
                </Button>
                <Button shape="round" size="large" type="primary" onClick={handleNext} style={{marginLeft:"100px",width:"100px"}}>
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
