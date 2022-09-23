
import { Slider, Switch } from 'antd';
import React, { useState,useRef,useEffect } from 'react';
import { Radio } from 'antd';
import { Button, Popconfirm } from 'antd';

const SaveValue = [{Segvalue:0},{Indexvalue:0}]
var method = ''

const Sliders = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [values,setValues] = useState(SaveValue);
  
  const plainOptions = ['WithoutVerifycode', 'HammingCode', 'ReedSolomonCode'];
  const onChange1 = ({ target: { value } }) => {
    console.log('radio1 checked', value);
    method=value
    console.log(method);
  };
  
 

  //获取segment和index的值
  const onAfterChange_seg = (value1) => {
    console.log("onAfterChange: ", value1);
    SaveValue[0].Segvalue = value1;
    setValues(SaveValue);
    //console.log(values);
  };
  const onAfterChange_index = (value2) => {
    console.log("onAfterChange: ", value2);
    SaveValue[1].Indexvalue = value2;
    setValues(SaveValue)
    console.log(values);
  };
 
  const handelClick=()=>{
    alert("确认你的值是正确的吗？")
    props.ParamPass(method,values);
  }

  return (
    <>
      <div style={{paddingLeft:"0px",paddingTop:"20px",fontSize:"16px"}}>
        <strong>Verify Method: </strong>
            <Radio.Group options={plainOptions} onChange={onChange1}  />
        <p style={{fontSize:"14px"}}>Tips: Method details please click the <a href='../Methods'>Method Paper</a></p>
      </div>
      <div>
        {/*Segment length阈值设置条*/}
        <strong style={{ fontSize: "16px" }}>Segment length:</strong>{" "}
        <Slider
          max={200}
          defaultValue={0}
          disabled={disabled}
          onAfterChange={onAfterChange_seg}
        />
        Tips:According to the existing synthesis and sequencing technology, the
        recommended length is 160bits.
        <br />
        <br />
        {/*index length阈值设置条*/}
        <strong style={{ fontSize: "16px" }}>Index length:</strong>{" "}
        <Slider
          max={50}
          defaultValue={0}
          disabled={disabled}
          onAfterChange={onAfterChange_index}
        />
        Tips:According to the existing synthesis and sequencing technology, the
        recommended length is 16bits.
      </div>
      <br />

    <button
          className="btn btn-danger"
          style={{ marginLeft: "650px", marginTop: "10px" }}
          onClick={handelClick}
        >
          Confirm
        </button>   
    </>
  );
};

export default Sliders;
