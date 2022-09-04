import React from "react";
import "./index.less";
export class PcrProps {}

export const Pcr: React.FC<PcrProps> = (props) => {
  return <div> Pcr content</div>;
};

Pcr.defaultProps = new PcrProps();
