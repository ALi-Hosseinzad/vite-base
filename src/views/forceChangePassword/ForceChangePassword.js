import React, { useRef, useState, useEffect } from "react";
import Classes from "views/forceChangePassword/styles/ForceChangePassword.module.scss";
import Logo from "assets/images/content/LogoLogin.svg";
import FormItemComponent from "components/formItem/FormItemComponent";
import { Button, Form, Input, Typography } from "antd";
import Dictionary from "helpers/Dictionary";
import CustomIcon from "components/customIcon/CustomIcon";
import Warning from "assets/images/icon/Warning.svg";
import CheckboxComponent from "components/checkbox/CheckboxComponent";
import { useLocation, useNavigate } from "react-router-dom";
import PasswordInput from "components/passwordInput/PasswordInput";
import cx from "classnames";
import { ForceChangePass } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";

const ForceChangePassword = () => {
  const { Text } = Typography;
  const [form] = Form.useForm();
  const location = useLocation();
  const [state, setState] = useState({ password: "" });
  const formRef = useRef();
  let [passObj, setPassObj] = useState("");
  const errorHandler = useErrorHandler();
  const navigate = useNavigate();
  useEffect(() => {
    form.setFieldsValue({ username: location.state.username });
  }, []);

  const handlePassLevel = (passValue) => {
    let validator = [];
    const hasCapitalLetter = passValue.match(/^(?=.*[A-Z])/);
    if (hasCapitalLetter) {
      validator.push("1");
    }
    const hasSmallLetter = passValue.match(/^(?=.*[a-z])/);
    if (hasSmallLetter) {
      validator.push("2");
    }
    const hasNumber = passValue.match(/^(?=.*\d)/);
    if (hasNumber) {
      validator.push("3");
    }
    const hasSpecialCharacter = passValue.match(/^(?=.*[!@#$%^&*()])/);
    if (hasSpecialCharacter) {
      validator.push("4");
    }

    setPassObj(validator.length <= 2 ? "weak" : validator.length === 3 ? "medium" : validator.length === 4 ? "strong" : "");
  };
  const handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setState({ [name]: value });
    handlePassLevel(value);
  };

  const onFinish = (values) => {
    ForceChangePass({
      username: location?.state?.username,
      old_password: values.oldPass,
      new_password: values.password,
      confirm_password: values["retry-password"],
    })
      .then(() => navigate("/"))
      .catch(() => errorHandler(errorResponse));
  };
  return (
    <div className={Classes["login-container"]}>
      <div className={Classes["login-backGround"]}>
        <div className={Classes["login-form-wrapper"]}>
          <img src={Logo} className={Classes["force-change-password-logo"]} />
          <div className={Classes["force-change-password-warning"]}>
            <CustomIcon src={Warning} size={24} color="#FDAC60" name="warning-icon" />
            <Text className={Classes["force-change-password-warning-text"]}>{Dictionary.forceChangePassword}</Text>
          </div>
          <Form
            className={Classes["login-form"]}
            layout="vertical"
            form={form}
            onFinish={onFinish}
            ref={formRef}
            requiredMark={false}
            initialValues={{ requiredMarkValue: false }}>
            <FormItemComponent label={Dictionary.username} name="username" className={Classes["login-form-item"]}>
              <Input
                className={Classes["force-change-password-username"]}
                placeholder={Dictionary.username}
                disabled
                value={location?.state?.username}
              />
            </FormItemComponent>
            <FormItemComponent
              label={`${Dictionary.password} ${Dictionary.current}`}
              name="oldPass"
              className={Classes["login-form-item"]}
              rules={[
                {
                  required: true,
                  message: Dictionary.require,
                },
              ]}>
              <PasswordInput name="oldPass" className={Classes["force-change-password-password"]} onChange={handleChange} />
            </FormItemComponent>
            <FormItemComponent
              label={Dictionary.password + " " + Dictionary.new}
              name="password"
              className={Classes["login-form-item"]}
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
                  pattern: /^[a-zA-Z0-9!*$@]+$/,
                  message: Dictionary.checkInput,
                },
                { pattern: /^((?!javascript)(?!select)(?!script)[\s\S])*$/gi, message: Dictionary.checkInput },
              ]}>
              <PasswordInput name="password" className={Classes["force-change-password-password"]} onChange={handleChange} />
            </FormItemComponent>
            <div>
              {state.password && (
                <div className={Classes["force-change-password-level"]}>
                  <div className={Classes[`${passObj}-text`]}>{Dictionary[passObj]}</div>
                  <div
                    className={cx(Classes["pass-validation"], Classes[`${passObj === "weak" || passObj === "medium" ? "grey" : passObj}-bg`])}></div>
                  <div className={cx(Classes["pass-validation"], Classes[`${passObj === "weak" ? "grey" : passObj}-bg`])}></div>
                  <div className={cx(Classes["pass-validation"], Classes[`${passObj}-bg`])}></div>
                </div>
              )}

              {state.password && (
                <div className={Classes["force-change-password-warning"]}>
                  <CustomIcon src={Warning} size={24} color="#FDAC60" name="warning-icon" />
                  <Text className={Classes["force-change-password-warning-text"]}>{Dictionary.passwordWarning}</Text>
                </div>
              )}
            </div>
            <FormItemComponent
              label={Dictionary.retry + " " + Dictionary.password + " " + Dictionary.new}
              name="retry-password"
              className={Classes["login-form-item"]}
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
                  pattern: /^[a-zA-Z0-9!*$@]+$/,
                  message: Dictionary.checkInput,
                },
                { pattern: /^((?!javascript)(?!select)(?!script)[\s\S])*$/gi, message: Dictionary.checkInput },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("رمز عبور جدید یکسان نیستند"));
                  },
                }),
              ]}>
              <PasswordInput autoComplete="new-password" className={Classes["force-change-password-password"]} />
            </FormItemComponent>
            {passObj === "weak" && (
              <FormItemComponent
                name="responsibility"
                rules={[
                  {
                    validator: (_, value) => (value ? Promise.resolve() : Promise.reject(new Error(Dictionary.require))),
                  },
                ]}>
                <CheckboxComponent name={Dictionary.responsibility} />
              </FormItemComponent>
            )}
            <FormItemComponent shouldUpdate>
              <Button htmlType={Dictionary.send} className={Classes["force-change-password-submit"]}>
                {Dictionary.send}
              </Button>
            </FormItemComponent>
          </Form>
          <div className={Classes["login-backGround-bottom"]} />
        </div>
      </div>
    </div>
  );
};
export default ForceChangePassword;
