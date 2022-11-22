import React, { useEffect, useMemo, useState } from "react";
import "./index.less";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { Encode } from "./Encode";
import { DecodeSetting } from "./DecodeSetting";
import { Report } from "./Report";
import { DecodeReport } from "./DecodeReport";
import { SimulationReport } from "./SimulationReport";
import { SimulationSetting } from "./SimulationSetting";

const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

export class ServicesProps {}

const siderLabel = ["Encode Data", "Simulation", "Decode"];

const infos = {
  bit_size: 0,
  byte_size: 0,
  encode_method: "None",
  index_length: 0,
  segment_length: 0,
  segment_number: 0,
  verify_method: "None",
};
const DNAinfos = {
  DNA_sequence: 0,
  encoding_time: 0,
  information_density: 0,
  nucleotide_counts: 0,
  min_free_energy: 0,
  net_information_density: 0,
  physical_information_density_g:"None"
  // min_free_energy_below_30kcal_mol:"0.0%",
};
const FileValue = {
  fileId: "None",
  filerename: "None",
  filetype: "None",
};

export const WholeServices: React.FC<ServicesProps> = (props) => {
  const [siderSelect, setSiderSelect] = useState(["0-0-0"]);
  const [fileId, setFileId] = useState("");
  const [isSynthesis, setIsSynthesis] = useState(false);
  const [isDecode, setIsDecode] = useState(false);
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
  const [mini, setMini] = useState(0);
  const [decodeData, setDecodeData] = useState();
  const [isdisabled, setIsdisabled] = useState(true);
  const [fileOver2M,setFileOver] = useState(false) //假设一开始不超过2M
  const items1 = useMemo(() => {
    return [
      {
        label: "Encode",
        key: "0-0",
        icon: <i className="iconfont icon-Encode-File" style={{ display: "inline" }}></i>,
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
        icon: <i className="iconfont icon-monidanping" style={{ display: "inline" }}></i>,
        children: [
          {
            label: "Setting",
            key: "0-1-0",
          },
          {
            label: "Report",
            key: "0-1-1",
            disabled: !isdisabled,
          },
        ],
      },
      {
        label: "Decode",
        key: "0-2",
        icon: <i className="iconfont icon-Decode-File" style={{ display: "inline" }}></i>,
        children: [
          {
            label: "Setting",
            key: "0-2-0",
          },
          {
            label: "Report",
            key: "0-2-1",
            // disabled: !isDecode,
          },
        ],
      },
    ];
  }, [isSynthesis, isDecode]);

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
        style={{
          width: 256,
        }}
        selectedKeys={siderSelect}
        mode="inline"
        items={items1}
        defaultOpenKeys={["0-0", "0-1", "0-2"]}
      />

      <div className="global-content">
        <div className="whole-service-wrapper">
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
              setFileOver={setFileOver}
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
              changeSider={setSiderSelect}
              fileOver2M={fileOver2M}
            />
          ) : null}

          {siderSelect[0] === "0-1-1" ? (
            <SimulationReport changeSider={setSiderSelect} fileId={fileId} />
          ) : null}
          {siderSelect[0] === "0-1-0" ? (
            <SimulationSetting changeSider={setSiderSelect} fileId={fileId} needUploader={false} setIsdisabled={setIsdisabled}/>
          ) : null}
          {siderSelect[0] === "0-2-0" ? (
            <DecodeSetting
              fileId={fileId}
              changeSider={setSiderSelect}
              setIsDecode={setIsDecode}
              setDecodeData={setDecodeData}
              setSpin={setSpin}
            />
          ) : null}
          {siderSelect[0] === "0-2-1" ? (
            <DecodeReport fileId={fileId} isDecode={isDecode} decodeData={decodeData} spinflag={spinflag}/>
          ) : null}
        </div>
      </div>
    </div>
  );
};
