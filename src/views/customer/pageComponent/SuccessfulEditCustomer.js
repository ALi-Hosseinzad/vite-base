import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import Classes from "views/customer/styles/SuccessAddNewCustomer.module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
import Successful from "assets/images/icon/Successful.svg";
import { Typography } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import { listCustomers } from "store/reducers/listCustomers/listCustomersReducer";

const SuccessfulEditCustomer = () => {
  const dispatch = useDispatch();
  const ListCustomersData = useSelector((state) => state.listCustomers.value);
  const { Text } = Typography;

  return (
    <div className={Classes["success-add-new-customer"]}>
      <CustomIcon
        src={Successful}
        size={88}
        name="success-add-new-customer-icon"
      />
      <Text className={Classes["success-add-new-customer-text"]}>
        {Dictionary.successAddNewCustomer}
      </Text>
      <Text className={Classes["success-add-new-customer-username"]}>
        {/* {ListCustomersData.record.gender === "female" ? Dictionary.female : Dictionary.male} {ListCustomersData.record.fullname} */}
        {`${Dictionary.maleOrFemale} ${ListCustomersData.record.fullname}`}
      </Text>
      <Text className={Classes["success-add-new-customer-username"]}>
        {Dictionary.username} <span>{ListCustomersData.record.username}</span>
      </Text>
      <Text className={Classes["success-add-new-customer-username"]}>
        {Dictionary.mobile} <span>{ListCustomersData.record.mobileNumber}</span>
      </Text>
      <ButtonComponent
        type="primary"
        htmlType="submit"
        classNameBtn={Classes["success-add-new-customer-btn"]}
        onClick={() => {
          dispatch(
            listCustomers({
              editUsernameAndMobileModal: false,
              secondStep: 1,
              collapse: "",
            })
          );
        }}
      >
        {Dictionary.close}
      </ButtonComponent>
    </div>
  );
};

export default SuccessfulEditCustomer;
