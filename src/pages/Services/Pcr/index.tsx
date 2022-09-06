import React from "react";
import "./index.less";
import { Breadcrumb } from 'antd';
export class PcrProps {}

export const Pcr: React.FC<PcrProps> = (props) => {
  return (
    <div>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
                      <a href="/">Home</a>
                    </Breadcrumb.Item>
            <Breadcrumb.Item>
            <a href="/Services">Service</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Simulation</Breadcrumb.Item>
          <Breadcrumb.Item>PCR</Breadcrumb.Item>
      </Breadcrumb>
      <div>PCR</div>
    </div>
    
  );
};

Pcr.defaultProps = new PcrProps();
