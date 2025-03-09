import React from "react";
import { Form } from "antd";
import Classes from "components/formItem/FormItemComponent.module.scss";
import cx from "classnames";

const FormItemComponent = (props) => {
  const { label, name, rules, className, initialValue, button, children, validateFirst, ...rest } = props;
  return (
    <Form.Item
      initialValue={initialValue}
      validateFirst={validateFirst || true}
      className={cx(className, button && Classes.btnFormItem)}
      label={label}
      name={name}
      rules={rules}
      {...rest}>
      {children}
    </Form.Item>
  );
};

export default FormItemComponent;
