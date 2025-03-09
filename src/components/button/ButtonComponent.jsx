import React from "react";
import { Button } from "antd";
import Classes from "components/button/ButtonComponent.module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
import cx from "classnames";

const ButtonComponent = (props) => {
  const {
    type,
    classNameBtn,
    onClick,
    children,
    disabled,
    srcRight,
    srcLeft,
    colorRight,
    colorLeft,
    name,
    htmlType,
    classNameLeftIcon,
    classNameRightIcon,
    ...rest
  } = props;

  return (
    <Button
      type={type}
      icon={
        !!srcRight && (
          <CustomIcon size={20} src={srcRight} color={colorRight} className={cx(Classes.rightIcon, classNameRightIcon)} name={`btn-icon-right-${name}`} />
        )
      }
      className={cx(classNameBtn, Classes[type], { disabled: Classes[`disabled-${type}`] })}
      onClick={onClick}
      disabled={disabled}
      {...rest}
      htmlType={htmlType}>
      {children}
      {!!srcLeft && (
        <CustomIcon size={20} src={srcLeft} color={colorLeft} className={`${Classes.leftIcon} ${classNameLeftIcon}`} name={`btn-icon-left-${name}`} />
      )}
    </Button>
  );
};

export default ButtonComponent;
