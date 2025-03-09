import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select } from "antd";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputComponent from "components/input/InputComponent";
import Dictionary from "helpers/Dictionary";
import Classes from "views/manageMenu/styles/editMenu.module.scss";
import SwitchComponent from "components/switch/SwitchComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import Tick from "assets/images/icon/Tick.svg";
import Cross from "assets/images/icon/Cross.svg";
import DropDown from "assets/images/icon/DropDown.svg";
import { manageMenu } from "store/reducers/manageMenu/manageMenuReducer";
import ButtonComponent from "components/button/ButtonComponent";
import { updateMenu } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";

const EditMenu = () => {
  const dispatch = useDispatch();
  const manageMenuData = useSelector((state) => state.manageMenu.value);
  const record = manageMenuData.record;
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();

  const handleChange = (value, item) => {
    dispatch(manageMenu({ record: { ...record, [item]: value } }));
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      menuCaption: record?.menu_caption,
      menuKey: record?.menu_key,
      android: record?.is_for_android,
      iOS: record?.is_for_ios,
      web: record?.is_for_web,
      pwa: record?.is_for_pwa,
      androidMinVersion: record?.android_min_version,
      iOSMinVersion: record?.ios_min_version,
      webMinVersion: record?.web_min_version,
      pwaMinVersion: record?.pwa_min_version,
      androidMaxVersion: record?.android_max_version,
      iOSMaxVersion: record?.ios_max_version,
      webMaxVersion: record?.web_max_version,
      pwaMaxVersion: record?.pwa_max_version,
    });
  }, [manageMenuData.editModal]);

  const onFinish = (values) => {
    updateMenu({
      menu_key: record?.menu_key,
      menu_caption: values.menuCaption,
      is_visible: record.is_visible,
      is_enabled: record.is_enabled,
      is_for_web: values.web,
      is_for_pwa: values.pwa,
      is_for_ios: values.iOS,
      is_for_android: values.android,
      android_min_version: values?.androidMinVersion,
      pwa_min_version: values?.pwaMinVersion,
      web_min_version: values.webMinVersion,
      ios_min_version: values.iOSMinVersion,
      android_max_version: values.androidMaxVersion || null,
      pwa_max_version: values.pwaMaxVersion || null,
      web_max_version: values.webMaxVersion || null,
      ios_max_version: values.iOSMaxVersion || null,
      parent_of_menu_id: record?.id,
      custom_order_position: record?.parent_of_menu_id,
    })
      .then(() =>
        dispatch(
          manageMenu({
            record: "",
            editModal: false,
            reload: !manageMenuData.reload,
          })
        )
      )
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const formFields = [
    {
      name: "android",
      key: "is_for_android",
      minName: "androidMinVersion",
      maxName: "androidMaxVersion",
    },
    {
      name: "iOS",
      key: "is_for_ios",
      minName: "iOSMinVersion",
      maxName: "iOSMaxVersion",
    },
    {
      name: "web",
      key: "is_for_web",
      minName: "webMinVersion",
      maxName: "webMaxVersion",
    },
    {
      name: "pwa",
      key: "is_for_pwa",
      minName: "pwaMinVersion",
      maxName: "pwaMaxVersion",
    },
  ];

  return (
    <div>
      <FormComponent
        className={Classes["form-edit-menu"]}
        layout="vertical"
        form={form}
        ref={formRef}
        onFinish={onFinish}
        requiredMark={false}
      >
        <div className={Classes["row"]}>
          <FormItemComponent
            name="menuCaption"
            label={Dictionary.title}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
            ]}
          >
            <InputComponent
              className={Classes["input-modal"]}
              width={343}
              placeholder={Dictionary.title}
            />
          </FormItemComponent>
          <FormItemComponent name="menuKey" label={"Key"}>
            <InputComponent
              className={Classes["input-modal"]}
              width={343}
              disabled={true}
            />
          </FormItemComponent>
        </div>
        <div className={Classes["row"]}>
          <FormItemComponent name="isVisible">
            <div className={Classes["switch-container"]}>
              <span>نمایش در منو</span>
              <SwitchComponent
                defaultChecked={record?.is_visible}
                onChange={() => {
                  dispatch(
                    manageMenu({
                      record: { ...record, is_visible: !record?.is_visible },
                    })
                  );
                }}
              />
            </div>
          </FormItemComponent>{" "}
          <FormItemComponent name="isEnable">
            <div className={Classes["switch-container"]}>
              <span>فعال/غیر فعال</span>
              <SwitchComponent
                defaultChecked={record?.is_enabled}
                onChange={() => {
                  dispatch(
                    manageMenu({
                      record: { ...record, is_enabled: !record?.is_enabled },
                    })
                  );
                }}
              />
            </div>
          </FormItemComponent>
        </div>
        {formFields.map((field) => (
          <div className={Classes["enable-visible-menu"]}>
            <FormItemComponent
              name={field.name}
              label={`نمایش در ${field.name}`}
            >
              <Select
                name={field.name}
                className={Classes["select-menu-edit"]}
                placeholder={`${Dictionary.color} ${Dictionary.card}`}
                suffixIcon={
                  <CustomIcon
                    src={DropDown}
                    size={20}
                    name="drop-down-icon"
                    color="#2B9570"
                  />
                }
                onChange={(e) => {
                  handleChange(e, field.key);
                }}
              >
                {manageMenuData?.items.map((item) => (
                  <Option
                    className={Classes["color-option"]}
                    value={item.value}
                    key={item.id}
                  >
                    <div>
                      <CustomIcon src={item.value ? Tick : Cross} size={28} />
                      <span>{item.text}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </FormItemComponent>
            <div className={Classes["min-max-version"]}>
              <FormItemComponent
                name={field.minName}
                label={Dictionary.minVersion}
                rules={[
                  {
                    required: true,
                    message: Dictionary.require,
                  },
                  {
                    pattern: /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/,
                    message: Dictionary.checkInput,
                  },
                ]}
              >
                <InputComponent width={163} disabled={!record[field.key]} />
              </FormItemComponent>
              <FormItemComponent
                name={field.maxName}
                label={Dictionary.maxVersion}
                rules={[
                  {
                    pattern: /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/,
                    message: Dictionary.checkInput,
                  },
                ]}
              >
                <InputComponent width={163} disabled={!record[field.key]} />
              </FormItemComponent>
            </div>
          </div>
        ))}

        <FormItemComponent
          shouldUpdate
          button
          className={Classes["edit-menu-buttons"]}
        >
          <ButtonComponent
            type="primary"
            htmlType="submit"
            classNameBtn={Classes["menu-edit-modal-confirm-button"]}
          >
            {Dictionary.confirm}
          </ButtonComponent>
          <ButtonComponent
            classNameBtn={Classes["menu-edit-modal-cancel-button"]}
            type="default"
            onClick={() => {
              dispatch(manageMenu({ editModal: false }));
              form.resetFields();
            }}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
    </div>
  );
};

export default EditMenu;
