import React from "react";
import "./index.less";
export class ContactProps {}

export const Contact: React.FC<ContactProps> = (props) => {
  return <div> Contact content</div>;
};

Contact.defaultProps = new ContactProps();
