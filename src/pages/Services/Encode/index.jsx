import React, { useState, useEffect } from "react";
import "./index.less";
import { Breadcrumb, Col, Row,Spin} from "antd";
import Encodelists from "./components/Encodelists";
import Uploads from "./components/Uploads";
import Sliders from "./components/Sliders";
import Graphs from "./components/Graphs";
import { Anchor } from "antd";
const { Link } = Anchor;

export const Encode = (props) => {
  const [targetOffset, setTargetOffset] = useState(undefined);

  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);

  const [seg, setSeg] = useState(160);
  const [index, setIndex] = useState(16);
  const [method, setMethod] = useState("None");
  const [btnflag,setBtn] = useState(false)
 
  useEffect(()=>{
    props.setIsSynthesis(false)
  },[])
  const ParamPass = (param1, param2) => {
    setSeg(param2[0].Segvalue);
    setIndex(param2[1].Indexvalue);
    console.log("done");
    setMethod(param1); //method
  };
  const GCPass = (param1) => {
    props.setGC(param1);
  };
  const HomoPass = (param1) => {
    props.setHomo(param1);
  };
  const InfoPass1 = (param1,param2,param3,param4,param5,param6,param7) => {
    props.infos.bit_size=param1
    props.infos.byte_size=param2
    props.infos.encode_method=param3
    props.infos.index_length=param4
    props.infos.segment_length=param5
    props.infos.segment_number=param6
    props.infos.verify_method=param7
    props.setInfo(props.infos);
    //console.log("InfoPass1", info);
  };
  const FileInfoPass = (param1, param2, param3) => {
    props.FileValue.fileId = param1;
    props.FileValue.filerename = param2;
    props.FileValue.filetype = param3;
    props.setFileInfo(props.FileValue);
    //console.log(props.fileinfo);
  };
  const DNAInfoPass = (param1, param2, param3, param4) => {
    props.DNAinfos.DNA_sequence = param1;
    props.DNAinfos.encoding_time = param2;
    props.DNAinfos.information_density = param3;
    props.DNAinfos.nucleotide_counts = param4;
    props.setDNAinfo(props.DNAinfos);
    console.log(props.DNAinfos);
  };
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
          <Breadcrumb.Item>Encode</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Row>
        <Col>
          <div
            id="uploads"
            style={{
              marginLeft: "150px",
              marginTop: "20px",
              fontSize: "18px",
            }}
          >
            <p>
              <strong>Please upload the storage files:</strong>
            </p>
            <Uploads GetFileID={props.setFileId} FileInfoPass={FileInfoPass} setBtn={setBtn}/>
          </div>
          <div
            id="sliders"
            style={{
              paddingLeft: "150px",
              paddingTop: "50px",
              fontSize: "14px",
            }}
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
            style={{
              paddingLeft: "50px",
              paddingTop: "20px",
              fontSize: "15px",
            }}
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
              GCPass={GCPass}
              HomoPass={HomoPass}
              DNAInfoPass={DNAInfoPass}
              changeSider={props.changeSider}
              btnflag={btnflag}
              setIsSynthesis={props.setIsSynthesis}
              setSpin={props.setSpin}
            />
          </div>
          <br />
          <br />
          <br />
        </Col>
        <Col>
          <div
            style={{ marginLeft: "50px", marginTop: "20px", fontSize: "18px" }}
          >
            <Anchor targetOffset={targetOffset}>
              <Link href="#uploads" title="File Upload" />
              <Link href="#sliders" title="Choose method and length" />
              <Link href="#graphs" title="Draw" />
              <Link href="#encodelist" title="Choose decode method" />
            </Anchor>
          </div>
        </Col>
      </Row>

    </div>
  );
};
//Encode.defaultProps = new EncodeProps();
