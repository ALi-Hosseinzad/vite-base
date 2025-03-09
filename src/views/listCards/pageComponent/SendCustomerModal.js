import React from "react";
import Dictionary from "helpers/Dictionary";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import { printCard, sendCardV2 } from "helpers/APIFunction";
import ButtonComponent from "components/button/ButtonComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import {
  listCards,
  listCardsState,
} from "store/reducers/listCards/listCardsReducer";
import Classes from "views/listCards/styles/SelectCityOrProvinceCardModal.module.scss";

const SendCustomerModal = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const listCardsData = useSelector(listCardsState);
  const { record, showSendCustomerModal, update } = listCardsData;

  const onFinish = () => {
    if (record.township) {
      if (record?.from_account_creation) {
        printCard({
          identification_code: record.identificationCode,
          reference_number: record.referenceNumber,
        })
          .then(() => {
            dispatch(
              listCards({
                update: !update,
                showSendCustomerModal: false,
                record: "",
              })
            );
          })
          .catch(() => {
            errorHandler(errorResponse);
          });
      } else {
        sendCardV2({
          identification_code: record.identificationCode,
          reference_number: record.referenceNumber,
        })
          .then(() => {
            dispatch(
              listCards({
                update: !update,
                showSendCustomerModal: false,
                record: "",
              })
            );
          })
          .catch(() => {
            errorHandler(errorResponse);
          });
      }
    } else {
      dispatch(
        setNotificationData({
          message: "شهر یا استانی برای این رکورد تعریف نشده است.",
          type: "error",
          time: 5000,
        })
      );
    }
  };

  const onClose = () => {
    dispatch(listCards({ showSendCustomerModal: false, record: "" }));
  };

  return (
    <ModalComponent
      width={842}
      maskClosable={false}
      onCancel={onClose}
      open={showSendCustomerModal}
      title={Dictionary.sendToCustomer}
    >
      <div className={Classes["eyeModalContainer"]}>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.cardNumber}</p>
          <p>{record?.pan || "--"}</p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.fullName}</p>
          <p>{record?.fullName || "--"}</p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.nationalId}</p>
          <p>{record?.identificationCode || "--"}</p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.traceCode}</p>
          <p>{record?.referenceNumber || "--"}</p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.postalCode}</p>
          <p>{record?.postalCode || "--"}</p>
        </div>
        {record?.address && (
          <div>
            <p className={Classes["address"]}>
              {Dictionary.address}: <span>{record?.address}</span>
            </p>
          </div>
        )}
        {record?.address_description && (
          <div>
            <p className={Classes["address"]}>
              {Dictionary.description} {Dictionary.address}:{" "}
              <span>{record?.address_description}</span>
            </p>
          </div>
        )}
      </div>
      <ButtonComponent
        type="primary"
        htmlType="button"
        classNameBtn={Classes["print-button"]}
        onClick={onFinish}
      >
        {Dictionary.cardIssuance}
      </ButtonComponent>
    </ModalComponent>
  );
};
export default SendCustomerModal;
