import React, { useEffect, useState } from "react";
import { Card, Table} from "antd";
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
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Value",
      dataIndex: "value1",
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
      title: "Value",
      dataIndex: "value1",
    },
  ];
  const columns3: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name1",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Value",
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
      value1: props.info.bit_size,
    },
    {
      key: "6",
      name1: "Encoding time",
      value1: props.dnainfo.encoding_time,
    },
  ];
  const data2: DataType[] = [
    {
      key: "1",
      name1: "Index length",
      value1: props.info.index_length,
      
    },
    {
      key: "2",
      name1: "Single DNA length",
      value1: props.dnainfo.DNA_sequence,
    },
    {
      key: "3",
      name1: "Verify method",
      value1: props.info.verify_method,
    },
    {
      key: "4",
      name1: "Encode method",
      value1: props.info.encode_method,
    },
    {
      key: "5",
      name1: "Segment length",
      value1: props.info.segment_length,
    },
    {
      key: "6",
      name1: "Segment number",
      value1: props.info.segment_number,
    },
    {
      key: "7",
      name1: "Information density",
      value1: props.dnainfo.information_density,
    },
    {
      key: "8",
      name1: "nucleotide_counts",
      value1: props.dnainfo.nucleotide_counts,
    },
    {
      key: "9",
      name1: "net_information_density",
      value1: props.dnainfo.net_information_density,
    },
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
      value1: props.mini,
    },

  ];
  console.log('dnainfo:',props.dnainfo);
  
  const DownloadURL = () => {
    // console.log(props.encodeurl);
    // console.log(props.fileURL);
    axios
      .post("http://localhost:5000/download", params1,{responseType: 'blob'})
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
            style={{ marginTop: "250px" }}
            spinning={props.spinflag}
            delay={10}
          >
            <div style={{ paddingLeft: "50px", paddingTop: "20px" }}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <a href="/">Home</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/Services">Service</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Report</Breadcrumb.Item>
        </Breadcrumb>
      </div>
            <div
              style={{ marginTop: "30px", marginLeft: "50px"}}
            >
              <Card title="File Information" style={{width:"100%"}} headStyle={{backgroundColor:'#99CCFF',textAlign:"center"}}>
                <Table
                  columns={columns1}
                  dataSource={data1}
                  pagination={{ position: ["none"] }}
                  style={{margin:"0 0 0 95px",width:"80%"}}
                />
              </Card>
            </div>

            <div style={{marginLeft: "50px"}}>
              <Card title="DNA Information" style={{width:"100%"}} headStyle={{backgroundColor:'#99CCFF',textAlign:"center"}}>
                <Table
                  columns={columns2}
                  dataSource={data2}
                  pagination={{ position: ["none"] }}
                  style={{margin:"0 0 0 95px",width:"80%"}}
                />
              </Card>
            </div>
            <div style={{marginLeft: "50px"}}>
              <Card
                title="Title: GC_Contact"
                type="inner"
                style={{width: "100%" }}
                headStyle={{backgroundColor:'#99CCFF',textAlign:"center"}}
              >
                <div
                  id="gcgraph"
                  style={{
                    paddingLeft: "0px",
                    paddingTop: "30px",
                    fontSize: "15px",
                    width: "750px",
                  }}
                >
                  <GLgraph GC={props.GC} />
                </div>
              </Card>
            </div>
            <div style={{marginLeft: "50px"}}>
            <Card
              title="Title: Homopolymer Length"
              type="inner"
              style={{width: "100%" }}
              headStyle={{backgroundColor:'#99CCFF',textAlign:"center"}}
            >
              <div
                id="homograph"
                style={{
                  paddingTop: "30px",
                  fontSize: "15px",
                  width: "750px",
                }}
              >
                <HomoGraph homo={props.homo} />
              </div>
            </Card>
            </div>
            <div style={{marginLeft: "50px",marginTop:"30px"}}>
              <Card 
                title="Min Energy Information" 
                style={{width:"100%"}}
                headStyle={{backgroundColor:'#ADD8E6',textAlign:"center"}}>
                <Table
                  columns={columns3}
                  dataSource={data3}
                  pagination={{ position: ["none"] }}
                  style={{margin:"0 0 0 75px",width:"80%"}}
                />
              </Card>
            </div>
          <div style={{marginLeft: "50px"}}>
              <Card
                title="Title: Sequence Min Free Energy "
                type="inner"
                style={{width: "100%" }}
                headStyle={{backgroundColor:'#ADD8E6',textAlign:"center"}}
              >
                <div
                  id="energygraph"
                  style={{
                    paddingLeft: "50px",
                    paddingTop: "30px",
                    width: "750px",
                  }}
                >
                  <EnergyGraph energy={props.energy} />
                </div>
              </Card>
            </div>
            <div style={{ marginLeft: "350px", marginTop: "100px" }}>
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
