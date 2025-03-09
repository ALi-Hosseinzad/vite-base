import React from "react";
import TextareaMessage from "components/textAreaMessage/TextAreaMessage";
import Dictionary from "helpers/Dictionary";
import Classes from "views/ticketing/styles/actionBar.module.scss";
import { useSelector } from "react-redux";

const ActionBar = () => {
  const ticketingData = useSelector((state) => state.ticketing.value);
  const { record } = ticketingData;
  return (
    <div className={Classes["answer-ticket-container"]}>
      {record?.status === "SEEN_BY_BACK_OFFICE" || record?.status === "ASKED" ? (
        <TextareaMessage placeholder={Dictionary.sendAnswerInOneSentence} title={Dictionary.description} />
      ) : record?.status === "CLOSED" ? (
        <div className={Classes["closed-message"]}>
          <p>{Dictionary.ticketWasClosedByCustomer}</p>
        </div>
      ) : (
        <div className={Classes["sent-message"]}>
          <p>{Dictionary.sentYourMessageSuccessfully}</p>
        </div>
      )}
    </div>
  );
};

export default ActionBar;
