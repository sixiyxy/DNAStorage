import React, { useState, useMemo } from "react";
import { Column } from "@ant-design/plots";
import ReactDOM from "react-dom";
import { Area } from "@ant-design/plots";

const HomoGraph = (props) => {
  //const [datas, setData] = useState([]);
  const data = useMemo(() => {
    // console.log('Homo',props.homo);
    return props.homo;
  }, [props.homo]);
  // console.log("homodata", data);
  const config = {
    data,
    xField: "x_value",
    yField: "y_value",
    width: 400,
    color: "#a8ddb5",
    label: {
      // 可手动配置 label 数据标签位置
      position: "top",
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: "x_value",
      },
      sales: {
        alias: "y_value",
      },
    },
  };
  return <Column {...config} />;
};

export default HomoGraph;
