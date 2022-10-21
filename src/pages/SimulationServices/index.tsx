import React, { createContext, useMemo, useState } from "react";
import "./index.less";
import { Breadcrumb, Layout, Menu, message } from "antd";

import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

import { Synthesis } from "./Synthesis";
import { Decay } from "./Decay";
import { Pcr } from "./Pcr";
import { Sampling } from "./Sampling";
import { Sequencing } from "./Sequencing";
const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

export class ServicesProps {}
import "./index.less";

export const SimulationServices: React.FC<ServicesProps> = (props) => {
  const [siderSelect, setSiderSelect] = useState(["0-1-0"]);
  const [fileId, setFileId] = useState("");
  const [isSynthesis, setIsSynthesis] = useState(false);

  let url = new URL(window.location.href);
  const pathname = url?.pathname;

  const items2 = useMemo(() => {
    return [
      {
        label: "Simulation",
        key: "0-1",
        icon: (
          <i
            className="iconfont icon-monidanping"
            style={{ display: "inline" }}
          ></i>
        ),
        children: [
          {
            label: "Synthesis",
            key: "0-1-0",
          },
          {
            label: "Decay",
            key: "0-1-1",
            disabled: !isSynthesis,
          },
          {
            label: "PCR",
            key: "0-1-2",
            disabled: !isSynthesis,
          },
          {
            label: "Sampling",
            key: "0-1-3",
            disabled: !isSynthesis,
          },
          {
            label: "Sequencing",
            key: "0-1-4",
            disabled: !isSynthesis,
          },
        ],
      },
    ];
  }, [isSynthesis]);

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
        items={items2}
        defaultOpenKeys={["0-1"]}
      />

      {siderSelect[0] === "0-1-0" ? (
        <Synthesis
          changeSider={setSiderSelect}
          setFileId={setFileId}
          fileId={fileId}
          setIsSynthesis={setIsSynthesis}
        />
      ) : null}
      {siderSelect[0] === "0-1-1" ? (
        <Decay changeSider={setSiderSelect} fileId={fileId} />
      ) : null}
      {siderSelect[0] === "0-1-2" ? (
        <Pcr changeSider={setSiderSelect} fileId={fileId} />
      ) : null}
      {siderSelect[0] === "0-1-3" ? (
        <Sampling changeSider={setSiderSelect} fileId={fileId} />
      ) : null}
      {siderSelect[0] === "0-1-4" ? (
        <Sequencing changeSider={setSiderSelect} fileId={fileId} />
      ) : null}
    </div>
  );
};
