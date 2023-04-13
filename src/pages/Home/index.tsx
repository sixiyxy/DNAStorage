import React, { useEffect, useState } from "react";
import { Link, PathRouteProps } from "react-router-dom";
import { Col, Row } from "antd";
import "./index.less";
import { Image } from "antd";
import pic1 from "../../assets/tutorial/home.png";
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
        <h1 style={{ color: "white", paddingTop: "100px", fontSize: "33px" }}>
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
          In recent times, synthetic DNA has garnered significant attention as a molecular medium for digital data storage owing to its superior characteristics. 
          These include theoretical retention time, power consumption, and storage density that surpass conventional electronic memory devices. 
          As a result, synthetic DNA has emerged as a highly promising medium for digital data storage. 
          However, practical applications of synthetic DNA are limited due to uncertainties in in vitro DNA synthesis and sequencing, 
          conjugation chemistry, and preservation conditions. These issues can result in significant errors and data loss. 
          Thus, DNA Storage Designer is proposed to simulate the workflow of the whole system to guide the design of the experiments. 
          This approach comprises three main stages for wet experiments: encoding, error simulation, and decoding. 
          To provide user-friendly services, the website embeds popular methods and platforms related to DNA storage instead of asking users for complex parameters. 
          It also offers comprehensive guidelines and simulated feedback based on user settings to help users adjust their experimental plans accordingly.

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
            The very first step for DNA Storage experiment is to encode files(usually binary format) into DNA bases(A,C,G,T) and sequences. 
            Therefore, we could synthesis the sequences and store the files accordingly. 
            The encode service integrates eight encoding and two verifying methods about DNA storage. 
            After uploading the file, users could simply select corresponding methods and elegantly set the segment length. 
            The result makes a visual analysis of the encoded file and presents relevant information.

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
