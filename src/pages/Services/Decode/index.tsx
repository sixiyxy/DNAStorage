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
  const [value, setValue] = useState("cdhit");
  const [data, setData] = useState();
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

  const tableData = useMemo(() => {
    return [
      {
        key: "1",
        name1: "decode_time",
        value1: data?.decode_time || "",
        name2: "clust_method",
        value2: data?.clust_method || "",
      },
      {
        key: "2",
        name1: "encode_dna_sequence_number",
        value1: data?.encode_dna_sequence_number || "",
        name2: "after_clust_dna_sequence_number",
        value2: data?.after_clust_dna_sequence_number || "",
      },
      {
        key: "3",
        name1: "recall_dna_sequence_number",
        value1: data?.recall_dna_sequence_number || "",
        name2: "recall_dna_sequence_rate",
        value2: data?.recall_dna_sequence_rate || "",
      },
      {
        key: "4",
        name1: "verify_method_remove_bits",
        value1: data?.verify_method_remove_bits || "",
        name2: "encode_bits_number",
        value2: data?.encode_bits_number || "",
      },
      {
        key: "5",

        name1: "final_decode_bits_number",
        value1: data?.final_decode_bits_number || "",
        name2: "recall_bits_number",
        value2: data?.recall_bits_number || "",
      },
      {
        key: "6",
        name1: "error_bits_number",
        value1: data?.error_bits_number || "",
        name2: "error_bits_rate",
        value2: data?.error_bits_rate || "",
      },
    ];
  }, [data]);

  const params = useMemo(() => {
    return {
      file_uid: props.fileId,
      clust_method: value,
    };
  }, [value]);

  const onDecode = function () {
    axios
      .post("http://localhost:5000/decode", params)
      .then(function (response) {
        console.log("decode", response);
        setData(response?.data);
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
              <Radio value={"cdhit"}>Cdhit</Radio>
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
          dataSource={tableData}
          pagination={{ position: ["none"] }}
        />
      </div>
    </div>
  );
};

Decode.defaultProps = new DecodeProps();
