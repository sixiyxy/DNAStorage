import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { Bar } from "@ant-design/plots";
import { Card } from "antd";

const Graphs: React.FC = (props: any) => {
  const [veri, setveri] = useState(0);
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
  // console.log('graph',props.seg);
  // console.log('graph',props.index);
  // console.log('graph',props.method);

  const memoizedValue = useMemo(() => {
    if (props.method === "WithoutVerifycode") {
      setveri(0);
      return [
        {
          name: props.method,
          value: props.seg,
          type: "Index Area",
        },

        {
          name: props.method,
          value: props.index,
          type: "Information Area",
        },
      ];
    }
    if (props.method === "Hamming") {
      let sum=0
      let sub={}
      let sub1={}
      let info={}
      let check={}
      const data1 = [];
      for (var i=1;i<=7;i++){
        sum += 2**i
        if (sum <= props.seg){
        sub = {
                  type: `Hamming${i - 1}`,
                  name: "Hamming",
                  value: 2 ** i,
                };
        check = {
                  type: `check${i - 1}`,
                  name: "Hamming",
                  value: 1,
                };
        data1.push(sub);
        data1.push(check);
      }
        if(sum > props.seg){
          console.log('sum',sum);
          sub = {
                  type: `Hamming${i - 1}`,
                  name: "Hamming",
                  value: props.seg-(sum-2**i),
                };
          data1.push(sub);
          info = {
                  type: "Information Area",
                  name: "Hamming",
                  value: props.index,
                };
          data1.push(info)
          break
        }
      }
      setveri(i - 1);
      console.log('data1',data1);
      return data1; 
    }
   
    if (props.method === "ReedSolomon") {
      setveri(8);
      return [
        {
          name: props.method,
          value: props.seg,
          type: "Index Area",
        },
        {
          name: props.method,
          value: 8,
          type: "check Code Area",
        },
        {
          name: props.method,
          value: props.index,
          type: "Information Area",
        },
      ];
    }
  }, [props.seg, props.index, props.method]);

  const config: any = {
    data: memoizedValue,
    isStack: true,
    xField: "value",
    yField: "name",
    seriesField: "type",
    maxBarWidth: 40,
    height: 200,
    colorField: "type", // 部分图表使用 seriesField
    color: ({ type }) => {
      if (type.search("check") != -1) {
        return "#A81829";
      }
      if (type.search("Information") != -1) {
        return "#006BA2";
      }
    },
    meta: {
      name: {
        alias: "example",
      },
    },
    legend: {
      custom: true,
      items: [
        {
          name: "Payload",
          marker: {
            symbol: "square",
            // style:{
            //   fill: "#6395f9"
            // },
            clickable: false,
          },
        },
        {
          name: "Verify Code",
          marker: {
            symbol: "square",
            style: {
              fill: "red",
            },
            clickable: false,
          },
        },
        {
          name: "Index",
          marker: {
            symbol: "square",
            style: {
              fill: "#006BA2",
            },
            clickable: false,
          },
        },
      ],
    },
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
    yAxis: {
      label: {
        formatter: (val) => `Example`,
      },
    },
    tooltip: {
      position: "bottom",
      customContent: (title, data) => {
        return `<div>
        </br>
        <h3>${props.method}</h3>
        </br>
          <h3>Payload Length : ${props.seg} bits</h3>
          </br>
          <h3>Index Length : ${props.index} bits</h3>
          </br>
          <h3>Verify Code : ${veri} bits</h3>
          </br>
        </div>`;
      },
    },
  };

  return (
    <div className="encode-graph-wrapper">
      <Card >
        <div style={{padding:"20px 250px 0 20px"}}>
        <Bar {...config} />
        </div>
      </Card>
    </div>
  );
};
export default Graphs;
