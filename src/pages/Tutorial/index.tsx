import React from "react";
import "./index.less";
export class TutorialProps {}

export const Tutorial: React.FC<TutorialProps> = (props) => {
  return <div> Tutorial content</div>;
};

Tutorial.defaultProps = new TutorialProps();
