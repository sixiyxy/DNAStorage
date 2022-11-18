import React, { useState, useEffect, useMemo } from "react";
import { Column } from "@ant-design/plots";
import { useParams } from "react-router-dom";

const GLgraph = (props) => {
  const data = useMemo(() => {
    return props.GC;
  }, [props.GC]);
  console.log("gcdata", data);
  const config = {
    data,
    xField: "x_value",
    yField: "y_value",
    width: 400,
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
    yAxis: {
      title: {
        text: "Sequence number",
        offset: 60,
      },
    },
    xAxis: {
      title: {
        text: "Singal DNA sequence GC contant %  ",
        offset: 50,
      },
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

export default GLgraph;
