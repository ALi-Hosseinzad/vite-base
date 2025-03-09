import React, { useEffect, useRef, useState } from "react";
import Classes from "components/firstMessage/firstMessage.module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
// import EditInfoIcon from "assets/images/icon/EditInfo.svg";
import cx from "classnames";
import Dictionary from "helpers/Dictionary";

const FirstMessage = ({ record, handleEdit }) => {
  const [showMore, setShowMore] = useState(false);
  const measuringWrapper = useRef();
  const growDiv = useRef();

  // useEffect(() => {
  // if (record.question.length > 150) {
  // setShowMore(true);
  // }
  // }, [record.question]);

  const handleClick = () => {
    setShowMore(false);
  };

  return (
    <div className={Classes["first-message"]}>
      <div className={Classes["first-message-main-part"]} ref={growDiv}>
        <p className={cx(Classes["first-message-text"], { [Classes["ellipse-first-message-text"]]: showMore })}>{record.question || "--"}</p>
        <div ref={measuringWrapper} className={cx(Classes["first-message-action-part"], { [Classes["more-hight"]]: showMore })}>
          {record.status === "ASKED" && <CustomIcon src={""} size={20} name="edit-icon" onClick={() => handleEdit()} />}
          {showMore && (
            <span onClick={handleClick} className={Classes["first-message-more"]}>
              {Dictionary.more}
            </span>
          )}
        </div>
      </div>
      <div className={Classes["first-message-second-part-2"]}>
        {/* <span className={Classes["first-message-status"]}></span> */}
        <span className={Classes["first-message-date"]}>{record.asking_time?.split(" ")?.reverse()?.join(" - ") || "--"}</span>
      </div>
    </div>
  );
};
export default FirstMessage;
