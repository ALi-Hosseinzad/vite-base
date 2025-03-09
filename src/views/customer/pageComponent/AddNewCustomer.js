import React, { useEffect, useState } from "react";
import { Steps } from "antd";
import { useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import Classes from "views/customer/styles/AddNewCustomer.module.scss";
import RegisterInformation from "./RegisterInformation";
import Validation from "./Validation";
import SetUsername from "./SetUsername";
import SuccessAddNewCustomer from "./SuccessAddNewCustomer";
import PrintCustomerPassword from "./PrintCustomerPassword";

const { Step } = Steps;

const AddNewCustomer = () => {
  const ListCustomersData = useSelector((state) => state.listCustomers.value);

  const steps = [
    {
      title: Dictionary.registerInformation,
      content: <RegisterInformation />,
    },
    {
      title: Dictionary.validation,
      content: <Validation />,
    },
    {
      title: Dictionary.username,
      content: <SetUsername />,
    },
  ];

  return (
    <>
      {ListCustomersData.current <= 2 ? (
        <>
          <Steps className={Classes["register-steps-header"]} current={ListCustomersData.current} labelPlacement="vertical">
            {steps.map((item, index) => (
              <Step key={index} title={item.title} />
            ))}
          </Steps>
          <div className={Classes["steps-content"]}>{steps[ListCustomersData.current].content}</div>
        </>
      ) : ListCustomersData.current === 3 ? (
        <SuccessAddNewCustomer />
      ) : (
        ListCustomersData.current === 4 && <PrintCustomerPassword />
      )}
    </>
  );
};

export default AddNewCustomer;
