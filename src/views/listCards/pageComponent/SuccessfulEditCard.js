import React from "react";
import { Typography } from "antd";
import Dictionary from "helpers/Dictionary";
import { useDispatch, useSelector } from "react-redux";
import CustomIcon from "components/customIcon/CustomIcon";
import Successful from "assets/images/icon/Successful.svg";
import InputComponent from "components/input/InputComponent";
import ButtonComponent from "components/button/ButtonComponent";
import Classes from "views/listCards/styles/EditCard.module.scss";
import {
  listCards,
  listCardsState,
} from "store/reducers/listCards/listCardsReducer";

const SuccessfulEditCard = () => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const listCardsData = useSelector(listCardsState);

  return (
    <div className={Classes["success-edit-card"]}>
      <CustomIcon src={Successful} size={88} name="success-edit-card-icon" />
      <Text className={Classes["success-edit-card-text"]}>
        {Dictionary.successfulChanges}
      </Text>
      <Text className={Classes["success-edit-card-username"]}>
        {Dictionary.username}: <span>{listCardsData.record.username}</span>
      </Text>
      <InputComponent
        width={343}
        name="cardNumber"
        defaultValue={listCardsData.newPan}
        prefix={<Text>{Dictionary.newCard}</Text>}
        maxLength={20}
        className={Classes["edit-card-form-input"]}
        disabled
      />
      <ButtonComponent
        type="primary"
        htmlType="submit"
        classNameBtn={Classes["success-edit-card-btn"]}
        onClick={() =>
          dispatch(
            listCards({ editModal: false, record: "", successEdit: false })
          )
        }
      >
        {Dictionary.close}
      </ButtonComponent>
    </div>
  );
};

export default SuccessfulEditCard;
