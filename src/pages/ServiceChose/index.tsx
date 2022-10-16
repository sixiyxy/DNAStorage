import { Area, Datum } from "@ant-design/charts";
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

import axios from "axios";
import { Link } from "react-router-dom";

export class ServiceChoseProps {}

export const ServiceChose: React.FC<ServiceChoseProps> = (props) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <Card style={{ width: 300, height: 500, margin: "30px 0" }}>
        <h1>Encode</h1>
        <Link to="/services/encode">
          <Button type="primary">Start</Button>
        </Link>
      </Card>
      <Card style={{ width: 300, height: 500, margin: "30px 0" }}>
        <h1>Simulation</h1>
        <Link to="/services/simulation">
          <Button type="primary">Start</Button>
        </Link>
      </Card>
      <Card style={{ width: 300, height: 500, margin: "30px 0" }}>
        <h1>Whole Process</h1>
        <Link to="/services/wholeprocess">
          <Button type="primary">Start</Button>
        </Link>
      </Card>
    </div>
  );
};

ServiceChose.defaultProps = new ServiceChoseProps();
