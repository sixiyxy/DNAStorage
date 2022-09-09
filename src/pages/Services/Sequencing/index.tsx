import React from "react";
import "./index.less";
export class SequencingProps {}

export const Sequencing: React.FC<SequencingProps> = (props) => {
  return <div> Sequencing content</div>;
};

Sequencing.defaultProps = new SequencingProps();
