import React, { forwardRef } from "react";
import Classes from "./CollapseComponent.module.scss";
import { Collapse } from "antd";
import CustomIcon from "components/customIcon/CustomIcon";
import Arrow from "assets/images/icon/ArrowDown.svg";
import cx from "classnames";

const { Panel } = Collapse;
const CollapseComponent = forwardRef(({ onChange, activeKey, className, panels, ...props }, ref) => (
  <Collapse
    {...props}
    activeKey={activeKey}
    accordion
    ref={ref}
    bordered={false}
    onChange={onChange}
    className={cx(Classes["site-collapse-custom-collapse"], className)}
    expandIconPosition="end"
    expandIcon={({ isActive }) => (
      <CustomIcon src={Arrow} name="edit-username-icon" color="#308A48" size={24} className={isActive ? Classes["edit-username-icon-rotate"] : ""} />
    )}>
    {panels.map((item) => (
      <Panel header={item.header} key={item.key} className={item.className}>
        <item.element />
      </Panel>
    ))}
  </Collapse>
));
CollapseComponent.displayName = "CollapseComponent";
export default CollapseComponent;
