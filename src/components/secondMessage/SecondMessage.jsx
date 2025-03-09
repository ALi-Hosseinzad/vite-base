import React from "react";
import Classes from "components/secondMessage/secondMessage.module.scss";
import Dictionary from "helpers/Dictionary";

const SecondMessage = ({ record }) => {
  return (
    <div className={Classes["first-message"]}>
      <div className={Classes["first-message-main-part"]}>
        <p className={Classes["first-message-text"]}>{record.answer || "--"}</p>
      </div>
      <div className={Classes["first-message-second-part"]}>
        <span className={Classes["first-message-username"]}>{`${Dictionary.username}: ${record.bo_user || "--"}`}</span>
        <span className={Classes["first-message-date"]}>{record.answering_time?.split(" ")?.reverse()?.join(" - ") || "--"}</span>
      </div>
    </div>
  );
};
export default SecondMessage;
