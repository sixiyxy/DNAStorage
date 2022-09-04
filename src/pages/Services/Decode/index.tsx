import React from "react";
import "./index.less";
export class DecodeProps {}

export const Decode: React.FC<DecodeProps> = (props) => {
  return <div> Decode content</div>;
};

Decode.defaultProps = new DecodeProps();
