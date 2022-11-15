import React, { useEffect, useState } from "react";
import { Card, Table,Divider, List} from "antd";
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
import {API_PREFIX} from "../../../common/Config";
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

}
interface DataType {
  key: string;
  name1: string;
  value1: any;
}

export const Report: React.FC<ReportProps> = (props) => {
  const [size, setSize] = useState<SizeType>("large");
  var params1 ={
    "file_uid":props.exam?"1565536927137009664":props.fileId,
    "type":"encode"
  }
  const columns1: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name1",
      width:"55%",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Information",
      dataIndex: "value1",
      align:"center"
    },
    // {
    //   title: "Name",
    //   dataIndex: "name2",
    //   render: (text) => <a>{text}</a>,
    // },
    // {
    //   title: "Value",
    //   dataIndex: "value2",
    // },
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
      align:"center"
    },
  ];
  const columns3: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name1",
      width:"340px",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Information",
      dataIndex: "value1",
    },
  ];
 
  const data1: DataType[] = [
    {
      key: "1",
      name1: "Job ID",
      value1: props.exam?"1565536927137009664":props.fileinfo.fileId,
      
    },
    {
      key: "2",
      name1: "File name",
      value1: props.exam?"Picture Demo":props.fileinfo.filerename,
    },
    {
      key: "3",
      name1: "File bytes",
      value1: props.info.byte_size,
    },
    {
      key: "4",
      name1: "File type",
      value1: props.exam?"jpg":props.fileinfo.filetype,
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
      value1: props.info.encode_method,
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
      value1: props.info.verify_method,
    },
    {
      key: "5",
      name1: "Segment number",
      value1: props.info.segment_number,
    },
    {
      key: "6",
      name1: "Encoding time",
      value1: `${props.dnainfo.encoding_time} s`,
    },
    {
      key: "7",
      name1: "Single DNA length",
      value1: `${props.dnainfo.DNA_sequence} bp`,
    },
    {
      key: "8",
      name1: "DNA sequence number",
      value1: props.info.segment_number,
    },
    {
      key: "9",
      name1: "Nucleotide counts",
      value1: props.dnainfo.nucleotide_counts,
    },
    {
      key: "10",
      name1: "Information density",
      value1: `${props.dnainfo.information_density} bits/nt`,
    }
  ];
  const data3: DataType[] = [
    {
      key: "1",
      name1: "Min free energy",
      value1: props.dnainfo.min_free_energy,
      
    },
    {
      key: "2",
      name1: "Min free energy below 30kcal/mol",
      value1: `${props.mini} %`,
    },

  ];
  console.log('dnainfo:',props.dnainfo);
  
  const DownloadURL = () => {
    // console.log(props.encodeurl);
    // console.log(props.fileURL);
    axios
      .post(API_PREFIX + "/download", params1,{responseType: 'blob'})
      .then(function (response) {
        console.log(response.data);
        const link = document.createElement('a');  //创建一个a标签
        const blob = new Blob([response.data]);             //实例化一个blob出来
        link.style.display = 'none';       
        link.href = URL.createObjectURL(blob);    //将后端返回的数据通过blob转换为一个地址
    //设置下载下来后文件的名字以及文件格式
        link.setAttribute(
      'download',
      `${props.exam?"Picture Demo":props.fileinfo.filerename}.` + `${'zip'}`,     //upload为下载的文件信息 可以在外层包一个函数 将upload作为参数传递进来
    );
    document.body.appendChild(link);
    link.click();                            //下载该文件
    document.body.removeChild(link);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="reportContainer">   
          <Spin
            tip="Loading..."
            size="large"
            style={{ marginTop: "250px",marginLeft:"100px",width:"800px"}}
            spinning={props.spinflag}
            delay={10}
          >
            <div style={{ paddingLeft: "50px", paddingTop: "20px" }}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <a href="/">Home</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
           Service
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            Encode
          </Breadcrumb.Item>
          <Breadcrumb.Item>Report</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div
              style={{ marginTop: "30px", marginLeft: "120px",width:"100%"}} className="FileInformation"
            >
              <Card title="File Information" style={{width:"90%"}} headStyle={{backgroundColor:'#99CCFF',fontSize:"20px"}}>
              <p style={{
                    margin: "0px 0 30px 30px",
                    fontSize: "15px",
                    width: "80%",
                  }}>This part displays some basic information about the files uploaded by users.</p>
                <Table
                  columns={columns1}
                  dataSource={data1}
                  size={"middle"}
                  pagination={{ position: ["none"] }}
                  style={{margin:"0 0 0 100px",width:"80%"}}
                />
              </Card>
            </div>

            <div style={{marginLeft: "120px",width:"100%"}} className="EncodeInformation">
              <Card title="Encode Information" style={{width:"90%"}} headStyle={{backgroundColor:'#99CCFF',fontSize:"20px"}}>
              <p style={{
                    margin: "10px 0 0 30px",
                    fontSize: "15px",
                    width: "90%",
                  }}>This part shows the information of the uploaded file during encoding and the result of DNA sequences analysis after encoding. <br></br>
                The analysis of the encoded DNA sequences includes GC content statics, 
                repeated sequences statics and minimum free energy calculation.</p>
                <Table
                  columns={columns2}
                  dataSource={data2}
                  pagination={{ position: ["none"] }}
                  style={{margin:"30px 0 0 100px",width:"80%"}}
                />
                <div
                  id="gcgraph"
                  style={{
                    margin: "50px 0 0 130px",
                    fontSize: "15px",
                    width: "65%",
                  }}
                >
                  <h3 style={{margin:"0 0 30px 280px"}}>GC Content</h3>
                  
                  <GLgraph GC={props.GC} />
                </div>
                <p style={{
                    margin: "20px 0 80px 150px",
                    fontSize: "15px",
                    width: "650px",
                    color:"#748189"
                  }}>Because the ratio of GC-content is crucial to the stability of DNA sequence. We counted the GC content of each encoded DNA sequence.
                    The X-axis is the percentage of GC content, and the Y-axis is the number of corresponding sequences.
                  </p>
                <div
                id="homograph"
                style={{
                  margin:"30px 0 30px 140px",
                  fontSize: "15px",
                  width: "60%",
                }}
              >
                <h3 style={{margin:"0 0 30px 235px"}}>Repeated Sequences</h3>
                <HomoGraph homo={props.homo} />
                
              </div>
              <p style={{
                    margin: "30px 0 0 150px",
                    fontSize: "15px",
                    width: "650px",
                    color:"#748189"
                  }}>The presence of repetitive sequences affects the accuracy of synthesis and sequence sequencing during DNA storage. 
                  So, we counted the number of repeats in the encoded DNA sequence. The x-axis is the length of the repeated sequence, and the y-axis is the corresponding number.</p>
                  <div
                  id="energygraph"
                  style={{
                    paddingLeft:"20px",
                    margin: "80px 0 30px 120px",
                    width: "65%",
                  }}
                >
                  <h3 style={{margin:"0px 0 30px 220px"}}>Sequence Minimum Free Energy</h3>
                  <EnergyGraph energy={props.energy} />
                </div>
                <div style={{
                    margin: "20px 0 0 150px",
                    fontSize: "15px",
                    width: "670px",
                    color:"#748189"
                  }}>
                <p><strong>The sequence average minimum free energy is : {props.dnainfo.min_free_energy}</strong></p>
                <p><strong>The percentage of sequence minimum free energy below 30 Kcal/mol is : {props.mini} %</strong></p>
                <p>The minimum free energy (MFE) of a DNA sequence is the minimum of the Gibbs standard free energy of all possible secondary structures. 
                  Therefore, the quality of DNA sequences can be measured by calculating the MFE of each sequence. 
                  Here we calculated the minimum free energies if randomly selected 1000 encoded DNA sequences by RNAfold.</p>
                </div>
            <div style={{margin: "100px 0 80px 400px" }}>
                  <Button
                    type="primary"
                    shape="round"
                    icon={<DownloadOutlined />}
                    size={size}
                    onClick={DownloadURL}
                  >
                    Download
                  </Button>
            </div>
              </Card>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
          </Spin>
    </div>
  );
};

Report.defaultProps = new ReportProps();
