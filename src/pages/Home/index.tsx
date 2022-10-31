import React from "react";
import { Link, PathRouteProps } from "react-router-dom";
import "./index.less";
import { Image } from 'antd';
import pic1 from './pic.jpg'
import { InboxOutlined } from "@ant-design/icons";
import { Button, UploadProps } from "antd";
import { message, Upload } from "antd";
export class HomeProps {}

export const Home: React.FC<HomeProps> = (props) => {
  return (
    <div>
    <div className="home-content1" style={{height:1050,backgroundColor:"#7da2ce"}}>
      <h1 style={{color:"black",marginLeft:"500px",paddingTop:"100px",fontSize:"26px"}}> <strong>Welcome to the DNA Storage Designer</strong></h1>
      <p style={{color:"black",marginLeft:"330px",paddingTop:"20px",fontSize:"20px"}}>
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br></br>
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br></br>
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br></br>
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br></br>
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br></br>
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br></br>
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br></br>
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      </p>
      <img
          width={700}
          height={400}
          src={pic1}
          style={{marginLeft:"410px",paddingTop:"20px"}}
      />
      <br></br>
      <Button className="home-button" size="large" type="primary" shape="round" style={{marginLeft:"500px",marginTop:"40px"}}>
              <Link to="/services">Service</Link>
      </Button>
      <Button className="home-button" size="large" shape="round" style={{marginLeft:"100px",marginTop:"20px"}}>
              <Link to="/methods">Methods</Link>
      </Button>
      <Button className="home-button" size="large" shape="round" style={{marginLeft:"100px",marginTop:"20px"}}>
              <Link to="/contact">Contact</Link>
      </Button>
    </div>
    <div className="home-content2" style={{height:400,backgroundColor:"white"}}>
          <div className="button-container">
            <Button className="home-button" size="large">
              <Link to="/services">Getting Start</Link>
            </Button>
            <Button className="home-button" size="large">
              <Link to="/tutorial">Manual</Link>
            </Button>
          </div>
      </div>
    </div>
  );
};
Home.defaultProps = new HomeProps();
