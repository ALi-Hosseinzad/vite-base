import React from "react";
import { Input } from "antd";
import Classes from "./TextAreaComponent.module.scss";
import { ConvertPersianToEnglish } from "helpers/ConvertPersianToEnglish";
const { TextArea } = Input;
const TextAreaComponent = React.forwardRef(({ defaultValue, width, onChange, className, ...props }, ref) => (
  <TextArea
    className={`${
      props.prefix ? Classes["input-component-with-icon"] : props.showCount ? Classes["input-component-with-counter"] : Classes["input-component"]
    } ${className}`}
    defaultValue={defaultValue}
    style={{ width: width }}
    ref={ref}
    onChange={
      onChange
        ? (event) => {
            onChange({
              ...event,
              target: {
                ...event.target,
                value: ConvertPersianToEnglish(event.target.value),
                name: event.target.name,
              },
            });
          }
        : ""
    }
    {...props}
  />
));

TextAreaComponent.displayName = "TextAreaComponent";

export default TextAreaComponent;
