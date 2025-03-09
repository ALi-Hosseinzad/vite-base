import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Form } from "antd";
import Classes from "views/customer/styles/EditComponent.module.scss";
import InputComponent from "components/input/InputComponent";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { listCustomers } from "store/reducers/listCustomers/listCustomersReducer";
import { changeUsername } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";

const EditUsername = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const listCustomersData = useSelector((state) => state.listCustomers.value);
  const errorHandler = useErrorHandler();
  useEffect(() => {
    form.resetFields();
  }, [listCustomersData.editUsernameAndMobileModal]);
  useEffect(() => {
    if (listCustomersData.record?.username) {
      form.setFieldsValue({ username: listCustomersData.record?.username });
    }
  }, [
    listCustomersData.record?.username,
    listCustomersData.editUsernameAndMobileModal,
  ]);

  const onFinish = (value) => {
    changeUsername(listCustomersData.record?.identificationCode, {
      username: value.username,
      otp_gateway_type: "BO_WEB",
    })
      .then(() =>
        dispatch(
          listCustomers({
            submit: true,
            secondStep: 2,
            editState: "username",
            record: { ...listCustomersData.record, username: value.username },
          })
        )
      )
      .catch(() => errorHandler(errorResponse));
  };
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
        name="username"
        label={Dictionary.username}
        className={Classes["form-item"]}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          {
            min: 6,
            message: Dictionary.size,
          },
          {
            max: 20,
            message: Dictionary.size,
          },
          {
            pattern: /^[a-zA-z0-9\.]+$/,
            message: Dictionary.onlyNumber,
          },
        ]}
      >
        <InputComponent
          width={311}
          name="username"
          placeholder={Dictionary.username}
          maxLength={20}
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
          classNameBtn={Classes["form-item-btn-cancel"]}
          type="default"
          onClick={() => {
            dispatch(listCustomers({ collapse: "" }));
            form.setFieldsValue({
              username: listCustomersData.record?.username,
            });
          }}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};
export default EditUsername;
