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
import {doPost} from "../../../../utils/request";

export class SamplingProps {
  changeSider;
  fileId;
  sampleflag;
  okflag;
}

export const Sampling: React.FC<SamplingProps> = (props) => {
  const [samplingRatio, setSamplingRatio] = useState(0.005);
  const [noDataTipsShow, setNoDataTipsShow] = useState(true);
  const [hrefLink, setHrefLink] = useState();
  const [countlen,setLen] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [densityData, setDensityData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alreadyRun, setAlreadyRun] = useState(false);
  const [group, setGroup] = useState();

  const params = useMemo(() => {
      return {
          file_uid: props.fileId,
          // file_uid: "1565536927137009664",
          sam_ratio: samplingRatio,
      };
  }, [samplingRatio]);

  //处理函数

  const lossChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setSamplingRatio(value);
  };
  const handleReset = function () {
    setSamplingRatio(0.005);
  };

  const skipDecay = function () {
    props.changeSider(["0-1-4"]);
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
    const responseBody = await doPost("/simu_sam", { body: params});
    setErrorData(responseBody?.sam_error_density);
    setLen(responseBody?.sam_density.length);
    setGroup(responseBody?.sam_group);
    setDensityData(responseBody?.sam_density);
    setHrefLink(responseBody?.synthesis_method_reference);
    setLoading(false);
    // axios
    //   .post("http://localhost:5000", params)
    //   .then(function (response) {
    //     //console.log("sampling response", response);
    //     //setErrorData(response?.data?.sam_error_density);
    //     setLen(response?.data?.sam_density.length);
    //     setGroup(response?.data?.sam_group);
    //     setDensityData(response?.data?.sam_density);
    //     setHrefLink(response?.data?.synthesis_method_reference);
    //     setLoading(false);
    //   });
  };
  const handleContinue = () => {
    props.changeSider(["0-1-4"]);
  };

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

  // console.log("params", params);
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
  //   width: 200,
  //   height: 150,
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
      data: densityData,
      width: 200,
      height: 300,
      binField: "value",
      binWidth: group,
      meta:{
        count:{
          alias:'percentage',
          formatter:(value:any)=>{
            
            return `${(value/countlen).toFixed(4)}%`
            }
         
        }
      }
    };
  }, [group, densityData]);
  return (
    <div className="sampling-content" style={{opacity:props.okflag?1:0.4}}>
      <Card title="Sampling" style={{width:"1100px",marginLeft:"20px",opacity:!props.sampleflag?1:0.4}} >
      <Row gutter={16}>
        <Col span={8}>
      <div className="function-content">
        <div style={{width:"480px",margin:"150px 0 0 10px"}}>
          <div className="function-bar">
            <span>Sampling Ratio:</span>
            <Tooltip title="The ratio of each oligo to be sampled.">
              <i
                className="iconfont icon-wenhao"
                style={{ verticalAlign: "middle", margin: "0 0 0 5px" }}
              ></i>
            </Tooltip>
            <Row>
              <Col span={12}>
                <Slider
                  min={0}
                  max={1.0}
                  onChange={lossChange}
                  value={typeof samplingRatio === "number" ? samplingRatio : 0}
                  step={0.001}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={1.0}
                  style={{
                    margin: "0 16px",
                  }}
                  step={0.001}
                  value={samplingRatio}
                  onChange={lossChange}
                />
              </Col>
            </Row>
          </div>

          <div
            style={{
              // display: "flex",
              justifyContent: "space-around",
              margin: "80px 0 0 20px",
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
            {/* <Button
              size="large"
              style={{ width: 100 }}
              onClick={showModal}
              disabled={alreadyRun}
            >
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
              <p>Do you want to skip Sampling?</p>
            </Modal>
          </div>
        </div>
      </div>
      </Col>
      <Col span={8}>
      <Card style={{ marginLeft: 155, height: 500,width:"530px",marginTop:"10px" }}>
        {/* <div>
          <span>The parameter settings are referenced from :</span>
          <br />
          {methodLink}
        </div>
        <div style={{ margin: "0 0 30px 0" }}>
          After synthesis simulation, the situation of oligonucleotides pool as
          follows:
        </div> */}
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
      hidden={!props.sampleflag}
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

Sampling.defaultProps = new SamplingProps();
