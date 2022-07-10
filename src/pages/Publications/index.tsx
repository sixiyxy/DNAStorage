import React from "react";
import "./index.less";
export class PublicationsProps {}

export const Publications: React.FC<PublicationsProps> = (props) => {
  return <div> Publications content</div>;
};

Publications.defaultProps = new PublicationsProps();
