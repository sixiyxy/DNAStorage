import React, { useState, useEffect,useMemo } from 'react';
import { Column } from '@ant-design/plots';
import { useParams } from 'react-router-dom';

const EnergyGraph = (props) => {

  const data =useMemo(() => {
    return props.energy
}, [props.energy]);

  const config = {
    data,
    xField: 'x',
    yField: 'y',
    width:400,
    intervalPadding:0,
    label: {
      // 可手动配置 label 数据标签位置
      position: 'top',
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
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
      x: {
        alias: 'x',
      },
      y: {
        alias: 'y',
      },
      range:{
        alias:'range'
      }
    },
    tooltip: {
      showTitle:false,
      fields: ["y","range"],
    },
  };
  return <Column {...config} />;
};

export default EnergyGraph;