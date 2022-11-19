import type { RadioChangeEvent } from "antd";
import { Input, Radio, Space, Col, Row, Card } from "antd";
import { Button, notification } from "antd";
import React, { useState } from "react";

import "./index.less";
import type { NotificationPlacement } from "antd/es/notification";
import { Link } from "react-router-dom";
import { CheckCircleTwoTone } from "@ant-design/icons";

const EncodeMethodList: React.FC = (props: any) => {
  const onChange = (e: RadioChangeEvent) => {
    props.setValue(e.target.value);
  };
  return (
    <div className="encode-method-list-wrapper">
      <Card>
        <h2>
          <CheckCircleTwoTone /> <strong>Encode method</strong>
        </h2>
        <div className="encode-inner">
          <Radio.Group onChange={onChange} value={props.value}>
            <Space direction="vertical">
              <Radio value={"Basic"}>
                <span>Vanilla code</span>
              </Radio>
              <Radio value={"Yin_Yang"}>
                <span>
                  Ping, Zhi, et al. "Towards practical and robust DNA-based data archiving using the
                  yin–yang codec system."<br></br>
                  <span style={{ color: "#748189" }}>
                    Nature Computational Science 2.4 (2022): 234-242.
                  </span>
                </span>
              </Radio>
              <Radio value={"DNA_Fountain"}>
                <span>
                  Erlich, Yaniv, and Dina Zielinski. "DNA Fountain enables a robust and efficient
                  storage architecture." <br></br>
                  <span style={{ color: "#748189" }}>Science 355.6328 (2017): 950-954.</span>
                </span>
              </Radio>
              <Radio value={"Church"}>
                <span>
                  Church, et al. "Next-generation digital information storage in DNA."<br></br>
                  <span style={{ color: "#748189" }}>Science 337.6102 (2012): 1628-1628.</span>
                </span>
              </Radio>
              <Radio value={"Goldman"}>
                <span>
                  Goldman, Nick, et al. "Towards practical, high-capacity, low-maintenance
                  information storage in synthesized DNA." <br></br>
                  <span style={{ color: "#748189" }}>Nature 494.7435 (2013): 77-80.</span>
                </span>
              </Radio>
              <Radio value={"Grass"}>
                <span>
                  Grass, Robert N., et al. "Robust chemical preservation of digital information on
                  DNA in silica with error‐correcting codes." <br></br>
                  <span style={{ color: "#748189" }}>
                    Angewandte Chemie International Edition 54.8 (2015): 2552-2555.
                  </span>
                </span>
              </Radio>
              <Radio value={"Blawat"}>
                <span>
                  Blawat, Meinolf, et al. "Forward error correction for DNA data storage." <br></br>
                  <span style={{ color: "#748189" }}>
                    Procedia Computer Science 80 (2016): 1011-1022.
                  </span>
                </span>
              </Radio>
              <Radio value={"Zan"}>
                <span>
                  Zan, Xiangzhen, et al. "A hierarchical error correction strategy for text DNA
                  storage."<br></br>
                  <span style={{ color: "#748189" }}>
                    Interdisciplinary Sciences: Computational Life Sciences 14.1 (2022): 141-150.
                  </span>
                </span>
              </Radio>
            </Space>
          </Radio.Group>
        </div>
        <p>
          Method details please click the <Link to="/methods">Method Paper</Link>
        </p>
      </Card>
    </div>
  );
};

export default EncodeMethodList;
