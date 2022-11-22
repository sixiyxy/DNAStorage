import React, { useState, useEffect } from "react";
import "./index.less";
import axios from "axios";
import { Breadcrumb, Col, Row, Spin, notification, Card,Image} from "antd";
import EncodeMethodList from "./components/EncodeMethodList";
import Uploads from "./components/Uploads";
import Sliders from "./components/Sliders";
import Graphs from "./components/Graphs";
import { Anchor, Button } from "antd";
import { FolderAddTwoTone } from "@ant-design/icons";
import { doPost } from "../../../utils/request";
const { Link } = Anchor;

export const Encode = (props) => {
  const [targetOffset, setTargetOffset] = useState(undefined);

  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);

  //作图的初始值
  const [seg, setSeg] = useState()
  const [index, setIndex] = useState(20);
  const [method, setMethod] = useState("WithoutVerifycode");
  const [btnflag, setBtn] = useState(false);
  const [encodevalue, setencodeValue] = useState("WithoutVerifycode");
  const [value, setValue] = useState("Basic");
  const [Segment, SetSegvalue] = useState();
  const [indexment, Setindexment] = useState(20);
  const [indexchange, setChange] = useState(true); //一开始是小于2M
  const [upload100kb, setUpload100] = useState(false); //一开始假设文件都大于100kb
  const [processRes, setprocessRes] = useState({})
  useEffect(() => {
    props.setIsSynthesis(false);
  }, []);
  useEffect(()=>{
    setSeg(Number(Object.keys(processRes.bar ? processRes.bar : {80:' '} )[1]))
    SetSegvalue(Number(Object.keys(processRes.bar ? processRes.bar : {80:' '} )[1]))
  },[processRes])
  
  const GCPass = (param1) => {
    props.setGC(param1);
  };
  const HomoPass = (param1) => {
    props.setHomo(param1);
  };
  const EnergyPass = (param1) => {
    props.setEnergy(param1);
  };
  const EncodeURLPass = (param1) => {
    props.setEncodeURL(param1);
  };
  const FileURLPass = (param1) => {
    props.setFileURL(param1);
  };
  const miniEnergyPass = (param1) => {
    props.setMini(param1);
    console.log(props.mini);
  };
  const InfoPass1 = (param1, param2, param3, param4, param5, param6, param7) => {
    props.infos.bit_size = param1;
    props.infos.byte_size = param2;
    props.infos.encode_method = param3;
    props.infos.index_length = param4;
    props.infos.segment_length = param5;
    props.infos.segment_number = param6;
    props.infos.verify_method = param7;
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
  const DNAInfoPass = (param1, param2, param3, param4, param5, param6, param7) => {
    //console.log('param6:',param6);
    props.DNAinfos.DNA_sequence = param1;
    props.DNAinfos.encoding_time = param2;
    props.DNAinfos.information_density = param3;
    props.DNAinfos.nucleotide_counts = param4;
    props.DNAinfos.min_free_energy = param5;
    props.DNAinfos.net_information_density = param6;
    props.DNAinfos.physical_information_density_g = param7
    props.setDNAinfo(props.DNAinfos);
    console.log("Encode-dnaindo", props.dnainfo);
  };
  var params1 = {
    file_uid: "1565536927137009664",
    segment_length: 160,
    index_length: 16,
    verify_method: "WithoutVerifycode",
    encode_method: "Basic",
  };
  const handleClick = async () => {
    //console.log("加载中");
    props.setIsSynthesis(true);
    props.changeSider(["0-0-1"]);
    props.setSpin(true);
    props.setExam(false);
    params1.file_uid = props.fileId;
    params1.segment_length = seg;
    params1.index_length = index;
    params1.verify_method = method;
    params1.encode_method = value;

    // const body = params1;

    const resp = await doPost("/encode", { body: params1 });
    console.log("Encode-response: ", resp);
    console.log("Encode-response: ", typeof resp.min_free_energy_below_30kcal_mol);
    InfoPass1(
      resp.bit_size,
      resp.byte_size,
      resp.encode_method,
      resp.index_length,
      resp.segment_length,
      resp.segment_number,
      resp.verify_method
    );
    GCPass(resp.gc_data);
    HomoPass(resp.homo_data);
    EnergyPass(resp.energy_plot);
    EncodeURLPass(resp.user_encode_file);
    FileURLPass(resp.user_file_infofile);
    DNAInfoPass(
      resp.DNA_sequence_length,
      resp.encoding_time,
      resp.information_density,
      resp.nucleotide_counts,
      resp.min_free_energy,
      resp.net_information_density,
      resp.physical_information_density_g
      // response.data.min_free_energy_below_30kcal_mol,
    );
    miniEnergyPass(resp.min_free_energy_below_30kcal_mol);
    props.setSpin(false);
    console.log("完成spin");
  };

  const scrollToAnchor = (placement) => {
    console.log("toanthor");
    notification.info({
      message: "Please make sure you complete the uploading and selection above!",
      description:
        "Confirm whether the file is uploaded and whether the encoding method is selected.",
      placement,
      duration: 4.5,
    });
    if ("upload-p") {
      let anchorElement = document.getElementById("upload-p");
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  };
  const handleExm = async () => {
    props.setIsSynthesis(true);
    props.changeSider(["0-0-1"]);
    props.setSpin(true);
    props.setExam(true);
    props.setFileId('1565536927137009664');
    const resp = await doPost("/encode", { body: params1 });
    console.log("Encode-response: ", resp);
    console.log("Encode-response: ", typeof resp.min_free_energy_below_30kcal_mol);
    InfoPass1(
      resp.bit_size,
      resp.byte_size,
      resp.encode_method,
      resp.index_length,
      resp.segment_length,
      resp.segment_number,
      resp.verify_method
    );
    GCPass(resp.gc_data);
    HomoPass(resp.homo_data);
    EnergyPass(resp.energy_plot);
    EncodeURLPass(resp.user_encode_file);
    FileURLPass(resp.user_file_infofile);
    DNAInfoPass(
      resp.DNA_sequence_length,
      resp.encoding_time,
      resp.information_density,
      resp.nucleotide_counts,
      resp.min_free_energy,
      resp.net_information_density,
      resp.physical_information_density_g
    );
    miniEnergyPass(resp.min_free_energy_below_30kcal_mol);
    props.setSpin(false);
  };
  const handlereset = () => {
    setSeg(160);
    SetSegvalue(160);
    Setindexment(20);
    setIndex(20);
    setMethod("WithoutVerifycode");
    setencodeValue("WithoutVerifycode");
    setValue("Basic");
  };

  return (
    <div className="encode-wrapper">
      {/*顶部菜单 tab 顺序*/}
      <div className="encode-nav-wrapper">
        <Card>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <a href="/home">Home</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Services</Breadcrumb.Item>
            <Breadcrumb.Item>Encode</Breadcrumb.Item>
            <Breadcrumb.Item>Setting</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
      </div>
      <div className="encode-main-body-wrapper">
      <div className="summary">
          <Card >
          <Row>
            <Col span={10}>
            <div className="decode-button-group">
                <div className="summary-word" >
                  <p>
                  The encode service integrates the most common and popular DNA storage encoding and verifying methods.
                   After uploading the file, users could simply select corresponding methods, elegantly slide the sliders to set the segment length, 
                   and wait for the result. The website will not only convert the file into DNA sequences but also calculate GC content and homopolymer length as well as the minimum free energy out directly.
                  </p>
                  
                </div>
                <Button
                      className="exm"
                      // type="primary"
                      shape="round"
                      size="large"
                      onClick={handleExm}
                    >
                      Example
                    </Button>
                </div>
            </Col>
            
            <Col span={10}>
            
              <div style={{ marginLeft:"150px"}} className="summary-img">
                <Image
                  width={"130%"}
                  // height={"50%"}
                  src="/src/assets/service/encode.png"
                />
              </div>
            </Col>
          </Row>
          {/* <div className="decode-button-group">
                    <Button
                      className="exm"
                      type="primary"
                      shape="round"
                      size="large"
                      // onClick={handleEXM}
                    >
                      Example
                    </Button>
          </div> */}
          </Card>
        </div>
        <Card>
          {/*标题描述*/}
          <p id="upload-p">
            <strong>
              <FolderAddTwoTone /> Please upload the storage files:
            </strong>
          </p>
          {/*文件上传组件*/}
          <Uploads
            GetFileID={props.setFileId}
            FileInfoPass={FileInfoPass}
            setBtn={setBtn}
            setChange={setChange}
            setUpload100={setUpload100}
          />
        </Card>
      </div>
      {/*编码方法列表*/}
      <EncodeMethodList 
        setValue={setValue} 
        value={value} 
        upload100kb={upload100kb} 
        setMethod={setMethod} 
        setencodeValue={setencodeValue}  
        encodevalue={encodevalue} 
        method={method} 
        fileId={props.fileId} 
        setprocessRes={setprocessRes} 
        setIndex={setIndex}
      />

      <Sliders
        indexchange={indexchange}
        setSeg={setSeg}
        setIndex={setIndex}
        SetSegvalue={SetSegvalue}
        Segment={Segment}
        Setindexment={Setindexment}
        indexment={indexment}
        processRes={processRes}
      />
      <Graphs
        seg={seg}
        index={index}
        method={method}
        setSeg={setSeg}
        setIndex={setIndex}
        setMethod={setMethod}
      />
      <div className="encode-button-wrapper">
        <Card>
          <div className="encode-button-group">
            <Button
              type="primary"
              shape="round"
              size={"large"}
              onClick={btnflag ? handleClick : () => scrollToAnchor("bottomLeft")}
            >
              Run
            </Button>
            {/* <Button shape="round" size={"large"} onClick={handleExm}>
              Example
            </Button> */}
            <Button shape="round" size={"large"} onClick={handlereset}>
              Reset
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Encode;
