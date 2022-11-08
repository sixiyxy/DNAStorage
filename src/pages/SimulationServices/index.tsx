import React, { createContext, useMemo, useState,useEffect} from "react";
import "./index.less";
import { Breadcrumb, Layout, Menu, message } from "antd";

import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

// import { Synthesis } from "./SimulationSetting/Synthesis";
// import { Decay } from "./Decay";
// import { Pcr } from "./Pcr";
// import { Sampling } from "./Sampling";
// import { Sequencing } from "./Sequencing";
import { SimulationReport } from "./SimulationReport";
import { SimulationSetting } from "./SimulationSetting";
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
            label: "Setting",
            key: "0-1-0",
          },
          {
            label: "Report",
            key: "0-1-1",
          },
        ],
      },
    ];
  }, [isSynthesis]);

  const onClick: MenuProps["onClick"] = (e) => {
    setSiderSelect([e?.key]);
  };
  useEffect(()=>{
    window.scrollTo(0,0);
  },[])
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
        <SimulationSetting
          changeSider={setSiderSelect}
          fileId={fileId}
          setFileId={setFileId}
        />
      ) : null}
      {siderSelect[0] === "0-1-1" ? <SimulationReport fileId={fileId} /> : null}
    </div>
  );
};
