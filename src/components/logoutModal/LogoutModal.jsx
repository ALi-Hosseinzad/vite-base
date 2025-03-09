import React from "react";
import ModalComponent from "components/modalComponent/ModalComponent";
import Classes from "components/logoutModal/logoutModal.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import Dictionary from "helpers/Dictionary";

const LogoutModal = ({ clickConfirm, clickCancel, visible }) => {
  return (
    <ModalComponent title={`${Dictionary.exit} ${Dictionary.from} ${Dictionary.platform}`} open={visible} onCancel={() => clickCancel()}>
      <div className={Classes["want-to-logout"]}>
        <p>{`${Dictionary.wantToExit}`}</p>
      </div>
      <div className={Classes["logout-modal-buttons"]}>
        <ButtonComponent type="danger" htmlType="button" classNameBtn={Classes["logout-modal-confirm-button"]} onClick={() => clickConfirm()}>
          {Dictionary.exit}
        </ButtonComponent>
        <ButtonComponent classNameBtn={Classes["logout-modal-cancel-button"]} type="default" onClick={() => clickCancel()}>
          {Dictionary.cancel}
        </ButtonComponent>
      </div>
    </ModalComponent>
  );
};

export default LogoutModal;
