import React, { useState, useMemo } from "react";
import { Column } from "@ant-design/plots";
import ReactDOM from "react-dom";
import { Area } from "@ant-design/plots";

const HomoGraph = (props) => {
  const data = useMemo(() => {
    console.log(props.homo)
    let objj = {'x_value':0,'y_value':0}
    props.homo.unshift(objj)
    console.log(props.homo)
    return props.homo;
  }, [props.homo]);

  
  const config = {
    data,
    xField: "x_value",
    yField: "y_value",
    width: 400,
    color: "#a8ddb5",
    label: {
      position: "top",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    yAxis:{
      title:{
        text:'Sequence number',
        offset:60,
      }
    },
    
    xAxis: {
      title:{
        text:'Singal DNA sequnce homopolymer length (bp)',
        offset:50,
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

export default HomoGraph;
