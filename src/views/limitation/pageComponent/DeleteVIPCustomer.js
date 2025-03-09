import React from "react";
import Dictionary from "helpers/Dictionary";
import Classes from "views/limitation/styles/limitation.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import { useDispatch } from "react-redux";
import { limitation } from "store/reducers/limitation/limitationReducer";

const DeleteVIPCustomer = ({ deleteFunction }) => {
  const dispatch = useDispatch();

  return (
    <div className={Classes["delete-modal-of-limitation"]}>
      <p style={{ marginBottom: "0" }}>
        {Dictionary.wantToDeleteFromVipCustomer}
      </p>
      <div className={Classes["delete-modal-buttons"]}>
        <ButtonComponent
          type="danger"
          htmlType="button"
          classNameBtn={Classes["delete-modal-confirm-button"]}
          onClick={() => deleteFunction()}
        >
          {Dictionary.delete}
        </ButtonComponent>
        <ButtonComponent
          classNameBtn={Classes["delete-modal-cancel-button"]}
          type="default"
          onClick={() => {
            dispatch(limitation({ vipDeleteModal: false }));
          }}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </div>
    </div>
  );
};

export default DeleteVIPCustomer;
