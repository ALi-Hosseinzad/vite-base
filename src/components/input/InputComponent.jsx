import React, { forwardRef } from "react";
import { Input } from "antd";
import Classes from "./InputComponent.module.scss";
import { ConvertPersianToEnglish } from "helpers/ConvertPersianToEnglish";

let invalidRegex = /javascript|script|select|\%|\!\=|\#|\\\*|\\\*|\/\*|\*\/|\=|\-\-|\;|\+|\`|\"|\'|\>|\<|\|\|/gi;
const InputComponent = forwardRef(({ defaultValue, width, onChange, className, name, ...props }, ref) => (
  <Input
    autoComplete="off"
    name={name}
    className={`${props.prefix ? Classes["input-component-with-icon"] : Classes["input-component"]} ${className}`}
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
                value: ConvertPersianToEnglish(event.target.value).replace(invalidRegex, "").replace(props?.whiteList, ""),
                name: event.target.name,
              },
            });
          }
        : (event) => ""
    }
    {...props}
  />
));

InputComponent.displayName = "InputComponent";

export default InputComponent;
