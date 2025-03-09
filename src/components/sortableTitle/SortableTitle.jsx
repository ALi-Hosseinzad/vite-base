import React from "react";
import Classes from "./sortableTitle.module.scss";
import ActiveSort from "assets/images/icon/ActiveSort.svg";
import SortIcon from "assets/images/icon/SortIcon.svg";
import CustomIcon from "components/customIcon/CustomIcon";

const SortableTitle = ({ sort, onClick, text, className }) => {
  return (
    <div onClick={onClick} className={`${Classes["title-with-sort"]} ${className}`}>
      {text}
      {sort === "inc" ? (
        <CustomIcon src={ActiveSort} />
      ) : sort === "desc" ? (
        <CustomIcon src={ActiveSort} className={Classes["rotate-sort-icon"]} />
      ) : (
        sort === "" && <CustomIcon src={SortIcon} />
      )}
    </div>
  );
};

export default SortableTitle;
