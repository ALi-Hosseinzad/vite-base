import React, { forwardRef } from "react";
import { Tooltip } from "antd";

const TooltipComponent = forwardRef(({ color = "#017874", title, placement = "top", children, ...props }, ref) => (
  <Tooltip title={title} placement={placement} color={color} ref={ref} {...props} style={{ backgroundBlendMode: "overlay" }}>
    {children}
  </Tooltip>
));
TooltipComponent.displayName = "TooltipComponent";

export default TooltipComponent;
