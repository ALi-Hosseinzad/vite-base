import React, { Fragment, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Form, Space, Typography } from "antd";
import Classes from "views/customer/styles/SetUsername.module.scss";
import InputComponent from "components/input/InputComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import Warning from "assets/images/icon/Warning.svg";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { listCustomers } from "store/reducers/listCustomers/listCustomersReducer";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { defineUsername } from "helpers/APIFunction";

const SetUsername = () => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const listCustomersData = useSelector((state) => state.listCustomers.value);
  const errorHandler = useErrorHandler();

  useEffect(() => {
    if (listCustomersData.type === "CID") {
      form.setFieldsValue({ username: listCustomersData?.username });
    } else {
      form.setFieldsValue({ username: "" });
    }
  }, [listCustomersData.resetFields]);

  const onFinish = (value) => {
    defineUsername({
      username: value.username,
      reference_number: listCustomersData.traceId,
      identification_code: listCustomersData.nationalId,
    })
      .then((res) =>
        dispatch(
          listCustomers({
            submit: true,
            current: 3,
            username: value.username,
            gender: res?.data?.gender,
            name: res?.data?.firstname + res?.data?.lastname,
            firstname: res?.data?.firstname,
            password: res?.data?.password,
          })
        )
      )
      .catch(() => errorHandler(errorResponse));
  };
  return (
    <Form
      className={Classes["set-username-form"]}
      layout="vertical"
      form={form}
      onFinish={onFinish}
      ref={formRef}
      requiredMark={false}
    >
      <FormItemComponent
        name="username"
        label={Dictionary.username}
        className={Classes["set-username-form-item"]}
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
          width={343}
          name="username"
          value={listCustomersData.username}
          placeholder={Dictionary.username}
          maxLength={20}
          className={Classes["set-username-form-input"]}
          disabled={listCustomersData.type === "CID"}
        />
      </FormItemComponent>
      <Space className={Classes["set-username-space"]}>
        <CustomIcon src={Warning} size={24} name="set-username-space-icon" />
        <Text className={Classes["set-username-text"]}>
          {listCustomersData.type === "CID"
            ? Dictionary.autoSetUsername
            : Dictionary.usernameWarning}
        </Text>
      </Space>
      <FormItemComponent shouldUpdate button>
        <ButtonComponent
          type="primary"
          htmlType="submit"
          classNameBtn={Classes["set-username-confirm-btn"]}
        >
          {Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          classNameBtn={Classes["set-username-cancel-btn"]}
          type="default"
          onClick={() => {
            dispatch(listCustomers({ modal: false, cancelModal: true }));
          }}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};
export default SetUsername;
