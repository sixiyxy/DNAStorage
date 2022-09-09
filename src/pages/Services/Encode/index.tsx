import React,{useState}from "react";
import "./index.less";
import { Breadcrumb } from 'antd';
import {Encodelist} from '../../../components/Encodelist'
import {Uploads} from '../../../components/Uploads'
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
      <div>
        <p style={{paddingLeft:"30px",paddingTop:"20px",fontSize:"18px",marginBottom:"0px"}}>Please upload the storage files:</p> 
        <Uploads/>
      </div>
      <div>
        <p style={{paddingLeft:"30px",paddingTop:"70px",fontSize:"18px",marginBottom:"0px"}}>请在下面的勾选框中选出适合自己的编码方法:</p>
      </div>
      <Encodelist/>
    </div>
    
  );
};
Encode.defaultProps = new EncodeProps();