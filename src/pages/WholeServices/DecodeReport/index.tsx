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
  setEncodeSet;
  changeSider;
  strand;
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
        value: data?.decode_time || "0",
      },
      {
        key: "2",
        name: "Clustering method",
        value: data?.clust_method || "0",
      },
      {
        key: "3",
        name: "Clustering time",
        value: data?.clust_time || "0",
      },
      {
        key: "4",
        name: "Encode DNA sequence number",
        value: data?.encode_dna_sequence_number || "0",
      },
      {
        key: "5",
        name: "Simulation DNA sequence number",
        value: data?.simulation_dna_number || "0",
      },
      {
        key: "6",
        name: "Clustering DNA sequence number",
        value: data?.after_clust_dna_sequence_number || "0",
      },
      {
        key: "7",
        name: "Recall DNA sequence number",
        value: data?.recall_dna_sequence_number || "0",
      },
      {
        key: "8",
        name: "Recall rate",
        value: data?.recall_dna_sequence_rate || "0",
      },
      {
        key: "9",
        name: "Encode segment bits number",
        value: data?.encode_bits_number || "0",
      },
      {
        key: "10",
        name: "Decode segment bits number",
        value: data?.final_decode_bits_number || "0",
      },
      {
        key: "11",
        name: "Recall segment bits number",
        value: data?.recall_bits_number || "0",
      },
      {
        key: "12",
        name: "Recall bits rate",
        value: data?.recall_bits_rate || "0",
      },
    ];
  }, [props.decodeData]);
  const handleNew=()=>{
    props.setEncodeSet(true)
    props.changeSider(["0-0-0"]);
  }

  
  return (
    <div className="decode-report-wrapper">
      <Spin
        tip={props.strand > 500000? "the simulation sequences is more than 500000, the decoding time will beyond 5mins!":"Loading..."}
        size="large"
        spinning={props.spinflag}
        delay={10}
      >
        <div>
          <Breadcrumb separator=">">
          <Breadcrumb.Item>
              <Link to="/home">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/services">Service</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/services/wholeprocess">Decode</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Report</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="decode-report-file-information">
          <Card title="Result" headStyle={{ backgroundColor: "#99CCFF" }}>
            <div className="decode-report-table-wrapper">
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={{ position: ["none"], pageSize: 15 }}
              />
            </div>
            <div className="decode-report-button-group">
            <Button
                type="primary"
                shape="round"
                size="large"
                onClick={handleNew}
              >
                New Start
              </Button>
            </div>
          </Card>
        </div>
      </Spin>
    </div>
  );
};

DecodeReport.defaultProps = new DecodeProps();
