import React, { useEffect, useState } from "react";
import { Card, Table, Divider, List } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Col, Row, Breadcrumb, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import GLgraph from "./components/GLgraph";
import HomoGraph from "./components/HomoGraph";
import EnergyGraph from "./components/EnergyGraph";
import axios from "axios";
import "./index.less";

import { Spin } from "antd";
import { API_PREFIX } from "../../../common/Config";
export class ReportProps {
  GC;
  homo;
  info;
  fileinfo;
  fileId;
  dnainfo;
  spinflag;
  energy;
  encodeurl;
  fileURL;
  exam;
  mini;
  changeSider;
  fileOver2M;
  setSimuSet;
  btnNext;
}
interface DataType {
  key: string;
  name1: string;
  value1: any;
}

export const Report: React.FC<ReportProps> = (props) => {
  const [size, setSize] = useState<SizeType>("large");
  const params1 = {
    file_uid: props.exam ? "example" : props.fileId,
    type: "encode",
  };
  const columns1: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name1",
      width: "55%",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Information",
      dataIndex: "value1",
      align: "center",
    },
  ];
  const columns2: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name1",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Information",
      dataIndex: "value1",
      align: "center",
    },
  ];
 

  const data1: DataType[] = [
    {
      key: "1",
      name1: "Job ID",
      value1: props.exam ? "1565536927137009664" : props.fileinfo.fileId,
    },
    {
      key: "2",
      name1: "File name",
      value1: props.exam ? "Picture Demo" : props.fileinfo.filerename,
    },
    {
      key: "3",
      name1: "File bytes",
      value1: `${props.info.byte_size} bytes`,
    },
    {
      key: "4",
      name1: "File type",
      value1: props.exam ? "jpg" : props.fileinfo.filetype,
    },
    {
      key: "5",
      name1: "File bites",
      value1: `${props.info.bit_size} bits`,
    },
  ];
  const data2: DataType[] = [
    {
      key: "1",
      name1: "Encode method",
      value1: props.info.encode_method ? props.info.encode_method:'None',
    },
    {
      key: "2",
      name1: "Segment length",
      value1: `${props.info.segment_length} bits`,
    },
    {
      key: "3",
      name1: "Index length",
      value1: `${props.info.index_length} bits`,
    },
    {
      key: "4",
      name1: "Verify method",
      value1: props.info.verify_method ? props.info.verify_method : 'None',
    },
    {
      key: "5",
      name1: "Verify code length",
      value1: props.info.verify_code_length,
    },
    {
      key: "6",
      name1: "Encode segment length",
      value1: props.info.final_segment_bit_length ? props.info.final_segment_bit_length :'None',
    },
    {
      key: "7",
      name1: "Segment number",
      value1: props.info.segment_number,
    },
    {
      key: "8",
      name1: "Encoding time",
      value1: `${props.dnainfo.encoding_time} s`,
    },
    {
      key: "9",
      name1: "Single DNA length",
      value1: props.dnainfo.DNA_sequence,
    },
    {
      key: "10",
      name1: "DNA sequence number",
      value1: props.info.DNA_sequence_number,
    },
    {
      key: "11",
      name1: "Nucleotide counts",
      value1: props.dnainfo.nucleotide_counts,
    },
    {
      key: "12",
      name1: "Information density",
      value1: `${props.dnainfo.information_density} bits/nt`,
    },
    {
      key: "13",
      name1: "Physical information density",
      value1: props.dnainfo.physical_information_density_g,
    },
  ];
 
  console.log("dnainfo:", props.dnainfo);

  const DownloadURL = () => {
    // console.log(props.encodeurl);
    // console.log(props.fileURL);
    axios
      .post(API_PREFIX + "/download", params1, { responseType: "blob" })
      .then(function (response) {
        console.log(response.data);
        const link = document.createElement("a"); //创建一个a标签
        const blob = new Blob([response.data]); //实例化一个blob出来
        link.style.display = "none";
        link.href = URL.createObjectURL(blob); //将后端返回的数据通过blob转换为一个地址
        //设置下载下来后文件的名字以及文件格式
        link.setAttribute(
          "download",
          `${props.exam ? "Picture Demo" : props.fileinfo.filerename}.` + `${"zip"}` //upload为下载的文件信息 可以在外层包一个函数 将upload作为参数传递进来
        );
        document.body.appendChild(link);
        link.click(); //下载该文件
        document.body.removeChild(link);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleNext=()=>{
    props.setSimuSet(true)
    props.changeSider(["0-1-0"]);
  }
  return (
    <div className="encode-report-wrapper">
      <Spin
        tip={props.fileOver2M ? "Please wait about 2mins...":"Loading..."}
        size="large"
        spinning={props.spinflag}
        // spinning={false}
        delay={10}
      >
        <div className="encode-report-nav-wrapper">
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <a href="/">Home</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Service</Breadcrumb.Item>
            <Breadcrumb.Item>Encode</Breadcrumb.Item>
            <Breadcrumb.Item>Report</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="encode-report-file-information">
          <Card title="File Information" headStyle={{ backgroundColor: "#99CCFF",fontSize:"18px"}}>
            <p id="top-word">
              This part displays some basic information about the files uploaded by users.
            </p>
            <Table
              columns={columns1}
              dataSource={data1}
              size={"middle"}
              pagination={{ position: ["none"] }}
            />
          </Card>
        </div>
        <div className="encode-report-encode-information">
          <Card title="Encode Information" headStyle={{ backgroundColor: "#99CCFF",fontSize:"18px"}}>
            <p id="top-word">
              This part shows the information of the uploaded file during encoding and the result of
              DNA sequences analysis after encoding. 
              The analysis of the encoded DNA sequences includes GC-content statics, repeated sequences
              statics and minimum free energy calculation.
            </p>
            <Table columns={columns2} dataSource={data2} pagination={{ position: ["none"],pageSize:15}} />
            <div
              className="encode-report-graph"
              id="gcgraph"
              style={{
                // width: "650px",
                fontSize: "15px",
              }}
            >
              <h3>GC Content</h3>
              <GLgraph GC={props.GC} />
            </div>
            <div id="gc-word">
            <p >
              Because the ratio of GC-content is crucial to the stability of DNA sequence. We
              counted the GC content of each encoded DNA sequence. The X-Axis is the percentage of
              GC content, and the Y-Axis is the number of corresponding sequences.
            </p>
            </div>
            
            <div
              className="encode-report-graph"
              id="homograph"
              style={{
                fontSize: "15px",
              }}
            >
              <h3>Repeated Sequences Length</h3>
              <HomoGraph homo={props.homo} />
            </div>
            <div id="homo-word">
            <p>
              The presence of repetitive sequences affects the accuracy of synthesis and sequence
              sequencing during DNA storage. So, we counted the number of repeats in the encoded DNA
              sequence. The x-axis is the length of the repeated sequence, and the y-axis is the
              corresponding number.
            </p>
            </div>
            <div id="energygraph" className="encode-report-graph">
              <h3>Sequence minimum Free Energy</h3>
              <EnergyGraph energy={props.energy} />
            </div>
            <div
              className="encode-report-footer-text"
              style={{
                fontSize: "15px",
              }}
            >
              <div className="encode-report-footer-result">
                <p>
                  <strong>
                    The sequence average minimum free energy is : {props.dnainfo.min_free_energy}
                  </strong>
                  <br></br>
                  <strong>
                    The percentage of sequence minimum free energy below 30 Kcal/mol is : {props.mini} %
                  </strong>
                </p>
              </div>
              <div className="encode-report-footer-information">
                <p>
                  The minimum free energy (MFE) of a DNA sequence is the minimum of the Gibbs
                  standard free energy of all possible secondary structures. Therefore, the quality
                  of DNA sequences can be measured by calculating the MFE of each sequence. Here we
                  calculated the minimum free energies if randomly selected 1000 encoded DNA
                  sequences by RNAfold.
                </p>
              </div>
            </div>
            <div className="encode-report-button-wrapper">
              <Button
                type="primary"
                shape="round"
                icon={<DownloadOutlined />}
                size={size}
                onClick={DownloadURL}
              >
                Download
              </Button>
              {props.btnNext?
                  <Button
                  style={{marginLeft:"100px",width:"100px"}}
                    type="primary"
                    shape="round"
                    size={size}
                    onClick={handleNext}
                  >
                    Next
                  </Button>:null}
            </div>
          </Card>
        </div>
      </Spin>
    </div>
  );
};

Report.defaultProps = new ReportProps();
