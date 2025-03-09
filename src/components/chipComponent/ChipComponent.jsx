import CustomIcon from "components/customIcon/CustomIcon";
import React, { useEffect, useState } from "react";
import Classes from "./chipComponent.module.scss";
import Close from "assets/images/icon/Close.svg";
import Add from "assets/images/icon/Add.svg";
import cx from "classnames";

const ChipComponent = (props) => {
  const { children, toggle, active, red, className, disabled } = props;
  const [enable, setEnable] = useState(false);

  const handleToggle = () => {
    setEnable(!enable);
  };
  useEffect(() => {
    if (active) {
      setEnable(true);
    } else {
      setEnable(false);
    }
  }, [active]);

  return (
    <div
      className={cx(
        className,
        toggle
          ? enable
            ? Classes["enableChipContainer"]
            : Classes["disableChipContainer"]
          : red
          ? Classes["redChipContainer"]
          : Classes["enableChipContainer"],
        disabled ? Classes["disableChipContainer"] : null
      )}
      style={{ cursor: `${toggle && "pointer"}` }}
      onClick={handleToggle}>
      {toggle &&
        (enable ? (
          <CustomIcon src={Close} color={"#2B9570"} name="enableChip" size={16} />
        ) : (
          <CustomIcon src={Add} color="#888888" name="disableChip" size={16} />
        ))}
      <span style={{ textAlign: "center" }}>{children}</span>
    </div>
  );
};

export default ChipComponent;
