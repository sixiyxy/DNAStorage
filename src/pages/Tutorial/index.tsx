import React from "react";
import { Breadcrumb } from 'antd';
import "./index.less";
export class TutorialProps {}

export const Tutorial: React.FC<TutorialProps> = (props) => {
  return (
    <div className="tutorial-container">
      <div className="tutorial">
      <div className="Breadcrumb">
            <Breadcrumb separator=">">
                  <Breadcrumb.Item>
                    <a href="/home">Home</a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>Tutorial</Breadcrumb.Item>
              </Breadcrumb>
          </div>
      
      </div>
    </div>
  )
};

Tutorial.defaultProps = new TutorialProps();
