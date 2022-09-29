import React from "react";
import "./index.less";
export class ContactProps {}

export const Contact: React.FC<ContactProps> = (props) => {
  return (
    <div id="page">
      <div id="people">
        <h1>People involved in the DNA Storage project:</h1>
        <ul>
          <li>Likun Jiang,Xiamen University</li>
          <li>Changzhi Jiang,Xiamen University</li>
          <li>Ziyun Zou,Xiamen University</li>
          <li>Xinyu Yu,Xiamen University</li>
          <li>Yanni Xu,Xiamen University</li>
          <li>Xinru Ruan,Xiamen University</li>
          <li>Xinyi Zhang,Xiamen University</li>
        </ul>
      </div>

      <div id="Correspondence">
        <h1>Correspondence</h1>
        <div id="tableContainer">
          <div id="tableRow">
            <div id="tableCell">
              <p id="teacher">Dr.Xiangrong Liu</p>
              <a href="">xrliu@xmu.edu.cn</a>
              <p>Professor</p>
              <p>Xiamen University,</p>
              <p>Xiamen,China</p>
            </div>
            <div id="tableCell">
              <img
                id="professorpic"
                src="src\pages\Contact\professor-img-3.png"
                alt="professorLiu img"
                width="130px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Contact.defaultProps = new ContactProps();
