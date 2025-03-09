import React from "react";
import ModalComponent from "components/modalComponent/ModalComponent";
import Dictionary from "helpers/Dictionary";
import Warning from "assets/images/icon/Warning.svg";
import Classes from "components/cancelModal/cancelModal.module.scss";
import ButtonComponent from "components/button/ButtonComponent";

const CancelModal = (props) => {
  const { clickConfirm, clickCancel, visible } = props;
  return (
    <ModalComponent title={`${Dictionary.warning} ${Dictionary.cancel}`} open={visible} onCancel={() => clickCancel()}>
      <div className={Classes["want-to-cancel"]}>
        <p>{Dictionary.wantToCancel}</p>
      </div>
      <div className={Classes["cancel-to-reset-flow"]}>
        <img src={Warning} alt="warning-icon" />
        <p>{Dictionary.cancelToResetFlow}</p>
      </div>
      <div className={Classes["cancel-modal-buttons"]}>
        <ButtonComponent type="danger" htmlType="button" classNameBtn={Classes["cancel-modal-confirm-button"]} onClick={() => clickConfirm()}>
          {Dictionary.cancel}
        </ButtonComponent>
        <ButtonComponent classNameBtn={Classes["cancel-modal-cancel-button"]} type="default" onClick={() => clickCancel()}>
          {Dictionary.continue}
        </ButtonComponent>
      </div>
    </ModalComponent>
  );
};

export default CancelModal;
