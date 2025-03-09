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
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import {
  getTrace,
  registration,
  verifyRegistrationOtp,
} from "helpers/APIFunction";

const Validation = () => {
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

  useEffect(() => {
    form.setFieldsValue({ validation: "" });
  }, [listCustomersData.resetFields]);

  const sendAgain = () => {
    getTrace()
      .then((res) => {
        registration({
          birth_date:
            String(listCustomersData.birthDate.year) +
            String(listCustomersData.birthDate.month).padStart(2, 0) +
            String(listCustomersData.birthDate.day).padStart(2, 0),
          mobile_number: listCustomersData.mobile,
          reference_number: res.data.trace_id,
          identification_code: listCustomersData.nationalId,
          identification_type: listCustomersData.type,
        })
          .then((res) => {
            dispatch(listCustomers({ submit: true, current: 1 }));
          })
          .catch(() => errorHandler(errorResponse));
        setState(!state);
        dispatch(
          setNotificationData({
            message: Dictionary.sendOtpToCustomer,
            type: "success",
            time: 5000,
          })
        );
      })
      .catch(() => errorHandler(errorResponse));
  };
  const onFinish = (value) => {
    verifyRegistrationOtp({
      otp: value.validation,
      identification_code: listCustomersData.nationalId,
      reference_number: listCustomersData.traceId,
    })
      .then(() => dispatch(listCustomers({ submit: true, current: 2 })))
      .catch(() => errorHandler(errorResponse));
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
              max: 6,
              min: 6,
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
            onClick={sendAgain}
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
            onClick={() => {
              dispatch(listCustomers({ modal: false, cancelModal: true }));
            }}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </Form>
    </div>
  );
};
export default Validation;
