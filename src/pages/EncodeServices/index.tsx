import React, { createContext, useMemo, useState } from "react";
import "./index.less";
import { Breadcrumb, Layout, Menu } from "antd";

import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import  Encode  from "./Encode";
import { Report } from "./Report";
const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

export class ServicesProps {}
import "./index.less";

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

export const EncodeServices: React.FC<ServicesProps> = (props) => {
  const [siderSelect, setSiderSelect] = useState(["0-0-0"]);
  const [fileId, setFileId] = useState("");
  const [isSynthesis, setIsSynthesis] = useState(false);
  const [GC, setGC] = useState([]);
  const [homo, setHomo] = useState([]);
  const [energy, setEnergy] = useState([]);
  const [info, setInfo] = useState(infos);
  const [fileinfo, setFileInfo] = useState(FileValue);
  const [dnainfo, setDNAinfo] = useState(DNAinfos);
  const [encodeurl, setEncodeURL] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [spinflag, setSpin] = useState(true);

  let url = new URL(window.location.href);
  const pathname = url?.pathname;

  return (
    <div className="encode-service-content">
      <Encode
        infos={infos}
        setDNAinfo={setDNAinfo}
        DNAinfos={DNAinfos}
        changeSider={setSiderSelect}
        fileId={fileId}
        setFileId={setFileId}
        setGC={setGC}
        setHomo={setHomo}
        setEncodeURL={setEncodeURL}
        setFileURL={setFileURL}
        setEnergy={setEnergy}
        setInfo={setInfo}
        setFileInfo={setFileInfo}
        FileValue={FileValue}
        fileinfo={fileinfo}
        setIsSynthesis={setIsSynthesis}
        setSpin={setSpin}
      />

      <Report
        dnainfo={dnainfo}
        GC={GC}
        homo={homo}
        encodeurl={encodeurl}
        fileURL={fileURL}
        energy={energy}
        fileinfo={fileinfo}
        info={info}
        fileId={fileId}
        spinflag={spinflag}
      />
    </div>
  );
};
