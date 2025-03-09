import React, { forwardRef } from "react";
import { Space } from "antd";
import Classes from "components/status/StatusComponent.module.scss";
import cx from "classnames";

const StatusComponent = forwardRef(({ type, title, onClick, className, ...props }, ref) => {
  return (
    <Space
      className={cx(
        { [Classes.success]: type === "success" },
        { [Classes.pending]: type === "pending" },
        { [Classes.rejected]: type === "rejected" },
        className
      )}
      onClick={onClick}
      ref={ref}
      {...props}>
      {title}
    </Space>
  );
});
StatusComponent.displayName = "StatusComponent";

export default StatusComponent;
