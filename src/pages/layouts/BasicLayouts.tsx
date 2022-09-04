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
            <i
              className="iconfont icon-medical"
              style={{ color: "white", display: "inline", margin: "0 40px" }}
            ></i>
          </Link>

          <MenuItem key="tutorial">
            <Link to="/tutorial">Tutorial</Link>
          </MenuItem>
          <MenuItem key="services">
            <Link to="/services">Services</Link>
          </MenuItem>

          <MenuItem key="publications">
            <Link to="/publications">Publication</Link>
          </MenuItem>
          <MenuItem key="resources">
            <Link to="/resources">Resource</Link>
          </MenuItem>
          <MenuItem key="contact">
            <Link to="/contact">Contact</Link>
          </MenuItem>
        </Menu>
      </Header>
      <Content style={{ width: 1000, height: 1000, padding: "0 0px" }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
};

BasicLayout.defaultProps = new BasicLayoutProps();
