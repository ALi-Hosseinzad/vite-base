import React, { forwardRef } from "react";
import { Form } from "antd";
import Classes from "./FormComponent.module.scss";

const FormComponent = forwardRef(({ children, form, onFinish, layout, className, ...props }, ref) => (
  <Form className={`${Classes["list-form"]} ${className}`} layout={layout} form={form} onFinish={onFinish} ref={ref} {...props}>
    {children}
  </Form>
));
FormComponent.displayName = "FormComponent";
export default FormComponent;
