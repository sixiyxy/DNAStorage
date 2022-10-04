import { Layout, Menu } from "antd";
import MenuItem from "antd/lib/menu/MenuItem";
import React from "react";
import { Link, Outlet, Route, useNavigate } from "react-router-dom";
import "./BasicLayouts.less";
export class BasicLayoutProps {}

export const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { Header, Content, Footer } = Layout;

  return (
    <Layout className="layout">
      <Header>
        <Menu theme="dark" mode="horizontal" className="header-menu">
          <Link to="/">
            <div
              style={{
                color: "white",
                fontSize: 20,
                marginRight: "10px",
              }}
            >
              DNA storage designer
            </div>
          </Link>

          <MenuItem key="home">
            <i
              className="iconfont icon-home_light"
              style={{ color: "white", display: "inline", margin: "0 3px" }}
            ></i>
            <Link to="/">Home</Link>
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
      <Content style={{}}>
        <Outlet />
      </Content>
      <Footer
        style={{
          textAlign: "center",
          position: "fixed",
          bottom: 0,
          left: 1400,
          height: 10,
        }}
      >
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
};

BasicLayout.defaultProps = new BasicLayoutProps();
