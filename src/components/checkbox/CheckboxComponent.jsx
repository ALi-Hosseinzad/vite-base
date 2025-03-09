import React from "react";
import { Checkbox } from "antd";
import Classes from "components/checkbox/CheckboxComponent.module.scss";

const CheckboxComponent = ({ onChange, name, defaultChecked, className, ...props }) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <Checkbox onChange={handleChange} {...props} defaultChecked={defaultChecked} className={className ? className : Classes["checkbox-component"]}>
      {name}
    </Checkbox>
  );
};

export default CheckboxComponent;
