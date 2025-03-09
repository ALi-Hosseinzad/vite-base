import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Form, Space, Typography } from "antd";
import Classes from "views/users/styles/users.module.scss";
import InputComponent from "components/input/InputComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import Warning from "assets/images/icon/Warning.svg";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { users } from "store/reducers/users/UsersReducer";

const SetUsername = () => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const listUsersData = useSelector((state) => state.users.value);

  useEffect(() => {
    if (listUsersData.edit) {
      form.setFieldsValue({
        username: listUsersData.record?.username,
      });
    }
  }, [listUsersData.edit, listUsersData.record]);

  const onFinish = (values) => {
    dispatch(
      users({
        submit: true,
        current: 2,
        record: { ...listUsersData.record, ...values },
      })
    );
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      ref={formRef}
      requiredMark={false}
    >
      <FormItemComponent
        name="username"
        label={Dictionary.username}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          {
            min: 6,
            max: 20,
            message: Dictionary.size,
          },
          {
            pattern: /^[a-zA-z0-9\.]+$/,
            message: Dictionary.checkInput,
          },
        ]}
      >
        <InputComponent
          width={343}
          name="username"
          value={listUsersData.username}
          placeholder={Dictionary.username}
          maxLength={20}
          className={Classes["input-user-form"]}
          whiteList={/[^a-zA-Z0-9.]/g}
        />
      </FormItemComponent>
      {listUsersData.edit && (
        <Text>نام کاربری فعلی شما {listUsersData.record.username} است</Text>
      )}
      <Space className={Classes["username-warning-div"]}>
        <CustomIcon src={Warning} size={24} name="set-username-space-icon" />
        <Text className={Classes["warning-username"]}>
          {Dictionary.usernameWarning}
        </Text>
      </Space>
      <FormItemComponent shouldUpdate button>
        <ButtonComponent
          type="primary"
          htmlType="submit"
          classNameBtn={Classes["confirm-button"]}
          // disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
        >
          {Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          type="default"
          classNameBtn={Classes["cancel-button"]}
          onClick={() => dispatch(users({ addModal: false, current: 0 }))}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};

export default SetUsername;
