import React from "react";
import { Tabs } from "antd";
import classes from "components/tabsBar/TabsBar.module.scss";
import cx from "classnames";

const TabsBar = ({ items, className, operations, onChange, activeKey, defaultActiveKey, ...rest }) => {
  return (
    <Tabs
      tabBarExtraContent={operations}
      items={items}
      className={cx(classes.tabsContainerDefault, className)}
      onChange={onChange}
      accessKey={activeKey}
      defaultActiveKey={defaultActiveKey}
      {...rest}
    />
  );
};
export default TabsBar;
