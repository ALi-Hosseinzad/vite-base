import React from "react";
import ModalComponent from "components/modalComponent/ModalComponent";
import { useDispatch, useSelector } from "react-redux";
import { setTimeOute } from "store/reducers/timeOut/timeOutReducer";
import { useNavigate } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import timer from "assets/images/icon/TimeCircle.svg";
import CustomIcon from "components/customIcon/CustomIcon";
import Classes from "./ModalTimeOut.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import { resetReducers } from "store/reducers/users/UsersReducer";

function ModalTimeOut() {
  const time = useSelector((state) => state.timeOut.timeOut);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClose = () => {
    dispatch(resetReducers());
    dispatch(setTimeOute(false));
    navigate("/");
  };
  return (
    <ModalComponent
      open={time}
      title={Dictionary.timeOut}
      className={Classes["modal-timer"]}
      onCancel={handleClose}
    >
      <div className={Classes["box-modal"]}>
        <CustomIcon size={80} src={timer} name="icon-timeOut" />
        <p>{Dictionary.timerText}</p>
        <ButtonComponent
          classNameBtn={Classes["confirm-button"]}
          type="primary"
          onClick={handleClose}
        >
          {Dictionary.iUnderstand}
        </ButtonComponent>
      </div>
    </ModalComponent>
  );
}
export default ModalTimeOut;
