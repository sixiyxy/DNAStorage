import { Breadcrumb, Button, Card, Radio, RadioChangeEvent, Space, Table,Row,Col} from "antd";
import axios from "axios";
import React, { useMemo, useState,useEffect} from "react";
import { Link } from "react-router-dom";
import { Image } from "antd";
import "./index.less";
import decode from "../../../assets/service/decode.png";
import { API_PREFIX } from "../../../common/Config";
export class DecodeProps {
  fileId;
  changeSider;
  setIsDecode;
  setDecodeData;
  setSpin;
  setDerepo;
}

export const DecodeSetting: React.FC<DecodeProps> = (props) => {
  const [value, setValue] = useState("starcode");
  const [data, setData] = useState();
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };
  useEffect(() => {
    // if (props.setIsdisabled) {
    //   props.setIsdisabled(true);
    // }
    window.scrollTo(0, 0);
  }, []);
  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      clust_method: value,
    };
  }, [value, props.fileId]);

  const onDecode = function () {
    props.setDerepo(true)
    props.changeSider(["0-2-1"]);
    props.setSpin(true)
    axios.post(API_PREFIX + "/decode", params).then(function (response) {
      //console.log("decode", response);
      props.setDecodeData(response?.data);
      props.setSpin(false)
      
    });
  };

  const onExample = function () {
    axios.post(API_PREFIX + "/example", { type: "decode" }).then(function (response) {
      //console.log("decode", response);
      props.setDerepo(true)
      props.setDecodeData(response?.data);
      props.changeSider(["0-2-1"]);
    });
  };
  return (
    <div className="decode-wrapper">
      {/*导航栏部分*/}
      <div className="decode-nav-wrapper">
        <Card>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/services">Service</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/services/wholeprocess">Decode</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Setting</Breadcrumb.Item>
            
          </Breadcrumb>
        </Card>
      </div>
      {/*信息介绍部分*/}
      <div className="decode-information-wrapper">
        <div className="summary">
          <Card >
          <Row>
            <Col span={10}>
            <div className="decode-button-group">
                <div className="whole-summary-word" >
                  <p>
                  In this last stage, we need to decode the DNA sequences
                  according to the reverse rules of the encoding ones. However, DNA strands obtained in this stage usually have random errors (insert\indel\SNV, we have
                  simulated this). So, we embedded two clustering algorithms, CD-HIT and Starcode,
                  to remove de-redundancy and correct the data. Then, the clustered
                  sequences will be decoded to obtain bits fragments.
                  Subsequently, the bits fragments will be removed from the verification code and
                  index code. Finally, we analyze the recovery information of bits fragment in the
                  report.
                  </p>
                </div>
                <Button
                      className="exm"
                      // type="primary"
                      shape="round"
                      size="large"
                      onClick={onExample}
                    >
                      Example
                    </Button>
            </div>
            </Col>
            
            <Col span={10}>
              <div style={{ marginLeft: "150px" }} className="summary-img">
                <Image
                  width={"130%"}
                  // height={"50%"}
                  src={decode}
                />
              </div>
            </Col>
          </Row>
          
          </Card>
        </div>
        <div className="cluster-algorithm-wrapper">
          <Card title="Cluster algorithms" headStyle={{ backgroundColor: "#99CCFF" }}>
            <Radio.Group onChange={onChange} value={value}>
              <Space direction="vertical">
              <Radio value={"starcode"}>
                  <strong>Starcode: </strong>sequence clustering based on all-pairs search.
                  Bioinformatics 31.12 (2015): 1913-1919.{" "}
                </Radio>
                <Radio value={"cdhit"}>
                  <strong>CD-HIT: </strong>a fast program for clustering and comparing large sets of
                  protein or nucleotide sequences. Bioinformatics 22.13 (2006): 1658-1659.{" "}
                </Radio>
                
              </Space>
            </Radio.Group>
            <div className="decode-button-group">
              <Button type="primary" shape="round" size={"large"} onClick={onDecode}>
                Decode
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

DecodeSetting.defaultProps = new DecodeProps();
