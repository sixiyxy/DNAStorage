import React, { useState, useEffect } from "react";
import "./index.less";
import { Breadcrumb } from "antd";
import { Encodelist } from "./components/Encodelist";
import Encodelists from "./components/Encodelists";
import Uploads from "./components/Uploads";
import Sliders from "./components/Sliders";
import Graphs from "./components/Graphs";

import { Anchor } from "antd";
import { useContext } from "react";
const { Link } = Anchor;


export const Encode = (props) => {
  const [targetOffset, setTargetOffset] = useState(undefined);

  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);


  const [seg,setSeg] = useState(160)
  const [index,setIndex] = useState(16)
  const [method, setMethod] = useState("None");

  //获取Slider中的参数信息传递给Graph
  const ParamPass = (param1, param2) => {
    //setValues(param2); //value
    setSeg(param2[0].Segvalue)
    setIndex(param2[1].Indexvalue)
    console.log(seg);
    setMethod(param1); //method
  };
  

  //console.log(props.fileId);
  return (
    <div className="EncodeContainer">
      <div style={{paddingLeft:"30px",paddingTop:"20px"}}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
                        <a href="/">Home</a>
                      </Breadcrumb.Item>
              <Breadcrumb.Item>
              <a href="/Services">Service</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Encode Data</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div
        id="uploads"
        style={{ paddingLeft: "150px", paddingTop: "20px", fontSize: "18px" }}
      >
        <p>
          <strong>Please upload the storage files:</strong>
        </p>
        <Uploads GetFileID={props.setFileId} />
      </div>
      <div
        id="sliders"
        style={{ paddingLeft: "150px", paddingTop: "50px", fontSize: "14px" }}
      >
        <hr />
        <Sliders ParamPass={ParamPass} />
      </div>
      <div id="graphs" style={{ paddingLeft: "150px", paddingTop: "20px" }}>
        <hr />
        <Graphs seg={seg} index={index} method={method} setSeg={setSeg} setIndex={setIndex} setMethod={setMethod}/>
      </div>

      <div
        id="encodelist"
        style={{ paddingLeft: "50px", paddingTop: "20px", fontSize: "15px" }}
      >
        
        <p style={{ paddingLeft: "100px",fontSize: "17px" }}>
        <hr/>
        </p>
        <Encodelists fileId={props.fileId} seg={seg} index={index} method={method} />
      </div>
      <br/>
      <br/>
      <br/>
      <div style={{ position: "fixed", top: "200px", margin: "0px 1000px" }}>
        <Anchor targetOffset={targetOffset}>
          <Link href="#uploads" title="File Upload" />
          <Link href="#sliders" title="Choose method and length" />
          <Link href="#graphs" title="Draw" />
          <Link href="#encodelist" title="Choose decode method" />
        </Anchor>
      </div>
    </div>
  );
};
//Encode.defaultProps = new EncodeProps();
