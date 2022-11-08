import React, { useState, useEffect } from "react";
import "./index.less";
import axios from "axios";
import { Breadcrumb, Col, Row, Spin } from "antd";
import Encodelists from "./components/Encodelists";
import Uploads from "./components/Uploads";
import Sliders from "./components/Sliders";
import Graphs from "./components/Graphs";
import { Anchor,Button} from "antd";
import { FolderAddTwoTone } from "@ant-design/icons";
const { Link } = Anchor;

export const Encode = (props) => {
  const [targetOffset, setTargetOffset] = useState(undefined);

  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);

  const [seg, setSeg] = useState(160);
  const [index, setIndex] = useState(16);
  const [method, setMethod] = useState("WithoutVerifycode");
  const [btnflag, setBtn] = useState(false);
  const [encodevalue, setencodeValue] = useState("WithoutVerifycode");
  const [value, setValue] = useState("Basic");
  const [Segment,SetSegvalue] =useState(160)
  const [indexment,Setindexment] =useState(20)
  const [indexchange,setChange]=useState(true) //一开始是小于2M
  
  useEffect(() => {
    props.setIsSynthesis(false);
  }, []);
  // const ParamPass = (param1, param2) => {
  //   setSeg(param2[0].Segvalue);
  //   setIndex(param2[1].Indexvalue);
  //   // console.log("done");
  //   setMethod(param1); //method
  // };
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
  const miniEnergyPass=(param1)=>{
    props.setMini(param1)
    console.log(props.mini);
  }
  const InfoPass1 = (
    param1,
    param2,
    param3,
    param4,
    param5,
    param6,
    param7
  ) => {
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
  const DNAInfoPass = (param1, param2, param3, param4,param5,param6) => {
    //console.log('param6:',param6);
    props.DNAinfos.DNA_sequence = param1;
    props.DNAinfos.encoding_time = param2;
    props.DNAinfos.information_density = param3;
    props.DNAinfos.nucleotide_counts = param4;
    props.DNAinfos.min_free_energy =param5;
    props.DNAinfos.net_information_density = param6;
    props.setDNAinfo(props.DNAinfos);
    console.log('Encode-dnaindo',props.dnainfo);
  };
  var params1 = {
    file_uid: "1565536927137009664",
    segment_length: 160,
    index_length: 16,
    verify_method: "WithoutVerifycode",
    encode_method: "Basic",
  };
  const handleClick = () => {
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

    axios
      .post("http://localhost:5000/encode", params1)
      .then(function (response) {
        console.log("Encode-response: ", response.data);
        console.log("Encode-response: ", typeof(response.data.min_free_energy_below_30kcal_mol));
        InfoPass1(
          response.data.bit_size,
          response.data.byte_size,
          response.data.encode_method,
          response.data.index_length,
          response.data.segment_length,
          response.data.segment_number,
          response.data.verify_method
        );
        GCPass(response.data.gc_data);
        HomoPass(response.data.homo_data);
        EnergyPass(response.data.energy_plot);
        EncodeURLPass(response.data.user_encode_file);
        FileURLPass(response.data.user_file_infofile);
        DNAInfoPass(
          response.data.DNA_sequence_length,
          response.data.encoding_time,
          response.data.information_density,
          response.data.nucleotide_counts,
          response.data.min_free_energy,
          response.data.net_information_density
        );
        miniEnergyPass(response.data.min_free_energy_below_30kcal_mol);
        props.setSpin(false);
        console.log('完成spin');
      })
      .catch(function (error) {
        //console.log(error);
      });
  };
  const scrollToAnchor = (placement) => {
    notification.info({
      message: 'Please make sure you complete the uploading and selection above!',
      description:
        'Confirm whether the file is uploaded and whether the encoding method is selected.',
      placement,
      duration: 4.5,
    });
    if ("uploads") {
      let anchorElement = document.getElementById("uploads");
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  };
  const handleExm=()=>{
    props.setIsSynthesis(true);
    props.changeSider(["0-0-1"]);
    props.setSpin(true);
    props.setExam(true);
    axios
      .post("http://localhost:5000/encode", params1)
      .then(function (response) {
        console.log("Encode-response: ", response.data);
        console.log("Encode-response: ", typeof(response.data.min_free_energy_below_30kcal_mol));
        InfoPass1(
          response.data.bit_size,
          response.data.byte_size,
          response.data.encode_method,
          response.data.index_length,
          response.data.segment_length,
          response.data.segment_number,
          response.data.verify_method
        );
        GCPass(response.data.gc_data);
        HomoPass(response.data.homo_data);
        EnergyPass(response.data.energy_plot);
        EncodeURLPass(response.data.user_encode_file);
        FileURLPass(response.data.user_file_infofile);
        DNAInfoPass(
          response.data.DNA_sequence_length,
          response.data.encoding_time,
          response.data.information_density,
          response.data.nucleotide_counts,
          response.data.min_free_energy,
          response.data.net_information_density,
          // response.data.min_free_energy_below_30kcal_mol,
        );
        miniEnergyPass(response.data.min_free_energy_below_30kcal_mol);
        props.setSpin(false);
      })
        
      .catch(function (error) {
        console.log(error);
      }); 
  }
  const handlereset=()=>{
    setSeg(160)
    SetSegvalue(160)
    Setindexment(20)
    setIndex(20)
    setMethod("WithoutVerifycode")
    setencodeValue('WithoutVerifycode')
    setValue("Basic")
  }
  useEffect(()=>{
    window.scrollTo(0,0);
  },[])
  return (
    <div className="EncodeContainer">
      <div style={{ paddingLeft: "100px", paddingTop: "20px" }}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <a href="/home">Home</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/Services">Service</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>EncodeServices</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Row>
        <Col>
          <div
            id="uploads"
            style={{
              marginLeft: "100px",
              marginTop: "20px",
              fontSize: "13px",
            }}
          >
            <h2>
              <strong>
                {" "}
                <FolderAddTwoTone /> Please upload the storage files:
              </strong>
            </h2>
            <Uploads
              GetFileID={props.setFileId}
              FileInfoPass={FileInfoPass}
              setBtn={setBtn}
              setChange={setChange}
            />
          </div>
          <div
            id="encodelist"
            style={{
              fontSize: "15px",
            }}
          >
            <p style={{ marginLeft: "50px", fontSize: "17px" }}>
            </p>
            <Encodelists
              // fileId={props.fileId}
              // seg={seg}
              // setSeg={setSeg}
              // index={index}
              // setIndex={setIndex}
              // method={method}
              // setMethod={setMethod}
              // InfoPass1={InfoPass1}
              // GCPass={GCPass}
              // EnergyPass={EnergyPass}
              // EncodeURLPass={EncodeURLPass}
              // FileURLPass={FileURLPass}
              // HomoPass={HomoPass}
              // DNAInfoPass={DNAInfoPass}
              // changeSider={props.changeSider}
              // btnflag={btnflag}
              // setIsSynthesis={props.setIsSynthesis}
              // setSpin={props.setSpin}
              // setExam={props.setExam}
              setValue={setValue}
              value={value}
              // SetSegvalue={SetSegvalue}
              // Setindexment={Setindexment}
            />
          </div>
          <div
            id="sliders"
            style={{
              marginLeft: "100px",
              paddingTop: "20px",
              fontSize: "14px",
            }}
          >
            <Sliders 
            // ParamPass={ParamPass} 
            indexchange={indexchange}
            setSeg={setSeg}
            setIndex={setIndex}
            setMethod={setMethod}
            setencodeValue={setencodeValue}
            encodevalue={encodevalue}
            SetSegvalue={SetSegvalue}
            Segment={Segment}
            Setindexment={Setindexment}
            indexment={indexment}
            />
          </div>
          <div id="graphs" style={{ marginLeft: "100px", paddingTop: "20px" }}>
            <hr></hr>
            <Graphs
              seg={seg}
              index={index}
              method={method}
              setSeg={setSeg}
              setIndex={setIndex}
              setMethod={setMethod}
            />
            <hr />
          </div>
        </Col>
      </Row>
      <div style={{marginTop:"40px",marginLeft:"100px"}}>
        
              <Button
                type="primary"
                shape="round"
                size={"large"}
                style={{width:"100px"}}
                onClick={btnflag ? handleClick : () => scrollToAnchor('bottomLeft')}
              >
                Run
              </Button>
          
         
              <Button
               shape="round"
               size={"large"}
                onClick={handleExm}
                style={{marginLeft:"15px"}}
              >
                Example
              </Button>
          
              <Button
              shape="round"
              size={"large"}
              onClick={handlereset}
              style={{marginLeft:"440px",width:"100px"}}
              >
                Reset
              </Button>
         
        </div>
    </div>
  );
};
//Encode.defaultProps = new EncodeProps();
export default Encode;
