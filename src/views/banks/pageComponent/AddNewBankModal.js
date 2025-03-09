import React, { useEffect, useRef } from "react";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputComponent from "components/input/InputComponent";
import Dictionary from "helpers/Dictionary";
import { listBanks } from "store/reducers/listBanks/listBanksReducer";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import Classes from "../styles/Bank.module.scss";
import { addBank, updateBank } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
const AddNewBankModal = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const formRef = useRef();
  const listBanksData = useSelector((state) => state.listBanks.value);
  const onFinish = (values) => {
    if (listBanksData.edit) {
      updateBank({
        bank_name: values.bankName,
        bank_code: values.bankCode,
        bin: values.bin.split("-"),
        is_enabled: listBanksData.record.isEnable,
      })
        .then(() =>
          dispatch(
            listBanks({
              modal: false,
              edit: false,
              reload: !listBanksData.reload,
            })
          )
        )
        .catch(() => errorHandler(errorResponse));
    } else {
      addBank({
        bank_name: values.bankName,
        bank_code: values.bankCode,
        bin: values.bin.split("-"),
        is_enabled: true,
      })
        .then(() =>
          dispatch(
            listBanks({
              modal: false,
              edit: false,
              reload: !listBanksData.reload,
            })
          )
        )
        .catch(() => errorHandler(errorResponse));
    }
  };
  useEffect(() => {
    if (listBanksData.edit) {
      form.setFieldsValue({
        bankCode: listBanksData.record?.bankCode,
        bankName: listBanksData.record?.bankName,
        bin: listBanksData.record?.bin.join("-"),
      });
    } else {
      form.resetFields();
    }
  }, [listBanksData.modal]);
  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      ref={formRef}
      className={Classes["bankModal"]}
      requiredMark={false}
    >
      <FormItemComponent
        name="bankCode"
        label={Dictionary.bankCode}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          {
            max: 2,
            min: 2,
            message: Dictionary.checkInput,
          },
          {
            pattern: /^[0-9]+$/,
            message: Dictionary.checkInput,
          },
        ]}
      >
        <InputComponent
          disabled={listBanksData.edit}
          placeholder={Dictionary.bankCode}
          name="card-from"
          className={Classes["inputModal"]}
        />
      </FormItemComponent>
      <FormItemComponent
        name="bankName"
        label={`${Dictionary.name} ${Dictionary.bank}`}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          {
            pattern: /^[\u0600-\u06FF\s()-]+$/,
            message: Dictionary.checkInput,
          },
        ]}
      >
        <InputComponent
          placeholder={`${Dictionary.name} ${Dictionary.bank}`}
          name="bankName"
          className={Classes["inputModal"]}
        />
      </FormItemComponent>
      <FormItemComponent
        name="bin"
        label="bin"
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          {
            pattern: /^[0-9-]+$/,
            message: Dictionary.checkInput,
          },
        ]}
      >
        <InputComponent
          placeholder="12345678-12345678"
          name="bin"
          className={Classes["inputModal-number"]}
        />
      </FormItemComponent>
      <FormItemComponent className={Classes["modalButton"]}>
        <ButtonComponent
          type="primary"
          htmlType={Dictionary.confirm}
          classNameBtn={Classes["confirmBtn"]}
        >
          {listBanksData.edit ? Dictionary.save : Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          type="default"
          htmlType={Dictionary.cancel}
          onClick={() =>
            dispatch(listBanks({ modal: false, edit: false, record: {} }))
          }
          classNameBtn={Classes["cancelBtn"]}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};

export default AddNewBankModal;
