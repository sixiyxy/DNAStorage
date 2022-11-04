import React from "react";
import "./index.less";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import { Breadcrumb } from 'antd';
import logo from './professor-img-3.png'
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
                <p style={{fontSize:"18px",textAlign:"justify"}}>DNA Storage Designer is developed and maintained by the DMCI Lab team from Department of Computer Science and Technology of Xiamen University. 
                  Professor Liu conceived of the study, carried out the web server design. 
                  Likun Jiang participated in website design and carried out writing back-end code. 
                  Ziyun Zou design and written “Error Simulation”part back-end code. 
                  Xinyu Yu and Xinru Ruan helped to code the front-end code. 
                  Other students helped to conduct literature method research.
                </p>
                <h1 style={{paddingTop:"30px",paddingBottom:"10px"}}>People involved in the DNA Storage project:</h1>
                <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Likun Jiang, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>
                <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Ziyun Zou, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>
                <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Xinyu Yu, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>
                <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Xinru Ruan, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>
                <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Xinyi Zhang, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>
                <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Yanni Xu, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>
                <p><Avatar size="small" style={{ backgroundColor: '#1678ff' }} icon={<UserOutlined />} />  Changzhi Jiang, School of Computer Science and Technology, Xiamen University, Xiamen, 361005, Fujian, China</p>
              <h1 style={{paddingTop:"30px"}}>Correspondence</h1>
              <p style={{paddingBottom:"200px",paddingTop:"10px"}}>
                <Image
                width={150}
                src={logo}
                />
                <br/>
                Dr.Xiangrong Liu<br/><a>xrliu@xmu.edu.cn</a><br/>Xiamen University<br/>Fujian, China
              </p>
              
          </div>
            

        </div>
    </div>
  );
};

Contact.defaultProps = new ContactProps();
