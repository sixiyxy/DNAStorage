import React,{useEffect,useState}from "react";
import { Card,Table} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Col, Row } from 'antd';
import GLgraph from './components/GLgraph'
import HomoGraph from './components/HomoGraph'
import Information from './components/Information'
import DNAinfo from './components/DNAinfo'
import { Spin } from 'antd';
export class ReportProps {
  GC;
  homo;
  info;
  fileinfo;
  fileId;
  dnainfo;
  spinflag;

}
interface DataType {
  key: string;
  name1: string;
  value1: any;
  name2: string;
  value2:any;
}
export const Report: React.FC<ReportProps> = (props) => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'FileInfos',
      dataIndex: 'name1',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Value',
      dataIndex: 'value1',
    },
    {
      title: 'DNAInfos',
      dataIndex: 'name2',
      render: text => <a>{text}</a>,
    },
    {
      title:'Value',
      dataIndex:'value2',
    }
  ];

  const data: DataType[] = [
    {
      key: '1',
      name1: 'Job ID',
      value1: props.fileinfo.fileId,
      name2: 'Index length:',
      value2: props.info.index_length,
    },
    {
      key: '2',
      name1: 'File name',
      value1: props.fileinfo.filerename,
      name2: 'Segment length',
      value2: props.info.segment_length,
    },
    {
      key: '3',
      name1: 'File type',
      value1: props.fileinfo.filetype,
      name2: 'Segment number:',
      value2: props.info.segment_number,
    },
    {
      key: '4',
      name1: 'File bites',
      value1: props.info.bit_size,
      name2: 'Single DNA length:',
      value2: props.dnainfo.DNA_sequence,
    },
    {
      key: '5',
      name1: 'File bytes',
      value1: props.info.byte_size,
      name2: 'Encoding time:',
      value2: props.dnainfo.encoding_time,
    },
    {
      key: '6',
      name1: 'Verify method:',
      value1: props.info.verify_method,
      name2: 'Information density',
      value2: props.dnainfo.information_density,
    },
    {
      key: '7',
      name1: 'Encode method',
      value1: props.info.encode_method,
      name2: 'Net information density',
      value2: props.dnainfo.nucleotide_counts,
    },
    
  ];

  return(
    <div>
      <Spin tip="Loading..." size="large" style={{marginTop:"250px",marginLeft:"200px"}} spinning={props.spinflag} delay={10}>

        <div style={{marginTop:"30px",marginLeft:"300px"}}>
          <Table
            columns={columns}
            dataSource={data}
          />
        </div>
      

    <Card title="Title:GC_Contact" type="inner" style={{ marginLeft:"300px",marginTop:"10px",width:"650px"}}>
        <div
            id="gcgraph"
            style={{ paddingLeft: "50px", paddingTop: "30px", fontSize: "15px" }}
        > 
          <GLgraph GC={props.GC}/>
        </div>
    </Card>
    
    <Card title="Title:Homopolymer Length" type="inner" style={{ marginLeft:"300px",marginTop:"30px",width:"650px"}}>
        <div
            id="gcgraph"
            style={{ paddingLeft: "50px", paddingTop: "30px", fontSize: "15px" }}
        > 
          <HomoGraph homo={props.homo} />
        </div>
    </Card>

      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      </Spin>
    </div>)
  
};

Report.defaultProps = new ReportProps();