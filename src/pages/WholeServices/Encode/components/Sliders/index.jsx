import { Card, Slider } from "antd";
import React, { useState, useEffect } from "react";
import { Radio, Space } from "antd";
import { Link } from "react-router-dom";
import { HighlightTwoTone, BulbTwoTone } from "@ant-design/icons";
import "./index.less";

const Sliders = (props) => {

  
  //获取segment和index的值
  const onAfterChange_seg = (value1) => {
    console.log('segmentAfter',value1);
    props.setSeg(value1);
    
  };
  // const onAfterChange_index = (value2) => {
  //   props.setIndex(value2);
  // };
  const onChange_seg = (value1) => {
    console.log('segmentChange',value1);
    props.SetSegvalue(value1);
    
  };
  // const onChange_inde = (value2) => {
  //   props.Setindexment(value2);
  // };
  // useEffect(() => {
  //   props.ParamPass(method, values);
  // }, [count]);
  const marks = {
    0: ' ',
    26: ' ',
    37: ' ',
    100: ' '
  };
  return (
    <div className="encode-sider-wrapper">
      <Card>
        <div>
          {/*Segment length阈值设置条*/}
          <strong style={{ fontSize: "19px" }}>
            {" "}
            <HighlightTwoTone /> Segment length
          </strong>
          <Slider
            marks={props.processRes.bar} 
            step={null}
            disabled={props.Zan && props.value==='SrcCode' ? true:false}
            max={props.processRes.bar ? Number(Object.keys(props.processRes.bar)[Object.keys(props.processRes.bar).length-1]) : 200}
            min={Number(Object.keys(props.processRes.bar ? props.processRes.bar : {80:' '} )[0])}
            value={props.Segment}
            // step={8}
            defaultValue={Number(Object.keys(props.processRes.bar ? props.processRes.bar : {80:' '} )[0])}
            // disabled={disabled}
            onAfterChange={onAfterChange_seg}
            onChange={onChange_seg}
            style={{ marginLeft: "20px", marginTop: "20px" }}
          />
          
          <div style={{ marginTop: "30px" }}>
            <strong style={{ fontSize: "19px" }}>
              {" "}
              <HighlightTwoTone /> Index length : {props.Zan? 0 : props.processRes.index_length} bits
            </strong>{" "}
          </div>
        </div>
        
      </Card>
    </div>
  );
};

export default Sliders;
