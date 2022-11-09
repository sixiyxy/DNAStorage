import { Area, Datum, DualAxes, Pie, Scatter,Bar} from "@ant-design/charts";
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
  var downinfo={
    "file_uid":props.fileId,
    "type":"simulation"
  }
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
  const [errorRecoder, setErrorRecode] = useState();
  const [errorDensity, setErrorDensity] = useState();
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
  useEffect(()=>{
    window.scrollTo(0,0);
  },[])
  useEffect(() => {
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
        setErrorRecode(response?.data?.Error_Recorder);
        setErrorDensity(response?.data?.Error_Density);
        setLoading(false);
      });
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
  const samplingErrorParamData = useMemo(()=>{
    return [
      {
        name:"Percentage",
        value:samplingData?.sam_ratio*1000,
        type: "Ratio Percentage",
      },

      {
        name:"Percentage",
        value:100-samplingData?.sam_ratio*1000,
        type: "Others",
      },
    ]
  },[samplingData])
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
        // content: "Error\nParam",
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
        // content: "Error\nParam",
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
        // content: "Error\nParam",
      },
    },
  };
  const samplingErrorParamConfig={
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
    meta:{
      value:{
        formatter:(value:any)=>{
          
          return `${value}%`
          }
       
      },
    },
    
  }
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
        value: errorRecoder?.SYN
          ? Math.log(errorRecoder?.SYN.n)
          : 0,
        type: "total",
      },
      {
        step: "synthesis",
        value: errorRecoder?.SYN
          ? Math.log(errorRecoder?.SYN.e)
          : 0,
        type: "error",
      },
      {
        step: "decay",
        value: errorRecoder?.DEC ? Math.log(errorRecoder?.DEC.n) : 0,
        type: "total",
      },
      {
        step: "decay",
        value: errorRecoder?.DEC ? Math.log(errorRecoder?.DEC.e) : 0,
        type: "error",
      },
      {
        step: "pcr",
        value: errorRecoder?.PCR ? Math.log(errorRecoder?.PCR.n) : 0,
        type: "total",
      },
      {
        step: "pcr",
        value: errorRecoder?.PCR ? Math.log(errorRecoder?.PCR.e) : 0,
        type: "error",
      },
      {
        step: "sample",
        value: errorRecoder?.SAM ? Math.log(errorRecoder?.SAM.n) : 0,
        type: "total",
      },
      {
        step: "sample",
        value: errorRecoder?.SAM ? Math.log(errorRecoder?.SAM.e) : 0,
        type: "error",
      },
      {
        step: "sequence",
        value: errorRecoder?.SEQ ? Math.log(errorRecoder?.SEQ.n) : 0,
        type: "total",
      },
      {
        step: "sequence",
        value: errorRecoder?.SEQ ? Math.log(errorRecoder?.SEQ.e) : 0,
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
        count: errorRecoder?.SYN
          ? Math.log(errorRecoder?.SYN["+"])
          : 0,
        name: "insert",
      },
      {
        step: "synthesis",
        count: errorRecoder?.SYN
          ? Math.log(errorRecoder?.SYN["-"])
          : 0,
        name: "delete",
      },
      {
        step: "synthesis",
        count: errorRecoder?.SYN
          ? Math.log(errorRecoder?.SYN.s)
          : 0,
        name: "substitute",
      },
      {
        step: "decay",
        count: errorRecoder?.DEC ? Math.log(errorRecoder?.DEC["+"]) : 0,
        name: "insert",
      },
      {
        step: "decay",
        count: errorRecoder?.DEC ? Math.log(errorRecoder?.DEC["-"]) : 0,
        name: "delete",
      },
      {
        step: "decay",
        count: errorRecoder?.DEC ? Math.log(errorRecoder?.DEC.s) : 0,
        name: "substitute",
      },
      {
        step: "pcr",
        count: errorRecoder?.PCR ? Math.log(errorRecoder?.PCR["+"]) : 0,
        name: "insert",
      },
      {
        step: "pcr",
        count: errorRecoder?.PCR ? Math.log(errorRecoder?.PCR["-"]) : 0,
        name: "delete",
      },
      {
        step: "pcr",
        count: errorRecoder?.PCR ? Math.log(errorRecoder?.PCR.s) : 0,
        name: "substitute",
      },
      {
        step: "sample",
        count: errorRecoder?.SAM ? Math.log(errorRecoder?.SAM["+"]) : 0,
        name: "insert",
      },
      {
        step: "sample",
        count: errorRecoder?.SAM ? Math.log(errorRecoder?.SAM["-"]) : 0,
        name: "delete",
      },
      {
        step: "sample",
        count: errorRecoder?.SAM ? Math.log(errorRecoder?.SAM.s) : 0,
        name: "substitute",
      },
      {
        step: "sequence",
        count: errorRecoder?.SEQ ? Math.log(errorRecoder?.SEQ["+"]) : 0,
        name: "insert",
      },
      {
        step: "sequence",
        count: errorRecoder?.SEQ ? Math.log(errorRecoder?.SEQ["-"]) : 0,
        name: "delete",
      },
      {
        step: "sequence",
        count: errorRecoder?.SEQ ? Math.log(errorRecoder?.SEQ.s) : 0,
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
  //   data: errorDensity || [],
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
  const ErrorDensityConfig={
    data: errorDensity||[],
    isStack: true,
    isPercent: true,
    xField: "count",
    yField: "type",
    seriesField: "error",
    maxBarWidth: 100,
    height: 400,
    // barWidthRatio:0.7,
    // isPercent: true,
    label: {  
      // 可手动配置 label 数据标签位置
      position: "left",
      // 'left', 'middle', 'right'
      // 可配置附加的布局方法
      content: (item:any) => {
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
    
  }

  //接口配置
  const params = useMemo(() => {
    return {
      simulation_key: props.fileId,
      // file_uid: "1565536927137009664",
    };
  }, []);

  const DownloadURL = () => {
    // console.log(props.encodeurl);
    // console.log(props.fileURL);
    axios
      .post("http://localhost:5000/download", downinfo,{responseType: 'blob'})
      .then(function (response) {
        console.log(response.data);
        const link = document.createElement('a');  //创建一个a标签
        const blob = new Blob([response.data]);             //实例化一个blob出来
        link.style.display = 'none';       
        link.href = URL.createObjectURL(blob);    //将后端返回的数据通过blob转换为一个地址
    //设置下载下来后文件的名字以及文件格式
        link.setAttribute(
      'download',
      `${props.fileId}.` + `${'zip'}`,     //upload为下载的文件信息 可以在外层包一个函数 将upload作为参数传递进来
    );
    document.body.appendChild(link);
    link.click();                            //下载该文件
    document.body.removeChild(link);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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
      {/* <Button size="large" style={{ width: 100 }} onClick={handleOk}>
        OK
      </Button> */}
      <Card style={{ width: 800, height: 500,marginLeft:"20px"}}>
        <Tabs defaultActiveKey="1" style={{fontSize:"16px"}}>
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
            <Bar
              {...samplingErrorParamConfig}
              style={{ margin: "80px 0 0 0" }}
            />
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
      <Card style={{ width: 800, height: 500,marginLeft:"20px"}}>
        <DualAxes {...dualConfig} />
      </Card>
      <Card style={{ width: 1000, height: 500,marginLeft:"20px"}}>
        <Bar {...ErrorDensityConfig} />
      </Card>
      <Button shape="round" size="large" type="primary" style={{margin:"40px 0px 0px 350px"}} onClick={DownloadURL}>Download</Button>
      {/* <Card style={{ width: 800, height: 500 }}></Card> */}
    </div>
  );
};

SimulationReport.defaultProps = new SimulationReportProps();
