import { Histogram } from "@ant-design/charts";
import {
  Button,
  Card,
  Col,
  Empty,
  InputNumber,
  Modal,
  Row,
  Select,
  Slider,
  Spin,
  Tooltip,
} from "antd";
import React, { useMemo, useState } from "react";
import "./index.less";
import { doPost } from "../../../../utils/request";

export class DecayProps {
  changeSider?;
  fileId;
  decayFlag;
  okFlag;
}

export const Decay: React.FC<DecayProps> = (props) => {
  const { Option, OptGroup } = Select;
  const [countLen, setCountLen] = useState(0);
  const [lossValue, setLossValue] = useState(0.3);
  const [monthValue, setMonthValue] = useState(24);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState([]);
  const [method, setMethod] = useState("Hsapiens");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alreadyRun, setAlreadyRun] = useState(false);
  const [group, setGroup] = useState();

  //处理函数
  const monthChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setMonthValue(value);
  };
  const lossChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setLossValue(value);
  };
  const handleChange = (value: string) => {
    setMethod(value);
  };
  const skipDecay = function () {
    props.changeSider(["0-1-2"]);
  };
  const handleReset = function () {
    setMethod("Hsapiens");
    setLossValue(0.3);
    setMonthValue(24);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk = async () => {
    setLoading(true);
    setNoDataTipsShow(false);
    setAlreadyRun(true);
    const resp: any = await doPost("/simu_dec", { body: params });

    setCountLen(resp.dec_density.length);
    setGroup(resp.dec_group);
    setData(resp.dec_density);
    setHrefLink(resp.storage_host_parameter_reference);
    setLoading(false);
  };

  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      //file_uid: "1565536927137009664",
      months_of_storage: monthValue,
      loss_rate: lossValue,
      storage_host: method,
    };
  }, [monthValue, lossValue, method]);

  const config = useMemo(() => {
    return {
      data: data,
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
  }, [group, data]);

  const methodLink = useMemo(() => {
    return hrefLink?.map((link, index) => {
      return (
        <>
          <a style={{ margin: "0 0 0 5px" }} href={link} target="_blank" rel="noreferrer">
            {link}
          </a>
          <br />
        </>
      );
    });
  }, [hrefLink]);
  return (
    <div className="simulation-decay-content" style={{ opacity: props.okFlag ? 1 : 1 }}>
      <Card title="Decay">
        <Row>
          <Col span={12}>
            <div className="simulation-decay-month">
              <span>Month of Storage:</span>
              <Tooltip title="During storage, depurination and deamination are the two main factors of the decay of strands, where the ratio could be computed with temperature, PH, and storage time. Other factors relate to the storage host you choose. ">
                <i
                  className="iconfont icon-wenhao"
                  style={{ verticalAlign: "middle", margin: "0 0 0 5px" }}
                />
              </Tooltip>
              <InputNumber
                min={1}
                value={monthValue}
                onChange={monthChange}
                className="simulation-decay-month-input"
              />
            </div>
            <div className="simulation-decay-line-div simulation-decay-loss-rate">
              <div>
                <span>Loss Rate: </span>
                <Tooltip title="Total loss rate during storage. ">
                  <i
                    className="iconfont icon-wenhao"
                    style={{ verticalAlign: "middle", margin: "0 0 0 5px" }}
                  />
                </Tooltip>
              </div>
              <Row>
                <Col span={12}>
                  <Slider
                    min={0}
                    max={1.0}
                    onChange={lossChange}
                    value={typeof lossValue === "number" ? lossValue : 0}
                    step={0.1}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={0}
                    max={1.0}
                    style={{
                      margin: "0 16px",
                    }}
                    step={0.1}
                    value={lossValue}
                    onChange={lossChange}
                  />
                </Col>
              </Row>
            </div>
            <div className="simulation-decay-line-div">
              <span>Storage Host :</span>
              <Select onChange={handleChange} value={method} className="simulation-decay-selector">
                <OptGroup label="Eukaryotic">
                  <Option value="Hsapiens">H sapiens</Option>
                  <Option value="Mmusculus">M musculus </Option>
                  <Option value="Dmelanogaster">D melanogaster</Option>
                  <Option value="Scerevisiae">S cerevisiae</Option>
                </OptGroup>

                <OptGroup label="In-vitro">
                  <Option value="Erasure">
                    Erasure Channel with an error probability of 0.5 percent
                  </Option>
                  <Option value="WhiteGaussian">
                    White Gaussian Noise with an error probability of 0.5 percent
                  </Option>
                  <Option value="Dep_ph8_293.15k">Depurination at pH 8 and 293.15K</Option>
                  <Option value="Dep_ph8_253.15k">Depurination at pH 8 and 253.15K</Option>
                  <Option value="Dep_ph8_193.15k">Depurination at pH 8 and 193.15K</Option>
                  <Option value="Dep_ph7_193.15k">Depurination at pH 7 and 193.15K</Option>
                  <Option value="Dep_ph7_253.15k">Depurination at pH 7 and 253.15K</Option>
                  <Option value="jukes_q1">Jukes-Cantor model with q=1</Option>
                </OptGroup>
                <OptGroup label="Prokaryotes">
                  <Option value="Ecoli">E Coli</Option>
                </OptGroup>
              </Select>
            </div>
            <div className="simulation-decay-buttons">
              <Button size="large" shape="round" onClick={handleOk} disabled={alreadyRun}>
                OK
              </Button>
              <Button shape="round" size="large" onClick={handleReset}>
                Reset
              </Button>
              <Modal
                title="Warning"
                visible={isModalOpen}
                onOk={skipDecay}
                onCancel={handleCancel}
                okText="Skip"
              >
                <i
                  className="iconfont icon-warning-circle"
                  style={{ fontSize: 40, color: "red" }}
                />
                <p>Do you want to skip Decay?</p>
              </Modal>
            </div>
          </Col>
          <Col span={12}>
            <Card>
              <div>
                After synthesis simulation, the situation of oligonucleotides pool as follows:
              </div>
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
                    <Spin size={"large"} />
                  </div>
                ) : (
                  <div style={{ margin: "15px 0 0 0" }}>
                    <div style={{ margin: "0 0 20px 0" }}>copies:</div>
                    <Histogram {...config} />
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
        {/*<div*/}
        {/*  hidden={!props.decayFlag}*/}
        {/*  style={{*/}
        {/*    display: "flex",*/}
        {/*    position: "absolute",*/}
        {/*    top: "0px", // 距离父级元素顶部0像素*/}
        {/*    left: "0px", // 距离父级元素左侧0像素*/}
        {/*    zIndex: 99, // 遮罩层的堆叠层级（只要设置的比被遮罩元素高就行）*/}
        {/*    height: "100%", // 与父级元素同高*/}
        {/*    width: "100%", // 与父级元素同宽*/}
        {/*    background: "rgba(0,0,0,0.1)", // 半透明背景*/}
        {/*    textAlign: "center",*/}
        {/*    justifyContent: "space-around",*/}
        {/*    alignItems: "center",*/}
        {/*  }}*/}
        {/*></div>*/}
        {/*<div*/}
        {/*  hidden={props.okFlag}*/}
        {/*  style={{*/}
        {/*    display: "flex",*/}
        {/*    position: "absolute",*/}
        {/*    top: "0px", // 距离父级元素顶部0像素*/}
        {/*    left: "0px", // 距离父级元素左侧0像素*/}
        {/*    zIndex: 99, // 遮罩层的堆叠层级（只要设置的比被遮罩元素高就行）*/}
        {/*    height: "100%", // 与父级元素同高*/}
        {/*    width: "100%", // 与父级元素同宽*/}
        {/*    background: "rgba(0,0,0,0.1)", // 半透明背景*/}
        {/*    textAlign: "center",*/}
        {/*    justifyContent: "space-around",*/}
        {/*    alignItems: "center",*/}
        {/*  }}*/}
        {/*></div>*/}
      </Card>
    </div>
  );
};

Decay.defaultProps = new DecayProps();
