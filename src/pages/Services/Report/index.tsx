import React from "react";
//import "./index.less";
export class ReportProps {}

export const Report: React.FC<ReportProps> = (props) => {
  return <div> Report content</div>;
};

Report.defaultProps = new ReportProps();