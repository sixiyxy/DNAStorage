import { Slider} from "antd";
import React, { useState, useEffect } from "react";
import { Radio,Space } from "antd";
import { Link } from "react-router-dom";

const SaveValue = [{ Segvalue: 160 }, { Indexvalue: 16 }];
var method = "WithoutVerifycode";

const Sliders = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [values, setValues] = useState(SaveValue);
  const [count,setCount] = useState(0) //触发标志
  const [value, setValue] = useState("WithoutVerifycode");
 
  const onChange1 = (e) => {
    setCount(count+1)
    setValue(e.target.value)
    console.log('count',count)
    method = e.target.value;
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

  useEffect(() => {
    props.ParamPass(method, values);
  }, [count]);

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
        <Radio.Group onChange={onChange1} value={value} defaultValue={"WithoutVerifycode"}>
            <Space direction="vertical">
              <Radio value={"WithoutVerifycode"}>WithoutVerifycode</Radio>
              <Radio value={"Hamming"}>Hamming</Radio>
              <Radio value={"ReedSolomon"}>ReedSolomon</Radio>
            </Space>
          </Radio.Group>
        <p style={{ fontSize: "14px",marginTop:"10px"}}>
          Tips: Method details please click the{" "}
          <Link to="/methods">Method Paper</Link>
        </p>
      </div>

    </>
  );
};


export default Sliders;
