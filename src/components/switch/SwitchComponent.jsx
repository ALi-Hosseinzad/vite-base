import React, { forwardRef } from "react";
import { Switch } from "antd";
import Classes from "components/switch/SwitchComponent.module.scss";

const SwitchComponent = forwardRef(({ checked, onChange, ...props }, ref) => (
  <Switch className={Classes["switch"]} checked={checked} onChange={onChange} ref={ref} {...props} />
));
SwitchComponent.displayName = "SwitchComponent";

export default SwitchComponent;
