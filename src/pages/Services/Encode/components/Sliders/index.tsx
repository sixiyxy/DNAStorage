import { Slider, Switch } from 'antd';
import React, { useState } from 'react';

const Sliders: React.FC = () => {
  const [disabled, setDisabled] = useState(false);

  //获取segment和index的值
  const onAfterChange_seg = (value: number | [number, number]) => {
    console.log('onAfterChange: ', value);
  };
  const onAfterChange_index = (value: number | [number, number]) => {
    console.log('onAfterChange: ', value);
  };
  return (
    <>
      {/*Segment length阈值设置条*/}
      <strong style={{fontSize:"16px"}}>Segment length:</strong> <Slider max={200} defaultValue={0} disabled={disabled} onAfterChange={onAfterChange_seg}/>
      Tips:According to the existing synthesis and sequencing technology, the recommended length is 160bits.<br/><br/>
      {/*index length阈值设置条*/}
      <strong style={{fontSize:"16px"}}>Index length:</strong> <Slider max={50} defaultValue={0} disabled={disabled} onAfterChange={onAfterChange_index}/>
      Tips:According to the existing synthesis and sequencing technology, the recommended length is 16bits.

    </>
  );
};

export default Sliders;