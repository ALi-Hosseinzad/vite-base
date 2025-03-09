import React from "react";
import ActionBar from "./ActionBar";
import Dictionary from "helpers/Dictionary";
import { ReplaceAll } from "helpers/ReplaceAll";
import { useDispatch, useSelector } from "react-redux";
import HeaderPage from "components/headerPage/HeaderPage";
import FirstMessage from "components/firstMessage/FirstMessage";
import SecondMessage from "components/secondMessage/SecondMessage";
import { ticketing } from "store/reducers/ticketing/ticketingReducer";
import Classes from "views/ticketing/styles/messageHistory.module.scss";

const MessageHistory = () => {
  const dispatch = useDispatch();
  const ticketingData = useSelector((state) => state.ticketing.value);
  const { record, messagesList, items, reload, permissions } = ticketingData;

  const handleBack = () => {
    dispatch(
      ticketing({
        messageHistory: false,
        objectModal: false,
        messagesList: [],
        reload: !reload,
      })
    );
  };

  return (
    <div className={Classes["message-history"]}>
      <HeaderPage
        title={`${Dictionary.ticket} ${record.trace_id} ${
          record.full_name ? " - " + record.full_name : ""
        } `}
        onClickBack={handleBack}
      />
      <div>
        <span className={Classes["title"]}>{Dictionary.deviceInfo}:</span>
        <span className={Classes["channel"]}>{` ${
          record?.application_channel || ""
        } - `}</span>
        <span className={Classes["version"]}>{`${
          record?.app_version || ""
        } - `}</span>
        <span className={Classes["info"]}>{`${record?.device_model || ""} - ${
          record?.gateway_version || ""
        } `}</span>
      </div>
      {record?.back_office_user_note && (
        <div className={Classes["supports-note"]}>
          <p>{Dictionary.supportsNote}:</p>
          <p>{ReplaceAll(record?.back_office_user_note, "\n", " ")}</p>
        </div>
      )}
      <div
        className={`${Classes["text-section-second"]} ${
          record?.status === "SEEN_BY_BACK_OFFICE" || record?.status === "ASKED"
            ? record?.back_office_user_note
              ? Classes["text-section-second-scroll-textarea-with-note"]
              : Classes["text-section-second-scroll-textarea"]
            : record?.back_office_user_note
            ? Classes["text-section-second-scroll-closed-with-note"]
            : Classes["text-section-second-scroll-closed"]
        }`}
      >
        <div className={Classes["row-bg-gray"]}>
          <p>{Dictionary.caption}</p>
          <p>{messagesList[0]?.caption}</p>
        </div>
        {messagesList?.map((item, index) => (
          <>
            <div className={Classes["second-line"]} />
            <FirstMessage record={item} />
            {!item.answer && messagesList.length === index + 1 && (
              <div style={{ marginBottom: 24 }} />
            )}
            {item.answer && <div className={Classes["second-line"]} />}
            {item.answer && <SecondMessage record={item} />}
            {item.answer && messagesList.length === index + 1 && (
              <div style={{ marginBottom: 24 }} />
            )}
          </>
        ))}
      </div>
      {permissions.ask && <ActionBar />}
    </div>
  );
};

export default MessageHistory;
