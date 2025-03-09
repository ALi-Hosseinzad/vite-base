import React, { useEffect, useRef } from "react";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputComponent from "components/input/InputComponent";
import Dictionary from "helpers/Dictionary";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import Classes from "../styles/TranType.module.scss";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import {
  tranTypes,
  tranTypesState,
} from "store/reducers/tranTypes/TranTypesReducer";
import { updateTranType } from "helpers/APIFunction";
const EditTranType = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const formRef = useRef();
  const tranTypesData = useSelector(tranTypesState);
  const { record, reload, modal } = tranTypesData;
  const onFinish = (values) => {
    updateTranType({
      code: values.code,
      description: values.desc,
      title: values.title,
    })
      .then(() => dispatch(tranTypes({ modal: false, reload: !reload })))
      .catch(() => errorHandler(errorResponse));
  };

  useEffect(() => {
    form.setFieldsValue({
      code: record?.code,
      title: record?.title,
      desc: record?.description,
      glCode: record?.gl?.code,
    });
  }, [modal]);
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
        name="code"
        label={Dictionary.code}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          {
            pattern: /^[0-9]+$/,
            message: Dictionary.onlyNumber,
          },
          {
            max: 4,
            message: Dictionary.checkInput,
          },
        ]}
      >
        <InputComponent
          placeholder={Dictionary.code}
          name="code"
          className={Classes["inputModal"]}
        />
      </FormItemComponent>
      <FormItemComponent name="title" label={Dictionary.title}>
        <InputComponent
          placeholder={Dictionary.title}
          name="title"
          className={Classes["inputModal"]}
          disabled
        />
      </FormItemComponent>
      <FormItemComponent
        name="glCode"
        label={Dictionary.code + " " + Dictionary.document + " gl"}
      >
        <InputComponent
          name="glCode"
          className={Classes["inputModal"]}
          disabled
        />
      </FormItemComponent>
      <FormItemComponent
        name="desc"
        label={Dictionary.desc}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
        ]}
      >
        <InputComponent
          placeholder={Dictionary.desc}
          name="bin"
          className={Classes["inputModal"]}
        />
      </FormItemComponent>
      <FormItemComponent className={Classes["modalButton"]}>
        <ButtonComponent
          type="primary"
          htmlType={Dictionary.confirm}
          classNameBtn={Classes["confirmBtn"]}
        >
          {Dictionary.edit}
        </ButtonComponent>
        <ButtonComponent
          type="default"
          onClick={() => dispatch(tranTypes({ modal: false, record: {} }))}
          classNameBtn={Classes["cancelBtn"]}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};

export default EditTranType;
