import React from "react";
import "./index.less";
export class ServicesProps {}

export const Services: React.FC<ServicesProps> = (props) => {
  return <div> Services content</div>;
};

Services.defaultProps = new ServicesProps();
