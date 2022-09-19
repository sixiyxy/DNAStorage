import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Bar } from '@ant-design/plots';


const Graphs: React.FC = () => {

  const data = [
    {
      name: '无纠错码',
      value: 16,
      type: '索引区',
    },
    {
      name: 'Hamming码',
      value: 16,
      type: '索引区',
    },
    {
      name: 'RS码',
      value: 16,
      type: '索引区',
    },
    {
      name: '无纠错码',
      value: 160,
      type: '信息区',
    },
    {
      name: 'Hamming码',
      value: 150,
      type: '信息区',
    },
    {
      name: 'RS码',
      value: 140,
      type: '信息区',
    }
  ];

  const config:any = {
    data: data.reverse(),
    isStack: true,
    xField: 'value',
    yField: 'name',
    seriesField: 'type',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'left', 'middle', 'right'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: 'interval-adjust-position',
        }, // 数据标签防遮挡
        {
          type: 'interval-hide-overlap',
        }, // 数据标签文颜色自动调整
        {
          type: 'adjust-color',
        },
      ],
    },
  };
  return <Bar {...config} />;
};
export default Graphs;


