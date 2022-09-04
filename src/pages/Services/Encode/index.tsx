import React from "react";
import "./index.less";
export class EncodeProps {}

export const Encode: React.FC<EncodeProps> = (props) => {
  return <div> Encode content</div>;
};

Encode.defaultProps = new EncodeProps();
