import { Card, Slider } from "antd";
import React from "react";
import { HighlightTwoTone} from "@ant-design/icons";
import "./index.less";

const Sliders = (props) => {

  
  //获取segment和index的值
  const onAfterChange_seg = (value1) => {
    //获取鼠标放开之后的那个值
    props.setSeg(value1);
    
  };
  const onChange_seg = (value1) => {
    //这里获取的是鼠标不断移动的值
    props.SetSegvalue(value1);
    
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
            defaultValue={Number(Object.keys(props.processRes.bar ? props.processRes.bar : {80:' '} )[0])}
            onAfterChange={onAfterChange_seg}
            onChange={onChange_seg}
            style={{ marginLeft: "20px", marginTop: "20px" }}
          />
          
          <div style={{ marginTop: "30px" }}>
            <strong style={{ fontSize: "19px" }}>
              {" "}
              <HighlightTwoTone /> Index length : {props.Zan && props.value==='SrcCode' ? 0 : props.processRes.index_length} bits
            </strong>{" "}
          </div>
        </div>
        
      </Card>
    </div>
  );
};

export default Sliders;
