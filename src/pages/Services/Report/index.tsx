import React from "react";
import { Card } from 'antd';
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

export const Report: React.FC<ReportProps> = (props) => {
  return(
    <div>
      <div className="spinstyle" style={{paddingLeft:"1400px"}}>
        <Spin spinning={props.spinflag} delay={10} size="large"/> 
      </div>
      <Row>
        <Col span={12}>
            <div
            id="information"
            style={{ paddingLeft: "15px", paddingTop: "30px",fontSize: "15px",width:"665px"}}
          >
            {/* <Information info={info} fileId={props.fileId} fileinfo={fileinfo} /> */}
            <Information info={props.info} fileId={props.fileId} fileinfo={props.fileinfo}/>
          </div>
        </Col>
        <Col span={12}>
            <div
            id="dnainfo"
            style={{ paddingLeft: "15px", paddingTop: "15px", fontSize: "15px",width:"665px"}}
          >
            {/* <Information info={info} fileId={props.fileId} fileinfo={fileinfo} /> */}
            <DNAinfo dnainfo={props.dnainfo} info={props.info} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
            <Card title="Title:GC_Contact" type="inner" style={{ marginLeft:"15px",marginTop:"30px",width:"650px"}}>
                <div
                id="gcgraph"
                style={{ paddingLeft: "50px", paddingTop: "30px", fontSize: "15px" }}
              > 
                {/*<GLgraph gc={gc}/>*/}
                <GLgraph GC={props.GC}/>
              </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Title:Homopolymer Length" type="inner" style={{ marginLeft:"15px",marginTop:"30px",width:"650px"}}>
            <div
            id="gcgraph"
            style={{ paddingLeft: "50px", paddingTop: "30px", fontSize: "15px" }}
          > 
            {/*<GLgraph gc={gc}/>*/}
            <HomoGraph homo={props.homo}/>
          </div>
          </Card>
        </Col>
      </Row>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
    </div>)
  
};

Report.defaultProps = new ReportProps();