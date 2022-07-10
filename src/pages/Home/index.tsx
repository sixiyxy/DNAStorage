import React from "react";
import { PathRouteProps } from "react-router-dom";
import "./index.less";
export class HomeProps {}

export const Home: React.FC<HomeProps> = (props) => {
  return <div> Home content</div>;
};
Home.defaultProps = new HomeProps();
