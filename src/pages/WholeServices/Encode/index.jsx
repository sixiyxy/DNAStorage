import React, { useState, useEffect, useMemo } from "react";
import "./index.less";
import axios from "axios";
import { Breadcrumb, Col, Row, Spin, notification, Card, Image } from "antd";
import EncodeMethodList from "./components/EncodeMethodList";
import Uploads from "./components/Uploads";
import Sliders from "./components/Sliders";
import Graphs from "./components/Graphs";
import { Anchor, Button } from "antd";
import { FolderAddTwoTone } from "@ant-design/icons";
import { doPost } from "../../../utils/request";
import encode from "../../../assets/service/encode.png";
import { Link } from "react-router-dom";
import { createAsyncStepRequest } from "../../../utils/request-util";

export const Encode = (props) => {
  const [targetOffset, setTargetOffset] = useState(undefined);

  useEffect(() => {
    props.setIsSynthesis(false);
    setTargetOffset(window.innerHeight / 2);
  }, []);

  //作图的初始值
  const [seg, setSeg] = useState();
  const [index, setIndex] = useState(20);
  const [method, setMethod] = useState("WithoutVerifycode");
  const [btnflag, setBtn] = useState(false);
  const [encodevalue, setencodeValue] = useState("WithoutVerifycode");
  const [value, setValue] = useState("Basic");
  const [Segment, SetSegvalue] = useState();
  // const [indexment, Setindexment] = useState(20);
  const [indexchange, setChange] = useState(true); //一开始是小于2M
  const [upload100kb, setUpload100] = useState(false); //一开始假设文件都大于100kb
  const [processRes, setprocessRes] = useState({});
  const [Zan, setZan] = useState(false); //其他方法都不能使用zan
  const [ZanRadio, setZanRadio] = useState(false); //一开始不禁
  const [isUpload, setUpload] = useState(false); //假设一开始没有上传文件
  const [uploadFileBytes, setUploadFileBytes] = useState(0);
  
  useEffect(() => {
    if (props.resetMenu) {
      props.setEncodeRepo(false);
      props.setSimuSet(false);
      props.setSimuRepo(false);
      props.setDeSet(false);
      props.setDerepo(false);
    }
  }, [props.resetMenu]);
  const close = () => {
    console.log(
      "Notification was closed. Either the close button was clicked or duration time elapsed."
    );
  };
  const btn = (
    <Button type="primary" size="middle" onClick={() => notification.close(key)}>
      OK
    </Button>
  );
  const key = `open${Date.now()}`;
  
  const controlPlace = useMemo(
    (placement) => {
      if (upload100kb && Zan) { //小于100k且是英文
        notification.info({
          message:"Ping-zhi's yin-yang code and Erlich's fountain code method are only used for files larger than 100kb!",
          placement,
          duration: 10.5,
        });
      }else if(upload100kb && !Zan){ //小于100k但是不是英文
        notification.info({
          message:"Ping-zhi's yin-yang code and Erlich's fountain code method are only used for files larger than 100kb! Zan's code can only encode the English letters in the txt file!",
          placement,
          duration: 10.5,
        });
      }
      return "1";
    },
    [props.fileId]
  );
const controlZan = useMemo(
  (placement)=>{
    if (!upload100kb && !Zan && isUpload==true) { //大于100k且不是英文（此时不能用Zan）
      notification.info({
        message:"Zan's code can only encode the English letters in the txt file!",
        placement,
        duration: 10.5,
      });
    }
    return "1";
},[Zan])

  useEffect(() => {
    if (Zan && value === "SrcCode") {
      console.log("index0");
      setIndex(0);
    }
    if (Zan && value === "SrcCode") {
      notification.open({
        message:
          "Zan's encode method directly converts letters into DNA base sequences. The file will not be binary compiled, so there is no segment length selection and no verification code can be added.",
        description: "",
        btn,
        key,
        duration: null,
        placement: "bottom",
        style: {
          width: "1000px",
          fontSize: "20px",
        },
        onClose: close,
      });
    }
    setSeg(
      Zan && value === "SrcCode"
        ? 0
        : Number(Object.keys(processRes.bar ? processRes.bar : { 80: " " })[1])
    );
    SetSegvalue(Number(Object.keys(processRes.bar ? processRes.bar : { 80: " " })[1]));
  }, [processRes, Zan]);

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
  const InfoPass1 = (
    param1,
    param2,
    param3,
    param4,
    param5,
    param6,
    param7,
    param8,
    param9,
    param10
  ) => {
    props.infos.bit_size = param1;
    props.infos.byte_size = param2;
    props.infos.encode_method = param3;
    props.infos.index_length = param4;
    props.infos.segment_length = param5;
    props.infos.segment_number = param6;
    props.infos.verify_method = param7;
    props.infos.verify_code_length = param8;
    props.infos.final_segment_bit_length = param9;
    props.infos.DNA_sequence_number = param10;
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
    props.DNAinfos.physical_information_density_g = param7;
    props.setDNAinfo(props.DNAinfos);
    console.log("Encode-dnaindo", props.dnainfo);
  };
  var params1 = {
    // file_uid: "1565536927137009664",
    // segment_length: 160,
    // index_length: 16,
    // verify_method: "WithoutVerifycode",
    // encode_method: "Basic",
    type: "encode",
  };
  const handleClick = async () => {
    props.setEncodeRepo(true);
    props.setSimuSet(true);
    props.setIsSynthesis(true);
    props.setEncodeSet(false)
    props.changeSider(["0-0-1"]);
    props.setEncodeAndDecodeSpinning(true);
    props.setExam(false);
    params1.file_uid = props.fileId;
    params1.segment_length = seg;
    params1.index_length = index;
    params1.verify_method = method;
    params1.encode_method = value;

    const body = params1;
    const uploadFileMb = uploadFileBytes / 1024 / 1024;
    const intervalTime = uploadFileMb < 1 ? 3000 : 5000;
    await createAsyncStepRequest(
      "encode",
      body,
      props.setEncodeAndDecodeSpinning,
      intervalTime,
      null,
      (resp) => {
        InfoPass1(
          resp.bit_size,
          resp.byte_size,
          resp.encode_method,
          resp.index_length,
          resp.segment_length,
          resp.segment_number,
          resp.verify_method,
          resp.verify_code_length,
          resp.final_segment_bit_length,
          resp.DNA_sequence_number
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
      }
    );

    //const resp = await doPost("/encode", { body: params1 });
    //props.setEncodeAndDecodeSpinning(false);
    //console.log("完成spin");
  };

  const scrollToAnchor = (placement) => {
    console.log("toanthor");
    notification.info({
      message: "Please make sure you uploaded the files!",
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
    // props.setIsSynthesis(true);
    props.setEncodeRepo(true);
    props.setSimuSet(true);
    props.setEncodeSet(false)
    props.changeSider(["0-0-1"]);
    props.setIsSynthesis(true);
    props.setEncodeAndDecodeSpinning(true);
    props.setExam(true);
    props.setFileId("example");
    const resp = await doPost("/example", { body: params1 });
    console.log("Encode-response: ", resp);
    console.log("Encode-response: ", typeof resp.min_free_energy_below_30kcal_mol);
    InfoPass1(
      resp.bit_size,
      resp.byte_size,
      resp.encode_method,
      resp.index_length,
      resp.segment_length,
      resp.segment_number,
      resp.verify_method,
      resp.verify_code_length,
      resp.final_segment_bit_length,
      resp.DNA_sequence_number
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
    props.setEncodeAndDecodeSpinning(false);
  };
  const handlereset = () => {
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
              <Link to="/home">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/services">Services</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/services/wholeprocess">Encode</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Setting</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
      </div>
      <div className="encode-main-body-wrapper">
        <div className="summary">
          <Card>
            <Row>
              <Col span={10}>
                <div className="decode-button-group">
                  <div className="summary-word">
                    <p>
                      The encode service integrates the most common and popular DNA storage encoding
                      and verifying methods. After uploading the file, users could simply select
                      corresponding methods, elegantly slide the sliders to set the segment length,
                      and wait for the result. The website will not only convert the file into DNA
                      sequences but also calculate GC content and homopolymer length as well as the
                      minimum free energy out directly.
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
                <div style={{ marginLeft: "150px" }} className="summary-img">
                  <Image
                    width={"130%"}
                    // height={"50%"}
                    src={encode}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </div>
        <Card>
          {/*标题描述*/}
          <p id="upload-p">
            <strong>
              <FolderAddTwoTone /> Upload the storage file
            </strong>
          </p>
          {/*文件上传组件*/}
          <Uploads
            GetFileID={props.setFileId}
            FileInfoPass={FileInfoPass}
            setUploadFileBytes={setUploadFileBytes}
            setBtn={setBtn}
            setChange={setChange}
            setUpload100={setUpload100}
            setFileOver={props.setFileOver}
            setZan={setZan}
            setZanRadio={setZanRadio}
            setUpload={setUpload}
            isUpload={isUpload}
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
        Zan={Zan}
        btnflag={btnflag}
        setZanRadio={setZanRadio}
        ZanRadio={ZanRadio}
        isUpload={isUpload}
      />

      <Sliders
        indexchange={indexchange}
        setSeg={setSeg}
        SetSegvalue={SetSegvalue}
        Segment={Segment}
        processRes={processRes}
        Zan={Zan}
        value={value}
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
