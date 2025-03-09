import React, { useEffect, useRef } from "react";
import ButtonComponent from "components/button/ButtonComponent";
import InputComponent from "components/input/InputComponent";
import Dictionary from "helpers/Dictionary";
import { Form, Typography } from "antd";
import FormItemComponent from "components/formItem/FormItemComponent";
import { sendReferralCode } from "helpers/APIFunction";
import CustomIcon from "components/customIcon/CustomIcon";
import Warning from "assets/images/icon/Warning.svg";
import Successful from "assets/images/icon/Successful.svg";
import Classes from "views/referralBranchCode/styles/referralBranchCode.module.scss";
import { branchCustomers } from "store/reducers/branchCustomers/BranchCustomers";
import { useDispatch, useSelector } from "react-redux";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";

const SendSmsToCustomer = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const branchCustomersData = useSelector(
    (state) => state.branchCustomers.value
  );
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const { Text } = Typography;
  const onFinish = (values) => {
    sendReferralCode({ mobile_number: values.mobile })
      .then((res) => dispatch(branchCustomers({ current: 2 })))
      .catch(() => errorHandler(errorResponse));
  };

  useEffect(() => {
    form.resetFields();
  }, [branchCustomersData.modal]);

  return (
    <div className={Classes["sms-modal"]}>
      {branchCustomersData.current === 1 ? (
        <>
          <div className={Classes["modal-notice"]}>
            <CustomIcon src={Warning} size={24} />
            <p>
              کاربر گرامی با وارد کردن تلفن همراه مشتری، کد معرف از طریق پیامک
              برای مشتری ارسال می گردد.
            </p>
          </div>
          <div className={Classes["modal-form"]}>
            <Form
              className=""
              layout="vertical"
              form={form}
              onFinish={onFinish}
              ref={formRef}
              requiredMark={false}
            >
              <FormItemComponent
                name="mobile"
                label={Dictionary.mobile}
                rules={[
                  {
                    required: true,
                    message: Dictionary.require,
                  },
                  {
                    min: 11,
                    message: Dictionary.size,
                  },
                  {
                    pattern: /^[0-9\.]+$/,
                    message: Dictionary.onlyNumber,
                  },
                ]}
              >
                <InputComponent
                  width={343}
                  placeholder="09121234567"
                  maxLength={11}
                  className={Classes["modal-mobile"]}
                />
              </FormItemComponent>
              <div style={{ display: "none" }}>
                <input />
              </div>
              <FormItemComponent className={Classes["modal-buttons"]}>
                <ButtonComponent
                  type="primary"
                  htmlType="submit"
                  classNameBtn={Classes["modal-button-confirm"]}
                >
                  {Dictionary.confirm}
                </ButtonComponent>
                <ButtonComponent
                  classNameBtn={Classes["modal-button-cancel"]}
                  type="default"
                  onClick={() => dispatch(branchCustomers({ modal: false }))}
                >
                  {Dictionary.cancel}
                </ButtonComponent>
              </FormItemComponent>
            </Form>
          </div>
        </>
      ) : (
        <div className={Classes["success-send-to-customer"]}>
          <CustomIcon
            src={Successful}
            size={88}
            name="success-send-to-customer-icon"
          />
          <Text className={Classes["success-send-to-customer-text"]}>
            {Dictionary.successSendReferralCode}
          </Text>
          <ButtonComponent
            type="primary"
            htmlType="submit"
            classNameBtn={Classes["success-send-to-customer-btn"]}
            onClick={() => {
              dispatch(branchCustomers({ modal: false, current: 1 }));
            }}
          >
            {Dictionary.close}
          </ButtonComponent>
        </div>
      )}
    </div>
  );
};

export default SendSmsToCustomer;
