import { Area, Datum, Histogram } from "@ant-design/charts";
import {
  Breadcrumb,
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
import React, { useContext, useEffect, useMemo, useState } from "react";
import "./index.less";

import axios from "axios";

export class SequencingProps {
  changeSider;
  fileId;
  sequenceflag;
  okflag;
}

export const Sequencing: React.FC<SequencingProps> = (props) => {
  const { Option, OptGroup } = Select;

  const [sequencingDepth, setSequencingDepth] = useState(1);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState();
  const [method, setMethod] = useState("ill_PairedEnd");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [densityData, setDensityData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState();
  const [alreadyRun, setAlreadyRun] = useState(false);

  const methodLink = useMemo(() => {
    return hrefLink?.map((link, index) => {
      return (
        <>
          <a style={{ margin: "0 0 0 5px" }} href={link} target="_blank">
            {link}
          </a>
          <br />
        </>
      );
    });
  }, [hrefLink]);
  //处理函数
  const monthChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setSequencingDepth(value);
  };

  const handleChange = (value: string) => {
    setMethod(value);
  };
  const skipDecay = function () {
    props.changeSider(["0-1-5"]);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleReset = () => {
    setMethod("ill_PairedEnd");
    setSequencingDepth(1);
  };
  const handleOk = () => {
    setLoading(true);
    setNoDataTipsShow(false);
    setAlreadyRun(true);
    axios
      .post("http://localhost:5000/simu_seq", params)
      .then(function (response) {
        console.log("sequencing response", response);
        //setErrorData(response?.data?.seq_error_density);
        setDensityData(response?.data?.seq_density);
        setGroup(response?.data?.seq_group);
        setHrefLink(response?.data?.synthesis_method_reference);
        setLoading(false);
      });
  };
  const handleContinue = () => {
    props.changeSider(["0-1-5"]);
  };

  //数据生成
  // const densityChartData = useMemo(() => {
  //   return densityData?.map((item) => {
  //     return {
  //       copyNumber: item[0],
  //       density: Number(item[1].toFixed(3)),
  //     };
  //   });
  // }, [densityData]);
  // const errorChartData = useMemo(() => {
  //   return errorData?.map((item) => {
  //     return {
  //       copyNumber: item[0],
  //       density: Number(item[1].toFixed(3)),
  //     };
  //   });
  // }, [errorData]);
  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      // file_uid: "1565536927137009664",
      seq_depth: sequencingDepth,

      seq_meth: method,
    };
  }, [sequencingDepth, method]);
  //console.log("params", params);
  // const densityConfig = {
  //   data: densityChartData,
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

  // const errorConfig = {
  //   data: errorChartData,
  //   smooth: true,
  //   width: 200,
  //   height: 150,
  //   xField: "copyNumber",
  //   yField: "density",
  //   autoFit: true,
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
      data: densityData,
      width: 200,
      height: 300,
      binField: "value",
      binWidth: group,
    };
  }, [group, densityData]);
  {/*style={{opacity:!props.sequenceflag?1:0.4}} */}
  return (
    <div className="sequencing-content" style={{opacity:props.okflag?1:0.4}}>  
      <Card title="Sequencing" style={{width:"1100px",marginLeft:"20px",opacity:!props.sequenceflag?1:0.4}} >
      <Row gutter={16}>
      <Col span={8}>
      <div className="function-content">
        <Card style={{width:"480px"}}>
          <div className="function-bar">
            <span>Sequencing Depth:</span>
            <Tooltip title="111">
              <i
                className="iconfont icon-wenhao"
                style={{ verticalAlign: "middle", margin: "0 0 0 5px" }}
              ></i>
            </Tooltip>
            <Row>
              <Col span={12}>
                <Slider
                  min={1}
                  max={100}
                  onChange={monthChange}
                  value={
                    typeof sequencingDepth === "number" ? sequencingDepth : 0
                  }
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={100}
                  style={{
                    margin: "0 16px",
                  }}
                  value={sequencingDepth}
                  onChange={monthChange}
                />
              </Col>
            </Row>
          </div>

          <div className="function-bar">
            <span>Sequencing Method:</span>
            {/* <Tooltip title="prompt text">
                  <i
                    className="iconfont icon-wenhao"
                    style={{ verticalAlign: "middle", margin: "0 0 0 5px" }}
                  ></i>
                </Tooltip> */}
            <Select
              style={{ width: 320, marginTop: 10 }}
              onChange={handleChange}
              value={method}
            >
              <OptGroup label="Illumina">
                <Option value="ill_PairedEnd">PairedEnd</Option>
                <Option value="ill_SingleEnd">SingleEnd</Option>
              </OptGroup>

              <OptGroup label="Nanopore">
                <Option value="nano_1D">1D</Option>
                <Option value="nano_2D">2D</Option>
              </OptGroup>
              <OptGroup label="PacBio">
                <Option value="Pac_subread">Subread</Option>
                <Option value="Pac_CCS">CCS</Option>
              </OptGroup>
              <OptGroup label="None">
                <Option value="None">None</Option>
              </OptGroup>
            </Select>
          </div>
          <div
            style={{
              // display: "flex",
              justifyContent: "space-around",
              margin: "50px 0 0 20px",
            }}
          >
            <Button
              size="large"
              shape="round"
              style={{ width: 100 }}
              onClick={handleOk}
              disabled={alreadyRun}
            >
              OK
            </Button>
            {/* <Button size="large" style={{ width: 100 }} onClick={showModal}>
              Skip
            </Button> */}
            <Button shape="round" size="large" style={{ width: 100,marginLeft:"110px"}} onClick={handleReset}>
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
              ></i>
              <p>Do you want to skip Sequencing?</p>
            </Modal>
          </div>
        </Card>
      </div>
      </Col>
      <Col span={8}>
        <Card style={{ marginLeft: 155, marginTop:"10px",height: 500,width:"530px" }}>
          <div>
            <span>The parameter settings are referenced from :</span>
            <br />
            {methodLink}
          </div>
          <div style={{ margin: "0 0 30px 0" }}>
            After synthesis simulation, the situation of oligonucleotides pool as
            follows:
          </div>
          <div>
            {noDataTipsShow ? (
              <Empty
                style={{ textAlign: "center", margin: "155px 0" }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{
                  height: 60,
                }}
                description={
                  <span>No simulation result, please select parameter</span>
                }
              ></Empty>
            ) : loading ? (
              <div
                style={{
                  textAlign: "center",
                  margin: "155px 0",
                }}
              >
                <Spin size={"large"} />
              </div>
            ) : (
              <div style={{ margin: "60px 0 0 0" }}>
                <div style={{ margin: "0 0 20px 0" }}>copies:</div>
                {/* <Area {...densityConfig} /> */}
                <Histogram {...config} />
              </div>
            )}
          </div>

          {/* <Button
                style={{ margin: " 40px 200px" }}
                onClick={handleContinue}
                disabled={noDataTipsShow}
              >
                Continue
              </Button> */}
        </Card>
      </Col>
      </Row>
      <div 
      hidden={!props.sequenceflag}
      style={{
        display:'flex',
        position:'absolute',
        top: '0px',	// 距离父级元素顶部0像素
              left: '0px',	// 距离父级元素左侧0像素
              zIndex: 99,	// 遮罩层的堆叠层级（只要设置的比被遮罩元素高就行）
              height: '100%',	// 与父级元素同高
              width: '100%',	// 与父级元素同宽
              background: 'rgba(0,0,0,0.1)',	// 半透明背景
              textAlign: 'center',
              justifyContent: 'space-around',
              alignItems: 'center'
      }}
      >
      </div>
      <div 
      hidden={props.okflag}
      style={{
        display:'flex',
        position:'absolute',
        top: '0px',	// 距离父级元素顶部0像素
              left: '0px',	// 距离父级元素左侧0像素
              zIndex: 99,	// 遮罩层的堆叠层级（只要设置的比被遮罩元素高就行）
              height: '100%',	// 与父级元素同高
              width: '100%',	// 与父级元素同宽
              background: 'rgba(0,0,0,0.1)',	// 半透明背景
              textAlign: 'center',
              justifyContent: 'space-around',
              alignItems: 'center'
      }}
      >
      </div>
      </Card>
    </div>
  );
};

Sequencing.defaultProps = new SequencingProps();
