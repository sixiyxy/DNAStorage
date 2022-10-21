import { Slider } from "antd";
import React, { useState, useEffect } from "react";
import { Radio, Space } from "antd";
import { Link } from "react-router-dom";

const Sliders = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [count, setCount] = useState(0); //触发标志
  

  const onChange1 = (e) => {
    setCount(count + 1);
    props.setValue(e.target.value)
    props.setMethod(e.target.value);
  };

  //获取segment和index的值
  const onAfterChange_seg = (value1) => {
    props.setSeg(value1)
  };
  const onAfterChange_index = (value2) => {
    props.setIndex(value2)

  };
  const onChange_seg=(value1)=>{
    props.SetSegvalue(value1)
  }
  const onChange_inde=(value2)=>{
    props.Setindexment(value2)
  }
  // useEffect(() => {
  //   props.ParamPass(method, values);
  // }, [count]);

  return (
    <>
      <div>
        {/*Segment length阈值设置条*/}
        <strong style={{ fontSize: "16px" }}>Segment length:</strong>{" "}
        <Slider
          max={200}
          min={120}
          value={props.Segment}
          step={8}
          defaultValue={160}
          disabled={disabled}
          onAfterChange={onAfterChange_seg}
          onChange={onChange_seg}
        />
        Tips:According to the existing synthesis and sequencing technology, the
        recommended length is 160bits.
        <br />
        <br />
        {/*index length阈值设置条*/}
        <strong style={{ fontSize: "16px" }}>Index length:</strong>{" "}
        <Slider
          max={30}
          min={props.indexchange?16:18}
          value={props.indexment}
          defaultValue={20}
          step={2}
          disabled={disabled}
          onAfterChange={onAfterChange_index}
          onChange={onChange_inde}
        />
        Tips:According to the existing synthesis and sequencing technology, the
        recommended length is 16bits.
      </div>
      <div style={{ paddingLeft: "0px", paddingTop: "20px", fontSize: "16px" }}>
        <strong>Verify Method: </strong>
        <Radio.Group
          onChange={onChange1}
          value={props.value}
          defaultValue={"WithoutVerifycode"}
        >
          <Space direction="vertical">
            <Radio value={"WithoutVerifycode"}>WithoutVerifycode</Radio>
            <Radio value={"Hamming"}>Hamming</Radio>
            <Radio value={"ReedSolomon"}>ReedSolomon</Radio>
          </Space>
        </Radio.Group>
        <p style={{ fontSize: "14px", marginTop: "10px" }}>
          Tips: Method details please click the{" "}
          <Link to="/methods">Method Paper</Link>
        </p>
      </div>
    </>
  );
};

export default Sliders;
