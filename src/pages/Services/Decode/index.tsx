import {
  Breadcrumb,
  Button,
  Card,
  Radio,
  RadioChangeEvent,
  Space,
  Table,
} from "antd";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./index.less";
export class DecodeProps {
  fileId;
}


export const Decode: React.FC<DecodeProps> = (props) => {
  const [value, setValue] = useState("");
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name1",
      key: "name1",
    },
    {
      title: "Value",
      dataIndex: "value1",
      key: "value1",
    },
    {
      title: "Name",
      dataIndex: "name2",
      key: "name2",
    },
    {
      title: "Value",
      dataIndex: "value2",
      key: "value2",
    },
  ];

  // const data = useMemo(() => {
  //   //
  // }, [])

  const data = [
    {
      key: "1",
      name1: "decode_time",
      value1: 111,
      name2: "clust_method",
      value2: 111,
    },
    {
      key: "2",
      name1: "encode_dna_sequence_number",
      value1: 111,
      name2: "after_clust_dna_sequence_number",
      value2: 111,
    },
    {
      key: "3",
      name1: "recall_dna_sequence_number",
      value1: 111,
      name2: "recall_dna_sequence_rate",
      value2: 111,
    },
    {
      key: "4",
      name1: "verify_method_remove_bits",
      value1: 111,
      name2: "encode_bits_number",
      value2: 111,
    },
    {
      key: "5",

      name1: "final_decode_bits_number",
      value1: 111,
      name2: "recall_bits_number",
      value2: 111,
    },
    {
      key: "6",
      name1: "error_bits_number",
      value1: 111,
      name2: "error_bits_rate",
      value2: 111,
    },
  ];

  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      clust_method: "cdhit",
    };
  }, [value]);

  const onDecode = function () {
    axios
      .post("http://localhost:5000/decode", params)
      .then(function (response) {
        console.log("decode", response);
      });
  };

  return (
    <div>
      <div style={{ paddingLeft: "30px", paddingTop: "20px" }}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <a href="/">Home</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/Services">Service</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Decode</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card style={{ margin: "10px 30px", width: 600 }}>
        <h2>DNA Sequence Cluster</h2>
        <div style={{ paddingLeft: "20px" }}>
          <Radio.Group onChange={onChange} value={value}>
            <Space direction="vertical">
              <Radio value={"Cdhit"}>Cdhit</Radio>
              <Radio value={"xxx"}>xxx</Radio>
            </Space>
          </Radio.Group>
        </div>
        <div>
          <Button
            type="primary"
            style={{ margin: "30px 20px 0" }}
            onClick={onDecode}
          >
            Run
          </Button>
        </div>
      </Card>
      <div style={{ marginTop: "30px", marginLeft: "30px" }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ position: ["none"] }}
        />
      </div>
    </div>
  );
};

Decode.defaultProps = new DecodeProps();
