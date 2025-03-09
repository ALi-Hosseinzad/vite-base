import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import Classes from "views/customer/styles/SuccessAddNewCustomer.module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
import Successful from "assets/images/icon/Successful.svg";
import { Typography } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import { listCustomers } from "store/reducers/listCustomers/listCustomersReducer";
import { users } from "store/reducers/users/UsersReducer";

const SuccessAddNewUser = () => {
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
        {ListUsersData.edit
          ? Dictionary.successfulChanges
          : Dictionary.successAddNewUser}
      </Text>
      <Text className={Classes["success-add-new-customer-username"]}>
        {ListUsersData.record?.gender === "FEMALE"
          ? Dictionary.female
          : Dictionary.male}{" "}
        {ListUsersData.record?.firstname} {ListUsersData.record?.lastname}
      </Text>
      <Text className={Classes["success-add-new-customer-username"]}>
        {Dictionary.username} <span>{ListUsersData.record?.username}</span>
      </Text>
      {!ListUsersData?.edit && <Text>{Dictionary.sendToUserMobile}</Text>}
      <ButtonComponent
        type="primary"
        htmlType="submit"
        classNameBtn={Classes["success-add-new-customer-btn"]}
        onClick={() => {
          dispatch(
            users({
              addModal: false,
              reload: !ListUsersData.reload,
              current: 0,
            })
          );
        }}
      >
        {Dictionary.close}
      </ButtonComponent>
    </div>
  );
};

export default SuccessAddNewUser;
