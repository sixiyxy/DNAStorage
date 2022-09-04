import React from "react";
import "./index.less";
export class DecayProps {}

export const Decay: React.FC<DecayProps> = (props) => {
  return <div> Decay content</div>;
};

Decay.defaultProps = new DecayProps();
