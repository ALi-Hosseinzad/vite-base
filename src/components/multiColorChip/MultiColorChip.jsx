import React from "react";
import Classes from "components/multiColorChip/multiColorChip.module.scss";

const MultiColorChip = ({ fontColor, bgc, children, className }) => {
  return (
    <div style={{ backgroundColor: bgc }} className={`${Classes["multi-chip-container"]} ${className}`}>
      <p style={{ color: fontColor }}>{children}</p>
    </div>
  );
};

export default MultiColorChip;
