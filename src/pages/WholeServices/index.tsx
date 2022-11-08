import React, { createContext, useMemo, useState,useEffect} from "react";
import "./index.less";
import { Breadcrumb, Layout, Menu } from "antd";

import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Encode } from "./Encode";
import { SimulationReport } from "./SimulationReport";
import { Decode } from "./Decode";
import { Report } from "./Report";
import { SimulationSetting } from "./SimulationSetting";
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
  min_free_energy: 0,
  // min_free_energy_below_30kcal_mol:"0.0%",
};
var FileValue = {
  fileId: "None",
  filerename: "None",
  filetype: "None",
};

export const WholeServices: React.FC<ServicesProps> = (props) => {
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
  const [exam, setExam] = useState(false);
  const [mini,setMini]=useState(0)
  const items1 = useMemo(() => {
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
            disabled: !isSynthesis,
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
            label: "Setting",
            key: "0-1-0",
          },
          {
            label: "Report",
            key: "0-1-1",
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

  // const items2 = useMemo(() => {
  //   return [
  //     {
  //       label: "Simulation",
  //       key: "0-1",
  //       icon: (
  //         <i
  //           className="iconfont icon-monidanping"
  //           style={{ display: "inline" }}
  //         ></i>
  //       ),
  //       children: [
  //         {
  //           label: "Synthesis",
  //           key: "0-1-0",
  //         },
  //         {
  //           label: "Decay",
  //           key: "0-1-1",
  //           disabled: !isSynthesis,
  //         },
  //         {
  //           label: "PCR",
  //           key: "0-1-2",
  //           disabled: !isSynthesis,
  //         },
  //         {
  //           label: "Sampling",
  //           key: "0-1-3",
  //           disabled: !isSynthesis,
  //         },
  //         {
  //           label: "Sequencing",
  //           key: "0-1-4",
  //           disabled: !isSynthesis,
  //         },
  //       ],
  //     },
  //   ];
  // }, [isSynthesis]);

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
        items={items1}
        defaultOpenKeys={["0-0", "0-1"]}
      />

      {siderSelect[0] === "0-0-0" ? (
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
          setExam={setExam}
          setMini={setMini}
        />
      ) : null}
      {siderSelect[0] === "0-0-1" ? (
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
          exam={exam}
          mini={mini}
        />
      ) : null}

      {siderSelect[0] === "0-1-1" ? (
        <SimulationReport changeSider={setSiderSelect} fileId={fileId} />
      ) : null}
      {siderSelect[0] === "0-1-0" ? (
        <SimulationSetting changeSider={setSiderSelect} fileId={fileId} />
      ) : null}
      {siderSelect[0] === "0-2" ? <Decode fileId={fileId} /> : null}
    </div>
  );
};
