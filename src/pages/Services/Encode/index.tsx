import React,{useState}from "react";
import "./index.less";
import { Breadcrumb } from 'antd';
import {Encodelist} from '../Encode/components/Encodelist'
import Uploads from '../Encode/components/Uploads'
import Sliders from '../Encode/components/Sliders'
import Graphs from '../Encode/components/Graphs'
import { VerifyMethod } from "./components/VerifyMethod";
export class EncodeProps {}

export const Encode: React.FC<EncodeProps> = (props) => {
  
  
  return (
    <div>
      <div>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
                        <a href="/">Home</a>
                      </Breadcrumb.Item>
              <Breadcrumb.Item>
              <a href="/Services">Service</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Encode Data</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div style={{paddingLeft:"30px",paddingTop:"20px",fontSize:"18px"}}>
        <p ><strong>Please upload the storage files:</strong></p> 
        <Uploads/>
      </div>
      <div style={{paddingLeft:"30px",paddingTop:"50px",fontSize:"14px"}}>
        <hr/>
        <Sliders/>
      </div>
      <div style={{paddingLeft:"30px",paddingTop:"40px",fontSize:"16px"}}>
        <hr/>
        <strong>Verify Method: </strong> <VerifyMethod/>
        <p style={{fontSize:"14px"}}>Tips: Method details please click the <a href='../Methods'>Method Paper</a></p>
      </div>
      <div style={{paddingLeft:"30px",paddingTop:"20px"}}>
        <Graphs/>
      </div>
      <div style={{paddingLeft:"30px",paddingTop:"20px",fontSize:"18px"}}>
        <hr/>
        <p><strong>请在下面的勾选框中选出适合自己的编码方法:</strong></p>
      </div>
      <Encodelist/>
    </div>
    
  );
};
Encode.defaultProps = new EncodeProps();