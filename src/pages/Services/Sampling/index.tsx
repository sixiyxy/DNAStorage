import React from "react";
import "./index.less";
export class SamplingProps {}

export const Sampling: React.FC<SamplingProps> = (props) => {
  return <div> Sampling content</div>;
};

Sampling.defaultProps = new SamplingProps();
