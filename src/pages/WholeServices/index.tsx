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
  physical_information_density_g: "None",
  // min_free_energy_below_30kcal_mol:"0.0%",
};
const FileValue = {
  fileId: "None",
  filerename: "None",
  filetype: "None",
};

export const WholeServices: React.FC<ServicesProps> = (props) => {
  const [siderSelect, setSiderSelect] = useState(["0-0-0"]);
  const [fileId, setFileId] = useState("1");
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
  const [encodeAndDecodeSpinning, setEncodeAndDecodeSpinning] = useState(true);
  const [exam, setExam] = useState(false);
  const [mini, setMini] = useState(0);
  const [decodeData, setDecodeData] = useState();
  const [isdisabled, setIsdisabled] = useState(true);
  const [fileOver2M, setFileOver] = useState(false); //假设一开始不超过2M
  const [fileOver3M,setFileOver3M] = useState(false)

  //左侧导航栏逻辑状态
  const [EncodeSet, setEncodeSet] = useState(true); //true代表可以看见
  const [EncodeRepo, setEncodeRepo] = useState(false);
  const [SimuSet, setSimuSet] = useState(false);
  const [SimuRepo, setSimuRepo] = useState(false);
  const [DeSet, setDeSet] = useState(false);
  const [DeRepo, setDerepo] = useState(false);
  //控制所有导航栏全部展示完毕恢复原始的状态
  const [resetMenu, setResetMenu] = useState(false); //还没有全部展示完
  //report页面参数
  const [simulationSpinning, setSimulationSpinning] = useState(true);
  const [synthesisData, setSynthesisData] = useState();
  const [decayData, setDacayData] = useState();
  const [pcrData, setPcrData] = useState();
  const [samplingData, setSamplingData] = useState();
  const [sequencingData, setSequenceingData] = useState();
  const [errorRecoder, setErrorRecode] = useState();
  const [errorDensity, setErrorDensity] = useState();
  const [btnNext, setBtnNext] = useState(true);
  const [strand, setStrand] = useState(0);
  //控制repo的next
  const [repoNext,setRepoNext] = useState(false) //能看见一开始
  const [decodeRepoNext,setdecodeRepoNext] = useState(false)
  const [simuStrand,setSimuStrand] = useState(0)
  // const [controlReport,setControl]=useState(false)
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
            disabled: !EncodeSet,
          },
          {
            label: "Report",
            key: "0-0-1",
            disabled: !EncodeRepo,
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
            disabled: !SimuSet,
          },
          {
            label: "Report",
            key: "0-1-1",
            disabled: !SimuRepo,
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
            disabled: !DeSet,
          },
          {
            label: "Report",
            key: "0-2-1",
            disabled: !DeRepo,
          },
        ],
      },
    ];
  }, [EncodeSet, EncodeRepo, SimuSet, SimuRepo, DeSet, DeRepo]);

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
              setEncodeAndDecodeSpinning={setEncodeAndDecodeSpinning}
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
              encodeAndDecodeSpinning={encodeAndDecodeSpinning}
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

          {siderSelect[0] === "0-1-1" ? (
            <SimulationReport
              changeSider={setSiderSelect}
              fileId={fileId}
              spinflags={simulationSpinning}
              synthesisData={synthesisData}
              decayData={decayData}
              pcrData={pcrData}
              samplingData={samplingData}
              sequencingData={sequencingData}
              errorRecoder={errorRecoder}
              errorDensity={errorDensity}
              strand={strand}
              setDeSet={setDeSet}
              setdecodeRepoNext={setdecodeRepoNext}
              decodeRepoNext={decodeRepoNext}
              simuStrand={simuStrand}
              info={info}
            />
          ) : null}
          {siderSelect[0] === "0-1-0" ? (
            <SimulationSetting
              changeSider={setSiderSelect}
              fileId={fileId}
              encodeInfo={info}
              needUploader={false}
              setFileId={setFileId}
              setSimuRepo={setSimuRepo}
              SimuRepo={SimuRepo}
              setDeSet={setDeSet}
              setSimuSet={setSimuSet}
              setSimulationSpin={setSimulationSpinning}
              setSynthesisData={setSynthesisData}
              setDacayData={setDacayData}
              setPcrData={setPcrData}
              setSamplingData={setSamplingData}
              setSequenceingData={setSequenceingData}
              setErrorRecode={setErrorRecode}
              setErrorDensity={setErrorDensity}
              setStrand={setStrand}
              info={info}
              dnainfo={dnainfo}
              setSimuStrand={setSimuStrand}
              simuStrand={simuStrand}

            />
          ) : null}
          {siderSelect[0] === "0-2-0" ? (
            <DecodeSetting
              fileId={fileId}
              setDeSet={setDeSet}
              changeSider={setSiderSelect}
              setIsDecode={setIsDecode}
              setDecodeData={setDecodeData}
              setEncodeAndDecodeSpinning={setEncodeAndDecodeSpinning}
              setDerepo={setDerepo}
              strand={strand}
            />
          ) : null}
          {siderSelect[0] === "0-2-1" ? (
            <DecodeReport
              fileId={fileId}
              isDecode={isDecode}
              decodeData={decodeData}
              spinflag={encodeAndDecodeSpinning}
              setResetMenu={setResetMenu}
              setEncodeSet={setEncodeSet}
              changeSider={setSiderSelect}
              strand={strand}
              info={info}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
