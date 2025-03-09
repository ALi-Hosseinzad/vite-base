import React from "react";
import Dictionary from "helpers/Dictionary";
import Classes from "../styles/AppSettings.module.scss";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "components/button/ButtonComponent";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import ModalComponent from "components/modalComponent/ModalComponent";
import { deleteOneAppSettings } from "helpers/APIFunction";
import {
  appSettings,
  appSettingsState,
} from "store/reducers/appSettings/AppSettingsReducer";

const DeleteAppSetting = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const AppSettingsData = useSelector(appSettingsState);
  const { deleteAppSettingsModal, record, refresh } = AppSettingsData;

  const onFinish = () => {
    deleteOneAppSettings(record.item_name)
      .then(() =>
        dispatch(
          appSettings({ deleteAppSettingsModal: false, refresh: !refresh })
        )
      )
      .catch(() => errorHandler(errorResponse));
  };

  return (
    <ModalComponent
      width={650}
      title={`${Dictionary.delete} ${Dictionary.settings} `}
      open={deleteAppSettingsModal}
      maskClosable={false}
      onCancel={() =>
        dispatch(appSettings({ deleteAppSettingsModal: false, record: "" }))
      }
    >
      <div className={Classes["delete-modal-appSettings"]}>
        <div className={Classes["delete-modal-appSettings-text-part"]}>
          <span>
            {Dictionary.name} {Dictionary.item}
          </span>
          <span>{record.item_name || "--"}</span>
        </div>
        <div className={Classes["delete-modal-appSettings-text-part"]}>
          <span>{Dictionary.android}</span>
          <span>{record.android_value || "--"}</span>
        </div>
        <div className={Classes["delete-modal-appSettings-text-part"]}>
          <span>{Dictionary.ios}</span>
          <span>{record.ios_value || "--"}</span>
        </div>
        <div className={Classes["delete-modal-appSettings-text-part"]}>
          <span>{Dictionary.browser}</span>
          <span>{record.browser_value || "--"}</span>
        </div>
      </div>
      <p className={Classes["text"]}>{Dictionary.wantToDeleteSettings}</p>
      <div className={Classes["delete-modal-buttons"]}>
        <ButtonComponent
          type="danger"
          htmlType="button"
          classNameBtn={Classes["delete-modal-confirm-button"]}
          onClick={onFinish}
        >
          {Dictionary.delete}
        </ButtonComponent>
        <ButtonComponent
          classNameBtn={Classes["delete-modal-cancel-button"]}
          type="default"
          onClick={() =>
            dispatch(appSettings({ deleteAppSettingsModal: false, record: "" }))
          }
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </div>
    </ModalComponent>
  );
};

export default DeleteAppSetting;
