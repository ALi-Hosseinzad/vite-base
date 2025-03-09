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

const SuccessfulRepresentative = () => {
  const representativeData = useSelector(representativeState);
  const { Text } = Typography;
  const dispatch = useDispatch();
  return (
    <div className={Classes["success-edit-card"]}>
      <CustomIcon src={Successful} size={88} name="success-edit-card-icon" />
      <Text className={Classes["success-edit-card-text"]}>
        {Dictionary.successfulSelectRepresentative}
      </Text>
      <div className={Classes["row"]}>
        <p>{Dictionary.accNo}</p>
        <p>{representativeData.list[0]?.account_number}</p>
      </div>
      <div className={Classes["row"]}>
        <p>{Dictionary.fullName + " " + Dictionary.representative}</p>
        <p>
          {representativeData.resultCheck?.firstname +
            " " +
            representativeData.resultCheck?.lastname}
        </p>
      </div>
      <ButtonComponent
        type="primary"
        htmlType="submit"
        classNameBtn={Classes["success-edit-card-btn"]}
        onClick={() =>
          dispatch(
            representative({
              addModal: false,
              resultCheck: null,
              showSuccess: false,
              dismissalModal: false,
              reload: true,
            })
          )
        }
      >
        {Dictionary.iUnderstand}
      </ButtonComponent>
    </div>
  );
};

export default SuccessfulRepresentative;
