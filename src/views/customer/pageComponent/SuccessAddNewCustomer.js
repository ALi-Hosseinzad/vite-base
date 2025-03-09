import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import Classes from "views/customer/styles/SuccessAddNewCustomer.module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
import Successful from "assets/images/icon/Successful.svg";
import { Typography } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import { listCustomers } from "store/reducers/listCustomers/listCustomersReducer";

const SuccessAddNewCustomer = () => {
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
        {ListCustomersData.type === "CID"
          ? ListCustomersData.firstname
          : `${Dictionary.maleOrFemale} ${ListCustomersData.name}`}
      </Text>
      <Text className={Classes["success-add-new-customer-username"]}>
        {Dictionary.username} <span>{ListCustomersData.username}</span>
      </Text>
      {ListCustomersData.type === "CID" && (
        <Space className={Classes["set-username-space"]}>
          <CustomIcon src={Warning} size={24} name="set-username-space-icon" />
          <Text className={Classes["set-username-text"]}>
            فعال کردن حساب از صفحه
            <span>مدیریت حساب</span>
            برای مشتریان حقوقی، توسط کاربر پنل الزامیست.
          </Text>
        </Space>
      )}
      <ButtonComponent
        type="primary"
        htmlType="submit"
        classNameBtn={Classes["success-add-new-customer-btn"]}
        onClick={() => {
          dispatch(
            listCustomers({ current: 4, reload: !ListCustomersData.reload })
          );
        }}
      >
        {Dictionary.printPassword}
      </ButtonComponent>
    </div>
  );
};

export default SuccessAddNewCustomer;
