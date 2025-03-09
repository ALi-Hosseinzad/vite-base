import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Form } from "antd";
import Classes from "../styles/RegisterInformation.module.scss";
import InputComponent from "components/input/InputComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import cx from "classnames";
import ButtonComponent from "components/button/ButtonComponent";
import { addWalletType, editWalletType } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import {
  walletType,
  walletTypeState,
} from "store/reducers/walletType/WalletTypeReducer";

const AddNewWalletType = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const walletTypeData = useSelector(walletTypeState);
  const { reload, modal, record, edit } = walletTypeData;

  const errorHandler = useErrorHandler();

  useEffect(() => {
    form.resetFields();
  }, [modal]);

  const onFinish = (value) => {
    if (edit) {
      editWalletType({
        active_gl_code: value.active_gl_code,
        code: value.code,
        description: value.desc,
        dormant_conversion_time: value.dormant,
        status: "ACTIVE",
        idle_gl_code: value.idle_gl_code,
      })
        .then(() =>
          dispatch(walletType({ reload: !reload, modal: false, edit: false }))
        )
        .catch(() => {
          errorHandler(errorResponse);
        });
    } else {
      addWalletType({
        active_gl_code: value.active_gl_code,
        code: value.code,
        description: value.desc,
        dormant_conversion_time: value.dormant,
        status: "ACTIVE",
        idle_gl_code: value.idle_gl_code,
      })
        .then(() =>
          dispatch(walletType({ reload: !reload, modal: false, edit: false }))
        )
        .catch(() => {
          errorHandler(errorResponse);
        });
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      code: record?.code,
      dormant: record?.dormant_conversion_time,
      desc: record?.description,
      active_gl_code: record?.active_gl?.code,
      idle_gl_code: record?.idle_gl?.code,
    });
  }, [modal]);
  return (
    <Form
      className={Classes["register-information-form"]}
      layout="vertical"
      form={form}
      onFinish={onFinish}
      ref={formRef}
      requiredMark={false}
    >
      <FormItemComponent
        name="code"
        label={Dictionary.code}
        className={Classes["register-information-form-item"]}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          {
            pattern: /^[0-9]+$/,
            message: Dictionary.onlyNumber,
          },
        ]}
      >
        <InputComponent
          width={343}
          className={Classes["register-new-customer-input"]}
          name="code"
          placeholder={Dictionary.code}
          disabled={edit}
        />
      </FormItemComponent>
      <FormItemComponent
        name="active_gl_code"
        label={Dictionary.code + " " + Dictionary.document + " gl"}
        className={Classes["register-information-form-item"]}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          {
            pattern: /^[0-9]+$/,
            message: Dictionary.onlyNumber,
          },
        ]}
      >
        <InputComponent
          width={343}
          className={Classes["register-new-customer-input"]}
          name="active_gl_code"
          placeholder={Dictionary.code + " gl"}
          disabled={edit}
        />
      </FormItemComponent>
      <FormItemComponent
        name="dormant"
        label={Dictionary.time + " " + Dictionary.stagnation}
        className={Classes["register-information-form-item"]}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },

          {
            pattern: /^[0-9]+$/,
            message: Dictionary.onlyNumber,
          },
          () => ({
            validator(_, value) {
              if (value && (1000 < value || value < 200)) {
                return Promise.reject(new Error(Dictionary.ErrorDormant));
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <InputComponent
          width={343}
          className={Classes["register-new-customer-input"]}
          name="dormant"
          placeholder={3 + " " + Dictionary.day}
          disabled={edit}
        />
      </FormItemComponent>
      <FormItemComponent
        name="idle_gl_code"
        label={
          Dictionary.code +
          Dictionary.document +
          " gl " +
          Dictionary.inCase +
          " " +
          Dictionary.stagnation
        }
        className={Classes["register-information-form-item"]}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          {
            pattern: /^[0-9]+$/,
            message: Dictionary.onlyNumber,
          },
        ]}
      >
        <InputComponent
          width={343}
          className={Classes["register-new-customer-input"]}
          name="idle_gl_code"
          placeholder={Dictionary.code + " gl "}
          disabled={edit}
        />
      </FormItemComponent>
      <FormItemComponent
        name="desc"
        label={Dictionary.desc}
        className={cx(Classes["register-information-form-item"])}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
        ]}
      >
        <InputComponent
          width={343}
          maxLength={30}
          placeholder={Dictionary.desc}
          className={Classes["register-new-customer-input"]}
        />
      </FormItemComponent>
      <FormItemComponent shouldUpdate button>
        <ButtonComponent
          type="primary"
          htmlType="submit"
          classNameBtn={Classes["register-modal-confirm-button"]}
        >
          {record?.code ? Dictionary.edit : Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          classNameBtn={Classes["register-modal-cancel-button"]}
          type="default"
          onClick={() => {
            dispatch(
              walletType({ modal: false, cancelModal: true, edit: false })
            );
          }}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};
export default AddNewWalletType;
