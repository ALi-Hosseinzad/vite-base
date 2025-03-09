import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import Classes from "views/representative/styles/Representative.module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
import Successful from "assets/images/icon/Successful.svg";
import { Typography } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import {
  representative,
  representativeState,
} from "store/reducers/representative/representativeReducer";
import ModalComponent from "components/modalComponent/ModalComponent";

const SuccessfulModal = () => {
  const dispatch = useDispatch();
  const representativeData = useSelector(representativeState);
  const { showSuccessModal, title, reloadChoose } = representativeData;
  const { Text } = Typography;

  const closeModal = () => {
    dispatch(
      representative({
        addNewRepresentativeModal: false,
        deleteRepresentativeModal: false,
        record: "",
        resultCheckId: "",
        nationalIdChecked: false,
        title: "",
        reloadChoose: !reloadChoose,
        showSuccessModal: false,
        checkedValue: false,
      })
    );
  };

  return (
    <ModalComponent
      maskClosable={false}
      title={title}
      open={showSuccessModal}
      width={540}
      onCancel={closeModal}
    >
      <div className={Classes["success-edit-card"]}>
        <CustomIcon src={Successful} size={88} name="success-edit-card-icon" />
        <Text className={Classes["success-edit-card-text"]}>
          {Dictionary.successfullyDone}
        </Text>
        <ButtonComponent
          type="primary"
          htmlType="submit"
          classNameBtn={Classes["success-edit-card-btn"]}
          onClick={closeModal}
        >
          {Dictionary.iUnderstand}
        </ButtonComponent>
      </div>
    </ModalComponent>
  );
};

export default SuccessfulModal;
