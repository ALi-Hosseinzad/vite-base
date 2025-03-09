import CustomIcon from "components/customIcon/CustomIcon";
import React from "react";
import Dictionary from "helpers/Dictionary";
import Warning from "assets/images/icon/Warning.svg";
import Classes from "views/limitation/styles/limitation.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import { useDispatch } from "react-redux";
import { limitation } from "store/reducers/limitation/limitationReducer";

const DeleteCustomerLimit = ({ deleteFunction }) => {
  const dispatch = useDispatch();

  return (
    <div className={Classes["delete-modal-of-limitation"]}>
      <p>{Dictionary.wantToDeleteLimitation}</p>
      <div>
        <CustomIcon src={Warning} size={24} />
        <p>{Dictionary.deleteSameAsSetDefault}</p>
      </div>
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
            dispatch(limitation({ deleteModal: false }));
          }}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </div>
    </div>
  );
};

export default DeleteCustomerLimit;
