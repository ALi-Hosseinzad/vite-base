import React, { useRef, useState } from "react";
import { useEffect } from "react";
import moment from "jalali-moment";
import { Form, InputNumber, Select } from "antd";
import Dictionary from "helpers/Dictionary";
import { useNavigate } from "react-router-dom";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import DropDown from "assets/images/icon/DropDown.svg";
import SearchIcon from "assets/images/icon/Search.svg";
import Classes from "../styles/AddCreditHub.module.scss";
import FormComponent from "components/form/FormComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import InputComponent from "components/input/InputComponent";
import ButtonComponent from "components/button/ButtonComponent";
import NewDatePicker from "components/newDatePicker/NewDatePicker";
import inputClass from "components/input/InputComponent.module.scss";
import FormItemComponent from "components/formItem/FormItemComponent";
import { nationalCodeValidation } from "helpers/nationalIdValidation";
import SelectComponent from "components/SelectComponent/SelectComponent";
import {
  creditHub,
  creditHubState,
} from "store/reducers/creditHub/creditHubReducer";
import {
  getAllActiveBranches,
  getSuppliers,
  getTrace,
  registerHub,
} from "helpers/APIFunction";

const Information = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorHandler = useErrorHandler();
  const [focus, setFocus] = useState(false);
  const creditHubData = useSelector(creditHubState);
  const { type, province, suppliers, record } = creditHubData;
  const thisYear = moment(Date.now()).locale("fa").format("YYYY");

  const onFinish = (values) => {
    getTrace()
      .then((response) => {
        registerHub({
          amount: values.amount,
          branch_code: values.branch_code,
          description: values.description,
          reagent_code: values.reagent_code,
          mobile_number: values.mobile_number,
          guarantee_type: values.guarantee_type,
          sub_reagent_code: values.sub_reagent_code,
          reference_number: response.data.trace_id,
          installment_number: values.installment_number,
          identification_code: values.identification_code,
          birth_date:
            typeof values.birth_date === "string"
              ? values.birth_date
              : `${values.birth_date.year}/${values.birth_date.month}/${values.birth_date.day}`,
        })
          .then((res) => {
            dispatch(
              creditHub({
                step: 1,
                information: values,
                resultInfo: res.data,
                traceId: response.data.trace_id,
              })
            );
          })
          .catch(() => {
            errorHandler(errorResponse);
          });
      })
      .catch(() => errorHandler(errorResponse));
  };
  const onClose = () => {
    form.resetFields();
    navigate(-1);
    dispatch(creditHub({ step: 0 }));
  };
  useEffect(() => {
    getAllActiveBranches()
      .then((res) => {
        const convert = res.data?.map((element) => {
          return {
            value: element.branch_code,
            label: `${element.branch_code} ${element.branch_name}`,
          };
        });
        dispatch(creditHub({ province: convert }));
      })
      .catch(() => errorHandler(errorResponse));
  }, []);

  useEffect(() => {
    getSuppliers()
      .then((res) =>
        dispatch(
          creditHub({
            suppliers: res.data?.map((i, index) => {
              return {
                id: index,
                value: i.reagent_code,
                text: i.reagent_name_fa,
                assurance_types: i.assurance_types,
                sub_reagents: i.sub_reagents,
              };
            }),
          })
        )
      )
      .catch(() => errorHandler(errorResponse));
  }, []);
  console.log(record);

  return (
    <FormComponent
      form={form}
      ref={formRef}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className={Classes["formContainer"]}
      initialValues={type === "edit" ? record : {}}
    >
      <div className={Classes["row"]}>
        <FormItemComponent
          name="identification_code"
          label={Dictionary.nationalId}
          className={Classes["form-item"]}
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
            {
              max: 10,
              min: 10,
              message: Dictionary.checkInput,
            },
            {
              pattern: /^[0-9]+$/,
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
            name="identification_code"
            className={Classes["inputModal"]}
            placeholder={Dictionary.nationalId}
            disabled={type === "edit" ? true : false}
          />
        </FormItemComponent>
        <FormItemComponent
          name="mobile_number"
          className={Classes["form-item"]}
          label={`${Dictionary.number} ${Dictionary.phone}`}
          rules={[{ required: true, message: Dictionary.require }]}
        >
          <InputComponent
            width={343}
            name="mobile_number"
            className={Classes["inputModal"]}
            disabled={type === "edit" ? true : false}
            placeholder={`${Dictionary.number} ${Dictionary.phone}`}
          />
        </FormItemComponent>
        <FormItemComponent
          name="birth_date"
          label={Dictionary.birthDate}
          className={Classes["form-item"]}
          rules={[{ required: true, message: Dictionary.require }]}
        >
          <NewDatePicker
            start={1300}
            scroll={700}
            end={thisYear}
            id="birth_date"
            className={Classes["date-picker"]}
            placeholder={Dictionary.datePicker}
            classNamePad={Classes["date-picker-pad"]}
          />
        </FormItemComponent>
        <FormItemComponent
          className={Classes["form-item"]}
          name="reagent_code"
          label={Dictionary.supplier}
          rules={[{ required: true, message: Dictionary.require }]}
        >
          <SelectComponent
            name="reagent_code"
            placeholder={Dictionary.choose}
            items={suppliers}
            className={Classes["details-info-select"]}
          />
        </FormItemComponent>
        <FormItemComponent
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.reagent_code !== currentValues.reagent_code
          }
        >
          {({ getFieldValue }) => (
            <FormItemComponent
              name="guarantee_type"
              className={Classes["form-item"]}
              label={Dictionary.type + " " + Dictionary.guarantee}
              rules={[{ required: true, message: Dictionary.require }]}
            >
              <SelectComponent
                mode="multiple"
                name="guarantee_type"
                placeholder={Dictionary.choose}
                disabled={!getFieldValue("reagent_code")}
                className={Classes["details-info-select"]}
                items={
                  getFieldValue("reagent_code")
                    ? suppliers
                        ?.find((i) => i.value === getFieldValue("reagent_code"))
                        ?.assurance_types?.map((v, index) => {
                          return {
                            id: index,
                            value: v.assurance_type,
                            text: v.assurance_type_fa,
                          };
                        })
                    : []
                }
              />
            </FormItemComponent>
          )}
        </FormItemComponent>
        <FormItemComponent
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.reagent_code !== currentValues.reagent_code
          }
        >
          {({ getFieldValue }) => (
            <FormItemComponent
              className={Classes["form-item"]}
              name="sub_reagent_code"
              label={Dictionary.type + " " + Dictionary.loan}
              rules={[{ required: true, message: Dictionary.require }]}
            >
              <SelectComponent
                className={Classes["details-info-select"]}
                name="sub_reagent_code"
                placeholder={Dictionary.choose}
                items={
                  getFieldValue("reagent_code")
                    ? suppliers
                        ?.find((i) => i.value === getFieldValue("reagent_code"))
                        ?.sub_reagents?.map((v, index) => {
                          return {
                            id: index,
                            value: v.sub_reagent_code,
                            text: v.reagent_name_fa,
                          };
                        })
                    : []
                }
                disabled={!getFieldValue("reagent_code")}
              />
            </FormItemComponent>
          )}
        </FormItemComponent>
        <FormItemComponent
          className={Classes["form-item"]}
          name="amount"
          label={Dictionary.amount + " (" + Dictionary.rial + ")"}
          rules={[{ required: true, message: Dictionary.require }]}
        >
          <InputNumber
            name="amount"
            controls={false}
            style={{ width: "343px" }}
            placeholder={Dictionary.amount + " " + Dictionary.loan}
            formatter={(value) => value?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            className={`${inputClass["input-component"]} ${Classes["input-number"]}`}
          />
        </FormItemComponent>
        <FormItemComponent
          name="installment_number"
          className={Classes["form-item"]}
          rules={[{ required: true, message: Dictionary.require }]}
          label={Dictionary.quantity + " " + Dictionary.installments}
        >
          <InputComponent
            width={343}
            maxLength={3}
            whiteList={/[^0-9]/g}
            name="installment_number"
            className={Classes["inputModal"]}
            placeholder={Dictionary.quantity + " " + Dictionary.installments}
          />
        </FormItemComponent>
        <FormItemComponent
          name="branch_code"
          label={Dictionary.branch}
          className={Classes["form-item"]}
          rules={[{ required: true, message: Dictionary.require }]}
        >
          <Select
            showSearch
            name="branch_code"
            options={province}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={{ width: 343, height: 48 }}
            className={Classes["province-select"]}
            placeholder={Dictionary.choose}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            suffixIcon={
              <CustomIcon
                src={focus ? SearchIcon : DropDown}
                size={20}
                name="drop-down-icon-branch-province"
                color="#2B9570"
              />
            }
          />
        </FormItemComponent>
      </div>
      <FormItemComponent
        className={Classes["form-item"]}
        name="description"
        label={Dictionary.description + " (" + Dictionary.optional + ")"}
      >
        <InputComponent
          className={Classes["input-desc"]}
          width={730}
          placeholder={Dictionary.description}
          name="description"
          maxLength={80}
        />
      </FormItemComponent>
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
  );
};

export default Information;
