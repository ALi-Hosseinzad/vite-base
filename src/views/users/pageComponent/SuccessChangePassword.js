import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import Classes from "views/customer/styles/SuccessAddNewCustomer.module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
import Successful from "assets/images/icon/Successful.svg";
import { Typography } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import { users } from "store/reducers/users/UsersReducer";

const SuccessChangePassword = () => {
  const dispatch = useDispatch();
  const ListUsersData = useSelector((state) => state.users.value);
  const { Text } = Typography;

  return (
    <div className={Classes["success-add-new-customer"]}>
      <CustomIcon
        src={Successful}
        size={88}
        name="success-add-new-customer-icon"
      />
      <Text className={Classes["success-add-new-customer-text"]}>
        {Dictionary.successRecoveryPassword}
      </Text>
      <Text className={Classes["success-add-new-customer-username"]}>
        {ListUsersData.record.gender === "FEMALE"
          ? Dictionary.female
          : Dictionary.male}{" "}
        {ListUsersData.record.firstname} {ListUsersData.record.lastname}
      </Text>
      <Text className={Classes["success-add-new-customer-username"]}>
        {Dictionary.username} <span>{ListUsersData.record.username}</span>
      </Text>
      <Text className={Classes["success-recover-password-text"]}>
        {Dictionary.newPasswordSent}
      </Text>
      <ButtonComponent
        type="primary"
        htmlType="close"
        classNameBtn={Classes["success-add-new-customer-btn"]}
        onClick={() => dispatch(users({ changePassword: false }))}
      >
        {Dictionary.close}
      </ButtonComponent>
    </div>
  );
};

export default SuccessChangePassword;
