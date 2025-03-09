import React from "react";
import Classes from "container/content/Content.module.scss";

const Content = ({ children }) => {
  return <div className={Classes["main-content"]}>{children}</div>;
};

export default Content;
