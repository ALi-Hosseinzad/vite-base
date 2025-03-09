import React from "react";
import Content from "container/content/Content";
import Header from "container/header/Header";
import Sidebar from "container/sidebar/Sidebar";
import Classes from "./Layout.module.scss";
import { LayoutProvider } from "context/LayoutContext";
import ModalTimeOut from "components/modalTimeOut/ModalTimeOut";

const Layout = ({ children }) => {
  return (
    <LayoutProvider>
      <ModalTimeOut />
      <div className={Classes["layout"]}>
        <Sidebar />
        <div className={Classes["layout-content"]}>
          <Header />
          <Content>{children}</Content>
        </div>
      </div>
    </LayoutProvider>
  );
};

export default Layout;
