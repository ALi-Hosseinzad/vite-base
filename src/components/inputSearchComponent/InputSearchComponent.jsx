import React, { forwardRef, useState } from "react";
import { Input } from "antd";
import Classes from "components/input/InputComponent.module.scss";
import { ConvertPersianToEnglish } from "helpers/ConvertPersianToEnglish";
import cx from "classnames";
import CustomIcon from "components/customIcon/CustomIcon";
import Close from "assets/images/icon/Close.svg";
import SearchLogo from "assets/images/icon/Search.svg";

const InputSearchComponent = forwardRef(({ defaultValue, width, onChange, className, name, ...props }, ref) => {
  const [state, setState] = useState(false);

  return (
    <Input
      className={cx(Classes["input-component-with-icon"], { className })}
      defaultValue={defaultValue}
      style={{ width: width }}
      ref={ref}
      onBlur={() => setState(false)}
      onFocus={() => setState(true)}
      prefix={
        <CustomIcon src={SearchLogo} size={16} name={state ? `${name}-search-focus` : `${name}-search`} color={state ? "#2B9570" : "#BDBDBD"} />
      }
      allowClear={{ clearIcon: <CustomIcon src={Close} name={`${name}-close-icon`} size={16} color="#2A2A2A" /> }}
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
  );
});

InputSearchComponent.displayName = "InputSearchComponent";

export default InputSearchComponent;
