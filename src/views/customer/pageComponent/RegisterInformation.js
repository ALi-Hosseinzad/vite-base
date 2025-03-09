import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Form } from "antd";
import Classes from "views/customer/styles/RegisterInformation.module.scss";
import InputComponent from "components/input/InputComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import cx from "classnames";
import ButtonComponent from "components/button/ButtonComponent";
import { listCustomers } from "store/reducers/listCustomers/listCustomersReducer";
import { nationalCodeValidation } from "helpers/nationalIdValidation";
import { getTrace, registration } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import NewDatePicker from "components/newDatePicker/NewDatePicker";
import moment from "jalali-moment";
import SelectComponent from "components/SelectComponent/SelectComponent";

const RegisterInformation = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const thisYear = moment(Date.now()).locale("fa").format("YYYY");
  const [, forceUpdate] = useState({});
  const listCustomersData = useSelector((state) => state.listCustomers.value);
  const { resetFields, birthDate, traceId, type } = listCustomersData;
  const userInfoData = useSelector((state) => state.userInfo.value);
  const errorHandler = useErrorHandler();

  useEffect(() => {
    form.resetFields();
  }, [resetFields]);

  useEffect(() => {
    forceUpdate({});
  }, [form]);

  const onFinish = (value) => {
    if (
      (userInfoData.username === "admin" &&
        (type === "CID" || (type === "NID" && birthDate))) ||
      (userInfoData.username !== "admin" && birthDate)
    ) {
      registration({
        birth_date: birthDate
          ? String(birthDate.year) +
            String(birthDate.month).padStart(2, 0) +
            String(birthDate.day).padStart(2, 0)
          : null,
        mobile_number: value.mobile,
        reference_number: traceId,
        identification_code: value.nationalId,
        identification_type:
          userInfoData.username === "admin" ? value.identificationType : "NID",
      })
        .then((res) =>
          dispatch(
            listCustomers({
              submit: true,
              current: 1,
              nationalId: value.nationalId,
              mobile: value.mobile,
              type:
                userInfoData.username === "admin"
                  ? value.identificationType
                  : "NID",
              username: listCustomersData.type === "CID" && res?.data?.username,
            })
          )
        )
        .catch(() => {
          errorHandler(errorResponse);
          getTrace().then((res) =>
            dispatch(listCustomers({ traceId: res.data.trace_id }))
          );
        });
    } else {
      dispatch(listCustomers({ birthDateError: true }));
    }
  };

  const items = [
    { id: 1, value: "NID", text: Dictionary.individual },
    { id: 2, value: "CID", text: Dictionary.corporate },
  ];

  const handleChange = (value) => {
    dispatch(listCustomers({ type: value }));
  };

  return (
    <Form
      className={Classes["register-information-form"]}
      layout="vertical"
      form={form}
      onFinish={onFinish}
      ref={formRef}
      requiredMark={false}
    >
      {userInfoData.username === "admin" && (
        <FormItemComponent
          name="identificationType"
          label={`${Dictionary.type} ${Dictionary.customer}`}
          className={Classes["register-information-form-item"]}
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
          ]}
        >
          <SelectComponent
            name="identificationType"
            width={343}
            value={type}
            placeholder={`${Dictionary.individual} / ${Dictionary.corporate}`}
            items={items}
            className={Classes["register-information-select-modal"]}
            onChange={(value) => handleChange(value)}
          />
        </FormItemComponent>
      )}
      <FormItemComponent
        name="nationalId"
        label={
          type === "CID" ? Dictionary.corporateCode : Dictionary.nationalId
        }
        className={Classes["register-information-form-item"]}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          {
            min: 10,
            message: Dictionary.size,
          },
          {
            pattern: /^[0-9]+$/,
            message: Dictionary.onlyNumber,
          },
          () => ({
            validator(_, value) {
              if ((value.length === 10) & !nationalCodeValidation(value)) {
                return Promise.reject(new Error(Dictionary.idNotValid));
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <InputComponent
          width={343}
          className={Classes["register-new-customer-input"]}
          name="nationalId"
          value={listCustomersData.nationalId}
          placeholder={
            type === "CID" ? Dictionary.corporateCode : Dictionary.nationalId
          }
          maxLength={11}
        />
      </FormItemComponent>
      <FormItemComponent
        name="mobile"
        label={Dictionary.mobile}
        className={cx(
          Classes["register-information-form-item"],
          Classes["register-information-form-mobile"]
        )}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          {
            min: 11,
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
          placeholder="09121234567"
          maxLength={11}
          className={Classes["register-new-customer-input-mobile"]}
        />
      </FormItemComponent>
      {type !== "CID" && (
        <>
          <NewDatePicker
            start={1300}
            end={thisYear}
            scroll={840}
            label={Dictionary.birthDate}
            onChange={(value) =>
              dispatch(
                listCustomers({ birthDate: value, birthDateError: false })
              )
            }
            className={
              listCustomersData.birthDateError && Classes["show-error"]
            }
            resetElement={listCustomersData.modal}
          />
          {listCustomersData.birthDateError && (
            <span className={Classes["text-error"]}>{Dictionary.require}</span>
          )}
        </>
      )}
      <FormItemComponent shouldUpdate button>
        <ButtonComponent
          type="primary"
          htmlType="submit"
          classNameBtn={Classes["register-modal-confirm-button"]}
        >
          {Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          classNameBtn={Classes["register-modal-cancel-button"]}
          type="default"
          onClick={() => {
            dispatch(listCustomers({ modal: false }));
            form.resetFields();
          }}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};
export default RegisterInformation;
