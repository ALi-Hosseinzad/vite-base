import React, { useEffect, useRef } from "react";
import { Form, InputNumber } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputComponent from "components/input/InputComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import Dictionary from "helpers/Dictionary";
import { useDispatch, useSelector } from "react-redux";
import { companies } from "store/reducers/companies/companiesReducer";
import Delete from "assets/images/icon/Delete.svg";
import Close from "assets/images/icon/Close.svg";
import Add from "assets/images/icon/Add.svg";
import Variables from "assets/styles/_Variables.scss";
import Classes from "views/companies/styles/companies.module.scss";
import {
  addPlan,
  editPlanOfCompany,
  getAllActiveBranches,
} from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import inputClass from "components/input/InputComponent.module.scss";
import SwitchComponent from "components/switch/SwitchComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";

const AddPlanModal = () => {
  const dispatch = useDispatch();
  const companiesData = useSelector((state) => state.companies.value);
  const {
    planList,
    initialPlanList,
    addPlanModal,
    record,
    reload,
    editStep,
    activeBranches,
    reloadDestinationList,
  } = companiesData;
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const formRef = useRef();

  useEffect(() => {
    if (editStep === "plan") {
      if (planList.length > 0) {
        const planData = planList.map((plan, planIndex) => ({
          [`${planIndex}isActive`]: plan.is_active,
          [`${planIndex}planName`]: plan.plan_name,
          [`${planIndex}planCode`]: plan.plan_code,
          [`${planIndex}mainAccountNumber`]: plan.account_number1,
          [`${planIndex}planLimitBudget`]: plan.plan_limit,
          [`${planIndex}loanType`]: plan.loan_type,
          [`${planIndex}settlement_interval`]: plan.settlement_interval,
          [`${planIndex}branch_code`]: plan.branch_code,
          [`${planIndex}company_loan_plan_settlement_detail_list`]:
            plan?.company_loan_plan_settlement_detail_list,
        }));
        const objectData = planData?.reduce((result, obj) => {
          return { ...result, ...obj };
        }, {});
        const settle = planList?.map((plan, planIndex) => ({
          [`${planIndex}company_loan_plan_settlement_detail_list`]:
            plan?.company_loan_plan_settlement_detail_list?.map((a, index) => ({
              [`${index}percent`]: a.percent,
              [`${index}days`]: a.days,
              [`${index}destination_account`]: a.destination_account,
            })),
        }));
        const newObj = settle?.map((item) =>
          Object.values(item)[0]?.length > 0
            ? Object.values(item)[0]?.reduce((acc, current) => {
                return { ...acc, ...current };
              })
            : false
        );
        const newSettle = planList?.map((plan, planIndex) => ({
          [`${planIndex}company_loan_plan_settlement_detail_list`]:
            newObj[planIndex],
        }));
        const objectData1 = newSettle?.reduce((result, obj) => {
          return { ...result, ...obj };
        }, {});
        form.setFieldsValue(objectData);
        form.setFieldsValue(objectData1);
      } else {
        form.resetFields();
        dispatch(companies({ planList: initialPlanList }));
      }
    } else {
      form.resetFields();
      dispatch(companies({ planList: initialPlanList }));
    }
  }, [addPlanModal, reloadDestinationList]);

  const closeModal = () => {
    if (editStep === "plan") {
      dispatch(companies({ addPlanModal: false }));
    } else {
      dispatch(companies({ addPlanModal: false, reload: !reload }));
    }
  };

  const onFinish = (values) => {
    const result = Object.keys(values).reduce((acc, key) => {
      const planIndex = key.match(/\d+/)[0];
      const propName = key.replace(/^\d+/, "");
      if (!acc[planIndex]) {
        acc[planIndex] = {};
      }
      acc[planIndex][propName] = values[key];
      return acc;
    }, []);
    const settle = result.map((item) =>
      Object.keys(item.company_loan_plan_settlement_detail_list).reduce(
        (acc, key) => {
          const planIndex = key.match(/\d+/)[0];
          const propName = key.replace(/^\d+/, "");
          if (!acc[planIndex]) {
            acc[planIndex] = {};
          }
          acc[planIndex][propName] =
            item.company_loan_plan_settlement_detail_list[key];
          return acc;
        },
        []
      )
    );
    const transformData = result.map((item, index) => ({
      account_number1: item.mainAccountNumber,
      account_number2: item.clearAccountNumber,
      is_active: item.isActive === undefined ? true : item.isActive,
      loan_type: item.loanType,
      plan_code: item.planCode,
      plan_limit: Number(item.planLimitBudget),
      plan_name: item.planName,
      settlement_interval: Number(item.settlement_interval),
      company_code: record.companyCode || record.company_code,
      branch_code: item.branch_code,
      company_loan_plan_settlement_detail_list: settle[index],
    }));
    const concat = planList.map((item, planIndex) => ({
      payback_period_values: item.payback_period_values,
      loan_amount_values: item.loan_amount_values,
      ...transformData[planIndex],
    }));
    if (editStep === "plan") {
      if (concat.length > record.plan_count) {
        editPlanOfCompany(concat.slice(0, record.plan_count))
          .then(() => addPlan(concat.slice(record.plan_count)))
          .then(() =>
            dispatch(
              companies({
                addPlanModal: false,
                addModal: false,
                reload: !reload,
                planList: [],
                record: "",
                editStep: "main",
              })
            )
          )
          .catch(() => errorHandler(errorResponse));
      } else {
        editPlanOfCompany(concat)
          .then(() =>
            dispatch(
              companies({
                addPlanModal: false,
                addModal: false,
                reload: !reload,
                planList: [],
                record: "",
                editStep: "main",
              })
            )
          )
          .catch(() => errorHandler(errorResponse));
      }
    } else {
      addPlan(concat)
        .then((res) =>
          dispatch(
            companies({
              addPlanModal: false,
              addModal: false,
              reload: !reload,
              planList: [],
              record: "",
              editStep: "main",
            })
          )
        )
        .catch(() => errorHandler(errorResponse));
    }
  };

  const generateRial = (item) =>
    Number(item)?.toLocaleString("en") + " " + Dictionary.rial;
  const generateMonth = (item) => item + " " + Dictionary.monthly;

  const handleAdd = (name, planIndex) => {
    const values = form.getFieldsValue();
    const list = [...planList];
    switch (name) {
      case "period":
        if (
          values[`${planIndex}payback_period_values`] &&
          !planList[planIndex]?.payback_period_values?.includes(
            Number(values[`${planIndex}payback_period_values`])
          )
        ) {
          list[planIndex] = {
            ...list[planIndex],
            payback_period_values: [
              ...list[planIndex]?.payback_period_values,
              Number(values[`${planIndex}payback_period_values`]),
            ],
          };
          dispatch(companies({ planList: [...list] }));
          form.setFieldsValue({ [`${planIndex}payback_period_values`]: "" });
        }
        break;
      case "amount":
        if (
          values[`${planIndex}loan_amount_values`] &&
          !planList[planIndex]?.loan_amount_values?.includes(
            Number(values[`${planIndex}loan_amount_values`])
          )
        ) {
          list[planIndex] = {
            ...list[planIndex],
            loan_amount_values: [
              ...list[planIndex].loan_amount_values,
              Number(values[`${planIndex}loan_amount_values`]),
            ],
          };
          dispatch(companies({ planList: [...list] }));
          form.setFieldsValue({ [`${planIndex}loan_amount_values`]: "" });
        }
        break;
      case "active":
        list[planIndex] = {
          ...list[planIndex],
          is_active: values[`${planIndex}isActive`],
        };
        dispatch(companies({ planList: [...list] }));
        form.setFieldsValue({
          [`${planIndex}isActive`]: values[`${planIndex}isActive`],
        });
        break;
    }
  };

  const handleRemove = (fieldIndex, planIndex, name) => {
    const filteredValues = [...planList];
    switch (name) {
      case "period":
        filteredValues[planIndex] = {
          ...filteredValues[planIndex],
          payback_period_values: [
            ...filteredValues[planIndex].payback_period_values.filter(
              (_, index) => index !== fieldIndex
            ),
          ],
        };
        dispatch(companies({ planList: filteredValues }));
        break;
      case "amount":
        filteredValues[planIndex] = {
          ...filteredValues[planIndex],
          loan_amount_values: [
            ...filteredValues[planIndex].loan_amount_values.filter(
              (_, index) => index !== fieldIndex
            ),
          ],
        };
        dispatch(companies({ planList: filteredValues }));
        break;
    }
  };

  const removePlan = (item) => {
    const filteredPlans = planList.filter((_, index) => index !== item);
    dispatch(companies({ planList: filteredPlans }));
  };

  const addAnotherPlan = () => {
    dispatch(companies({ planList: [...planList, ...initialPlanList] }));
  };

  const addSettlementInfo = (planIndex) => {
    const list = [...planList];
    list[planIndex] = {
      ...list[planIndex],
      company_loan_plan_settlement_detail_list: [
        ...list[planIndex]?.company_loan_plan_settlement_detail_list,
        { days: null, destination_account: null, percent: null },
      ],
    };
    dispatch(companies({ planList: [...list] }));
  };

  const removeSettlementInfo = (item, fieldIndex, planIndex) => {
    const filteredValues = [...planList];
    filteredValues[planIndex] = {
      ...filteredValues[planIndex],
      company_loan_plan_settlement_detail_list: [
        ...filteredValues[
          planIndex
        ].company_loan_plan_settlement_detail_list.filter(
          (a, index) => index !== fieldIndex
        ),
      ],
    };
    editStep === "plan"
      ? dispatch(
          companies({
            planList: filteredValues,
            reloadDestinationList: !reloadDestinationList,
          })
        )
      : dispatch(companies({ planList: filteredValues }));
  };

  useEffect(() => {
    if (activeBranches.length === 0) {
      const activeBranches = [];
      getAllActiveBranches()
        .then((res) =>
          res.data.forEach((element) => {
            activeBranches.push({
              id: element.id,
              value: element.branch_code,
              text: `${element.branch_code} ${element.branch_name}`,
            });
          })
        )
        .then(() => dispatch(companies({ activeBranches: activeBranches })))
        .catch(() => errorHandler(errorResponse));
    }
  }, []);

  return (
    <ModalComponent
      className={Classes["add-plan-modal"]}
      width={918}
      title={
        editStep === "plan"
          ? `${Dictionary.editCompanyAndPlan} ${record?.company_name}`
          : Dictionary.addCompanyAndPlan
      }
      open={addPlanModal}
      onCancel={closeModal}
    >
      <FormComponent
        layout="vertical"
        form={form}
        onFinish={onFinish}
        ref={formRef}
        requiredMark={false}
        style={{ border: "none" }}
      >
        {planList?.map((plan, planIndex) => {
          return (
            <div key={planIndex} className={Classes["plan-container"]}>
              <div className={Classes["plan-title"]}>
                <p>
                  {Dictionary.plan} {planIndex + 1}
                </p>
                <div>
                  {editStep === "plan" && plan?.plan_code ? (
                    <FormItemComponent
                      name={`${planIndex}isActive`}
                      className={Classes["switch-plan"]}
                    >
                      <SwitchComponent
                        checked={plan.is_active}
                        onChange={() => handleAdd("active", planIndex)}
                      />
                    </FormItemComponent>
                  ) : (
                    <CustomIcon
                      src={Delete}
                      name="delete-icon-for-plans"
                      size={22}
                      onClick={() =>
                        planList.length !== 1 && removePlan(planIndex)
                      }
                      color={planList.length === 1 && Variables.NotifPink}
                    />
                  )}
                </div>
              </div>
              <div className={Classes["row"]}>
                <FormItemComponent
                  name={`${planIndex}planName`}
                  label={Dictionary.name + " " + Dictionary.plan}
                  rules={[
                    {
                      required: true,
                      message: Dictionary.require,
                    },
                    { min: 2, max: 50, message: Dictionary.checkInput },
                    {
                      pattern: /^[\u0600-\u06FF\s]+$/,
                      message: Dictionary.onlyFarsi,
                    },
                  ]}
                >
                  <InputComponent
                    width={343}
                    name={`${planIndex}planName`}
                    placeholder={Dictionary.name + " " + Dictionary.plan}
                    className={Classes["add-company-input"]}
                  />
                </FormItemComponent>
                <FormItemComponent
                  name={`${planIndex}planCode`}
                  label={Dictionary.key + " " + Dictionary.plan}
                  rules={[
                    {
                      required: true,
                      message: Dictionary.require,
                    },
                  ]}
                >
                  <InputComponent
                    width={343}
                    name={`${planIndex}planCode`}
                    placeholder={Dictionary.key + " " + Dictionary.plan}
                    className={Classes["add-company-input-company-code"]}
                    disabled={editStep === "plan" && plan?.plan_code}
                  />
                </FormItemComponent>
              </div>
              <div className={Classes["row"]}>
                <FormItemComponent
                  name={`${planIndex}mainAccountNumber`}
                  label={Dictionary.mainAccountNumber}
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
                      min: 13,
                      message: Dictionary.checkInput,
                    },
                  ]}
                >
                  <InputComponent
                    maxLength="13"
                    width={343}
                    name={`${planIndex}mainAccountNumber`}
                    placeholder={Dictionary.mainAccountNumber}
                    className={Classes["add-company-input"]}
                  />
                </FormItemComponent>
                <FormItemComponent
                  name={`${planIndex}planLimitBudget`}
                  label={`${Dictionary.planLimitBudget} (${Dictionary.rial})`}
                  rules={[
                    {
                      required: true,
                      message: Dictionary.require,
                    },
                    {
                      pattern: /^[0-9]+$/,
                      message: Dictionary.checkInput,
                    },
                  ]}
                >
                  <InputNumber
                    controls={false}
                    formatter={(value) =>
                      value?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "343px" }}
                    name={`${planIndex}planLimitBudget`}
                    placeholder={Dictionary.planLimitBudget}
                    className={`${inputClass["input-component"]} ${Classes["add-company-input-number"]}`}
                  />
                </FormItemComponent>
              </div>
              {plan?.company_loan_plan_settlement_detail_list?.map(
                (item, order) => (
                  <div
                    className={Classes["row"]}
                    style={{ marginBottom: "0px" }}
                  >
                    <FormItemComponent
                      name={[
                        `${planIndex}company_loan_plan_settlement_detail_list`,
                        `${order}destination_account`,
                      ]}
                      label={`${Dictionary.clearAccountNumber} ${order + 1}`}
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
                          min: 13,
                          message: Dictionary.checkInput,
                        },
                      ]}
                    >
                      <InputComponent
                        maxLength="13"
                        value={item.destination_account}
                        width={343}
                        placeholder={`${Dictionary.clearAccountNumber} ${
                          order + 1
                        }`}
                        className={Classes["add-company-input"]}
                      />
                    </FormItemComponent>
                    <div className={Classes["b2b-container"]}>
                      <FormItemComponent
                        name={[
                          `${planIndex}company_loan_plan_settlement_detail_list`,
                          `${order}days`,
                        ]}
                        label={Dictionary.numberOfSettlementDays}
                        rules={[
                          {
                            required: true,
                            message: Dictionary.require,
                          },
                          {
                            pattern: /^[0-9]+$/,
                            message: Dictionary.checkInput,
                          },
                        ]}
                      >
                        <InputComponent
                          value={item.days}
                          width={140}
                          placeholder={Dictionary.numberOfSettlementDays}
                          className={Classes["add-company-input"]}
                        />
                      </FormItemComponent>
                      <FormItemComponent
                        name={[
                          `${planIndex}company_loan_plan_settlement_detail_list`,
                          `${order}percent`,
                        ]}
                        label={Dictionary.percentage}
                        rules={[
                          {
                            required: true,
                            message: "فیلد اجباری",
                          },
                          {
                            pattern: /^[0-9]+$/,
                            message: "عددی باشد",
                          },
                        ]}
                      >
                        <InputComponent
                          value={item.percent}
                          width={140}
                          placeholder={Dictionary.percentage}
                          className={Classes["add-company-input"]}
                          suffix={"%"}
                          maxLength="3"
                        />
                      </FormItemComponent>
                      {order === 0 ? (
                        <CustomIcon
                          src={Add}
                          size={20}
                          name="add-list-of-settlement-info"
                          onClick={() => addSettlementInfo(planIndex)}
                        />
                      ) : (
                        <CustomIcon
                          src={Close}
                          size={20}
                          name="delete-list-of-settlement-info"
                          onClick={() =>
                            removeSettlementInfo(item, order, planIndex)
                          }
                          color={Variables.NotifRed}
                        />
                      )}
                    </div>
                  </div>
                )
              )}
              <div className={Classes["row"]}>
                <FormItemComponent
                  name={`${planIndex}loanType`}
                  label={Dictionary.loanTypeCode}
                  rules={[
                    {
                      required: true,
                      message: Dictionary.require,
                    },
                    {
                      pattern: /^[0-9]+$/,
                      message: Dictionary.checkInput,
                    },
                  ]}
                >
                  <InputComponent
                    width={343}
                    name={`${planIndex}loanType`}
                    placeholder={Dictionary.loanTypeCode}
                    className={Classes["add-company-input"]}
                  />
                </FormItemComponent>
                <FormItemComponent
                  name={`${planIndex}branch_code`}
                  label={`${Dictionary.branchCode} عامل`}
                  rules={[
                    {
                      required: true,
                      message: Dictionary.require,
                    },
                  ]}
                >
                  <SelectComponent
                    className={Classes["select-branch"]}
                    name={`${planIndex}branch_code`}
                    width={343}
                    placeholder={`${Dictionary.branchCode} عامل`}
                    items={activeBranches}
                    prefix
                  />
                </FormItemComponent>
              </div>
              <div className={Classes["row"]} style={{ marginBottom: "0px" }}>
                <FormItemComponent
                  name={`${planIndex}payback_period_values`}
                  label={`${Dictionary.paybackPeriodValues} (${Dictionary.month})`}
                  rules={[
                    {
                      pattern: /^[0-9]+$/,
                      message: Dictionary.checkInput,
                    },
                  ]}
                >
                  <InputComponent
                    className={Classes["add-company-input"]}
                    width={343}
                    name={`${planIndex}payback_period_values`}
                    suffix={
                      <CustomIcon
                        src={Add}
                        size={24}
                        onClick={() => handleAdd("period", planIndex)}
                      />
                    }
                    maxLength="2"
                  />
                </FormItemComponent>
                <FormItemComponent
                  name={`${planIndex}loan_amount_values`}
                  label={`${Dictionary.loanAmountValues} (${Dictionary.rial})`}
                  rules={[
                    {
                      pattern: /^[0-9]+$/,
                      message: Dictionary.checkInput,
                    },
                    {
                      max: 15,
                      message: Dictionary.maxSize15,
                    },
                  ]}
                >
                  <InputComponent
                    className={Classes["add-company-input"]}
                    width={343}
                    name={`${planIndex}loan_amount_values`}
                    suffix={
                      <CustomIcon
                        src={Add}
                        size={24}
                        onClick={() => handleAdd("amount", planIndex)}
                      />
                    }
                  />
                </FormItemComponent>
              </div>
              {/* chips value */}
              <div className={Classes["row"]} style={{ marginBottom: "0px" }}>
                <div className={Classes["chips-container"]}>
                  {plan.payback_period_values?.length > 0 &&
                    plan.payback_period_values?.map((item, ind) => (
                      <p className={Classes["add-input-list-chip"]}>
                        <CustomIcon
                          src={Close}
                          color={Variables.GreyDark3}
                          onClick={() => handleRemove(ind, planIndex, "period")}
                        />
                        <span>{generateMonth(item)}</span>
                      </p>
                    ))}
                </div>
                <div className={Classes["chips-container"]}>
                  {plan.loan_amount_values?.length > 0 &&
                    plan.loan_amount_values?.map((item, ind) => (
                      <p className={Classes["add-input-list-chip"]}>
                        <CustomIcon
                          src={Close}
                          color={Variables.GreyDark3}
                          onClick={() => handleRemove(ind, planIndex, "amount")}
                        />
                        <span>{generateRial(item)}</span>
                      </p>
                    ))}
                </div>
              </div>
            </div>
          );
        })}
        <div
          className={Classes["add-another-plan"]}
          onClick={() => addAnotherPlan()}
        >
          <CustomIcon src={Add} />
          <p>{Dictionary.addAnotherPlan}</p>
        </div>
        <FormItemComponent
          shouldUpdate
          button
          className={Classes["add-company-buttons"]}
        >
          <ButtonComponent
            type="primary"
            htmlType="submit"
            classNameBtn={Classes["confirm-button"]}
          >
            {Dictionary.confirm}
          </ButtonComponent>
          <ButtonComponent
            type="default"
            classNameBtn={Classes["cancel-button"]}
            onClick={closeModal}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default AddPlanModal;
