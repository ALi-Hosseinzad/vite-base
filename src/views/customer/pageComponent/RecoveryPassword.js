import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import Classes from "views/customer/styles/SuccessAddNewCustomer.module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
import Successful from "assets/images/icon/Successful.svg";
import { Typography } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import { listCustomers } from "store/reducers/listCustomers/listCustomersReducer";
import SendOTP from "./SendOTP";

const RecoveryPassword = () => {
  const ListCustomersData = useSelector((state) => state.listCustomers.value);
  const dispatch = useDispatch();
  const { Text } = Typography;

  return (
    <>
      {ListCustomersData.recoveryStep === 1 ? (
        <SendOTP />
      ) : ListCustomersData.recoveryStep === 2 ? (
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
            {ListCustomersData.record.fullName}
          </Text>
          <Text className={Classes["success-add-new-customer-username"]}>
            {Dictionary.username} {ListCustomersData.record.username}
          </Text>
          <ButtonComponent
            type="primary"
            htmlType="submit"
            classNameBtn={Classes["success-add-new-customer-btn"]}
            onClick={() =>
              dispatch(listCustomers({ recoveryModal: false, recoveryStep: 1 }))
            }
          >
            {Dictionary.iUnderstand}
          </ButtonComponent>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default RecoveryPassword;
