import React, { useEffect, useRef } from "react";
import { Form } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputComponent from "components/input/InputComponent";
import { useDispatch, useSelector } from "react-redux";
import { limitation } from "store/reducers/limitation/limitationReducer";
import Classes from "views/limitation/styles/limitation.module.scss";
import Dictionary from "helpers/Dictionary";
import { nationalCodeValidation } from "helpers/nationalIdValidation";

const CustomerInfoInput = ({ onClickButton, onCancelButton }) => {
  const listLimitData = useSelector((state) => state.limitation.value);
  const [inputForm] = Form.useForm();
  const formRef = useRef();
  const onFinish = (values) => {
    onClickButton(values);
  };

  const onCancel = () => {
    onCancelButton();
  };
  useEffect(() => {
    inputForm.resetFields();
  }, [listLimitData.addModal, listLimitData.vipAddModal]);

  return (
    <>
      <p className={Classes["add-limit-national-code-point"]}>
        {Dictionary.insertNationalCode}
      </p>
      <Form
        layout="vertical"
        form={inputForm}
        ref={formRef}
        requiredMark={false}
        onFinish={onFinish}
      >
        <FormItemComponent
          name="identificationCode"
          label={Dictionary.nationalIdCode}
          className={Classes["add-limit-national-code-input"]}
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
            {
              pattern: /^[0-9]+$/,
              message: Dictionary.checkInput,
            },
            {
              min: 10,
              message: Dictionary.checkInput,
            },
            () => ({
              validator(_, value) {
                if ((value.length === 10) & !nationalCodeValidation(value)) {
                  return Promise.reject(new Error(Dictionary.idNotValid));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputComponent
            width={343}
            className={Classes["add-limit-national-code-input__"]}
            maxLength={11}
          />
        </FormItemComponent>
        <FormItemComponent
          shouldUpdate
          button
          className={Classes["add-limit-buttons"]}
        >
          <ButtonComponent
            type="primary"
            htmlType="submit"
            classNameBtn={Classes["confirm-button"]}
          >
            {Dictionary.continue}
          </ButtonComponent>
          <ButtonComponent
            type="default"
            classNameBtn={Classes["cancel-button"]}
            onClick={onCancel}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </Form>
    </>
  );
};

export default CustomerInfoInput;
