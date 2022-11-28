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
  setTime;
  clickEXM;
  time3min;
}

export const SimulationReport: React.FC<SimulationReportProps> = (props) => {
  const downinfo = {
    file_uid: props.fileId,
    type: "simulation",
  };
  const { Option, OptGroup } = Select;

  const [sequencingDepth, setSequencingDepth] = useState(1);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState();
  const [method, setMethod] = useState("ill_PairedEnd");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [densityData, setDensityData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spinflag, setSpin] = useState(true);
  const [synthesisData, setSynthesisData] = useState();
  const [decayData, setDacayData] = useState();
  const [pcrData, setPcrData] = useState();
  const [samplingData, setSamplingData] = useState();
  const [sequencingData, setSequenceingData] = useState();
  const [errorRecoder, setErrorRecode] = useState();
  const [errorDensity, setErrorDensity] = useState();
  const [strand,setStrand] = useState(0)
  
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setNoDataTipsShow(false);
      const resp = await doPost("/simu_repo", { body: params });
      setSpin(false);
      console.log("report", resp);
      setSynthesisData(resp.SYN);
      setDacayData(resp.DEC);
      setPcrData(resp.PCR);
      setSamplingData(resp.SAM);
      setSequenceingData(resp.SEQ);
      setErrorRecode(resp.Error_Recorder);
      setErrorDensity(resp.Error_Density);
      setLoading(false);
      setStrand(resp.Strand_Count)
    }

    fetchData();
    // axios
    //   .post("http://localhost:5000//simu_repo", params)
    //   .then(function (response) {
    //     console.log("report", response);
    //     setSynthesisData(response?.data?.synthesis);
    //     setDacayData(response?.data?.decay);
    //     setPcrData(response?.data?.pcr);
    //     setSamplingData(response?.data?.sample);
    //     setSequenceingData(response?.data?.sequence);
    //     setErrorRecode(response?.data?.Error_Recorder);
    //     setErrorDensity(response?.data?.Error_Density);
    //     setLoading(false);
    //   });
  }, [props.fileId]);
  // const handleOk = () => {
  //   setLoading(true);
  //   setNoDataTipsShow(false);
  //   axios
  //     .post("http://localhost:5000//simu_repo", params)
  //     .then(function (response) {
  //       console.log("report", response);
  //       setSynthesisData(response?.data?.synthesis);
  //       setDacayData(response?.data?.decay);
  //       setPcrData(response?.data?.pcr);
  //       setSamplingData(response?.data?.sample);
  //       setSequenceingData(response?.data?.sequence);
  //       setErrorRecode(response?.data?.Error_Recorder);
  //       setLoading(false);
  //     });
  // };
  const handleContinue = () => {
    props.changeSider(["0-2"]);
  };

  //数据生成

  //环形图数据以及配置
  const synthesisErrorParamData = useMemo(() => {
    return [
      {
        type: "substitute",
        value: Number(synthesisData?.error_param?.sub).toFixed(3) * 100,
      },
      {
        type: "insertion",
        value: Number(synthesisData?.error_param?.ins).toFixed(3) * 100,
      },
      {
        type: "deletion",
        value: Number(synthesisData?.error_param?.del).toFixed(3) * 100,
      },
    ];
  }, [synthesisData]);
  const decayErrorParamData = useMemo(() => {
    return [
      {
        type: "substitute",
        value: Number(decayData?.error_param?.sub).toFixed(3) * 100,
      },
      {
        type: "insertion",
        value: Number(decayData?.error_param?.ins).toFixed(3) * 100,
      },
      {
        type: "deletion",
        value: Number(decayData?.error_param?.del).toFixed(3) * 100,
      },
    ];
  }, [decayData]);
  const pcrErrorParamData = useMemo(() => {
    return [
      {
        type: "substitute",
        value: Number(pcrData?.error_param?.sub).toFixed(3) * 100,
      },
      {
        type: "insertion",
        value: Number(pcrData?.error_param?.ins).toFixed(3) * 100,
      },
      {
        type: "deletion",
        value: Number(pcrData?.error_param?.del).toFixed(3) * 100,
      },
    ];
  }, [pcrData]);
  const sequenceingErrorParamData = useMemo(() => {
    return [
      {
        type: "substitute",
        value: Number(sequencingData?.error_param?.sub).toFixed(3) * 100,
      },
      {
        type: "insertion",
        value: Number(sequencingData?.error_param?.ins).toFixed(3) * 100,
      },
      {
        type: "deletion",
        value: Number(sequencingData?.error_param?.del).toFixed(3) * 100,
      },
    ];
  }, [sequencingData]);
  const samplingErrorParamData = useMemo(() => {
    return [
      {
        name: "Percentage",
        value: samplingData?.sam_ratio <= 0.1? samplingData?.sam_ratio * 1000 : samplingData?.sam_ratio*100,
        type: "Ratio",
      },

      {
        name: "Percentage",
        value: samplingData?.sam_ratio <= 0.1? (100 - samplingData?.sam_ratio * 1000): 100-samplingData?.sam_ratio*100,
        type: "Rest",
      },
    ];
  }, [samplingData]);
  const synthesisErrorParamConfig = {
    data:synthesisErrorParamData,
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
    // data: synthesisErrorParamData,
    // angleField: "value",
    // colorField: "type",
    // radius: 1,
    // innerRadius: 0.6,
    // width: 200,
    // height: 200,
    // label: {
    //   // type: "inner",
    //   offset: "-50%",
    //   content: "{value}%",
    //   style: {
    //     textAlign: "center",
    //     fontSize: 14,
    //   },
    // },
    // interactions: [
    //   {
    //     type: "element-selected",
    //   },
    //   {
    //     type: "element-active",
    //   },
    // ],
    // statistic: {
    //   title: false,
    //   content: {
    //     style: {
    //       whiteSpace: "pre-wrap",
    //       overflow: "hidden",
    //       textOverflow: "ellipsis",
    //     },
    //     // content: "Error\nParam",
    //   },
    // },
  
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
  //混合图数据以及配置
  // const columnData = useMemo(() => {
  //   return [
  //     {
  //       step: "synthesis",
  //       value: errorRecoder?.Synthesis
  //         ? errorRecoder?.Synthesis.n
  //         : 0,
  //       type: "total",
  //     },
  //     {
  //       step: "synthesis",
  //       value: errorRecoder?.Synthesis ? errorRecoder?.Synthesis.e : 0,
  //       type: "error",
  //     },
  //     {
  //       step: "decay",
  //       value: errorRecoder?.Decay ? errorRecoder?.Decay.n : 0,
  //       type: "total",
  //     },
  //     {
  //       step: "decay",
  //       value: errorRecoder?.Decay ? errorRecoder?.Decay.e : 0,
  //       type: "error",
  //     },
  //     {
  //       step: "pcr",
  //       value: errorRecoder?.PCR ? errorRecoder?.PCR.n : 0,
  //       type: "total",
  //     },
  //     {
  //       step: "pcr",
  //       value: errorRecoder?.PCR ? errorRecoder?.PCR.e : 0,
  //       type: "error",
  //     },
  //     {
  //       step: "sample",
  //       value: errorRecoder?.Sam ? errorRecoder?.Sam.n : 0,
  //       type: "total",
  //     },
  //     {
  //       step: "sample",
  //       value: errorRecoder?.Sam ? errorRecoder?.Sam.e : 0,
  //       type: "error",
  //     },
  //     {
  //       step: "sequence",
  //       value: errorRecoder?.Seq ? errorRecoder?.Seq.n : 0,
  //       type: "total",
  //     },
  //     {
  //       step: "sequence",
  //       value: errorRecoder?.Seq ? errorRecoder?.Seq.e : 0,
  //       type: "error",
  //     },
  //   ];
  // }, [errorRecoder]);
  const columnData = useMemo(() => {
    return [
      {
        step: "synthesis",
        value: errorRecoder?.SYN ? Math.log(errorRecoder?.SYN.n) : 0,
        type: "total",
      },
      {
        step: "synthesis",
        value: errorRecoder?.SYN ? Math.log(errorRecoder?.SYN.e) : 0,
        type: "error",
      },
      {
        step: "decay",
        value: errorRecoder?.DEC ? Math.log(errorRecoder?.DEC.n) : null,
        type: "total",
      },
      {
        step: "decay",
        value: errorRecoder?.DEC ? Math.log(errorRecoder?.DEC.e) : null,
        type: "error",
      },
      {
        step: "pcr",
        value: errorRecoder?.PCR ? Math.log(errorRecoder?.PCR.n) : null,
        type: "total",
      },
      {
        step: "pcr",
        value: errorRecoder?.PCR ? Math.log(errorRecoder?.PCR.e) : null,
        type: "error",
      },
      {
        step: "sample",
        value: errorRecoder?.SAM ? Math.log(errorRecoder?.SAM.n) : null,
        type: "total",
      },
      {
        step: "sample",
        value: errorRecoder?.SAM ? Math.log(errorRecoder?.SAM.e) : null,
        type: "error",
      },
      {
        step: "sequence",
        value: errorRecoder?.SEQ ? Math.log(errorRecoder?.SEQ.n) : null,
        type: "total",
      },
      {
        step: "sequence",
        value: errorRecoder?.SEQ ? Math.log(errorRecoder?.SEQ.e) : null,
        type: "error",
      },
    ];
  }, [errorRecoder]);
  // const lineData = useMemo(() => {
  //   return [
  //     {
  //       step: "synthesis",
  //       count: errorRecoder?.Synthesis ? errorRecoder?.Synthesis["+"] : 0,
  //       name: "insert",
  //     },
  //     {
  //       step: "synthesis",
  //       count: errorRecoder?.Synthesis ? errorRecoder?.Synthesis["-"] : 0,
  //       name: "delete",
  //     },
  //     {
  //       step: "synthesis",
  //       count: errorRecoder?.Synthesis ? errorRecoder?.Synthesis.s : 0,
  //       name: "substitute",
  //     },
  //     {
  //       step: "decay",
  //       count: errorRecoder?.Decay ? errorRecoder?.Decay["+"] : 0,
  //       name: "insert",
  //     },
  //     {
  //       step: "decay",
  //       count: errorRecoder?.Decay ? errorRecoder?.Decay["-"] : 0,
  //       name: "delete",
  //     },
  //     {
  //       step: "decay",
  //       count: errorRecoder?.Decay ? errorRecoder?.Decay.s : 0,
  //       name: "substitute",
  //     },
  //     {
  //       step: "pcr",
  //       count: errorRecoder?.PCR ? errorRecoder?.PCR["+"] : 0,
  //       name: "insert",
  //     },
  //     {
  //       step: "pcr",
  //       count: errorRecoder?.PCR ? errorRecoder?.PCR["-"] : 0,
  //       name: "delete",
  //     },
  //     {
  //       step: "pcr",
  //       count: errorRecoder?.PCR ? errorRecoder?.PCR.s : 0,
  //       name: "substitute",
  //     },
  //     {
  //       step: "sample",
  //       count: errorRecoder?.Sam ? errorRecoder?.Sam["+"] : 0,
  //       name: "insert",
  //     },
  //     {
  //       step: "sample",
  //       count: errorRecoder?.Sam ? errorRecoder?.Sam["-"] : 0,
  //       name: "delete",
  //     },
  //     {
  //       step: "sample",
  //       count: errorRecoder?.Sam ? errorRecoder?.Sam.s : 0,
  //       name: "substitute",
  //     },
  //     {
  //       step: "sequence",
  //       count: errorRecoder?.Seq ? errorRecoder?.Seq["+"] : 0,
  //       name: "insert",
  //     },
  //     {
  //       step: "sequence",
  //       count: errorRecoder?.Seq ? errorRecoder?.Seq["-"] : 0,
  //       name: "delete",
  //     },
  //     {
  //       step: "sequence",
  //       count: errorRecoder?.Seq ? errorRecoder?.Seq.s : 0,
  //       name: "substitute",
  //     },
  //   ];
  // }, [errorRecoder]);
  const lineData = useMemo(() => {
    return [
      {
        step: "synthesis",
        count: errorRecoder?.SYN ? Math.log(errorRecoder?.SYN["+"]) : 0,
        name: "insert",
      },
      {
        step: "synthesis",
        count: errorRecoder?.SYN ? Math.log(errorRecoder?.SYN["-"]) : 0,
        name: "delete",
      },
      {
        step: "synthesis",
        count: errorRecoder?.SYN ? Math.log(errorRecoder?.SYN.s) : 0,
        name: "substitute",
      },
      {
        step: "decay",
        count: errorRecoder?.DEC ? Math.log(errorRecoder?.DEC["+"]) : null,
        name: "insert",
      },
      {
        step: "decay",
        count: errorRecoder?.DEC ? Math.log(errorRecoder?.DEC["-"]) : null,
        name: "delete",
      },
      {
        step: "decay",
        count: errorRecoder?.DEC ? Math.log(errorRecoder?.DEC.s) : null,
        name: "substitute",
      },
      {
        step: "pcr",
        count: errorRecoder?.PCR ? Math.log(errorRecoder?.PCR["+"]) : null,
        name: "insert",
      },
      {
        step: "pcr",
        count: errorRecoder?.PCR ? Math.log(errorRecoder?.PCR["-"]) : null,
        name: "delete",
      },
      {
        step: "pcr",
        count: errorRecoder?.PCR ? Math.log(errorRecoder?.PCR.s) : null,
        name: "substitute",
      },
      {
        step: "sample",
        count: errorRecoder?.SAM ? Math.log(errorRecoder?.SAM["+"]) : null,
        name: "insert",
      },
      {
        step: "sample",
        count: errorRecoder?.SAM ? Math.log(errorRecoder?.SAM["-"]) : null,
        name: "delete",
      },
      {
        step: "sample",
        count: errorRecoder?.SAM ? Math.log(errorRecoder?.SAM.s) : null,
        name: "substitute",
      },
      {
        step: "sequence",
        count: errorRecoder?.SEQ ? Math.log(errorRecoder?.SEQ["+"]) : null,
        name: "insert",
      },
      {
        step: "sequence",
        count: errorRecoder?.SEQ ? Math.log(errorRecoder?.SEQ["-"]) : null,
        name: "delete",
      },
      {
        step: "sequence",
        count: errorRecoder?.SEQ ? Math.log(errorRecoder?.SEQ.s) : null,
        name: "substitute",
      },
    ];
  }, [errorRecoder]);
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

 
  const ErrorDensityConfig = {
    data: errorDensity || [],
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
    //       <h3>0 : ${errorDensity} </h3>
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

  //接口配置
  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      upload_flag: "True",
      // file_uid: "1565536927137009664",
    };
  }, []);

  const DownloadURL = () => {
    // console.log(props.encodeurl);
    // console.log(props.fileURL);
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
          `${props.fileId}.` + `${"zip"}` //upload为下载的文件信息 可以在外层包一个函数 将upload作为参数传递进来
        );
        document.body.appendChild(link);
        link.click(); //下载该文件
        document.body.removeChild(link);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  
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
       
        <Spin tip={props.time3min? "Please waiting 3 mins!": "Loading..."} size="large" spinning={spinflag}>
          <Card title="Stage summary" headStyle={{ backgroundColor: "#99CCFF"}}>
          <p style={{
                textAlign: "justify",
              }}>This part reviews user settings.</p>
            <Tabs defaultActiveKey="1" style={{paddingLeft:"20px",fontSize:"14px"}}>
              <Tabs.TabPane tab="Synthesis" key="1" disabled={synthesisData === undefined}>
                <div className="TabSYN" id='table'>
                  
                  Synthesis number  : {synthesisData?.synthesis_number}
                  <br />
                  Synthesis yield   : {synthesisData?.synthesis_yield}
                  <br />
                  Synthesis method  : {synthesisData?.synthesis_method}
                  <br />
                  <br />
                </div>
                <p id='illstr'>The error rate distribution of your chosen synthesis method is as follows:</p>

                <Pie className="pie" {...synthesisErrorParamConfig} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Decay" key="2" disabled={decayData === undefined}>
                <div className="TabDEC">
                  Storage host : {decayData?.storage_host}
                  <br />
                  Months of storage : {decayData?.months_of_storage}
                  <br />
                  Decay loss rate : {decayData?.decay_loss_rate}
                  <br />
                  <br />
                  {/* storage_host_parameter_reference :
            <br />
            {decayData?.storage_host_parameter_reference?.map((link, index) => {
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
              <Tabs.TabPane tab="PCR" key="3" disabled={pcrData === undefined}>
                <div className="TabPCR">
                  Pcr polymerase: {pcrData?.pcr_polymerase}
                  <br />
                  Pcr cycle: {pcrData?.pcr_cycle}
                  <br />
                  Pcr probability: {pcrData?.pcr_prob}
                  <br />
                  <br />
                </div>
                <p id='illstr'>The error rate distribution of your chosen pcr polymerase is as follows:</p>
                <Pie className="pie" {...pcrErrorParamConfig} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Sampling" key="4" disabled={samplingData === undefined}>
                {/* sam_ratio: {samplingData?.sam_ratio} */}
                <p style={{ margin: "10px 0 0 0px" }}>The sampling ratio you chose is:</p>

                <Bar {...samplingErrorParamConfig}  />
                
                <br />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Sequencing" key="5" disabled={sequencingData === undefined}>
                <div className="TabSEQ">
                  Sequencing depth : {sequencingData?.seq_depth}
                  <br />
                  Sequencing method : {sequencingData?.seq_meth}
                  <br />
                  <br />
                </div>
                <p id='illstr'>The error rate distribution of your chosen sequencing method is as follows:</p>
                <Pie className="pie" {...sequenceErrorParamConfig} />
              </Tabs.TabPane>
            </Tabs>
          </Card>
          <Card title="Simulation result" headStyle={{ backgroundColor: "#99CCFF"}}>
          <p style={{"textAlign":"justify"}}>During simulation, sequence density, distribution and error occurrance vary from stages.Down below, we provide a Sequence distribution and a Error counts diagram to illustrate these change tendency. Simple explanation are provided beneath the diagrams and more details could be found in tutorial. </p>
          <h3>Sequences distribution</h3>
            <div style={{padding:"50px 150px 0 150px"}}>
            
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
              <strong>After simulation, the number of strands in oligo pool is : {strand}</strong><br></br><br></br>
              During the whole process, the number of sequences, causes of erors and proposrtions of
              different types of errors change from time to time. Therefore, we counted and compared
              the numbers of DNA strands with errors and the left 100% correct DNA strands for each
              stage using stacked column chart, as well as showed the changes of the strands numbers
              that contained different types of errors using line chart. Since the difference
              between the data is too large, each data x here is percented using ln(x).
            </div>
          {/* </Card>
          <Card>
            <h3>Error Counts </h3> */}
              <h3>Error counts </h3>
            <div style={{padding:"50px 220px 0 150px"}}>
                {/* <h3>Error Counts </h3> */}
              <Bar {...ErrorDensityConfig} />
            </div>
            <div
              style={{
                textAlign: "justify",
                color: "#748189",
                padding:"20px 200px 0 180px"
              }}
            >
              <p>
                Because the effects of occurred errors are cumulative, it is reasonable that as the
                simulation proceeds, both the percentage of strands with errors as well as the
                average error number for all strands will increase. Thus, we count the number of
                strands with different number of errors for the different stages as shown above.
                As we could see, the later the stage is, the higher the number of chains with errors
                is.
              </p>
              <div className="simulation-report-button-group">
                <Button shape="round" size="large" type="primary" onClick={DownloadURL}>
                  Download
                </Button>
              </div>
            </div>
          </Card>
        </Spin>
      </div>
    </div>
  );
};

SimulationReport.defaultProps = new SimulationReportProps();
