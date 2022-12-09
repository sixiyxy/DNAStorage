import React, { useEffect, useState } from "react";
import { Link, PathRouteProps } from "react-router-dom";
import { Col, Row } from "antd";
import "./index.less";
import { Image } from "antd";
import pic1 from "./Home1031.png";
import { InboxOutlined } from "@ant-design/icons";
import { Button, notification, Drawer, Modal } from "antd";
import { message, Upload } from "antd";
import type { DrawerProps, RadioChangeEvent } from "antd";
import { ContainerTwoTone, PhoneTwoTone } from "@ant-design/icons";
export class HomeProps {}

export const Home: React.FC<HomeProps> = (props) => {
  const [count, setCount] = useState(0);

  return (
    <div className="home">
      <div className="home-content1" style={{ height: "100%", backgroundColor: "#1B5585" }}>
        <h1 style={{ color: "white", paddingTop: "100px", fontSize: "30px" }}>
          {" "}
          <strong>Welcome to the DNA Storage Designer</strong>
        </h1>
        <p
          style={{
            color: "white",
            marginLeft: "160px",
            marginRight: "160px",
            paddingTop: "30px",
            fontSize: "20px",
            lineHeight: "40px",
            textAlign: "justify",
          }}
        >
          DNA Storage Designer is an easy-to-use online web-server that covers the simulation of
          whole process of DNA storage application. It includes eight popular encoding methods and
          realizes the corresponding decoding process. Users can choose freely and convert uploaded files into DNA sequences. In addition, it also simulates the sequence
          errors in the five DNA sequences storage processes of synthesis, decay, PCR, sampling and
          sequencing. Users can not only use independent 'Encode' modules to encode files and obtain
          DNA sequences for vivo/in vivo storage experiments, but also could upload DNA sequences to
          simulate sequence errors during storage by the 'Simulation' modules. Aiming to provide
          user-friendly services, this website embeds the most popular methods and platforms
          related to DNA storage instead of asking users for complex parameters. It also provides
          thorough guidelines and simulated feedback based on user settings so that user could
          adjust their experimental plan accordingly.
        </p>
        <div style={{ paddingTop: "30px", textAlign:"center"}}>
          <img
            style={{ width: "80%" }}
            // width="80%"
            // height="50%"
            src={pic1}
          />
        </div>
        <div
          style={{ marginTop: "40px", display: "flex", flexDirection: "row", marginBottom: "60px" }}
        >
          <Button className="home-button" size="large" type="primary" shape="round">
            <Link to="/services/wholeprocess">Getting Started</Link>
          </Button>
          {/* <Button className="home-button" size="large" shape="round" style={{marginLeft:"200px",marginTop:"20px"}} icon={<ContainerTwoTone/>}>
              <Link to="/methods"> Methods</Link>
      </Button> */}
          <Button
            className="home-button"
            size="large"
            shape="round"
            style={{ marginLeft: "280px" }}
            icon={<ContainerTwoTone />}
          >
            <Link to="/tutorial"> Tutorial</Link>
          </Button>
        </div>
      </div>
      <div className="home-introduce-wrapper" style={{ height: "100%", backgroundColor: "white" }}>
        <div className="home-introduce-line">
          <div className="home-introduce-item">
            <h2>Encode File</h2>
            <p style={{ fontSize: "19px", textAlign: "justify" }}>
              The encode service integrates the most common and popular encoding and
              verifying methods about DNA storage. After uploading the file, users could simply select corresponding
              methods and elegantly set the segment length. The result makes a visual analysis of the encoded file and presents relevant information.
            </p>
          </div>
          <div className="home-introduce-item">
            <h2>Error Simulation</h2>
            <p style={{ fontSize: "19px", textAlign: "justify" }}>
              The simulation service allows user to upload their own fasta DNA file to proceed error
              simulation stage. It covers the five stages of DNA storage, namely, synthesis, storage
              decay, PCR, sampling, and sequencing. Users could see how sequence distribution changes accordingly and how errors
              are introduced from stages to stages.
            </p>
          </div>
        </div>
        <div className="home-introduce-line home-introduce-button-line">
          <div className="home-introduce-item">
            <Button
              className="home-button"
              type="primary"
              shape="round"
              size="large"
              // style={{ backgroundColor: "#83c5b7" }}
            >
              <Link to="/services/encode"> Try </Link>
            </Button>
          </div>
          <div className="home-introduce-item">
            <Button
              className="home-button"
              type="primary"
              shape="round"
              size="large"
              // style={{ backgroundColor: "#83c5b7" }}
            >
              <Link to="/services/simulation">Try</Link>
            </Button>
          </div>
        </div>
        {/* <div className="button-container">
            <Button className="home-button" shape="round" size="large">
              <Link to="/services">Getting Start</Link>
            </Button>
            <Button className="home-button" shape="round" size="large">
              <Link to="/tutorial">Manual</Link>
            </Button>
          </div> */}
      </div>
    </div>
  );
};
Home.defaultProps = new HomeProps();
