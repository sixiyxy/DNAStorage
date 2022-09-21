import React,{useState,useEffect}from "react";
import "./index.less";
import { Breadcrumb } from 'antd';
import {Encodelist} from '../Encode/components/Encodelist'
import Uploads from '../Encode/components/Uploads'
import Sliders from '../Encode/components/Sliders'
import Graphs from '../Encode/components/Graphs'

import { Anchor } from 'antd';
const { Link } = Anchor;

export class EncodeProps {}



export const Encode: React.FC<EncodeProps> = (props) => {

  const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined);
  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);

  const SaveValue = [{Segvalue:0},{Indexvalue:0}]
  const [values,setValues] = useState(SaveValue);
  const [method,setMethod] = useState('WithoutVerifycode')
  
  //获取Slider中的参数信息传递给Graph
  const ParamPass=(param1:any,param2:any)=>{
    // console.log("父亲",param1);
    // console.log("父亲",param2);
    setValues(param2) //value
    setMethod(param1) //method
    console.log("父亲",values);
    console.log("父亲",method);
  }
  
  return (
    <div className="EncodeContainer">
      <div style={{paddingLeft:"30px",paddingTop:"20px"}}>
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
      <div id='uploads' style={{paddingLeft:"250px",paddingTop:"20px",fontSize:"18px"}}>
        <p ><strong>Please upload the storage files:</strong></p> 
        <Uploads/>
      </div>
      <div id='sliders' style={{paddingLeft:"250px",paddingTop:"50px",fontSize:"14px"}}>
        <hr/>
        <Sliders sendValueToFather={ParamPass.bind(this)}/>
      </div>
      <div id='graphs' style={{paddingLeft:"250px",paddingTop:"20px"}}>
        <hr/>
        <Graphs values={values} method={method}/>
      </div>
      
      <div id='encodelist' style={{paddingLeft:"150px",paddingTop:"20px",fontSize:"15px"}}>
        <p style={{paddingLeft:"100px",fontSize:"17px"}}><hr/><strong>请在下面的勾选框中选出适合自己的编码方法:</strong></p>
        <Encodelist/>
      </div>
      <div style={{ position:"fixed",top:"200px",margin:"0px 1150px"}}>
            <Anchor targetOffset={targetOffset}>

              <Link href="#uploads" title="File Upload" />
              <Link href="#sliders" title="Choose method and length" />
              <Link href="#graphs" title="Draw" />
              <Link href="#encodelist" title="Choose decode method" />
      
            </Anchor>  
        </div>
    </div>
    
  );
};
Encode.defaultProps = new EncodeProps();