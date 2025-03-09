import React, { useEffect, useRef } from "react";
import { Form, InputNumber } from "antd";
import Dictionary from "helpers/Dictionary";
import { addAssurance, confirmHub } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import Classes from "../styles/viewCreditHub.module.scss";
import FormComponent from "components/form/FormComponent";
import InputComponent from "components/input/InputComponent";
import { useNavigate, useSearchParams } from "react-router-dom";
import ButtonComponent from "components/button/ButtonComponent";
import { ConvertNumberToComma } from "helpers/ConvertNumberToComma";
import inputClass from "components/input/InputComponent.module.scss";
import FormItemComponent from "components/formItem/FormItemComponent";
import {
  creditHubState,
  resetCreditHub,
} from "store/reducers/creditHub/creditHubReducer";

const ConfirmBranch = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const [searchParams] = useSearchParams();
  const creditHubData = useSelector(creditHubState);
  const { details } = creditHubData;

  useEffect(() => {
    if (
      details?.backoffice_status === "SENT_TO_BRANCH" &&
      details?.guarantee_type?.length > 0
    ) {
      const convertList = [];
      details?.guarantee_type?.forEach((item, index) => {
        const convertObj = {
          ["amount_" + index]: "",
          ["description_" + index]: "",
          ["assurance_serial_" + index]: "",
          ["assurance_type_code_" + index]: "",
          ["assurance_type_" + index]: item.key,
        };
        convertList.push(convertObj);
      });
      const objectData = convertList?.reduce((result, obj) => {
        return { ...result, ...obj };
      }, {});

      form.setFieldsValue({ ...objectData });
    }
  }, [details]);

  const onClose = () => {
    form.resetFields();
    dispatch(resetCreditHub());
    navigate("/loan/credit-hub");
  };

  const ConvertObjectToArray = (values) => {
    const result = Object.keys(values).reduce((acc, key) => {
      const planIndex = key?.match(/\d+/)[0];
      let propName = key?.replace(/\d+/g, "");
      propName = propName.slice(0, -1);
      if (planIndex !== null) {
        if (!acc[planIndex]) {
          acc[planIndex] = {};
        }
        acc[planIndex][propName] = values[key];
      }
      return acc;
    }, []);
    return result;
  };

  const onFinish = (values) => {
    const arrayOfValues = ConvertObjectToArray(values);
    addAssurance({
      credit_hub_assurance_detail_list: arrayOfValues,
      reference_number: searchParams.get("reference"),
    })
      .then(() => {
        confirmHub({
          reference_number: searchParams.get("reference"),
          status: "ACCEPT",
        })
          .then(() => onClose())
          .catch(() => {
            errorHandler(errorResponse);
          });
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  return (
    <div className={Classes["credit-hub-container"]}>
      {details?.backoffice_status !== "SENT_TO_BRANCH" &&
        details?.assurance_list?.length > 0 && (
          <div className={Classes["view-box"]}>
            {details?.assurance_list.map((item) => (
              <div className={Classes["view-box-container"]} key={item.id}>
                <p className={Classes["form-name-2"]}>
                  {Dictionary.informationOf} {Dictionary.assurance}{" "}
                  {item?.value}
                </p>
                <div className={Classes["row"]}>
                  <span>
                    {Dictionary.serial} {Dictionary.assurance} :
                  </span>
                  <span> {item?.assurance_serial || "--"}</span>
                </div>
                <div className={Classes["row"]}>
                  <span>
                    {Dictionary.code} {Dictionary.type} {Dictionary.assurance} :
                  </span>
                  <span>{item?.assurance_type_code || "--"}</span>
                </div>
                <div className={Classes["row"]}>
                  <span>{Dictionary.amount} :</span>
                  <span>
                    {item?.amount ? ConvertNumberToComma(item.amount) : "--"}
                  </span>
                </div>
                <div className={Classes["full-row"]}>
                  <span>{Dictionary.description} :</span>
                  <span>{item?.description || "--"}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      {details?.backoffice_status === "SENT_TO_BRANCH" && (
        <FormComponent
          form={form}
          ref={formRef}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className={Classes["formContainer"]}
        >
          <div className={Classes["form-items"]}>
            {details?.guarantee_type?.map((item, index) => (
              <div className={Classes["form-wrapper"]} key={index}>
                <p className={Classes["form-name"]}>
                  {Dictionary.informationOf} {Dictionary.assurance}{" "}
                  {item?.value}
                </p>
                <div className={Classes["row-form"]}>
                  <FormItemComponent
                    className={Classes["form-item"]}
                    name={`assurance_serial_${index}`}
                    label={Dictionary.serial + " " + Dictionary.assurance}
                    rules={[{ required: true, message: Dictionary.require }]}
                  >
                    <InputComponent
                      width={343}
                      className={Classes["inputModal"]}
                      name={`assurance_serial-${index}`}
                      placeholder={
                        Dictionary.serial + " " + Dictionary.assurance
                      }
                    />
                  </FormItemComponent>
                  <FormItemComponent
                    className={Classes["form-item"]}
                    name={`assurance_type_code_${index}`}
                    rules={[{ required: true, message: Dictionary.require }]}
                    label={`${Dictionary.code} ${Dictionary.type} ${Dictionary.assurance}`}
                  >
                    <InputComponent
                      width={343}
                      className={Classes["inputModal"]}
                      name={`assurance_type_code_${index}`}
                      placeholder={`${Dictionary.code} ${Dictionary.type} ${Dictionary.assurance}`}
                    />
                  </FormItemComponent>
                  <FormItemComponent
                    name={`amount_${index}`}
                    className={Classes["form-item"]}
                    rules={[{ required: true, message: Dictionary.require }]}
                    label={
                      Dictionary.amount +
                      " " +
                      Dictionary.assurance +
                      " (" +
                      Dictionary.rial +
                      ")"
                    }
                  >
                    <InputNumber
                      controls={false}
                      name={`amount_${index}`}
                      style={{ width: "343px" }}
                      placeholder={
                        Dictionary.amount + " " + Dictionary.assurance
                      }
                      formatter={(value) =>
                        value?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      className={`${inputClass["input-component"]} ${Classes["input-number"]}`}
                    />
                  </FormItemComponent>
                  <FormItemComponent
                    name={`description_${index}`}
                    label={
                      Dictionary.description + " (" + Dictionary.optional + ")"
                    }
                  >
                    <InputComponent
                      width={706}
                      name={`description_${index}`}
                      className={Classes["input-desc"]}
                      placeholder={Dictionary.description}
                    />
                  </FormItemComponent>
                  <FormItemComponent
                    name={`assurance_type_${index}`}
                    className={Classes["form-item-hidden"]}
                    label={Dictionary.amount}
                  >
                    <InputComponent
                      width={343}
                      name={`assurance_type_${index}`}
                      placeholder={Dictionary.amount}
                      className={Classes["inputModal"]}
                    />
                  </FormItemComponent>
                </div>
              </div>
            ))}
          </div>

          <FormItemComponent className={Classes["appSettingsEditButton"]}>
            <ButtonComponent
              classNameBtn={Classes["confirmBtn"]}
              type="primary"
              htmlType="submit"
            >
              {Dictionary.confirm}
            </ButtonComponent>
            <ButtonComponent
              classNameBtn={Classes["cancelBtn"]}
              type="default"
              onClick={onClose}
            >
              {Dictionary.cancel}
            </ButtonComponent>
          </FormItemComponent>
        </FormComponent>
      )}
    </div>
  );
};

export default ConfirmBranch;
