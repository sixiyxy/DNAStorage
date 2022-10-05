import React, { useState, useEffect,useMemo } from "react";
import ReactDOM from "react-dom";
import { Bar } from "@ant-design/plots";

const Graphs: React.FC = (props: any) => {

  //const [dataobj, setData] = useState(data);
  //const [setData,setMethod] = props
  // const handleClick = () => {
  //   if (props.method === "WithoutVerifycode") {
  //     data[0].value = props.values[1].Indexvalue;
  //     data[3].value = props.values[0].Segvalue;
  //     setData(data);
  //     //console.log(dataobj);
  //   } else if (props.method === "HammingCode") {
  //     data[1].value = props.values[1].Indexvalue;
  //     data[4].value = props.values[0].Segvalue;
  //     setData(data);
  //     //console.log(dataobj);
  //   } else {
  //     data[2].value = props.values[1].Indexvalue;
  //     data[5].value = props.values[0].Segvalue;
  //     setData(data);
  //     //console.log(dataobj);
  //   }
  // };
  // const SegChange = (value: number) => {
  //   if (isNaN(value)) {
  //     return;
  //   }
  //   props.setSeg(props.seg);
  // };
  console.log('graph',props.seg);
  
  const memoizedValue = useMemo(() => {
      return ([
        {
          name: props.method,
          value: props.seg,
          type: "索引区",
        },
        
        {
          name: props.method,
          value: props.index,
          type: "信息区",
        }
      ])
  }, [props.seg,props.index,props.method]);

  const config: any = {
    data: memoizedValue,
    isStack: true,
    xField: "value",
    yField: "name",
    seriesField: "type",
    maxBarWidth:40,
    height:200,
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
  };

  return (
    <div>
      <Bar {...config} />
    </div>
  );
};
export default Graphs;
