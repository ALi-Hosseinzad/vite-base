import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import Classes from "views/customer/styles/EditUsernameAndMobile.module.scss";
import { Space } from "antd";
import CollapseComponent from "components/collapse/CollapseComponent";
import EditUsername from "./EditUsername";
import { listCustomers } from "store/reducers/listCustomers/listCustomersReducer";
import EditMobile from "./EditMobile";
import SendOTP from "./SendOTP";
import SuccessfulEditCustomer from "./SuccessfulEditCustomer";

const EditUsernameAndMobile = () => {
  const ListCustomersData = useSelector((state) => state.listCustomers.value);
  const dispatch = useDispatch();
  const onChange = (key) => {
    dispatch(listCustomers({ collapse: key }));
  };
  const panels = [
    { header: Dictionary.editUsername, key: "1", element: EditUsername },
    {
      header: Dictionary.editMobile,
      key: "2",
      className: Classes["site-collapse-custom-panel"],
      element: EditMobile,
    },
  ];
  return (
    <Fragment>
      {ListCustomersData.secondStep === 1 && (
        <Space direction="vertical" className={Classes["edit-modal-wrapper"]}>
          <CollapseComponent
            panels={panels}
            onChange={onChange}
            activeKey={ListCustomersData.collapse}
          />
        </Space>
      )}
      {ListCustomersData.secondStep === 2 && <SendOTP />}
      {ListCustomersData.secondStep === 3 && <SuccessfulEditCustomer />}
    </Fragment>
  );
};
export default EditUsernameAndMobile;
