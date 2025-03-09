import React from "react";
import Dictionary from "helpers/Dictionary";
import { errorResponse } from "helpers/APIService";
import { deleteVersion } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import Classes from "../styles/AppVersions.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import {
  versions,
  versionsState,
} from "store/reducers/versions/versionsReducer";

const VersionDelete = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const AppVersionsData = useSelector(versionsState);
  const { deleteVersionModal, record, refresh } = AppVersionsData;

  const onFinish = () => {
    deleteVersion({
      operating_system: record?.operating_system,
      app_version: record?.app_version,
    })
      .then(() =>
        dispatch(versions({ deleteVersionModal: false, refresh: !refresh }))
      )
      .catch(() => errorHandler(errorResponse));
  };

  return (
    <ModalComponent
      width={650}
      title={`${Dictionary.delete} ${Dictionary.version} `}
      open={deleteVersionModal}
      maskClosable={false}
      onCancel={() =>
        dispatch(versions({ deleteVersionModal: false, record: "" }))
      }
    >
      <div className={Classes["delete-modal-version"]}>
        <div className={Classes["delete-modal-version-text-part"]}>
          <span>
            {Dictionary.type} {Dictionary.system}
          </span>
          <span>{record?.operating_system || "--"}</span>
        </div>
        <div className={Classes["delete-modal-version-text-part"]}>
          <span>{Dictionary.version}</span>
          <span>{record?.app_version || "--"}</span>
        </div>
        {record?.operating_system !== "BROWSER" &&
          record?.checksums?.length > 0 && (
            <div className={Classes["delete-modal-version-text-part"]}>
              <span>CheckSum</span>
              <span>{record?.checksums[0]}</span>
            </div>
          )}
        <div className={Classes["delete-modal-version-text-part"]}>
          <span>Force Update</span>
          <span>{record?.force_update ? Dictionary.yes : Dictionary.no}</span>
        </div>
        <div className={Classes["delete-modal-version-text-part"]}>
          <span>Pre live</span>
          <span>{record?.pre_live ? Dictionary.yes : Dictionary.no}</span>
        </div>
        <div className={Classes["delete-modal-version-text-part"]}>
          <span>
            {Dictionary.date} {Dictionary.release}
          </span>
          <span style={{ direction: "ltr" }}>
            {record?.release_date
              ? record.release_date.replace(" ", " - ")
              : "--"}
          </span>
        </div>
      </div>
      <p className={Classes["text"]}>{Dictionary.wantToDeleteVersion}</p>
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
            dispatch(versions({ deleteVersionModal: false, record: "" }))
          }
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </div>
    </ModalComponent>
  );
};

export default VersionDelete;
