import React, { useState, useEffect } from "react";
import "./index.less";
import { Breadcrumb } from "antd";

import Encodelists from "./components/Encodelists";
import Uploads from "./components/Uploads";
import Sliders from "./components/Sliders";
import Graphs from "./components/Graphs";
import Information from "./components/Information";
import { Anchor } from "antd";
import { useContext } from "react";
import GLgraph from "./components/GLgraph";
import HomoGraph from "./components/HomoGraph";
const { Link } = Anchor;

var infos = {
  'bit_size':0,
  'byte_size':0,
  'encode_method':'None',
  'index_length':0,
  'segment_length':0,
  'segment_number':0,
  'verify_method':'None'
  }
var FileValue = {
    fileId:"None",
    filerename: "None",
    filetype: "None",
  };
var data = []
for (var i=0;i<100;i++){
        var param = {};
        param.x_value = i+"";
        param.y_value = 0;
        data.push(param);
      }
export const Encode = (props) => {
  const [targetOffset, setTargetOffset] = useState(undefined);

  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);

  const [seg, setSeg] = useState(160);
  const [index, setIndex] = useState(16);
  const [method, setMethod] = useState("None");
  const [gc,setGC] = useState(data)
  const [homo,setHomo] = useState([])
  const [info,setInfo] = useState(infos)
  const [fileinfo,setFileInfo] = useState(FileValue)
  //const [flag, setFlag] = useState(false); //设置标志位 如果axios得到返回值 就置为True 显示新的组件
  
  //获取Slider中的参数信息传递给Graph
  const ParamPass = (param1, param2) => {
    //setValues(param2); //value
    setSeg(param2[0].Segvalue);
    setIndex(param2[1].Indexvalue);
    console.log(seg);
    setMethod(param1); //method
  };
  const GCPass = (param1) =>{
    setGC(param1)
    console.log('GCPass',gc);
  }
  const HomoPass =(param1)=>{
    setHomo(param1)
    console.log('HomoPass',homo);
  }
  const InfoPass1=(param1)=>{
    setInfo(param1)
    console.log('InfoPass1',info);
  }
  const FileInfoPass=(param1,param2,param3)=>{
    FileValue.fileId = param1
    FileValue.filerename=param2
    FileValue.filetype=param3
    setFileInfo(FileValue)
    console.log(fileinfo);
  }
  return (
    <div className="EncodeContainer">
      <div style={{ paddingLeft: "30px", paddingTop: "20px" }}>
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
        <Uploads GetFileID={props.setFileId}FileInfoPass={FileInfoPass} />
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
        <Graphs
          seg={seg}
          index={index}
          method={method}
          setSeg={setSeg}
          setIndex={setIndex}
          setMethod={setMethod}
        />
      </div>

      <div
        id="encodelist"
        style={{ paddingLeft: "50px", paddingTop: "20px", fontSize: "15px" }}
      >
        <p style={{ paddingLeft: "100px", fontSize: "17px" }}>
          <hr />
        </p>
        <Encodelists
          fileId={props.fileId}
          seg={seg}
          index={index}
          method={method}
          InfoPass1={InfoPass1}
          GCPass = {GCPass}
          HomoPass={HomoPass}
        />
      </div>
      <div
        id="information"
        style={{ paddingLeft: "150px", paddingTop: "30px", fontSize: "15px" }}
      >
        <Information info={info} fileId={props.fileId} fileinfo={fileinfo}/>
      </div>
      <div
        id="gcgraph"
        style={{ paddingLeft: "150px", paddingTop: "30px", fontSize: "15px" }}
      >
        <h2>Title:GC_Contact</h2>
        <GLgraph gc={gc}/>
      </div>
      <div
        id="homograph"
        style={{ paddingLeft: "150px", paddingTop: "30px", fontSize: "15px" }}
      >
        <h2>Title:xxx</h2>
        <HomoGraph homo={homo}/>
      </div>

      <br />
      <br />
      <br />
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
