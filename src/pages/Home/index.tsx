import React from "react";
import { Link, PathRouteProps } from "react-router-dom";
import "./index.less";
import { InboxOutlined } from "@ant-design/icons";
import { Button, UploadProps } from "antd";
import { message, Upload } from "antd";
export class HomeProps {}

export const Home: React.FC<HomeProps> = (props) => {
  return (
    <div className="home-content">
      <div className="home-model-name">
        <h1>model name</h1>
      </div>
      <div className="brief">
        简介：xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      </div>
      <div className="home-photo">
        <img></img>
      </div>

      <div className="button-container">
        <Button className="home-button">
          <Link to="/tutorial">Getting Start</Link>
        </Button>
        <Button className="home-button">
          <Link to="/tutorial">Manual</Link>
        </Button>
        <Button className="home-button">Github</Button>
      </div>
    </div>
  );
};
Home.defaultProps = new HomeProps();
