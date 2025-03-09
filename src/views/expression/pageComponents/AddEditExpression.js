import { Form } from "antd";
import SelectComponent from "components/SelectComponent/SelectComponent";
import ButtonComponent from "components/button/ButtonComponent";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputComponent from "components/input/InputComponent";
import { addUpdateExpression } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import Dictionary from "helpers/Dictionary";
import useErrorHandler from "helpers/useErrorHandler";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { expression } from "store/reducers/expression/expressionReducer";
import Classes from "views/expression/styles/expression.module.scss";

const AddEditExpression = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const expressionData = useSelector((state) => state.expression.value);
  const record = expressionData.record;
  const errorHandler = useErrorHandler();
  useEffect(() => {
    form.resetFields();
    if (expressionData.state === "edit") {
      form.setFieldsValue({
        expression: record?.expression,
        event: record?.event,
      });
    }
  }, [expressionData.addModal]);

  const onFinish = (values) => {
    addUpdateExpression({
      id: record.id || null,
      event: values?.event,
      expression: values?.expression,
    })
      .then(() =>
        dispatch(
          expression({
            addModal: false,
            record: "",
            reload: !expressionData.reload,
          })
        )
      )
      .catch(() => errorHandler(errorResponse));
  };

  return (
    <div>
      <FormComponent
        layout="vertical"
        form={form}
        onFinish={onFinish}
        ref={formRef}
        requiredMark={false}
        className={Classes["expression-form-modal"]}
      >
        <FormItemComponent
          name="expression"
          label={Dictionary.sentenceText}
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
            {
              max: 120,
              message: Dictionary.checkInput,
            },
          ]}
        >
          <InputComponent
            className={Classes["expression-text-in-modal"]}
            width={718}
            placeholder="حداکثر 120 کاراکتر"
          />
        </FormItemComponent>
        <FormItemComponent
          name="event"
          label={Dictionary.happen}
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
          ]}
        >
          <SelectComponent
            name="event"
            items={expressionData.searchItems}
            width={718}
            className={Classes["expression-selection-in-modal"]}
            placeholder="یک مورد را انتخاب کنید."
            disabled={expressionData.state === "edit"}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["expression-button"]}>
          <ButtonComponent
            classNameBtn={Classes["confirmBtn"]}
            type="primary"
            htmlType="submit"
          >
            {expressionData.state === "edit"
              ? Dictionary.save
              : Dictionary.confirm}
          </ButtonComponent>
          <ButtonComponent
            classNameBtn={Classes["cancelBtn"]}
            type="default"
            onClick={() => {
              dispatch(expression({ addModal: false, record: "" }));
            }}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
    </div>
  );
};

export default AddEditExpression;
