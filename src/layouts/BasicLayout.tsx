import {Layout, Menu, Row, Col, Button} from "antd";
import MenuItem from "antd/lib/menu/MenuItem";
import React from "react";
import { Link, Outlet, Route, useNavigate } from "react-router-dom";
import "./BasicLayout.less";
import AntdIcon from "../components/base/AntdIcon";
import {doGet, doPost} from "../utils/request";
export class BasicLayoutProps {}

export const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { Header, Content, Footer } = Layout;
  return (
    <Layout className="layout">
      <Header>
        <Menu theme="dark" mode="horizontal" className="header-menu">
          <Link to="/home">
            <div
              style={{
                color: "white",
                fontSize: 20,
                marginRight: "20px",
              }}
            >
              <i
                className="iconfont icon-medical"
                style={{ marginRight: "20px" }}
              ></i>
              DNA Storage Designer
            </div>
          </Link>

          <MenuItem key="home">
            <i
              className="iconfont icon-home_light"
              style={{ color: "white", display: "inline", margin: "0 3px" }}
            ></i>
            <Link to="/home">Home</Link>
          </MenuItem>

          <MenuItem key="services">
            <i
              className="iconfont icon-function-console"
              style={{ color: "white", display: "inline", margin: "0 3px" }}
            ></i>
            <Link to="/services">Services</Link>
          </MenuItem>

          <MenuItem key="tutorial">
            <i
              className="iconfont icon-bangzhushouce"
              style={{ color: "white", display: "inline", margin: "0 3px" }}
            ></i>
            <Link to="/tutorial">Tutorial</Link>
          </MenuItem>

          <MenuItem key="methods">
            <i
              className="iconfont icon-lunwenfabiaoshuliang"
              style={{ color: "white", display: "inline", margin: "0 3px" }}
            ></i>
            <Link to="/methods">Methods</Link>
          </MenuItem>
          <MenuItem key="contact">
            <i
              className="iconfont icon-lianxi"
              style={{ color: "white", display: "inline", margin: "0 3px" }}
            ></i>
            <Link to="/contact">Contact</Link>
          </MenuItem>
        </Menu>
      </Header>
      <Content>
        <Outlet />
      </Content>
      <div className="footer">
        <div className="contact">
          <span>Contact us: xrliu@xmu.edu.cn | jianglikun@stu.xmu.edu.cn</span>
          <span>This website is free to all users and there is no login requirement.</span>
        </div>
        <div className="line"/>
        <div className="organization">
          <Row>
            <Col xxl={14} xl={10} lg={8} xs={24}>
              <div className="code">
                <a href="https://github.com/sixiyxy/DNAStorage">
                  {AntdIcon.Github}
                  <span className="text">View source code</span>
                </a>
                <a href="https://github.com/sixiyxy/DNAStorage/issues">
                  {AntdIcon.Bug}
                  <span className="text">Submit bugs and corrections</span>
                </a>
              </div>
            </Col>
            <Col xxl={5} xl={7} lg={8} xs={24}>
              <div className="logo">
                <img
                    src="https://www.xmu.edu.cn/images/logo.png"
                    alt="xmu"
                />
              </div>
            </Col>
            <Col xxl={5} xl={7} lg={8} xs={24}>
              <div className="logo">
                <img
                    src="https://www.zhejianglab.com/statics/images/whitelogo.png"
                    alt="zhijianglab"
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Button onClick={async () => {
              console.log("开始测试 request 工具类...");

              const body = {
                "file_uid": "1565536927137009664",
                "segment_length": 160,
                "index_length": 20,
                "verify_method": "Hamming",
                "encode_method": "Basic"
              }

              try {
                const resp = await doPost("/encode", {body})
                console.log("接受到响应：", resp);
              } catch (err) {
                console.log("发生异常", err);
              }
            }}>测试请求按钮（最后会删除）</Button>
          </Row>

        </div>
      </div>
    </Layout>
  );
};

BasicLayout.defaultProps = new BasicLayoutProps();
