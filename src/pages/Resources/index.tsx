import React from "react";
import "./index.less";
export class ResourcesProps {}

export const Resources: React.FC<ResourcesProps> = (props) => {
  return <div> Resources content</div>;
};

Resources.defaultProps = new ResourcesProps();
