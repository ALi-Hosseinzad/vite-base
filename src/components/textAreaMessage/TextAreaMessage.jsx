import React, { useRef, useState } from "react";
import CustomIcon from "components/customIcon/CustomIcon";
import Classes from "components/textAreaMessage/textAreaMessage.module.scss";
import ArrowBack from "assets/images/icon/ArrowBack.svg";
import Dictionary from "helpers/Dictionary";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { useDispatch, useSelector } from "react-redux";
import { answerTickets } from "helpers/APIFunction";
import { ticketing } from "store/reducers/ticketing/ticketingReducer";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";

const TextareaMessage = (props) => {
  const errorHandler = useErrorHandler();
  const ticketingData = useSelector((state) => state.ticketing.value);
  const { messagesList, record, reload } = ticketingData;
  const dispatch = useDispatch();
  const textareaRef = useRef();
  const { title, placeholder } = props;
  const form = useRef(null);
  const [disabled, setDisabled] = useState(true);
  const [answer, setAnswer] = useState("");

  const handleNote = (event) => {
    if (event.target.value.length > 10) {
      if (disabled !== false) {
        setDisabled(false);
      }
      if (event.target.value.length > 500) {
        dispatch(
          setNotificationData({
            message: Dictionary.errorMaxCharacter,
            type: "error",
            time: 5000,
          })
        );
      }
    } else {
      setDisabled(true);
    }
    setAnswer(event.target.value);
  };

  const handleInput = (e) => {
    if (textareaRef.current && e.target.scrollHeight < 180) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${e.target.scrollHeight - 16}px`;
    }
  };

  const onClick = () => {
    answerTickets({
      id: messagesList[messagesList?.length - 1]?.id,
      answer: answer,
      trace_id: record.trace_id,
    })
      .then(() =>
        dispatch(
          ticketing({
            messageHistory: false,
            reload: !reload,
            objectModal: false,
          })
        )
      )
      .catch(() => errorHandler(errorResponse));
  };

  return (
    <div className={Classes["text-message-container"]}>
      <form ref={form}>
        <div className={Classes["text-message-note-text"]}>
          <p>{title}</p>
        </div>
        <div className={Classes["text-message-note"]}>
          <textarea
            id="note"
            ref={textareaRef}
            name="note"
            rows="4"
            cols="250"
            // maxLength="250"
            // onInput={handleInput}
            value={answer}
            onChange={handleNote}
            placeholder={placeholder}
          />
          <span
            type="submit"
            disabled={disabled}
            onClick={onClick}
            className={
              disabled
                ? Classes["text-message-disabled-submit-btn"]
                : Classes["text-message-submit-btn"]
            }
          >
            <CustomIcon
              src={ArrowBack}
              size={24}
              name="send-icon"
              cursor={disabled ? "default" : "pointer"}
            />
          </span>
        </div>
      </form>
    </div>
  );
};
export default TextareaMessage;
