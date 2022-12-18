import React, { useEffect, useMemo, useState } from "react";
import "./index.less";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { Report } from "../WholeServices/Report";
import { Encode } from "../WholeServices/Encode";

const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

export class ServicesProps {}

const infos = {
  bit_size: 0,
  byte_size: 0,
  encode_method: "None",
  index_length: "None",
  segment_length: "None",
  segment_number: 0,
  verify_method: "None",
  verify_code_length: "None",
  final_segment_bit_length: "None",
  DNA_sequence_number: 0,
};
const DNAinfos = {
  DNA_sequence: 0,
  encoding_time: 0,
  information_density: 0,
  nucleotide_counts: 0,
  min_free_energy: 0,
  net_information_density: 0,
  // min_free_energy_below_30kcal_mol:0,
};
const FileValue = {
  fileId: "None",
  filerename: "None",
  filetype: "None",
};

export const EncodeServices: React.FC<ServicesProps> = (props) => {
  const [siderSelect, setSiderSelect] = useState(["0-0-0"]);
  const [fileId, setFileId] = useState("1");
  const [isSynthesis, setIsSynthesis] = useState(false);
  const [GC, setGC] = useState([]);
  const [homo, setHomo] = useState([]);
  const [energy, setEnergy] = useState([]);
  const [info, setInfo] = useState(infos);
  const [fileinfo, setFileInfo] = useState(FileValue);
  const [dnainfo, setDNAinfo] = useState(DNAinfos);
  const [encodeurl, setEncodeURL] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [EncodeSet, setEncodeSet] = useState(true); //true代表可以看见
  const [encodeSpinning, setencodeSpinning] = useState(true);
  const [exam, setExam] = useState(false);
  const [mini, setMini] = useState(0);
  const [fileOver2M, setFileOver] = useState(false); //假设一开始不超过2M
  const [fileOver3M,setFileOver3M] = useState(false)
  const [EncodeRepo, setEncodeRepo] = useState(false);
  const [SimuSet, setSimuSet] = useState(false);
  const [SimuRepo, setSimuRepo] = useState(false);
  const [DeSet, setDeSet] = useState(false);
  const [DeRepo, setDerepo] = useState(false);
  const [repoNext,setRepoNext] = useState(false) //能看见一开始
  const [decodeRepoNext,setdecodeRepoNext] = useState(false)
  const [btnNext, setBtnNext] = useState(false);
  //控制所有导航栏全部展示完毕恢复原始的状态
  const [resetMenu, setResetMenu] = useState(false); //还没有全部展示完

  const url = new URL(window.location.href);
  const pathname = url?.pathname;
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
    ];
  }, [isSynthesis]);
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
        items={items1}
        defaultOpenKeys={["0-0"]}
      />
      <div className="global-content">
        <div className="encode-wrapper">
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
              setencodeSpinning={setencodeSpinning}
              setExam={setExam}
              setMini={setMini}
              setFileOver={setFileOver}
              setEncodeRepo={setEncodeRepo}
              setSimuSet={setSimuSet}
              setSimuRepo={setSimuRepo}
              setDeSet={setDeSet}
              setDerepo={setDerepo}
              resetMenu={resetMenu}
              setEncodeSet={setEncodeSet}
              setRepoNext={setRepoNext}
              setdecodeRepoNext={setdecodeRepoNext}
              setFileOver3M={setFileOver3M}
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
              encodeSpinning={encodeSpinning}
              exam={exam}
              mini={mini}
              changeSider={setSiderSelect}
              fileOver2M={fileOver2M}
              setSimuSet={setSimuSet}
              btnNext={btnNext}
              repoNext={repoNext}
              setRepoNext={setRepoNext}
              fileOver3M={fileOver3M}
            />
          ) : null}
        </div>
      </div>
    </div>
    // </div>
  );
};
