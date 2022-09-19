import { Slider, Switch } from 'antd';
import React, { useState } from 'react';
import { Checkbox } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
const SaveValue = [{Segvalue:0},{Indexvalue:0}]

const Sliders: React.FC = () => {
  const [disabled, setDisabled] = useState(false);
  const [value,setValue] = useState(SaveValue);
  const [Method,setMethod] = useState('')
  const onChange = (checkedValues: CheckboxValueType[]) => {
    console.log('checked = ', checkedValues);
    setMethod(checkedValues[0])
    
    console.log(checkedValues[0]);
    console.log(typeof(checkedValues[0]));
    
    
  };
  
  const options = [
    { label: 'WithoutVerifycode', value: 'Without Verify code'},
    { label: 'HammingCode', value: 'HammingCode'},
    { label: 'ReedSolomonCode', value: 'Reed Solomon Code'},
  ];
  //获取segment和index的值
  const onAfterChange_seg = (value1: number) => {
    console.log('onAfterChange: ', value1);
    SaveValue[0].Segvalue = value1;
    setValue(SaveValue)
    console.log(value);
    
  };
  const onAfterChange_index = (value2: number) => {
    console.log('onAfterChange: ', value2);
    SaveValue[1].Indexvalue = value2;
    setValue(SaveValue)
    console.log(value);
  };
  const handleClick =(event:any)=>{
     console.log();
  }
  return (
    <>
      <div style={{paddingLeft:"0px",paddingTop:"20px",fontSize:"16px"}}>
        <strong>Verify Method: </strong><Checkbox.Group options={options} onChange={onChange} />
        <p style={{fontSize:"14px"}}>Tips: Method details please click the <a href='../Methods'>Method Paper</a></p>
      </div>
      <div>
        {/*Segment length阈值设置条*/}
        <strong style={{fontSize:"16px"}}>Segment length:</strong> <Slider max={200} defaultValue={0} disabled={disabled} onAfterChange={onAfterChange_seg}/>
        Tips:According to the existing synthesis and sequencing technology, the recommended length is 160bits.<br/><br/>
        {/*index length阈值设置条*/}
        <strong style={{fontSize:"16px"}}>Index length:</strong> <Slider max={50} defaultValue={0} disabled={disabled} onAfterChange={onAfterChange_index}/>
        Tips:According to the existing synthesis and sequencing technology, the recommended length is 16bits.
      </div>
      <br/>
      <button className='btn btn-danger' style={{marginLeft:"650px",marginTop:"10px"}} onClick={handleClick}>Confirm</button>
    </>
  );
};

export default Sliders;