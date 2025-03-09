import React, { useEffect } from "react";
import { Steps } from "antd";
import UserRegisterInfo from "./UserRegisterInfo";
import { useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import SetUsername from "views/users/pageComponent/SetUsername";
import SetRole from "./SetRole";
import Classes from "../styles/users.module.scss";
import SuccessAddNewUser from "./SuccessAddNewUser";

const { Step } = Steps;
const AddEditUser = () => {
  const ListUsersData = useSelector((state) => state.users.value);
  const steps = [
    {
      title: ListUsersData.edit ? Dictionary.editInformation : Dictionary.registerInformation,
      content: <UserRegisterInfo />,
    },
    {
      title: ListUsersData.edit ? `${Dictionary.edit} ${Dictionary.username}` : Dictionary.username,
      content: <SetUsername />,
    },
    {
      title: ListUsersData.edit ? `${Dictionary.edit} ${Dictionary.role}` : Dictionary.setRole,
      content: <SetRole />,
    },
  ];

  return ListUsersData.current <= 2 ? (
    <>
      <Steps current={ListUsersData.current} labelPlacement="vertical">
        {steps.map((item, index) => (
          <Step key={index} title={item.title} />
        ))}
      </Steps>
      <div className={Classes["addModal"]}>{steps[ListUsersData.current].content}</div>
    </>
  ) : (
    <SuccessAddNewUser />
  );
};

export default AddEditUser;
