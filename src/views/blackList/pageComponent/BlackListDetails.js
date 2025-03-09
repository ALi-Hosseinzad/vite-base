import React from "react";
import ChipComponent from "components/chipComponent/ChipComponent";
import Dictionary from "helpers/Dictionary";
import { useDispatch, useSelector } from "react-redux";
import Classes from "views/blackList/styles/blacklist.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import { blacklist } from "store/reducers/blacklist/blacklistReducer";
import { deleteBlackList } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { setNotificationData } from "store/reducers/toast/toastReducer";

const BlackListDetails = () => {
  const blacklistData = useSelector((state) => state.blacklist.value);
  const record = blacklistData.record;
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();

  const unBlockCustomer = () => {
    deleteBlackList({
      identification_code: record.identification_code,
      event: record.event,
    })
      .then(() => {
        dispatch(
          blacklist({
            detailsModal: false,
            record: "",
            reload: !blacklistData.reload,
          })
        );
        dispatch(
          setNotificationData({
            message: Dictionary.successfullyDone,
            type: "success",
            time: 5000,
          })
        );
      })
      .catch(() => errorHandler(errorResponse));
  };

  return (
    <div>
      <div className={Classes["row-with-bgc"]}>
        <p>{Dictionary.nationalId}</p>
        <p>{record?.identification_code || "--"}</p>
      </div>
      <div className={Classes["row-with-bgc"]}>
        <p>{Dictionary.fullName}</p>
        <p>{record?.fullname || "--"}</p>
      </div>
      <div className={Classes["div-with-bgc"]}>
        <div>
          <p>{Dictionary.service}</p>
          <ChipComponent red>{record?.event_description}</ChipComponent>
        </div>
        <div>
          <p>{Dictionary.by}</p>
          <p>{record?.blocked_by || "--"}</p>
        </div>
        <div>
          <p>{Dictionary.blockDate}</p>
          <p style={{ direction: "ltr" }}>{record?.blocked_date || "--"}</p>
        </div>
        <div>
          <p>{`${Dictionary.reason} ${Dictionary.lock}`}</p>
          <p>{record?.block_description || "--"}</p>
        </div>
        <div>
          <p>{Dictionary.traceCode}</p>
          <p>{record?.reference_number || "--"}</p>
        </div>
      </div>
      {blacklistData.permissions.delete ? (
        <div className={Classes["blacklist-details-btn"]}>
          <ButtonComponent
            classNameBtn={Classes["confirmBtn"]}
            type="primary"
            htmlType="submit"
            onClick={() => unBlockCustomer()}
          >
            {Dictionary.unlock}
          </ButtonComponent>
          <ButtonComponent
            classNameBtn={Classes["cancelBtn"]}
            type="default"
            onClick={() =>
              dispatch(blacklist({ detailsModal: false, record: "" }))
            }
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </div>
      ) : (
        <ButtonComponent
          classNameBtn={Classes["eyeModalBtn"]}
          onClick={() =>
            dispatch(blacklist({ detailsModal: false, record: "" }))
          }
          type="primary"
          htmlType={Dictionary.close}
        >
          {Dictionary.close}
        </ButtonComponent>
      )}
    </div>
  );
};

export default BlackListDetails;
