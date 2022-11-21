import { Card, Slider } from "antd";
import React, { useState, useEffect } from "react";
import { Radio, Space } from "antd";
import { Link } from "react-router-dom";
import { HighlightTwoTone, BulbTwoTone } from "@ant-design/icons";
import "./index.less";

const Sliders = (props) => {
  const [disabled, setDisabled] = useState(false);
 

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
    0: '0',
    26: '26',
    37: '37',
    100: '100'
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
            marks={marks} 
            step={null}
            // max={200}
            // min={120}
            value={props.Segment}
            // step={8}
            // defaultValue={160}
            // disabled={disabled}
            onAfterChange={onAfterChange_seg}
            onChange={onChange_seg}
            style={{ marginLeft: "20px", marginTop: "20px" }}
          />
          {/* <span style={{ marginLeft: "20px" }}>
            According to the existing synthesis and sequencing technology, the recommended length is
            160 bits.
          </span> */}
          <br />
          <br />
          {/*index length阈值设置条*/}
          <div style={{ marginTop: "30px" }}>
            <strong style={{ fontSize: "19px" }}>
              {" "}
              <HighlightTwoTone /> Index length : {props.processRes.index_length} bits
            </strong>{" "}
            {/* <Slider
              max={30}
              min={props.indexchange ? 16 : 18}
              value={props.indexment}
              defaultValue={20}
              step={2}
              disabled={disabled}
              onAfterChange={onAfterChange_index}
              onChange={onChange_inde}
              style={{ marginLeft: "20px", marginTop: "20px" }}
            />
            <span style={{ marginLeft: "20px" }}>
              According to the existing synthesis and sequencing technology, the recommended length
              is 20 bits.
            </span> */}
          </div>
        </div>
        
      </Card>
    </div>
  );
};

export default Sliders;
