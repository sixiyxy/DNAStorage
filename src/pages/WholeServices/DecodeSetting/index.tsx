import { Breadcrumb, Button, Card, Radio, RadioChangeEvent, Space, Table,Row,Col} from "antd";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "antd";
import "./index.less";
import { API_PREFIX } from "../../../common/Config";
export class DecodeProps {
  fileId;
  changeSider;
  setIsDecode;
  setDecodeData;
  setSpin;
}

export const DecodeSetting: React.FC<DecodeProps> = (props) => {
  const [value, setValue] = useState("cdhit");
  const [data, setData] = useState();
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      clust_method: value,
    };
  }, [value, props.fileId]);

  const onDecode = function () {
    props.changeSider(["0-2-1"]);
    props.setSpin(true)
    axios.post(API_PREFIX + "/decode", params).then(function (response) {
      //console.log("decode", response);
      props.setDecodeData(response?.data);
      props.setIsDecode(true);
      props.setSpin(false)
      
    });
  };

  const onExample = function () {
    axios.post(API_PREFIX + "/example", { type: "decode" }).then(function (response) {
      //console.log("decode", response);
      props.setDecodeData(response?.data);
      props.setIsDecode(true);
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
              <a href="/">Home</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="/Services">Service</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Decode</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
      </div>
      {/*信息介绍部分*/}
      <div className="decode-information-wrapper">
        <div className="summary">
          <Card >
          <Row>
            <Col span={10}>
                <div className="summary-word" >
                  <p>
                  In the DNA storage process, file recovery needs to decode the DNA sequences
                  according to the reverse process of the encoding roles. However，DNA sequences
                  obtained by sequencing usually have random errors(insert\indel\SNV, we have
                  simulated this). So, we designed two clustering algorithms, CD-HIT and Starcode,
                  to remove de-redundancy and correct the sequencing data. Then, the clustered
                  sequences will decode according to the rules to obtain bits fragments.
                  Subsequently, the bits fragments will be removed from the verification code and
                  index code. Finally, we analyze the recovery information of bits fragment in the
                  report.
                  </p>
                  
                </div>
            </Col>
            
            <Col span={10}>
              <div className="summary-img">
                <Image
                  width={"130%"}
                  // height={"50%"}
                  src="/src/assets/service/decode.png"
                />
              </div>
            </Col>
          </Row>
          <div className="decode-button-group">
                    <Button
                      className="exm"
                      // type="primary"
                      shape="round"
                      size="large"
                      // onClick={handleEXM}
                    >
                      Example
                    </Button>
          </div>
          </Card>
        </div>
        <div className="cluster-algorithm-wrapper">
          <Card title="Cluster algorithms" headStyle={{ backgroundColor: "#99CCFF" }}>
            <Radio.Group onChange={onChange} value={value}>
              <Space direction="vertical">
                <Radio value={"cdhit"}>
                  <strong>CD-HIT: </strong>a fast program for clustering and comparing large sets of
                  protein or nucleotide sequences. Bioinformatics 22.13 (2006): 1658-1659.{" "}
                </Radio>
                <Radio value={"starcode"}>
                  <strong>Starcode: </strong>sequence clustering based on all-pairs search.
                  Bioinformatics 31.12 (2015): 1913-1919.{" "}
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
