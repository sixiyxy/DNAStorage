import { Slider, Switch } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { Radio } from "antd";
import { Button, Popconfirm } from "antd";
import { Link } from "react-router-dom";

const SaveValue = [{ Segvalue: 160 }, { Indexvalue: 16 }];
var method = "";

const Sliders = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [values, setValues] = useState(SaveValue);

  const plainOptions = ["WithoutVerifycode", "HammingCode", "ReedSolomonCode"];
  const onChange1 = ({ target: { value } }) => {
    method = value;
  };

  //获取segment和index的值
  const onAfterChange_seg = (value1) => {
    SaveValue[0].Segvalue = value1;
    setValues(SaveValue);
  };
  const onAfterChange_index = (value2) => {
    SaveValue[1].Indexvalue = value2;
    setValues(SaveValue);
  };

  const handelClick = ()=>{
    props.ParamPass(method, values);
  }

  return (
    <>
      <div>
        {/*Segment length阈值设置条*/}
        <strong style={{ fontSize: "16px" }}>Segment length:</strong>{" "}
        <Slider
          max={200}
          min={120}
          step={8}
          defaultValue={160}
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
          defaultValue={16}
          disabled={disabled}
          onAfterChange={onAfterChange_index}
        />
        Tips:According to the existing synthesis and sequencing technology, the
        recommended length is 16bits.
      </div>
      <div style={{ paddingLeft: "0px", paddingTop: "20px", fontSize: "16px" }}>
        <strong>Verify Method: </strong>
        <Radio.Group options={plainOptions} onChange={onChange1} />
        <p style={{ fontSize: "14px",marginTop:"10px"}}>
          Tips: Method details please click the{" "}
          <Link to="/methods">Method Paper</Link>
        </p>
      </div>
      <button
        className="btn btn-danger"
        style={{ marginLeft: "650px"}}
        onClick={handelClick}
      >
        OK
      </button>
    </>
  );
};

export default Sliders;
