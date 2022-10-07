import React from "react";
//import "./index.less";
import GLgraph from './components/GLgraph'
import HomoGraph from './components/HomoGraph'
import Information from './components/Information'
export class ReportProps {
  GC;
  homo;
  info;
  fileinfo;
  fileId;
  dnainfo;
}

export const Report: React.FC<ReportProps> = (props) => {
  return(
    <div>
    <div
        id="information"
        style={{ paddingLeft: "50px", paddingTop: "30px", fontSize: "15px",width:"600px"}}
      >
        {/* <Information info={info} fileId={props.fileId} fileinfo={fileinfo} /> */}
        <Information dnainfo={props.dnainfo} info={props.info} fileId={props.fileId} fileinfo={props.fileinfo}/>
      </div>
    <div
        id="gcgraph"
        style={{ paddingLeft: "50px", paddingTop: "30px", fontSize: "15px" }}
      >
        <h2>Title:GC_Contact</h2>
        {/*<GLgraph gc={gc}/>*/}
        <GLgraph GC={props.GC}/>
      </div>
      <div
        id="homograph"
        style={{ paddingLeft: "50px", paddingTop: "30px", fontSize: "15px" }}
      >
        <h2>Title:Homopolymer Length</h2>
        {/*<HomoGraph homo={homo}>*/}
        <HomoGraph homo={props.homo}/>
      </div>
    </div>)
  
};

Report.defaultProps = new ReportProps();