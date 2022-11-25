import { Breadcrumb, Button, Card, Radio, RadioChangeEvent, Space, Table, Spin } from "antd";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "antd";
import "./index.less";
import { API_PREFIX } from "../../../common/Config";
export class DecodeProps {
  fileId;
  decodeData;
  isDecode;
  spinflag;
  setResetMenu;
}

export const DecodeReport: React.FC<DecodeProps> = (props) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 400,
    },
    {
      title: "Information",
      dataIndex: "value",
      key: "value",
      align: "center",
    },
  ];

  const tableData = useMemo(() => {
    const data = props.decodeData;
    props.setResetMenu(true)//decode数据收到，所有页面展示完毕了
    return [
      {
        key: "1",
        name: "Decode time",
        value: data?.decode_time || "",
      },
      {
        key: "2",
        name: "Clust method",
        value: data?.clust_method || "",
      },
      {
        key: "3",
        name: "Clust time",
        value: data?.clust_time || "",
      },
      {
        key: "4",
        name: "Encode DNA sequence number",
        value: data?.encode_dna_sequence_number || "",
      },
      {
        key: "5",
        name: "Simulation DNA sequence number",
        value: data?.simulation_dna_number || "",
      },
      {
        key: "6",
        name: "Cluster DNA sequence number",
        value: data?.after_clust_dna_sequence_number || "",
      },
      {
        key: "7",
        name: "Recall DNA sequence number",
        value: data?.recall_dna_sequence_number || "",
      },
      {
        key: "8",
        name: "Recall rate",
        value: data?.recall_dna_sequence_rate || "",
      },
      {
        key: "9",
        name: "Encode bits fragments",
        value: data?.encode_bits_number || "",
      },
      {
        key: "10",
        name: "Decode bits fragments",
        value: data?.final_decode_bits_number || "",
      },
      {
        key: "11",
        name: "Recall bits fragments",
        value: data?.recall_bits_number || "",
      },
      {
        key: "12",
        name: "Recall bits rate",
        value: data?.recall_bits_rate || "",
      },
    ];
  }, [props.decodeData]);

  return (
    <div className="decode-report-wrapper">
      <Spin
        tip="Loading..."
        size="large"
        spinning={props.spinflag}
        // spinning={false}
        delay={10}
      >
        <div>
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

        <div className="decode-report-file-information">
          <Card title="Result" headStyle={{ backgroundColor: "#99CCFF" }}>
            <div className="decode-report-table-wrapper">
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={{ position: ["none"], pageSize: 15 }}
                // pagination={{}}
                // size={"small"}
              />
            </div>
          </Card>
        </div>
      </Spin>
    </div>
  );
};

DecodeReport.defaultProps = new DecodeProps();
