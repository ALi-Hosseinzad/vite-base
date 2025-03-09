import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Checkbox, Col, Form, Row, Space, Typography } from "antd";
import Classes from "views/representative/styles/Representative.module.scss";
import InputComponent from "components/input/InputComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import Warning from "assets/images/icon/Warning.svg";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { useEffect } from "react";
import { addRepresentative2, checkNationalId2 } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import {
  representative,
  representativeState,
} from "store/reducers/representative/representativeReducer";
import ModalComponent from "components/modalComponent/ModalComponent";

const AddNewRepresentative = () => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const errorHandler = useErrorHandler();
  const representativeData = useSelector(representativeState);
  const {
    record,
    nationalIdChecked,
    resultCheckId,
    addNewRepresentativeModal,
    checkedValue,
    nationalId,
  } = representativeData;

  const onFinish = (values) => {
    if (nationalIdChecked) {
      addRepresentative2({
        account_number: record?.account_number,
        signer_identification_code: record?.identification_code,
        agent_identification_code: nationalId,
        agent_action: checkedValue,
      })
        .then(() => {
          dispatch(
            representative({
              showSuccessModal: true,
              addNewRepresentativeModal: false,
              expandedRowKeys: null,
              agentsListAsRecord: [],
            })
          );
        })
        .catch(() => errorHandler(errorResponse));
    } else {
      checkNationalId2({ identification_code: values.nationalId })
        .then((res) => {
          dispatch(
            representative({
              resultCheckId: res.data,
              nationalIdChecked: true,
              nationalId: values.nationalId,
            })
          );
        })
        .catch(() => {
          dispatch(
            representative({ resultCheckId: "", nationalIdChecked: false })
          );
          errorHandler(errorResponse);
        });
    }
  };

  useEffect(() => {
    form.resetFields();
  }, [addNewRepresentativeModal]);

  const closeModal = () => {
    dispatch(
      representative({
        addNewRepresentativeModal: !addNewRepresentativeModal,
        record: "",
        resultCheckId: "",
        nationalIdChecked: false,
        checkedValue: false,
        nationalId: "",
      })
    );
  };

  const onChange = (e) => {
    if (checkedValue === e.target.value) {
      dispatch(representative({ checkedValue: "" }));
    } else {
      dispatch(representative({ checkedValue: e.target.value }));
    }
  };

  return (
    <ModalComponent
      maskClosable={false}
      title={`${Dictionary.select} ${Dictionary.representative} ${Dictionary.signer} - ${record?.account_description}`}
      open={addNewRepresentativeModal}
      width={918}
      onCancel={closeModal}
    >
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
        <div className={Classes["acc-number2"]}>
          <span>{Dictionary.accNo}</span>
          <p>{record.account_number || "--"}</p>
        </div>
        <div className={Classes["acc-number2"]}>
          <span>{Dictionary.signer}</span>
          <p>{record.full_name || "--"}</p>
        </div>
        {nationalIdChecked ? (
          <>
            <div className={Classes["acc-number2"]}>
              <span>
                {Dictionary.nationalId + " " + Dictionary.representative}
              </span>
              <p>{resultCheckId.identification_code || "--"}</p>
            </div>
            <div className={Classes["acc-number2"]}>
              <span>{Dictionary.representative}</span>
              <p>
                {resultCheckId.name || "--"} {resultCheckId.family || "--"}
              </p>
            </div>
            <p className={Classes["info-text"]}>
              {Dictionary.selectAccessibility}:
            </p>
            <div className={Classes["check-box-part"]}>
              <Row style={{ width: "100%" }}>
                <Col span={12}>
                  <Checkbox
                    checked={checkedValue === "FINANCIAL_AGENT"}
                    onChange={onChange}
                    value="FINANCIAL_AGENT"
                    className={Classes["check-box"]}
                  >
                    {Dictionary.services + " " + Dictionary.financial}
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={checkedValue === "NONFINANCIAL_AGENT"}
                    onChange={onChange}
                    value="NONFINANCIAL_AGENT"
                    className={Classes["check-box"]}
                  >
                    {Dictionary.services + " " + Dictionary.notFinancial}
                  </Checkbox>
                </Col>
              </Row>
            </div>
          </>
        ) : (
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
        )}
        <FormItemComponent button={true} style={{ marginBottom: 0 }}>
          <ButtonComponent
            type="primary"
            htmlType="submit"
            classNameBtn={Classes["confirm-card-form-btn"]}
          >
            {Dictionary.confirm}
          </ButtonComponent>
          <ButtonComponent
            type="default"
            onClick={closeModal}
            classNameBtn={Classes["edit-card-form-btn"]}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </Form>
    </ModalComponent>
  );
};
export default AddNewRepresentative;
