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
import { Image } from 'antd';
import "./index.less";
import {API_PREFIX} from "../../../common/Config";
export class DecodeProps {
  fileId;
  decodeData;
  isDecode;
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
    },
  ];

  const tableData = useMemo(() => {
    let data = props.decodeData
    return [
      {
        key: "1",
        name: "Decode time",
        value: data?.decode_time || "",
      },
      {
        key: "2",
        name: "Clust time",
        value: data?.clust_method || "",
      },
      {
        key: "3",
        name: "Encode DNA sequence number",
        value: data?.encode_dna_sequence_number || "",
      },
      {
        key: "4",
        name: "Simulation DNA sequence number",
        value: data?.simulation_dna_sequence_number || "",
      },
      {
        key: "5",
        name: "Cluster DNA sequence number",
        value: data?.after_cluster_dna_sequence_number || "",
      },
      {
        key: "6",
        name: "Recall DNA sequence number",
        value: data?.recall_dna_sequence_number || "",
      },
      {
        key: "7",
        name: "Recall rate",
        value: data?.recall_dna_sequence_rate || "",
      },
      {
        key: "8",
        name: "Encode bits fragments",
        value: data?.verify_method_remove_bits || "",
      },
      {
        key: "9",
        name: "Decode bits fragments",
        value: data?.encode_bits_number || "",
      },
      {
        key: "10",
        name: "Recall bits fragments",
        value: data?.final_decode_bits_number || "",
      },

    ];
  }, [props.decodeData]);


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
      <div
              style={{ marginTop: "30px", marginLeft: "120px",width:"100%"}} className="FileInformation"
            >
              
              <Card title="Result" style={{width:"90%"}} headStyle={{backgroundColor:'#99CCFF'}} >
              <div style={{ marginTop: "5px", marginLeft: "30px" }}>
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{ position: ["none"] }}
          size={"small"}
        />
      </div>
              </Card>
            </div>
    </div>
  );
};

DecodeReport.defaultProps = new DecodeProps();
