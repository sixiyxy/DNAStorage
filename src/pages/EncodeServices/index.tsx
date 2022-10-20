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
  const [exam,setExam] = useState(false)

  let url = new URL(window.location.href);
  const pathname = url?.pathname;
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
      }   
    ];
  }, [isSynthesis]);
  const onClick: MenuProps["onClick"] = (e) => {
    setSiderSelect([e?.key]);
  };
  return (
    <div className="encode-service-content">
      <div className="service-content">
      
        <Menu
          onClick={onClick}
          style={{
            width: 256,
          }}
          selectedKeys={siderSelect}
          mode="inline"
          items={items1}
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
      />
    
      ) : null}
      
    </div>
  );



    </div>
  );
};
