import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Form } from "antd";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputComponent from "components/input/InputComponent";
import { ConvertToLetters } from "helpers/ConvertToLetters";
import Classes from "views/limitation/styles/limitation.module.scss";
import Dictionary from "helpers/Dictionary";
import ButtonComponent from "components/button/ButtonComponent";
import {
  limitation,
  resetLimitation,
} from "store/reducers/limitation/limitationReducer";
import CustomerInfoInput from "./CustomerInfoInput";
import cx from "classnames";
import {
  addCustomerLimit,
  editCustomerLimit,
  getCustomerName,
} from "helpers/APIFunction";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";

const AddCustomerLimit = ({ resetSearch }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const listLimitData = useSelector((state) => state.limitation.value);
  const record = listLimitData.record;
  const errorHandler = useErrorHandler();

  useEffect(() => {
    form.setFieldsValue({
      fullname: record?.fullname,
    });
  }, [listLimitData.editModal]);
  const inputFields = [
    {
      name: "total_daily",
      id: "total_daily",
      label: `${Dictionary.maxTransLimit} ${Dictionary.daily}`,
      bottomText: ConvertToLetters(String(listLimitData?.record?.total_daily)),
      value: record?.total_daily
        ? record?.total_daily?.toLocaleString("en")
        : "",
      current: listLimitData?.currentTotalDaily?.toLocaleString("en"),
    },
    {
      name: "internal_daily",
      label: (
        <p
          style={{ justifyContent: "flex-start" }}
          className={Classes["totalDaily"]}
        >
          {Dictionary.maxTransfer}{" "}
          <span className={Classes["bold"]}> {Dictionary.internal} </span>{" "}
          {Dictionary.daily}
        </p>
      ),
      bottomText: ConvertToLetters(
        String(listLimitData?.record?.internal_daily)
      ),
      value: record?.internal_daily
        ? record?.internal_daily?.toLocaleString("en")
        : "",
    },
    {
      name: "satna_daily",
      label: (
        <p
          style={{ justifyContent: "flex-start" }}
          className={Classes["totalDaily"]}
        >
          {Dictionary.maxTransfer}{" "}
          <span className={Classes["bold"]}> {Dictionary.satna} </span>{" "}
          {Dictionary.daily}
        </p>
      ),
      bottomText: ConvertToLetters(String(listLimitData?.record?.satna_daily)),
      value: record?.satna_daily
        ? record?.satna_daily?.toLocaleString("en")
        : "",
    },
    {
      name: "paya_daily",
      label: (
        <p
          style={{ justifyContent: "flex-start" }}
          className={Classes["totalDaily"]}
        >
          {Dictionary.maxTransfer}{" "}
          <span className={Classes["bold"]}> {Dictionary.paya} </span>{" "}
          {Dictionary.daily}
        </p>
      ),
      bottomText: ConvertToLetters(String(listLimitData?.record?.paya_daily)),
      value: record?.paya_daily ? record?.paya_daily?.toLocaleString("en") : "",
    },
    {
      name: "total_paya_satna_daily",
      label: Dictionary.totalPayaSatnaDaily,
      bottomText: ConvertToLetters(
        String(listLimitData?.record?.total_paya_satna_daily)
      ),
      value: record?.total_paya_satna_daily
        ? record?.total_paya_satna_daily?.toLocaleString("en")
        : "",
    },
    {
      name: "batch_daily",
      label: (
        <p
          style={{ justifyContent: "flex-start" }}
          className={Classes["totalDaily"]}
        >
          {Dictionary.maxTransfer}{" "}
          <span className={Classes["bold"]}> {Dictionary.batch} </span>{" "}
          {Dictionary.daily}
        </p>
      ),
      bottomText: ConvertToLetters(String(listLimitData?.record?.batch_daily)),
      value: record?.batch_daily
        ? record?.batch_daily?.toLocaleString("en")
        : "",
    },
    {
      name: "pol_daily",
      label: (
        <p
          style={{ justifyContent: "flex-start" }}
          className={Classes["totalDaily"]}
        >
          {Dictionary.maxTransfer}{" "}
          <span className={Classes["bold"]}> {Dictionary.pol} </span>{" "}
          {Dictionary.daily}
        </p>
      ),
      bottomText: ConvertToLetters(String(listLimitData?.record?.pol_daily)),
      value: record?.pol_daily ? record?.pol_daily?.toLocaleString("en") : "",
    },
  ];

  // ?.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const handleChangeLimit = (e, item) => {
    dispatch(
      limitation({
        record: {
          ...listLimitData.record,
          [item]: e.target.value
            ?.replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        },
      })
    );
  };

  const onFinish = () => {
    if (
      !listLimitData.record?.total_daily &&
      !listLimitData.record?.internal_daily &&
      !listLimitData.record?.paya_daily &&
      !listLimitData.record?.satna_daily &&
      !listLimitData.record?.total_paya_satna_daily &&
      !listLimitData.record?.batch_daily &&
      !listLimitData.record?.pol_daily
    ) {
      dispatch(
        setNotificationData({
          message: Dictionary.oneItemHasValueAtleast,
          type: "error",
          time: 5000,
        })
      );
    } else if (listLimitData.state === "add") {
      addCustomerLimit({
        ...record,
        internal_daily: record.internal_daily
          ? String(record?.internal_daily)?.split(",").join("")
          : null,
        paya_daily: record.paya_daily
          ? String(record?.paya_daily)?.split(",").join("")
          : null,
        satna_daily: record.satna_daily
          ? String(record?.satna_daily)?.split(",").join("")
          : null,
        total_daily: record.total_daily
          ? String(record?.total_daily)?.split(",").join("")
          : null,
        total_paya_satna_daily: record.total_paya_satna_daily
          ? String(record?.total_paya_satna_daily)?.split(",").join("")
          : null,
        batch_daily: record.batch_daily
          ? String(record?.batch_daily)?.split(",").join("")
          : null,
        pol_daily: record.pol_daily
          ? String(record?.pol_daily)?.split(",").join("")
          : null,
      })
        .then(() => {
          dispatch(
            resetLimitation({
              permissions: listLimitData.permissions,
              vipPermissions: listLimitData.vipPermissions,
            })
          );
          dispatch(
            setNotificationData({
              message: Dictionary.successfullyDone,
              type: "success",
              time: 5000,
            })
          );
        })
        .catch(() => errorHandler(errorResponse));
    } else if (listLimitData.state === "edit") {
      editCustomerLimit({
        ...record,
        internal_daily: record.internal_daily
          ? String(record?.internal_daily)?.split(",").join("")
          : null,
        paya_daily: record.paya_daily
          ? String(record?.paya_daily)?.split(",").join("")
          : null,
        satna_daily: record.satna_daily
          ? String(record?.satna_daily)?.split(",").join("")
          : null,
        total_daily: record.total_daily
          ? String(record?.total_daily)?.split(",").join("")
          : null,
        total_paya_satna_daily: record.total_paya_satna_daily
          ? String(record?.total_paya_satna_daily)?.split(",").join("")
          : null,
        batch_daily: record.batch_daily
          ? String(record?.batch_daily)?.split(",").join("")
          : null,
        pol_daily: record.pol_daily
          ? String(record?.pol_daily)?.split(",").join("")
          : null,
      })
        .then(() => {
          dispatch(
            resetLimitation({
              permissions: listLimitData.permissions,
              vipPermissions: listLimitData.vipPermissions,
            })
          );
          dispatch(
            setNotificationData({
              message: Dictionary.successfullyDone,
              type: "success",
              time: 5000,
            })
          );
          resetSearch();
        })
        .catch(() => errorHandler(errorResponse));
    }
  };

  const getInfo = (values) => {
    getCustomerName(values.identificationCode)
      .then((res) => {
        dispatch(
          limitation({
            record: { ...listLimitData.record, ...res.data },
            addStep: 1,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };
  const onCancelButton = () =>
    dispatch(limitation({ addModal: false, addStep: 0 }));
  return listLimitData.addStep === 0 ? (
    <CustomerInfoInput
      onClickButton={getInfo}
      onCancelButton={onCancelButton}
    />
  ) : (
    <>
      <div className={Classes["add-customer-modal-container"]}>
        <Form
          layout="vertical"
          form={form}
          ref={formRef}
          requiredMark={false}
          onFinish={onFinish}
        >
          <div className={Classes["add-customer-limit-row"]}>
            <FormItemComponent
              name="identificationCode"
              label={Dictionary.nationalIdCode}
            >
              <InputComponent
                className={Classes["add-customer-limit-modal-input"]}
                style={{ direction: "ltr", width: "343px" }}
                defaultValue={listLimitData.record?.identification_code}
                placeholder={Dictionary.nationalIdCode}
                disabled
              />
            </FormItemComponent>
            <FormItemComponent name="fullname" label={Dictionary.fullName}>
              <InputComponent
                width={343}
                className={Classes["add-customer-limit-modal-input"]}
                defaultValue={listLimitData.record?.fullname}
                placeholder={Dictionary.fullName}
                disabled
              />
            </FormItemComponent>
          </div>
          <Divider className={Classes["divider"]} />
          <p className={Classes["add-customer-limit-modal-hint"]}>
            {Dictionary.CustomerLimitationHint}
          </p>
          <div className={Classes["add-customer-limit-row"]}>
            {inputFields.map((item) => (
              <div
                key={item.name}
                className={cx(
                  Classes["add-customer-limit-modal-input-container"],
                  { [Classes["add-customer-limit-error-input"]]: item.error }
                )}
              >
                <label name={item.name}>
                  {item.label}
                  <span className={Classes["add-customer-limit-current-total"]}>
                    {item.current
                      ? `${Dictionary.current}: ${item.current}`
                      : ""}
                  </span>
                </label>
                <input
                  width={343}
                  onChange={(e) => handleChangeLimit(e, item.name)}
                  {...item}
                  autoComplete="off"
                />
                {item.value && (
                  <p className={Classes["add-customer-limit-num-to-letter"]}>
                    {item?.bottomText}
                  </p>
                )}
              </div>
            ))}
          </div>
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
              onClick={() =>
                dispatch(
                  limitation({ record: "", addModal: false, editModal: false })
                )
              }
            >
              {Dictionary.cancel}
            </ButtonComponent>
          </FormItemComponent>
        </Form>
      </div>
    </>
  );
};

export default AddCustomerLimit;
