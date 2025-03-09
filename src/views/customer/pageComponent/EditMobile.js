import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Form } from "antd";
import Classes from "views/customer/styles/EditComponent.module.scss";
import InputComponent from "components/input/InputComponent";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { listCustomers } from "store/reducers/listCustomers/listCustomersReducer";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { changeMobile } from "helpers/APIFunction";

const EditMobile = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const formRef = useRef();
  const listCustomersData = useSelector((state) => state.listCustomers.value);
  useEffect(() => {
    form.resetFields();
  }, [listCustomersData.editUsernameAndMobileModal]);
  const onFinish = (value) => {
    changeMobile(listCustomersData.record?.identificationCode, {
      mobile_number: value.mobileNumber,
    })
      .then(() => {
        dispatch(
          listCustomers({
            submit: true,
            secondStep: 2,
            editState: "mobileNumber",
            record: {
              ...listCustomersData.record,
              mobileNumber: value.mobileNumber,
            },
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };
  useEffect(() => {
    if (listCustomersData.record?.mobileNumber) {
      form.setFieldsValue({
        mobileNumber: listCustomersData.record?.mobileNumber,
      });
    }
  }, [
    listCustomersData.record?.mobileNumber,
    listCustomersData.editUsernameAndMobileModal,
  ]);
  return (
    <Form
      className={Classes["form"]}
      layout="vertical"
      form={form}
      onFinish={onFinish}
      ref={formRef}
      requiredMark={false}
    >
      <FormItemComponent
        name="mobileNumber"
        label={Dictionary.mobile}
        className={Classes["form-item"]}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          {
            min: 11,
            max: 11,
            message: Dictionary.size,
          },
          {
            pattern: /^[a-zA-z0-9\.]+$/,
            message: Dictionary.onlyNumber,
          },
          {
            validator: (_, value) =>
              value !== listCustomersData.record?.mobileNumber
                ? Promise.resolve()
                : Promise.reject(new Error(Dictionary.repetitiveMobile)),
          },
        ]}
      >
        <InputComponent
          width={311}
          placeholder={Dictionary.mobile}
          maxLength={11}
          className={Classes["form-input-mobile"]}
        />
      </FormItemComponent>
      <FormItemComponent className={Classes["form-item-btn"]}>
        <ButtonComponent
          type="primary"
          htmlType="submit"
          classNameBtn={Classes["form-item-btn-success"]}
        >
          {Dictionary.confirm}
        </ButtonComponent>

        <ButtonComponent
          type="default"
          onClick={() => {
            dispatch(listCustomers({ collapse: "" }));
            form.setFieldsValue({
              mobileNumber: listCustomersData.record?.mobileNumber,
            });
          }}
          classNameBtn={Classes["form-item-btn-cancel"]}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};
export default EditMobile;
