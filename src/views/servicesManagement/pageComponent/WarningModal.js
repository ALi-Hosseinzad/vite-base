import CustomIcon from "components/customIcon/CustomIcon";
import React from "react";
import Dictionary from "helpers/Dictionary";
import Classes from "views/servicesManagement/styles/warningModal.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import Warning from "assets/images/icon/Warning.svg";
import { useDispatch, useSelector } from "react-redux";
import { services } from "store/reducers/servicesManagement/servicesReducer";
import {
  editAnonymousService,
  editAuthenticationService,
} from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";

const WarningModal = () => {
  const dispatch = useDispatch();
  const servicesData = useSelector((state) => state.services.value);
  const record = servicesData.record;
  const errorHandler = useErrorHandler();
  const clickConfirm = () => {
    if (servicesData.serviceType === "AUTHENTICATED") {
      editAuthenticationService({
        facility_key: record.facility_key,
        is_for_pwa: record.is_for_pwa ? 1 : 0,
        is_for_web: record.is_for_web ? 1 : 0,
        is_for_mobile: record.is_for_mobile ? 1 : 0,
        allow_user_disable: record.allow_user_disable ? 1 : 0,
        is_biometric: record.is_biometric_available ? 1 : 0,
      })
        .then(() =>
          dispatch(
            services({
              editModal: false,
              warningModal: false,
              record: "",
              reload: !servicesData.reload,
            })
          )
        )
        .catch(() => errorHandler(errorResponse));
    } else if (servicesData.serviceType === "ANONYMOUS") {
      editAnonymousService({
        facility_key: record.facility_key,
        is_for_pwa: record.is_for_pwa ? 1 : 0,
        is_for_web: record.is_for_web ? 1 : 0,
        is_for_mobile: record.is_for_mobile ? 1 : 0,
        allow_user_disable: record.allow_user_disable ? 1 : 0,
        is_biometric: record.is_biometric_available ? 1 : 0,
      })
        .then(() =>
          dispatch(
            services({
              editModal: false,
              warningModal: false,
              record: "",
              reload: !servicesData.reload,
            })
          )
        )
        .catch(() => errorHandler(errorResponse));
    }
  };
  const clickCancel = () => {
    dispatch(services({ warningModal: false, editModal: true }));
  };

  return (
    <div>
      <div className={Classes["deactive-service-modal-text"]}>
        <CustomIcon src={Warning} size={24} />
        <p>{Dictionary.deactivateServiceWarning}</p>
      </div>
      <p className={Classes["deactive-service-modal-note"]}>
        {Dictionary.wantToDeactive}
      </p>
      <div className={Classes["deactivate-service-modal-buttons"]}>
        <ButtonComponent
          type="primary"
          htmlType="button"
          classNameBtn={Classes["deactivate-service-modal-confirm-button"]}
          onClick={() => clickConfirm()}
        >
          {Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          classNameBtn={Classes["deactivate-service-modal-cancel-button"]}
          type="default"
          onClick={() => clickCancel()}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </div>
    </div>
  );
};

export default WarningModal;
