import React, { useState } from "react";
import "./index.less";
import { Breadcrumb, Layout, Menu } from "antd";

import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Encode } from "./Encode";
import { Synthesis } from "./Synthesis";
import { Decay } from "./Decay";
import { Pcr } from "./Pcr";
import { Sampling } from "./Sampling";
import { Sequencing } from "./Sequencing";
import { Decode } from "./Decode";
const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

export class ServicesProps {}
import "./index.less";

const siderLabel = ["Encode Data", "Simulation", "Decode"];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items = [
  getItem(
    "Encode Data",
    "0-0",
    <i className="iconfont icon-Encode-File" style={{ display: "inline" }}></i>
  ),
  getItem(
    "Simulation",
    "0-1",
    <i className="iconfont icon-monidanping" style={{ display: "inline" }}></i>,
    [
      getItem("Synthesis", "0-1-0"),
      getItem("Decay", "0-1-1"),
      getItem("PCR", "0-1-2"),
      getItem("Sampling", "0-1-3"),
      getItem("Sequencing", "0-1-4"),
    ]
  ),
  getItem(
    "Decode",
    "0-2",
    <i className="iconfont icon-Decode-File" style={{ display: "inline" }}></i>
  ),
];

export const Services: React.FC<ServicesProps> = (props) => {
  const [siderSelect, setSiderSelect] = useState(["0-0"]);
  const onClick: MenuProps["onClick"] = (e) => {
    setSiderSelect([e?.key]);
  };
  return (
    <div className="service-content">
      <Menu
        onClick={onClick}
        style={{
          width: 256,
        }}
        selectedKeys={siderSelect}
        mode="inline"
        items={items}
      />
      {siderSelect[0] === "0-0" ? <Encode /> : null}
      {siderSelect[0] === "0-1-0" ? (
        <Synthesis changeSider={setSiderSelect} />
      ) : null}
      {siderSelect[0] === "0-1-1" ? <Decay /> : null}
      {siderSelect[0] === "0-1-2" ? <Pcr /> : null}
      {siderSelect[0] === "0-1-3" ? <Sampling /> : null}
      {siderSelect[0] === "0-1-4" ? <Sequencing /> : null}
      {siderSelect[0] === "0-2" ? <Decode /> : null}
    </div>
  );
};
