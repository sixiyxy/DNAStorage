import React from "react";
import "./index.less";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import { Breadcrumb } from 'antd';
import logo from './professor-img-3.png';
import jlk from './jlk.jpg';
import yxy from './yxy.jpg';
import rxr from './rxr.jpg';
import zzy from './zzy.jpg';
import {
  Col,
  Row
} from "antd";
export class ContactProps {}

export const Contact: React.FC<ContactProps> = (props) => {
  return (
    <div className="Contact_Container" >
        <div className="contact">
          <div className="contact_inner" >
          <div style={{paddingTop:"30px"}}>
            <Breadcrumb separator=">">
                  <Breadcrumb.Item>
                    <a href="/home">Home</a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>Contact</Breadcrumb.Item>
              </Breadcrumb>
          </div>
              <h1 style={{paddingTop:"30px"}}>Information</h1>
                <p style={{textAlign:"justify",width:"80%"}}>DNA Storage Designer is developed and maintained by the DMCI Lab team from Department of Computer Science and Technology of Xiamen University. 
                  Professor Liu conceived of the study, carried out the web server design. 
                  Likun Jiang participated in website design and carried out writing back-end code. 
                  Ziyun Zou design and written “Error Simulation”part back-end code. 
                  Xinyu Yu and Xinru Ruan helped to code the front-end code. 
                  Other students helped to conduct literature method research.
                </p>
                {/* <h1 style={{paddingTop:"30px",paddingBottom:"10px"}}>People involved in the DNA Storage project:</h1> */}
                {/* <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Likun Jiang, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>
                <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Ziyun Zou, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>
                <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Xinyu Yu, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>
                <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Xinru Ruan, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p> */}
                
              <h1 style={{paddingTop:"30px",paddingBottom:"30px"}}>Introduction of participating members</h1>
              <Row gutter={20}>
              <Col span={5}>
                <p style={{width:"80%"}}>
                  <Image
                  width={"78%"}
                  height={"100%"}
                  src={jlk}
                  
                  />
                  <br/>
                  <br/>
                  <strong>Ph.D. Likun Jiang</strong><br/>
                  School of Computer Science and Technology<br/>
                  Xiamen University
                </p>
              </Col>
              <Col span={5}>
              <p style={{margin:"0 0 0 30px",width:"80%"}}>
                  <Image
                  width={"69%"}
                  height={"100%"}
                  src={zzy}
                  
                  />
                  <br/>
                  <br/>
                  <strong>Master. Ziyun Zou</strong><br/>
                  School of Computer Science and Technology<br/>
                  Xiamen University
                </p>
              </Col>
              <Col span={5}>
              <p style={{margin:"0 0 0 70px",width:"80%"}}>
                  <Image
                  width={"78%"}
                  height={"100%"}
                  src={rxr}
                  />
                  <br/>
                  <br/>
                  <strong>Master. Xinru Ruan</strong><br/>
                  School of Computer Science and Technology<br/>
                  Xiamen University
                </p>
              
              </Col>
              <Col span={5}>
              <p style={{margin:"0 0 0 100px",width:"70%"}}>
                  <Image
                  width={"77%"}
                  height={"100%"}
                  src={yxy}
                  
                  />
                  <br/>
                  <br/>
                  <strong>Master. Xinyu Yu</strong><br/>
                  School of Computer Science and Technology<br/>
                  Xiamen University
                </p>

              </Col>
              </Row>
              <br/>
              <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Yinghao Lan, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>
              <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Zelong Chen, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>
              <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Xinyi Zhang, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>
              <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Yanni Xu, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>
              <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Changzhi Jiang, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>

              <h1 style={{paddingTop:"30px"}}>Correspondence</h1>
              <Row gutter={8}>
                <Col span={4} >
                <p style={{paddingBottom:"200px",paddingTop:"20px",marginRight:"10px"}}>
                <Image
                width={"100%"}
                src={logo}
                />
              </p>
                
                </Col>
                <Col span={8} >
                <p style={{paddingBottom:"200px",paddingTop:"20px",marginLeft:"20px",width:"100%"}}>
                  <span style={{fontSize:"18px"}}><strong>Professor. Xiangrong Liu</strong></span><br/><br/>
                  <a>xrliu@xmu.edu.cn</a><br/>
                  Department of Computer Science and Technology<br/>
                  Xiamen University<br/>
                  Fujian, China
                </p>
                
                </Col>
              </Row>
              
              
          </div>
            

        </div>
    </div>
  );
};

Contact.defaultProps = new ContactProps();
