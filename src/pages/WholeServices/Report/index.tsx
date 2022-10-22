import React, { useEffect, useState } from "react";
import { Card, Table,Anchor} from "antd";
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

}
interface DataType {
  key: string;
  name1: string;
  value1: any;
}
const { Link } = Anchor;
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
      name1: "Net information density",
      value1: props.dnainfo.nucleotide_counts,
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
      value1: props.dnainfo.min_free_energy_below_30kcal_mol,
    },

  ];
  
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
            <div id="fileinfo"
              style={{ marginTop: "30px", marginLeft: "50px", width: "800px" }}
            >
              <Card title="File Information" headStyle={{backgroundColor:'#99CCFF'}}>
                <Table
                  columns={columns1}
                  dataSource={data1}
                  pagination={{ position: ["none"] }}
                />
              </Card>
            </div>

            <div style={{ marginTop: "30px", marginLeft: "50px" }} id="dnainfo">
              <Card title="DNA Information" headStyle={{backgroundColor:'#99CCFF'}}>
                <Table
                  columns={columns2}
                  dataSource={data2}
                  pagination={{ position: ["none"] }}
                />
              </Card>
            </div>

            <Card
              title="Title: GC_Contact"
              type="inner"
              style={{ marginLeft: "50px", marginTop: "10px", width: "800px" }}
              headStyle={{backgroundColor:'#99CCFF'}}
            >
              <div 
                id="gcgraph"
                style={{
                  paddingLeft: "50px",
                  paddingTop: "30px",
                  fontSize: "15px",
                  width: "750px",
                }}
              >
                <GLgraph GC={props.GC} />
              </div>
            </Card>

            <Card
              title="Title: Homopolymer Length"
              type="inner"
              style={{ marginLeft: "50px", marginTop: "30px", width: "800px" }}
              headStyle={{backgroundColor:'#99CCFF'}}
            >
              <div
                id="homograph"
                style={{
                  paddingLeft: "50px",
                  paddingTop: "30px",
                  fontSize: "15px",
                  width: "750px",
                }}
              >
                <HomoGraph homo={props.homo} />
              </div>
            </Card>
            
            <div style={{ marginTop: "30px", marginLeft: "50px" }} id="energyinfo">
              <Card 
                title="Min Energy Information" 
                headStyle={{backgroundColor:'#ADD8E6'}}>
                <Table
                  columns={columns3}
                  dataSource={data3}
                  pagination={{ position: ["none"] }}
                />
              </Card>
            </div>

            <Card
              title="Title: Sequence Min Free Energy "
              type="inner"
              style={{ marginLeft: "50px", marginTop: "30px", width: "800px" }}
              headStyle={{backgroundColor:'#ADD8E6'}}
            >
              <div
                id="energygraph"
                style={{
                  paddingLeft: "50px",
                  paddingTop: "30px",
                  fontSize: "15px",
                  width: "750px",
                }}
              >
                <EnergyGraph energy={props.energy} />
              </div>
            </Card>

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
            {/* <div > 
            <Anchor>
                <Link href="#fileinfo" title="Basic demo" />
                <Link href="#dnainfo" title="Static demo" />
                <Link href="#gcgraph" title="API"/>
                <Link href="#homograph" title="API"/>
                <Link href="#energyinfo" title="API"/>
                <Link href="#energygraph" title="API"/>
            </Anchor>
            </div> */}
            
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
