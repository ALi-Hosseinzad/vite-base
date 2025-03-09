import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Form, Space, Typography } from "antd";
import Classes from "views/representative/styles/Representative.module.scss";
import InputComponent from "components/input/InputComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import Warning from "assets/images/icon/Warning.svg";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { useEffect } from "react";
import { checkNationalId } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import {
  representative,
  representativeState,
} from "store/reducers/representative/representativeReducer";

const AddRepresentative = () => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const representativeData = useSelector(representativeState);
  const errorHandler = useErrorHandler();

  const onFinish = (values) => {
    checkNationalId(values.nationalId)
      .then((res) => {
        dispatch(representative({ resultCheck: res.data }));
      })
      .catch(() => errorHandler(errorResponse));
  };

  useEffect(() => {
    form.resetFields();
  }, [representativeData.addModal]);

  return (
    <Fragment>
      <Form
        className={Classes["edit-card-form"]}
        layout="vertical"
        form={form}
        onFinish={onFinish}
        requiredMark={false}
      >
        <Space className={Classes["edit-card-space"]}>
          <CustomIcon src={Warning} size={24} name="edit-card-space-icon" />
          <Text className={Classes["edit-card-text"]}>
            {Dictionary.representativeWarning}
          </Text>
        </Space>
        <div className={Classes["acc-number"]}>
          <p>{Dictionary.accNo}</p>
          <p>{representativeData.list[0]?.account_number}</p>
        </div>
        <FormItemComponent
          name="nationalId"
          className={Classes["edit-card-form-item"]}
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
            {
              min: 10,
              message: Dictionary.size,
            },
            {
              max: 10,
              message: Dictionary.size,
            },
            {
              pattern: /^[0-9]+$/,
              message: Dictionary.onlyNumber,
            },
          ]}
          label={Dictionary.nationalId + " " + Dictionary.representative}
        >
          <InputComponent
            width={466}
            name="nationalId"
            maxLength={10}
            className={Classes["edit-card-form-input"]}
          />
        </FormItemComponent>
        <FormItemComponent button={true}>
          <ButtonComponent
            type="primary"
            htmlType="submit"
            classNameBtn={Classes["confirm-card-form-btn"]}
          >
            {Dictionary.confirm}
          </ButtonComponent>
          <ButtonComponent
            type="default"
            onClick={() =>
              dispatch(
                representative({
                  addModal: false,
                  resultCheck: null,
                  showSuccess: false,
                  dismissalModal: false,
                })
              )
            }
            classNameBtn={Classes["edit-card-form-btn"]}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </Form>
    </Fragment>
  );
};
export default AddRepresentative;
