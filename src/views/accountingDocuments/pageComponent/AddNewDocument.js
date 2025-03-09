import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Form } from "antd";
import Classes from "../styles/RegisterInformation.module.scss";
import InputComponent from "components/input/InputComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import cx from "classnames";
import ButtonComponent from "components/button/ButtonComponent";
import { addDocument } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { accountingDocuments } from "store/reducers/accountingDocuments/AccountingDocumentsReducer";

const AddNewDocument = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const accDocumentsData = useSelector(
    (state) => state.accountingDocuments.value
  );
  const { reload, modal } = accDocumentsData;

  const errorHandler = useErrorHandler();

  useEffect(() => {
    form.resetFields();
  }, [modal]);

  const onFinish = (value) => {
    addDocument({
      code: value.code,
      description: value.desc,
      status: "ACTIVE",
    })
      .then(() =>
        dispatch(accountingDocuments({ reload: !reload, modal: false }))
      )
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

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
        />
      </FormItemComponent>
      <FormItemComponent
        name="desc"
        label={Dictionary.desc}
        className={cx(
          Classes["register-information-form-item"],
          Classes["register-information-form-mobile"]
        )}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
        ]}
      >
        <InputComponent
          width={343}
          placeholder={Dictionary.desc}
          className={Classes["input-desc"]}
        />
      </FormItemComponent>

      <FormItemComponent shouldUpdate button>
        <ButtonComponent
          type="primary"
          htmlType="submit"
          classNameBtn={Classes["register-modal-confirm-button"]}
        >
          {Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          classNameBtn={Classes["register-modal-cancel-button"]}
          type="default"
          onClick={() => {
            dispatch(accountingDocuments({ modal: false, cancelModal: true }));
          }}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};
export default AddNewDocument;
