import React, { useEffect, useMemo, useState } from "react";
import "./index.less";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { SimulationSetting } from "../WholeServices/SimulationSetting";
import { SimulationReport } from "../WholeServices/SimulationReport";

// import { Synthesis } from "./SimulationSetting/Synthesis";
// import { Decay } from "./Decay";
// import { Pcr } from "./Pcr";
// import { Sampling } from "./Sampling";
// import { Sequencing } from "./Sequencing";

const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

export class ServicesProps {}

export const SimulationServices: React.FC<ServicesProps> = (props) => {
  const [siderSelect, setSiderSelect] = useState(["0-1-0"]);
  const [fileId, setFileId] = useState("");
  const [isdisabled, setIsdisabled] = useState(true);
  const [clickEXM, setclickEXM] = useState(false);
  const url = new URL(window.location.href);
  const pathname = url?.pathname;

  const items2 = useMemo(() => {
    return [
      {
        label: "Simulation",
        key: "0-1",
        icon: <i className="iconfont icon-monidanping" style={{ display: "inline" }}></i>,
        children: [
          {
            label: "Setting",
            key: "0-1-0",
          },
          {
            label: "Report",
            key: "0-1-1",
            disabled: isdisabled,
          },
        ],
      },
    ];
  }, [isdisabled]);

  const onClick: MenuProps["onClick"] = (e) => {
    setSiderSelect([e?.key]);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="global-wrapper">
      <Menu
        className="global-menu"
        onClick={onClick}
        selectedKeys={siderSelect}
        mode="inline"
        items={items2}
        defaultOpenKeys={["0-1"]}
      />

      <div className="global-content">
        <div className="simulation-wrapper">
          {siderSelect[0] === "0-1-0" ? (
            <SimulationSetting
              changeSider={setSiderSelect}
              fileId={fileId}
              setFileId={setFileId}
              clickEXM={clickEXM}
              setclickEXM={setclickEXM}
              setIsdisabled={setIsdisabled}
              needUploader={true}
            />
          ) : null}
          {siderSelect[0] === "0-1-1" ? (
            <SimulationReport fileId={fileId} clickEXM={clickEXM} />
          ) : null}
        </div>
      </div>
    </div>
  );
};
