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
      type: {
        alias: 'x',
      },
      sales: {
        alias: 'y',
      },
    },
  };
  return <Column {...config} />;
};

export default EnergyGraph;