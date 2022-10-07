import React from "react";
//import "./index.less";
export class SettingProps {}

export const Setting: React.FC<SettingProps> = (props) => {
  return <div> Setting content</div>;
};

Setting.defaultProps = new SettingProps();