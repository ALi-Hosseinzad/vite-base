import React, { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import Dictionary from "helpers/Dictionary";
import Classes from "views/customerServices/styles/disableServiceModal.module.scss";
import {
  disableBiometricService,
  disableLoginService,
  disableNotLoginService,
  getReactionSentences,
} from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import { customerService } from "store/reducers/customerServices/customerServiceReducer";
import { useDispatch, useSelector } from "react-redux";
import SelectComponent from "components/SelectComponent/SelectComponent";

const DisableServiceModal = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const customerServiceData = useSelector(
    (state) => state.customerService.value
  );
  const [disableDesc, setDisableDesc] = useState("");

  useEffect(() => {
    setDisableDesc("");
    form.resetFields();
  }, [customerServiceData.reasonModal]);

  useEffect(() => {
    const sentences = [];
    getReactionSentences({
      offset: "0",
      count: "100",
      sort_by: "-createdDate",
      criteria: {
        operation: "and",
        criteria: [
          {
            key: "event",
            value: "DISABLE_FACILITY_REASONS",
            operation: "equals",
          },
        ],
      },
    })
      .then((res) =>
        res.data?.data?.forEach((element, index) => {
          sentences.push({
            id: index,
            value: element.expression,
            text: element.expression,
          });
        })
      )
      .then(() => dispatch(customerService({ disableReasons: sentences })))
      .catch(() => {
        errorHandler(errorResponse);
        dispatch(customerService({ reasonModal: false }));
      });
  }, [customerServiceData.reasonModal]);

  const onFinish = () => {
    let body = {
      facility_key: customerServiceData.record.facility_key,
      disabled_desc: disableDesc,
      identification_code: customerServiceData.list.identification_code,
    };
    if (customerServiceData.chooseRow.service === "not_login_facilities") {
      disableNotLoginService(body)
        .then(() =>
          dispatch(
            customerService({
              reasonModal: false,
              record: "",
              chooseRow: "",
              reload: !customerServiceData.reload,
            })
          )
        )
        .catch(() => {
          errorHandler(errorResponse);
          dispatch(
            customerService({ reasonModal: false, record: "", chooseRow: "" })
          );
        });
    } else if (customerServiceData.chooseRow.service === "login_facilities") {
      disableLoginService(body)
        .then(() =>
          dispatch(
            customerService({
              reasonModal: false,
              record: "",
              chooseRow: "",
              reload: !customerServiceData.reload,
            })
          )
        )
        .catch(() => {
          errorHandler(errorResponse);
          dispatch(
            customerService({ reasonModal: false, record: "", chooseRow: "" })
          );
        });
    } else if (
      customerServiceData.chooseRow.service === "biometric_login_facilities"
    ) {
      disableBiometricService(body)
        .then(() =>
          dispatch(
            customerService({
              reasonModal: false,
              record: "",
              chooseRow: "",
              reload: !customerServiceData.reload,
            })
          )
        )
        .catch(() => {
          errorHandler(errorResponse);
          dispatch(
            customerService({ reasonModal: false, record: "", chooseRow: "" })
          );
        });
    }
  };
  return (
    <Form
      requiredMark={false}
      onFinish={onFinish}
      layout="vertical"
      form={form}
      ref={formRef}
    >
      <p className={Classes["disable-modal-note"]}>
        {Dictionary.reasonOfDiableCustomer}
      </p>
      <FormItemComponent
        shouldUpdate
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
        ]}
        name="reason"
        label={Dictionary.reason}
        className={Classes["disable-service-modal-select"]}
      >
        <SelectComponent
          name="reason"
          style={{ width: "466px" }}
          className={Classes["ready-reactions"]}
          placeholder="یک مورد را انتخاب نمایید."
          items={customerServiceData?.disableReasons}
          onChange={(e) => setDisableDesc(e)}
        />
      </FormItemComponent>
      <FormItemComponent
        button={true}
        className={Classes["disable-service-modal-btn"]}
      >
        <ButtonComponent
          type="primary"
          htmlType="submit"
          classNameBtn={Classes["disable-service-modal-confirm-btn"]}
        >
          {Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          type="default"
          onClick={() =>
            dispatch(
              customerService({ reasonModal: false, record: "", chooseRow: "" })
            )
          }
          classNameBtn={Classes["disable-service-modal-cancel-btn"]}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};

export default DisableServiceModal;
