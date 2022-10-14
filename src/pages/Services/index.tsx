import React, { createContext, useMemo, useState } from "react";
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
import { Report } from "./Report";
const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

export class ServicesProps {}
import "./index.less";

const siderLabel = ["Encode Data", "Simulation", "Decode"];
// function getItem(
//   label: React.ReactNode,
//   key: React.Key,
//   icon?: React.ReactNode,
//   children?: MenuItem[],
//   type?: "group",
//   disabled?: boolean
// ): MenuItem {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//     disabled,
//   } as MenuItem;
// }

// const items = [
// getItem(
//   "Encode Data",
//   "0-0",
//   <i className="iconfont icon-Encode-File" style={{ display: "inline" }}></i>
// ),
//   getItem(
//     "Simulation",
//     "0-1",
//     <i className="iconfont icon-monidanping" style={{ display: "inline" }}></i>,
//     [
//       getItem("Synthesis", "0-1-0"),
//       getItem("Decay", "0-1-1"),
//       getItem("PCR", "0-1-2"),
//       getItem("Sampling", "0-1-3"),
//       getItem("Sequencing", "0-1-4"),
//     ]
//   ),
//   getItem(
//     "Decode",
//     "0-2",
//     <i className="iconfont icon-Decode-File" style={{ display: "inline" }}></i>
//   ),
// ];
var infos = {
  bit_size: 0,
  byte_size: 0,
  encode_method: "None",
  index_length: 0,
  segment_length: 0,
  segment_number: 0,
  verify_method: "None",
};
var DNAinfos = {
  DNA_sequence: 0,
  encoding_time: 0,
  information_density: 0,
  nucleotide_counts: 0,
};
var FileValue = {
  fileId: "None",
  filerename: "None",
  filetype: "None",
};

export const Services: React.FC<ServicesProps> = (props) => {
  const [siderSelect, setSiderSelect] = useState(["0-0-0"]);
  const [fileId, setFileId] = useState("");
  const [isSynthesis, setIsSynthesis] = useState(false);
  const [GC, setGC] = useState([]);
  const [homo, setHomo] = useState([]);
  const [info, setInfo] = useState(infos);
  const [fileinfo, setFileInfo] = useState(FileValue);
  const [dnainfo, setDNAinfo] = useState(DNAinfos);
  const items = useMemo(() => {
    return [
      {
        label: "Encode",
        key: "0-0",
        icon: (
          <i
            className="iconfont icon-Encode-File"
            style={{ display: "inline" }}
          ></i>
        ),
        children: [
          {
            label: "Setting",
            key: "0-0-0",
          },
          {
            label: "Report",
            key: "0-0-1",
          },
        ],
      },
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
      {
        label: "Decode",
        key: "0-2",
        icon: (
          <i
            className="iconfont icon-Decode-File"
            style={{ display: "inline" }}
          ></i>
        ),
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
        items={items}
      />

      {siderSelect[0] === "0-0-0" ? (
        <Encode
          setDNAinfo={setDNAinfo}
          DNAinfos={DNAinfos}
          changeSider={setSiderSelect}
          fileId={fileId}
          setFileId={setFileId}
          setGC={setGC}
          setHomo={setHomo}
          setInfo={setInfo}
          setFileInfo={setFileInfo}
          FileValue={FileValue}
          fileinfo={fileinfo}
        />
      ) : null}
      {siderSelect[0] === "0-0-1" ? (
        <Report
          dnainfo={dnainfo}
          GC={GC}
          homo={homo}
          fileinfo={fileinfo}
          info={info}
          fileId={fileId}
        />
      ) : null}
      {siderSelect[0] === "0-1-0" ? (
        <Synthesis
          changeSider={setSiderSelect}
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
      {siderSelect[0] === "0-2" ? <Decode /> : null}
    </div>
  );
};
