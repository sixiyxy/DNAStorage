import { Layout, Menu } from "antd";
import MenuItem from "antd/lib/menu/MenuItem";
import React from "react";
import { Link, Outlet, Route, useNavigate } from "react-router-dom";
import "./BasicLayout.less";
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
                marginRight: "10px",
              }}
            >
              <i
                className="iconfont icon-medical"
                style={{ marginRight: "5px" }}
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
          <span>Contact us: xrliu@xmu.edu.cn| jianglikun@stu.xmu.edu.cn</span>
          <span>This website is free to all users and there is no login</span>
          <span>requirement.</span>
        </div>
        <div style={{ borderTop: "1px solid #ffffff", width: "50%" }} />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "33%" }}>
            <p>View source code</p>
            <p>Submit bugs and corrections</p>
          </div>
          <img
            src="https://www.xmu.edu.cn/images/logo.png"
            alt="xmu"
            style={{ width: "33%" }}
          />
          <img
            src="https://www.zhejianglab.com/statics/images/whitelogo.png"
            alt="zhejianglab"
            style={{ width: "33%" }}
          />
        </div>
      </div>
    </Layout>
  );
};

BasicLayout.defaultProps = new BasicLayoutProps();
