import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Form, Typography } from "antd";
import Classes from "views/customer/styles/Validation.module.scss";
import FormItemComponent from "components/formItem/FormItemComponent";
import ButtonComponent from "components/button/ButtonComponent";
import CountdownTimer from "components/timer/Timer";
import InputComponent from "components/input/InputComponent";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { listCustomers } from "store/reducers/listCustomers/listCustomersReducer";
import {
  verifyChangeMobile,
  verifyChangeUsername,
  VerifyRecoveryPassword,
} from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";

const SendOTP = () => {
  const { Text } = Typography;
  const THREE_DAYS_IN_MS = 120 * 1000;
  const NOW_IN_MS = new Date().getTime();
  const dateTimeAfterThreeDays = NOW_IN_MS + THREE_DAYS_IN_MS;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const listCustomersData = useSelector((state) => state.listCustomers.value);
  const [state, setState] = useState(false);
  const errorHandler = useErrorHandler();
  const onClick = () => {
    setState(!state);
    dispatch(
      setNotificationData({
        message: Dictionary.sendOtpToCustomer,
        type: "success",
        time: 5000,
      })
    );
  };

  const onFinish = (value) => {
    if (listCustomersData.recoveryModal) {
      VerifyRecoveryPassword({
        identification_code: listCustomersData.record.identificationCode,
        otp: value.validation,
      })
        .then(() => dispatch(listCustomers({ recoveryStep: 2 })))
        .catch(() => errorHandler(errorResponse));
    } else {
      if (listCustomersData.editState === "mobileNumber") {
        verifyChangeMobile(listCustomersData.record?.identificationCode, {
          otp: value.validation,
          mobile_number: listCustomersData.record.mobileNumber,
        })
          .then(() =>
            dispatch(
              listCustomers({
                secondStep: 3,
                reload: !listCustomersData.reload,
              })
            )
          )
          .catch(() => errorHandler(errorResponse));
      } else if (listCustomersData.editState === "username") {
        verifyChangeUsername(listCustomersData.record?.identificationCode, {
          otp: value.validation,
        })
          .then(() =>
            dispatch(
              listCustomers({
                secondStep: 3,
                reload: !listCustomersData.reload,
              })
            )
          )
          .catch(() => errorHandler(errorResponse));
      }
    }
  };

  const cancelModal = () => {
    if (listCustomersData.recoveryModal) {
      dispatch(listCustomers({ recoveryModal: false, recoveryStep: 1 }));
      form.resetFields();
    } else {
      dispatch(
        listCustomers({
          editUsernameAndMobileModal: false,
          secondStep: 1,
          collapse: "",
        })
      );
    }
  };

  return (
    <div className={Classes["validation-wrapper"]}>
      <div className={Classes["validation-wrapper-change-mobile"]}>
        <Text className={Classes["validation-wrapper-change-mobile-text"]}>
          {Dictionary.sendOTP}
        </Text>
      </div>
      <Form
        className={Classes["validation-form"]}
        layout="vertical"
        form={form}
        onFinish={onFinish}
        ref={formRef}
        requiredMark={false}
      >
        <FormItemComponent
          name="validation"
          label={Dictionary.otp}
          className={Classes["validation-form-item"]}
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
            {
              max: 8,
              min: 5,
              message: Dictionary.size,
            },
            {
              pattern: /^[0-9]+$/,
              message: Dictionary.onlyNumber,
            },
          ]}
        >
          <InputComponent
            width={343}
            value={listCustomersData.otp}
            maxLength={8}
            className={Classes["validation-form-input"]}
          />
        </FormItemComponent>
        <div className={Classes["validation-form-timer"]}>
          <CountdownTimer
            targetDate={dateTimeAfterThreeDays}
            onClick={onClick}
          />
        </div>
        <FormItemComponent shouldUpdate button>
          <ButtonComponent
            classNameBtn={Classes["validation-modal-confirm-button"]}
            type="primary"
            htmlType="submit"
          >
            {Dictionary.confirm}
          </ButtonComponent>
          <ButtonComponent
            classNameBtn={Classes["validation-modal-cancel-button"]}
            type="default"
            onClick={cancelModal}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </Form>
    </div>
  );
};
export default SendOTP;
