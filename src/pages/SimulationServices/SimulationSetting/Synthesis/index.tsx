import {Histogram} from "@ant-design/charts";
import {InboxOutlined} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Slider,
  Spin,
  Tooltip,
  Upload,
} from "antd";
import React, {useMemo, useState} from "react";
import "./index.less";
import {doPost} from "../../../../utils/request";
import axios from "axios";
import {API_PREFIX} from "../../../../common/Config";

const {Dragger} = Upload;

export class SynthesisProps {
  changeSider?;
  fileId;
  setIsSynthesis?;
  setFileId;
  okFlag;
}

export const Synthesis: React.FC<SynthesisProps> = (props) => {
  const {Option, OptGroup} = Select;
  const [countLen, setCountLen] = useState(0);
  const [yieldValue, setYieldValue] = useState(0.99);
  const [cycleValue, setCycleValue] = useState(30);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState("");
  const [method, setMethod] = useState("ErrASE");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOkDisable, setIsOkDisable] = useState(true);
  const [group, setGroup] = useState();
  const [alreadyRun, setAlreadyRun] = useState(false);

  //处理函数
  const cycleChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setCycleValue(value);
  };
  const yieldChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setYieldValue(value);
  };
  const handleChange = (value: string) => {
    setMethod(value);
  };
  const skipSynthesis = function () {
    props.changeSider(["0-2"]);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk = () => {
    setLoading(true);
    setNoDataTipsShow(false);
    axios.post(API_PREFIX + "/simu_synthesis", params).then(function (response) {
      setCountLen(response?.data?.syn_density.length);
      console.log("synthesis response", response);
      setGroup(response?.data?.density_group);
      setData(response?.data?.syn_density);
      setHrefLink(response?.data?.synthesis_method_reference);
      setLoading(false);
    });
    props.setIsSynthesis(true);
  };
  const param1 = {
    file_uid: "1582175684011364352", //待确认
    synthesis_number: 30,
    synthesis_yield: 0.99,
    synthesis_method: "ErrASE",
    upload_flag: "True",
  };
  const handleExample = async () => {
    setLoading(true);
    setNoDataTipsShow(false);
    // todo 对响应结果 TS 化，否则无法消除警告
    const resp: any = await doPost("/simu_synthesis", {body: param1});
    setCountLen(resp.syn_density.length);
    setGroup(resp.density_group);
    setData(resp.syn_density);
    setHrefLink(resp.synthesis_method_reference);
    setLoading(false);

    props.setIsSynthesis(true);
  };
  // const handleContinue = () => {
  //   props.changeSider(["0-1-1"]);
  // };

  const uploadProps = {
    name: "file",
    multiple: true,
    action: API_PREFIX + "/dna_upload",
    onChange(info) {
      const {status, response} = info.file;
      console.log("status", info);
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        props.setFileId(response.file_uid);

        setIsOkDisable(false);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      //console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const beforeUpload = (file) => {
    const {name} = file;
    const type = name.split(".")[1];

    const isFasta = type === "fasta";
    if (!isFasta) {
      message.error("You can only upload fasta file!");
    }

    return isFasta;
  };
  //数据生成
  // const chartData = useMemo(() => {
  //   return data?.map((item) => {
  //     return {
  //       copyNumber: item[0],
  //       density: Number(item[1].toFixed(3)),
  //     };
  //   });
  // }, [data]);
  const handleReset = function () {
    console.log("ressssssss....");

    setCycleValue(30);
    setMethod("ErrASE");
    setYieldValue(0.99);
  };
  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      //file_uid: "1565536927137009664",
      synthesis_number: cycleValue,
      synthesis_yield: yieldValue,
      synthesis_method: method,
      upload_flag: "True",
    };
  }, [cycleValue, yieldChange, method]);
  //console.log("params", params);
  // const config = {
  //   data: chartData,
  //   width: 200,
  //   height: 300,
  //   xField: "copyNumber",
  //   yField: "density",
  //   autoFit: true,
  //   smooth: true,
  //   xAxis: {
  //     // range: [0, 200],
  //     title: {
  //       text: "Copy Number",
  //     },
  //   },
  //   yAxis: {
  //     // range: [0, 0.5],
  //     title: {
  //       text: "Density",
  //     },
  //   },
  // };

  const config = useMemo(() => {
    return {
      data,
      width: 200,
      height: 300,
      binField: "value",
      binWidth: group,
      meta: {
        count: {
          alias: "percentage",
          formatter: (value: any) => {
            return `${(value / countLen).toFixed(4)}%`;
          },
        },
      },
    };
  }, [group, data, countLen]);

  const show = props.okFlag;

  return (
    <div>
      <div className="simulation-step-content">
        <Card className="simulation-card" bordered={false} title="Upload Dna File">
          <Dragger
            className="simulation-synthesis-uploader"
            {...uploadProps}
            beforeUpload={beforeUpload}
            accept=".fasta"
            maxCount={1}
            onRemove={() => {
              setIsOkDisable(true);
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined/>
            </p>
            <p className="ant-upload-text">Click this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from uploading company data or
              other band files
            </p>
          </Dragger>
        </Card>
      </div>

      <div className="simulation-step-content">
        <Card title="Synthesis" className={`${show ? null : "simulation-content-masked"}`}>
          <Row>
            <Col span={12}>
              <div className="simulation-bar">
                <span>Synthesis Cycle:</span>
                <Tooltip title="The copied number of each oligo you want it to have.">
                  <i
                    className="iconfont icon-wenhao"
                    style={{verticalAlign: "middle", margin: "0 0 0 5px"}}
                  />
                </Tooltip>
                <Row>
                  <Col span={12}>
                    <Slider
                      min={10}
                      max={50}
                      onChange={cycleChange}
                      value={typeof cycleValue === "number" ? cycleValue : 0}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      className="simulation-input"
                      min={10}
                      max={50}
                      value={cycleValue}
                      onChange={cycleChange}
                    />
                  </Col>
                </Row>
              </div>
              <div className="simulation-bar">
                <span>Synthesis Yield :</span>
                <Tooltip
                  title="The possibility of adding one nucleoside to the current synthesizing strand is defined as coupling efficiency. The process might be terminated because of unsuccessful coupling so imperfect coupling efficiency limits the length of the final sequence. Typically, it ranges about 98-99.5.">
                  <i
                    className="iconfont icon-wenhao"
                    style={{verticalAlign: "middle", margin: "0 0 0 5px"}}
                  />
                </Tooltip>
                <Row>
                  <Col span={12}>
                    <Slider
                      min={0.98}
                      max={0.995}
                      onChange={yieldChange}
                      value={typeof yieldValue === "number" ? yieldValue : 0}
                      step={0.001}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      className="simulation-input"
                      min={0.98}
                      max={0.995}
                      step={0.001}
                      value={yieldValue}
                      onChange={yieldChange}
                    />
                  </Col>
                </Row>
              </div>
              <div className="simulation-row">
                <span>Synthesis Method :&nbsp;</span>
                <Select
                  className="simulation-selector"
                  onChange={handleChange}
                  value={method}
                >
                  <OptGroup label="Column Synthesized Oligos">
                    <Option value="ErrASE">ErrASE</Option>
                    <Option value="MutS">MutS</Option>
                    <Option value="ConsensusShuffle">Consensus Shuffle</Option>
                  </OptGroup>

                  <OptGroup label="Microarray based Oligo Pools">
                    <Option value="Oligo">Oligo Hybridization based error correction</Option>
                    <Option value="HighTemperature">
                      High temperature ligation/hybridization based error correction
                    </Option>
                    <Option value="ErrASE(Mic)">ErrASE</Option>
                    <Option value="Nuclease">Nuclease based error correction</Option>
                    <Option value="NGS">NGS based error correction</Option>
                  </OptGroup>
                  <OptGroup label="None">
                    <Option value="None">None</Option>
                  </OptGroup>
                </Select>
              </div>
              <div className="simulation-buttons">
                <Button size="large" shape="round" onClick={handleOk}>
                  OK
                </Button>
                <Button shape="round" size="large" onClick={handleReset}>
                  Reset
                </Button>
              </div>
              <Modal
                title="Warning"
                visible={isModalOpen}
                onOk={skipSynthesis}
                onCancel={handleCancel}
                okText="Skip"
              >
                <i
                  className="iconfont icon-warning-circle"
                />
                <p>Synthesis is the basic process of the error simulation stage.</p>
                <p>Skipping this step means skipping the whole stage. </p>
                <p>Do you still want to skip it?</p>
              </Modal>
            </Col>
            <Col span={12}>
              <Card>
                <div>
                  {noDataTipsShow ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      imageStyle={{
                        height: 60,
                      }}
                      description={<span>No simulation result, please select parameter</span>}
                    />
                  ) : loading ? (
                    <div>
                      <Spin size={"large"}/>
                    </div>
                  ) : (
                    <div>
                      <div>copies:</div>
                      <Histogram {...config} />
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
          <div className="common-masker" hidden={show}/>
        </Card>
      </div>

    </div>
  );
};

Synthesis.defaultProps = new SynthesisProps();
