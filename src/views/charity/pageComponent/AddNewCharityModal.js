import React, { useEffect, useRef } from "react";
import Dictionary from "helpers/Dictionary";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import Classes from "views/listCards/styles/SelectCityOrProvinceCardModal.module.scss";
import FormItemComponent from "components/formItem/FormItemComponent";
import ButtonComponent from "components/button/ButtonComponent";
import InputComponent from "components/input/InputComponent";
import TextAreaComponent from "components/textArea/TextArea";
import { charities } from "store/reducers/charity/charityReducer";
import { addCharity, updateCharity } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";

const AddNewCharityModal = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const formRef = useRef();

  const listCharityData = useSelector((state) => state.charities.value);
  const onOk = (values) => {
    if (listCharityData.edit) {
      updateCharity({
        charity_account_number: values.accNo,
        charity_key: values.uniqueKey,
        charity_name: values.InstitutionName,
        charity_description: values.description,
        website: values.InstitutionSite,
      })
        .then(() =>
          dispatch(charities({ modal: false, reload: !listCharityData.reload }))
        )
        .catch(() => errorHandler(errorResponse));
    } else {
      addCharity({
        charity_account_number: values.accNo,
        charity_key: values.uniqueKey,
        charity_name: values.InstitutionName,
        charity_description: values.description,
        website: values.InstitutionSite,
        disable: true,
      })
        .then(() =>
          dispatch(charities({ modal: false, reload: !listCharityData.reload }))
        )
        .catch(() => errorHandler(errorResponse));
    }
  };
  const okCancel = () => {
    dispatch(charities({ modal: false }));
  };
  useEffect(() => {
    if (listCharityData.edit) {
      form.setFieldsValue({
        InstitutionName: listCharityData.record?.name,
        description: listCharityData.record?.charity_description,
        InstitutionSite: listCharityData.record?.site,
        uniqueKey: listCharityData.record?.key,
        accNo: listCharityData.record?.accountNumber,
      });
    } else {
      form.resetFields();
    }
  }, [listCharityData.modal]);
  return (
    <Form
      className={Classes["list-cards-form"]}
      layout="vertical"
      form={form}
      onFinish={onOk}
      ref={formRef}
      requiredMark={false}
    >
      <FormItemComponent
        name="InstitutionName"
        className={Classes["add-cards-form-item"]}
        label={Dictionary.InstitutionName}
        rules={[{ required: true, message: Dictionary.require }]}
      >
        <InputComponent
          placeholder={Dictionary.InstitutionName}
          name="card-from"
        />
      </FormItemComponent>
      <FormItemComponent
        name="accNo"
        className={Classes["add-cards-form-item"]}
        label={Dictionary.accNo}
        rules={[
          { required: true, message: Dictionary.require },
          {
            pattern: /^[0-9]+$/,
            message: Dictionary.checkInput,
          },
          {
            min: 13,
            message: Dictionary.checkInput,
          },
          {
            max: 13,
            message: Dictionary.checkInput,
          },
        ]}
      >
        <InputComponent placeholder={Dictionary.accNo} name="card-to" />
      </FormItemComponent>
      <FormItemComponent
        name="InstitutionSite"
        className={Classes["add-cards-form-item"]}
        label={Dictionary.InstitutionSite}
        rules={[{ required: true, message: Dictionary.require }]}
      >
        <InputComponent
          placeholder={Dictionary.InstitutionSite}
          name="card-to"
        />
      </FormItemComponent>
      <FormItemComponent
        name="uniqueKey"
        className={Classes["add-cards-form-item"]}
        label={Dictionary.uniqueKey}
        rules={[{ required: true, message: Dictionary.require }]}
      >
        <InputComponent
          placeholder={Dictionary.uniqueKey}
          name="card-to"
          disabled={listCharityData.edit}
        />
      </FormItemComponent>
      <FormItemComponent
        name="description"
        className={Classes["add-cards-form-item"]}
        label={Dictionary.description}
        rules={[{ required: true, message: Dictionary.require }]}
      >
        <TextAreaComponent
          placeholder={Dictionary.description}
          name="card-to"
          rows={4}
        />
      </FormItemComponent>
      <FormItemComponent className={Classes["add-card-btn"]}>
        <ButtonComponent
          htmlType="submit"
          type="primary"
          classNameBtn={Classes["list-card-btn-confirm-button"]}
        >
          {Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          htmlType="button"
          type="default"
          classNameBtn={Classes["list-card-btn-cancel-button"]}
          onClick={okCancel}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};

export default AddNewCharityModal;
