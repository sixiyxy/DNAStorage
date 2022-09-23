import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Bar } from '@ant-design/plots';

const Graphs: React.FC = (props:any) => {
  
  const data = [
    {
      name: 'WithoutVerifycode',
      value: 0,
      type: '索引区',
    },
    {
      name: 'HammingCode',
      value: 0,
      type: '索引区',
    },
    {
      name: 'ReedSolomonCode',
      value: 0,
      type: '索引区',
    },
    {
      name: 'WithoutVerifycode',
      value: 0,
      type: '信息区',
    },
    {
      name: 'HammingCode',
      value: 0,
      type: '信息区',
    },
    {
      name: 'ReedSolomonCode',
      value: 0,
      type: '信息区',
    }
  ];  
  const [dataobj,setData]=useState(data)
  // console.log('method：',props.method);

  console.log('props：',props);

  
  const handleClick=()=>{
    if (props.method==='WithoutVerifycode'){
      data[0].value = props.values[1].Indexvalue
      data[3].value = props.values[0].Segvalue
      setData(data)
      console.log(dataobj);
      
    }
    else if(props.method==='HammingCode'){
      data[1].value = props.values[1].Indexvalue
      data[4].value = props.values[0].Segvalue
      setData(data)
      console.log(dataobj);


    }else{
      data[2].value = props.values[1].Indexvalue
      data[5].value = props.values[0].Segvalue
      setData(data)
      console.log(dataobj);

    }
  }
  const config:any = {
    data: dataobj,
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

  
  return (
    <div>
      <button className='btn btn-danger' style={{marginLeft:"650px",marginTop:"10px"}} onClick={handleClick}>作 图</button>
      <Bar {...config} />
    </div>
    
  );
};
export default Graphs;


