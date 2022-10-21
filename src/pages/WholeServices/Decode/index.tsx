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
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  const tableData = useMemo(() => {
    return [
      {
        key: "1",
        name: "decode_time",
        value: data?.decode_time || "",
      },
      {
        key: "2",
        name: "clust_method",
        value: data?.clust_method || "",
      },
      {
        key: "3",
        name: "encode_dna_sequence_number",
        value: data?.encode_dna_sequence_number || "",
      },
      {
        key: "4",
        name: "after_clust_dna_sequence_number",
        value: data?.after_clust_dna_sequence_number || "",
      },
      {
        key: "5",
        name: "recall_dna_sequence_number",
        value: data?.recall_dna_sequence_number || "",
      },
      {
        key: "6",
        name: "recall_dna_sequence_rate",
        value: data?.recall_dna_sequence_rate || "",
      },
      {
        key: "7",
        name: "verify_method_remove_bits",
        value: data?.verify_method_remove_bits || "",
      },
      {
        key: "8",
        name: "encode_bits_number",
        value: data?.encode_bits_number || "",
      },
      {
        key: "9",
        name: "final_decode_bits_number",
        value: data?.final_decode_bits_number || "",
      },
      {
        key: "10",
        name: "recall_bits_number",
        value: data?.recall_bits_number || "",
      },
      {
        key: "11",
        name: "error_bits_number",
        value: data?.error_bits_number || "",
      },
      {
        key: "12",
        name: "error_bits_rate",
        value: data?.error_bits_rate || "",
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
        //console.log("decode", response);
        setData(response?.data);
      });
  };

  return (
    <div className="decode-content">
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
