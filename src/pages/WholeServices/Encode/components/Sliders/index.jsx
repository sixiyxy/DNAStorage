import { Slider } from "antd";
import React, { useState, useEffect } from "react";
import { Radio, Space } from "antd";
import { Link } from "react-router-dom";
import {
  HighlightTwoTone,
  BulbTwoTone,
} from "@ant-design/icons";

const Sliders = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [count, setCount] = useState(0); //触发标志


  const onChange1 = (e) => {
    setCount(count + 1);
    props.setencodeValue(e.target.value)
    props.setMethod(e.target.value);
  };

  //获取segment和index的值
  const onAfterChange_seg = (value1) => {
    props.setSeg(value1)
  };
  const onAfterChange_index = (value2) => {
    props.setIndex(value2)

  };
  const onChange_seg = (value1) => {
    props.SetSegvalue(value1)
  }
  const onChange_inde = (value2) => {
    props.Setindexment(value2)
  }
  // useEffect(() => {
  //   props.ParamPass(method, values);
  // }, [count]);

  return (
    <>
      <div>
        {/*Segment length阈值设置条*/}
        <strong style={{ fontSize: "19px" }}> <HighlightTwoTone /> Segment length</strong>
        <Slider
          max={200}
          min={120}
          value={props.Segment}
          step={8}
          defaultValue={160}
          disabled={disabled}
          onAfterChange={onAfterChange_seg}
          onChange={onChange_seg}
          style={{marginLeft: "20px", marginTop: "20px"}}
        />
        <span style={{marginLeft: "20px"}}>According to the existing synthesis and sequencing technology, the
        recommended length is 160 bits.</span>
        <br/>
        <br/>
        {/*index length阈值设置条*/}
        <div style={{marginTop:"30px"}}>
        <strong style={{ fontSize: "19px"}}> <HighlightTwoTone /> Index length</strong>{" "}
        <Slider
          max={30}
          min={props.indexchange ? 16 : 18}
          value={props.indexment}
          defaultValue={20}
          step={2}
          disabled={disabled}
          onAfterChange={onAfterChange_index}
          onChange={onChange_inde}
          style={{marginLeft: "20px", marginTop: "20px"}}
        />
        <span style={{marginLeft: "20px"}}>According to the existing synthesis and sequencing technology, the
        recommended length is 20 bits.</span>
        </div>
      </div>
      <div style={{ paddingLeft: "0px", marginTop: "50px", fontSize: "19px" }}>
        <strong><BulbTwoTone /> Verify method </strong><br/>
        <Radio.Group
          onChange={onChange1}
          value={props.encodevalue}
          defaultValue={"WithoutVerifycode"}
          style={{marginLeft: "20px", marginTop: "20px"}}
        >
          <Space direction="vertical">
            <Radio value={"WithoutVerifycode"}><span>WithoutVerifycode</span></Radio>
            <Radio value={"Hamming"}><span>Hamming</span></Radio>
            <Radio value={"ReedSolomon"}><span>ReedSolomon</span></Radio>
          </Space>
        </Radio.Group>
        <p style={{marginTop: "10px" }}>
          <span style={{marginLeft:"20px",fontSize:"16px"}}>Method details please click the{" "}</span>
          <Link to="/methods"><span style={{fontSize:"16px"}}>Method Paper</span></Link>
        </p>
      </div>
    </>
  );
};

export default Sliders;
