import React, { forwardRef, useState } from "react";
import { Input } from "antd";
import Classes from "components/passwordInput/PasswordInput.module.scss";
import { ConvertPersianToEnglish } from "helpers/ConvertPersianToEnglish";
import cx from "classnames";
import Visible from "assets/images/icon/Visible.svg";
import InVisible from "assets/images/icon/VisibleGrey.svg";
import CustomIcon from "components/customIcon/CustomIcon";

const PasswordInput = forwardRef(({ defaultValue, width, onChange, className, name, color, placeholder, ...props }, ref) => {
  const [state, setState] = useState(false);

  return (
    <Input.Password
      name={name}
      autoComplete="new-password"
      placeholder={placeholder || "* * * * * * * * * * *"}
      className={cx(Classes["input-password"], `${className}`)}
      defaultValue={defaultValue}
      style={state ? { borderColor: color, width: width } : { width: width }}
      iconRender={(visible) => (
        <CustomIcon
          src={visible ? Visible : InVisible}
          color={state ? color : "#BDBDBD"}
          name={visible ? "name-visible-icon" : "name-invisible-icon"}
          size={28}
        />
      )}
      ref={ref}
      onBlur={() => setState(false)}
      onFocus={() => setState(true)}
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

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
