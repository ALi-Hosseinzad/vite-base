import React, { Fragment, useEffect, useRef, useState } from "react";
import { Form } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import Dictionary from "helpers/Dictionary";
import PasswordInput from "components/passwordInput/PasswordInput";
import Classes from "container/header/Header.module.scss";
import Variables from "assets/styles/_Variables.scss";
import { changePassword } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import {
  userInfo,
  userInfoState,
} from "store/reducers/userInfo/UserInfoReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalComponent from "components/modalComponent/ModalComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import success from "assets/images/content/success.svg";
const ChangePassword = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const userInfoData = useSelector(userInfoState);
  const navigate = useNavigate();
  const [successModal, setSuccessModal] = useState(false);
  const onFinish = (values) => {
    if (values) {
      changePassword({
        old_password: values.oldPassword,
        new_password: values.newPassword,
        confirm_password: values.retryPassword,
      })
        .then(() => {
          dispatch(userInfo({ modal: false }));
          setSuccessModal(true);
        })
        .catch(() => {
          errorHandler(errorResponse);
        });
    }
  };
  const handleCancel = () => {
    dispatch(userInfo({ modal: false }));
  };
  const logOut = () => {
    setSuccessModal(!successModal);
    navigate("/");
  };
  useEffect(() => {
    form.resetFields();
  }, [userInfoData.modal]);
  return (
    <Fragment>
      <ModalComponent
        title={Dictionary.changePassword}
        open={successModal}
        onCancel={logOut}
      >
        <div className={Classes["success-body"]}>
          <CustomIcon src={success} name="success-icon" size={88} />
          <p className={Classes["success-text"]}>
            {Dictionary.successfullyDone}
          </p>
          <p className={Classes["success-text-two"]}>{Dictionary.exitSystem}</p>
          <ButtonComponent
            type="primary"
            classNameBtn={Classes["success-btn"]}
            onClick={logOut}
          >
            {Dictionary.iUnderstand}
          </ButtonComponent>
        </div>
      </ModalComponent>
      <ModalComponent
        title={Dictionary.changePassword}
        open={userInfoData.modal}
        onCancel={handleCancel}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          ref={formRef}
          requiredMark={false}
          className={Classes["change-password-form"]}
        >
          <FormItemComponent
            name="oldPassword"
            label={Dictionary.password + " " + Dictionary.current}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                min: 8,
                message: Dictionary.checkInput,
              },
              {
                max: 20,
                message: Dictionary.checkInput,
              },
            ]}
          >
            <PasswordInput
              width={343}
              color={Variables.LogoGreenDark}
              maxLength={20}
              autoComplete="new-password"
              className={Classes["password-input"]}
            />
          </FormItemComponent>
          <FormItemComponent
            name="newPassword"
            label={Dictionary.password + " " + Dictionary.new}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                min: 8,
                message: Dictionary.checkInput,
              },
              {
                max: 20,
                message: Dictionary.checkInput,
              },
              {
                pattern: /^[a-zA-Z0-9!*#$%@]+$/,
                message: Dictionary.checkInput,
              },
              {
                pattern: /^((?!javascript)(?!select)(?!script)[\s\S])*$/gi,
                message: Dictionary.checkInput,
              },

              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("oldPassword") === value) {
                    return Promise.reject(
                      new Error(
                        "رمز عبور جدید نباید با رمز عبور فعلی یکسان باشد"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <PasswordInput
              width={343}
              color={Variables.LogoGreenDark}
              autoComplete="new-password"
              maxLength={20}
              className={Classes["password-input"]}
            />
          </FormItemComponent>
          <div className={Classes["bottom-inputs"]}>
            <FormItemComponent
              name="retryPassword"
              label={
                Dictionary.retry +
                " " +
                Dictionary.password +
                " " +
                Dictionary.new
              }
              rules={[
                {
                  required: true,
                  message: Dictionary.require,
                },
                {
                  min: 8,
                  message: Dictionary.checkInput,
                },
                {
                  max: 20,
                  message: Dictionary.checkInput,
                },
                {
                  pattern: /^[a-zA-Z0-9!*#$%-@_.]+$/,
                  message: Dictionary.checkInput,
                },
                {
                  pattern: /^((?!javascript)(?!select)(?!script)[\s\S])*$/gi,
                  message: Dictionary.checkInput,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("رمز عبور جدید یکسان نیستند")
                    );
                  },
                }),
              ]}
            >
              <PasswordInput
                width={343}
                color={Variables.LogoGreenDark}
                autoComplete="new-password"
                maxLength={20}
                className={Classes["password-input"]}
              />
            </FormItemComponent>
          </div>
          <FormItemComponent shouldUpdate button>
            <ButtonComponent
              type="primary"
              htmlType="submit"
              classNameBtn={Classes["new-password-confirm-btn"]}
            >
              {Dictionary.confirm}
            </ButtonComponent>
            <ButtonComponent
              type="default"
              onClick={handleCancel}
              classNameBtn={Classes["new-password-cancel-btn"]}
            >
              {Dictionary.cancel}
            </ButtonComponent>
          </FormItemComponent>
        </Form>
      </ModalComponent>{" "}
    </Fragment>
  );
};

export default ChangePassword;
