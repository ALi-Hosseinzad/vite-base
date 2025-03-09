import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomerInfoInput from "./CustomerInfoInput";
import {
  limitation,
  resetLimitation,
} from "store/reducers/limitation/limitationReducer";
import { addVipCustomer, getCustomerName } from "helpers/APIFunction";
import InputComponent from "components/input/InputComponent";
import { Form, Typography } from "antd";
import Dictionary from "helpers/Dictionary";
import Classes from "views/limitation/styles/limitation.module.scss";
import FormItemComponent from "components/formItem/FormItemComponent";
import ButtonComponent from "components/button/ButtonComponent";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";

const AddVipCustomer = () => {
  const dispatch = useDispatch();
  const listLimitData = useSelector((state) => state.limitation.value);
  const { Text } = Typography;
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();

  const getInfo = (values) => {
    getCustomerName(values.identificationCode)
      .then((res) => {
        dispatch(
          limitation({
            vipRecord: { ...listLimitData.vipRecord, ...res.data },
            vipAddStep: 1,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };
  const onCancel = () =>
    dispatch(limitation({ vipAddModal: false, vipAddStep: 0 }));

  const onFinish = () => {
    addVipCustomer({
      identification_code: listLimitData.vipRecord?.identification_code,
    })
      .then(() => {
        dispatch(
          resetLimitation({
            permissions: listLimitData.permissions,
            vipPermissions: listLimitData.vipPermissions,
          })
        );
        dispatch(
          setNotificationData({
            message: Dictionary.successfullyDone,
            type: "success",
            time: 5000,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  return listLimitData.vipAddStep === 0 ? (
    <CustomerInfoInput onClickButton={getInfo} onCancelButton={onCancel} />
  ) : (
    <Form
      layout="vertical"
      form={form}
      ref={formRef}
      requiredMark={false}
      onFinish={onFinish}
    >
      <div className={Classes["add-vip-customer-info"]}>
        <FormItemComponent>
          <InputComponent
            width={257}
            name="lastName"
            value={listLimitData.vipRecord?.identification_code}
            prefix={<Text>{Dictionary.nationalId}</Text>}
            className={Classes["vip-customer-info"]}
          />
        </FormItemComponent>
        <FormItemComponent>
          <InputComponent
            width={257}
            name="lastName"
            value={listLimitData.vipRecord?.fullname}
            prefix={<Text>{Dictionary.fullName}</Text>}
            className={Classes["vip-customer-info"]}
          />
        </FormItemComponent>
      </div>
      <FormItemComponent
        shouldUpdate
        button
        className={Classes["add-limit-buttons"]}
      >
        <ButtonComponent
          type="primary"
          htmlType="submit"
          classNameBtn={Classes["confirm-button"]}
        >
          {Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          type="default"
          classNameBtn={Classes["cancel-button"]}
          onClick={onCancel}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};

export default AddVipCustomer;
