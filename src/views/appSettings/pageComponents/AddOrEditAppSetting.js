import React, { useRef } from "react";
import Dictionary from "helpers/Dictionary";
import Classes from "../styles/AppSettings.module.scss";
import InputComponent from "components/input/InputComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import FormComponent from "components/form/FormComponent";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import { useEffect } from "react";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import ModalComponent from "components/modalComponent/ModalComponent";
import {
  appSettings,
  appSettingsState,
} from "store/reducers/appSettings/AppSettingsReducer";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { addNewAppSettings } from "helpers/APIFunction";

const AddOrEditAppSetting = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const AppSettingsData = useSelector(appSettingsState);
  const { showAddNewAppSettingsModal, refresh, type, record } = AppSettingsData;

  useEffect(() => {
    form.resetFields();
    if (type === "edit") {
      form.setFieldsValue({
        android_value: record.android_value,
        ios_value: record.ios_value,
        browser_value: record.browser_value,
        item_name: record.item_name,
      });
    }
  }, [type]);

  const onFinish = (values) => {
    if (
      type === "edit" &&
      values.browser_value === record.browser_value &&
      values.ios_value === record.ios_value &&
      values.android_value === record.android_value
    ) {
      dispatch(
        setNotificationData({
          message: Dictionary.chooseOneAtLeast,
          type: "error",
          time: 5000,
        })
      );
    } else {
      addNewAppSettings({
        android_value: values.android_value,
        browser_value: values.browser_value,
        ios_value: values.ios_value,
        item_name: values.item_name,
      })
        .then(() =>
          dispatch(
            appSettings({
              showAddNewAppSettingsModal: false,
              refresh: !refresh,
              type: "",
            })
          )
        )
        .catch(() => errorHandler(errorResponse));
    }
  };

  const onClose = () => {
    form.resetFields();
    dispatch(
      appSettings({ showAddNewAppSettingsModal: false, record: "", type: "" })
    );
  };

  return (
    <ModalComponent
      width={650}
      title={
        type === "add"
          ? `${Dictionary.add} ${Dictionary.settings} ${Dictionary.new}`
          : `${Dictionary.edit} ${Dictionary.settings}`
      }
      open={showAddNewAppSettingsModal}
      maskClosable={false}
      onCancel={onClose}
    >
      <FormComponent
        layout="vertical"
        form={form}
        className={Classes["formContainer"]}
        ref={formRef}
        onFinish={onFinish}
        requiredMark={false}
      >
        <div className={Classes["form-items-container"]}>
          <FormItemComponent
            className={Classes["form-item"]}
            name="item_name"
            label={`${Dictionary.name} ${Dictionary.item}`}
            rules={[{ required: true, message: Dictionary.require }]}
          >
            <InputComponent
              className={Classes["inputModal"]}
              width={343}
              placeholder={`${Dictionary.name} ${Dictionary.item}`}
              name="item_name"
              disabled={type === "edit" ? true : false}
            />
          </FormItemComponent>
          <FormItemComponent
            className={Classes["form-item"]}
            name="android_value"
            label="Android"
            rules={[{ required: true, message: Dictionary.require }]}
          >
            <InputComponent
              className={Classes["inputModal2"]}
              width={343}
              placeholder="Android"
              name="android_value"
            />
          </FormItemComponent>
          <FormItemComponent
            className={Classes["form-item"]}
            name="ios_value"
            label="Ios"
            rules={[{ required: true, message: Dictionary.require }]}
          >
            <InputComponent
              className={Classes["inputModal2"]}
              width={343}
              placeholder="Ios"
              name="ios_value"
            />
          </FormItemComponent>
          <FormItemComponent
            name="browser_value"
            className={Classes["form-item"]}
            label="Browser"
            rules={[{ required: true, message: Dictionary.require }]}
          >
            <InputComponent
              className={Classes["inputModal2"]}
              width={343}
              placeholder="Browser"
              name="browser_value"
            />
          </FormItemComponent>
        </div>

        <FormItemComponent className={Classes["appSettingsEditButton"]}>
          <ButtonComponent
            classNameBtn={Classes["confirmBtn"]}
            type="primary"
            htmlType="submit"
          >
            {Dictionary.confirm}
          </ButtonComponent>
          <ButtonComponent
            classNameBtn={Classes["cancelBtn"]}
            type="default"
            onClick={onClose}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default AddOrEditAppSetting;
