import React, { useRef, useState } from "react";
import Classes from "views/login/styles/Login.module.scss";
import Logo from "assets/images/content/LogoLogin.svg";
import FormItemComponent from "components/formItem/FormItemComponent";
import { Button, Form, Input } from "antd";
import Dictionary from "helpers/Dictionary";
import CustomIcon from "components/customIcon/CustomIcon";
import Visible from "assets/images/icon/Visible.svg";
import InVisible from "assets/images/icon/VisibleGrey.svg";
import { useEffect } from "react";
import { login, logout } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import { useNavigate } from "react-router-dom";
import packageJson from "../../../package.json";
import { useDispatch } from "react-redux";
import { resetUsers } from "store/reducers/users/UsersReducer";
import { setNotificationData } from "store/reducers/toast/toastReducer";

const Login = () => {
  const [form] = Form.useForm();
  const [state, setState] = useState(false);
  const formRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.localStorage?.clear();
    window.sessionStorage?.clear();
    if ("caches" in window) {
      if (typeof caches !== "undefined") {
        if (caches?.keys() !== undefined) {
          caches?.keys()?.then(function (names) {
            for (let name of names) {
              caches?.delete(name);
            }
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    logout()
      .then(() => {})
      .catch(() => {});
    window.sessionStorage.clear();
  }, []);

  const onFinish = (values) => {
    login({ ...values })
      .then(() => {
        navigate("/home");
      })
      .catch(() => {
        if (errorResponse.error?.data?.error_code === "DP-171040") {
          navigate("/force-change-password", {
            state: { username: values.username },
          });
        } else {
          // TODO
          // errorHandler(errorResponse);
          dispatch(
            setNotificationData({
              message: errorResponse?.error?.data?.error_message,
              type: "error",
              time: 5000,
            })
          );
          dispatch(resetUsers());
        }
      });
  };

  return (
    <div className={Classes["login-container"]}>
      <div className={Classes["login-backGround"]}>
        <div className={Classes["login-form-wrapper"]}>
          <img src={Logo} className={Classes["login-form-logo"]} />

          <Form
            className={Classes["login-form"]}
            layout="vertical"
            form={form}
            onFinish={onFinish}
            ref={formRef}
            requiredMark={false}
            initialValues={{
              requiredMarkValue: false,
            }}
          >
            <FormItemComponent
              label={Dictionary.username}
              name="username"
              className={Classes["login-form-item"]}
              rules={[
                {
                  required: true,
                  message: Dictionary.require,
                },
                {
                  min: 3,
                  message: Dictionary.size,
                },
                {
                  max: 20,
                  message: Dictionary.size,
                },
              ]}
            >
              <Input
                className={Classes["login-input"]}
                placeholder={Dictionary.username}
              />
            </FormItemComponent>
            <FormItemComponent
              label={Dictionary.password}
              name="password"
              className={`${Classes["login-form-item"]} ${Classes["login-form-password"]}`}
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
              ]}
            >
              <Input.Password
                className={`${Classes["login-input"]} ${Classes["login-password"]}`}
                placeholder="***********"
                onFocus={() => setState(true)}
                onBlur={() => setState(false)}
                style={state ? { borderColor: "#AEECBF" } : {}}
                iconRender={(visible) => (
                  <CustomIcon
                    src={visible ? Visible : InVisible}
                    color={state ? "#AEECBF" : "#BDBDBD"}
                    name={visible ? "name-visible-icon" : "name-invisible-icon"}
                    size={28}
                  />
                )}
              />
            </FormItemComponent>
            <FormItemComponent>
              <Button htmlType="submit" className={Classes["login-submit"]}>
                {Dictionary.login}
              </Button>
            </FormItemComponent>
          </Form>
          <div className={Classes["login-backGround-bottom"]} />
          <span className={Classes["login-version"]}>
            {packageJson.version}
          </span>
        </div>
      </div>
    </div>
  );
};
export default Login;
