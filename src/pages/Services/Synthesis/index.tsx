import React from "react";
import "./index.less";
export class SynthesisProps {}

export const Synthesis: React.FC<SynthesisProps> = (props) => {
  return <div> Synthesis content</div>;
};

Synthesis.defaultProps = new SynthesisProps();
