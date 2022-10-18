import React,{useEffect,useState}from "react";
import { Card,Table} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Col, Row,Breadcrumb } from 'antd';
import GLgraph from './components/GLgraph'
import HomoGraph from './components/HomoGraph'
import EnergyGraph from './components/EnergyGraph'
import './index.less'
// import Information from './components/Information'
// import DNAinfo from './components/DNAinfo'
import { Spin } from 'antd';
export class ReportProps {
  GC;
  homo;
  info;
  fileinfo;
  fileId;
  dnainfo;
  spinflag;
  energy;
}
interface DataType {
  key: string;
  name1: string;
  value1: any;
  name2: string;
  value2:any;
}
export const Report: React.FC<ReportProps> = (props) => {
  const columns1: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name1',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Value',
      dataIndex: 'value1',
    },
    {
      title: 'Name',
      dataIndex: 'name2',
      render: text => <a>{text}</a>,
    },
    {
      title:'Value',
      dataIndex:'value2',
    }
  ];
  const columns2: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name1',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Value',
      dataIndex: 'value1',
    },
    {
      title: 'Name',
      dataIndex: 'name2',
      render: text => <a>{text}</a>,
    },
    {
      title:'Value',
      dataIndex:'value2',
    }
  ];
  const data1: DataType[] = [
    {
      key: '1',
      name1: 'Job ID',
      value1: props.fileinfo.fileId,
      name2: 'File type',
      value2: props.fileinfo.filetype,
    },
    {
      key: '2',
      name1: 'File name',
      value1: props.fileinfo.filerename,
      name2: 'File bites',
      value2: props.info.bit_size,
    },
    {
      key: '3',
      name1: 'File bytes',
      value1: props.info.byte_size,
      name2: 'Encoding time:',
      value2: props.dnainfo.encoding_time,
    }
  
    
  ];
  const data2: DataType[] = [
    {
      key: '1',
      name1: 'Index length',
      value1: props.info.index_length,
      name2: 'Segment length',
      value2: props.info.segment_length,
    },
    {
      key: '2',
      name1: 'Single DNA length',
      value1: props.dnainfo.DNA_sequence,
      name2: 'Segment number',
      value2: props.info.segment_number,
    },
    {
      key: '3',
      name1: 'Verify method',
      value1: props.info.verify_method,
      name2: 'Information density',
      value2: props.dnainfo.information_density,
    },
    {
      key: '4',
      name1: 'Encode method',
      value1: props.info.encode_method,
      name2: 'Net information density',
      value2: props.dnainfo.nucleotide_counts,
    },
    
  ];

  return(
    <div className="reportContainer">
      <Spin tip="Loading..." size="large" style={{marginTop:"250px",marginLeft:"200px"}} spinning={props.spinflag} delay={10}>
      <div style={{ paddingLeft: "300px", paddingTop: "20px" }}>
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
        <div style={{marginTop:"30px",marginLeft:"300px",width:"800px"}}>
          <Card title="File Information">
              <Table
                columns={columns1}
                dataSource={data1}
                pagination={{ position: ["none"] }}
              />
          </Card>
        </div>

        <div style={{marginTop:"30px",marginLeft:"300px"}}>
          <Card title="DNA Information">
            <Table
              columns={columns2}
              dataSource={data2}
              pagination={{ position: ["none"] }}
            />
          </Card>
        </div>
      

    <Card title="Title:GC_Contact" type="inner" style={{ marginLeft:"300px",marginTop:"10px",width:"800px"}}>
        <div
            id="gcgraph"
            style={{ paddingLeft: "50px", paddingTop: "30px", fontSize: "15px",width:"750px"}}
        > 
          <GLgraph GC={props.GC}/>
        </div>
    </Card>
    
    <Card title="Title:Homopolymer Length" type="inner" style={{ marginLeft:"300px",marginTop:"30px",width:"800px"}}>
        <div
            id="homograph"
            style={{ paddingLeft: "50px", paddingTop: "30px", fontSize: "15px",width:"750px"}}
        > 
          <HomoGraph homo={props.homo} />
        </div>
    </Card>

    {/* <Card title="Title:Energy Length" type="inner" style={{ marginLeft:"300px",marginTop:"30px",width:"650px"}}>
        <div
            id="energygraph"
            style={{ paddingLeft: "50px", paddingTop: "30px", fontSize: "15px" }}
        > 
          <EnergyGraph energy={props.energy} />
        </div>
    </Card> */}

      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      </Spin>
    </div>)
  
};

Report.defaultProps = new ReportProps();