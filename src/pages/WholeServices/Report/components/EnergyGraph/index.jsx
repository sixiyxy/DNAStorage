import React, { useState, useEffect,useMemo } from 'react';
import { Column } from '@ant-design/plots';
import { useParams } from 'react-router-dom';

const EnergyGraph = (props) => {

  const data =useMemo(() => {
    return props.energy ? props.energy : []
}, [props.energy]);
  const config = {
    data,
    xField: 'x_value',
    yField: 'y_value',
    width:400,
    intervalPadding:0,
    label: {
      position: 'top',
      style: {
        fill: '#FFFFFF',
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
        text:'minimum free energy (kcal/mol)',
        offset:50,
      },
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      x: {
        alias: 'x_value',
      },
      y: {
        alias: 'y_value',
      },
      range:{
        alias:'range'
      }
    },
    tooltip: {
      showTitle:false,
      fields: ["y_value","range"],
    },
  };
  return <Column {...config} />;
};

export default EnergyGraph;