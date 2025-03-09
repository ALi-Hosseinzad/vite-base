import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputComponent from "components/input/InputComponent";
import Dictionary from "helpers/Dictionary";
import Classes from "views/payaSatnaPol/styles/ReasonList.module.scss";
import SwitchComponent from "components/switch/SwitchComponent";
import ButtonComponent from "components/button/ButtonComponent";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import ModalComponent from "components/modalComponent/ModalComponent";
import {
  payaSatnaPol,
  payaSatnaPolState,
} from "store/reducers/payaSatnaPol/PayaSatnaPolReducer";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { editSettingPayaSatna } from "helpers/APIFunction";

const EditSettingModal = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const payaSatnaPolData = useSelector(payaSatnaPolState);
  const { record, is_control, reloadDaily, showEditSettingModal } =
    payaSatnaPolData;

  useEffect(() => {
    form.resetFields();
    if (record) {
      form.setFieldsValue({
        start_time: record?.start_time,
        end_time: record?.end_time,
        weekday_desc: record?.weekday_desc,
      });
      dispatch(payaSatnaPol({ is_control: record?.is_controled }));
    }
  }, [record]);

  const TimeCompare = (t1, t2) => {
    const startTime = t1?.split(":");
    const endTime = t2?.split(":");
    if (t1 === t2) {
      return "isEqual";
    } else {
      if (Number(startTime[0]) > Number(endTime[0])) {
        return "isBigger";
      } else if (
        Number(startTime[0]) === Number(endTime[0]) &&
        Number(startTime[1]) > Number(endTime[1])
      ) {
        return "isBigger";
      } else if (
        Number(startTime[0]) === Number(endTime[0]) &&
        Number(startTime[1]) === Number(endTime[1]) &&
        Number(startTime[2]) > Number(endTime[2])
      ) {
        return "isBigger";
      } else {
        return false;
      }
    }
  };
  const onFinish = (values) => {
    if (
      is_control === record.is_controled &&
      values.end_time === record.end_time &&
      values.start_time === record.start_time
    ) {
      dispatch(
        setNotificationData({
          message: Dictionary.chooseOneAtLeast,
          type: "error",
          time: "3000",
        })
      );
    } else {
      const check = TimeCompare(values.start_time, values.end_time);
      if (check) {
        dispatch(
          setNotificationData({
            message:
              check === "isEqual"
                ? Dictionary.dontBeEqual
                : Dictionary.startCantBeBiggerThanEnd,
            type: "error",
            time: "3000",
          })
        );
      } else {
        editSettingPayaSatna({
          weekday: record.weekday,
          start_time: values.start_time,
          end_time: values.end_time,
          is_controled: is_control,
        })
          .then(() => {
            dispatch(
              payaSatnaPol({
                showEditSettingModal: false,
                record: "",
                is_control: false,
                reloadDaily: !reloadDaily,
              })
            );
          })
          .catch(() => {
            errorHandler(errorResponse);
          });
      }
    }
  };

  return (
    <ModalComponent
      className={Classes["add-modal"]}
      title={`${Dictionary.edit} ${Dictionary.hour} ${Dictionary.control} ${Dictionary.daily} ${Dictionary.satna}`}
      open={showEditSettingModal}
      maskClosable={false}
      onCancel={() => {
        dispatch(
          payaSatnaPol({
            showEditSettingModal: false,
            record: "",
            is_control: false,
          })
        );
        form.resetFields();
      }}
    >
      <FormComponent
        className={Classes["form-edit-menu"]}
        layout="vertical"
        form={form}
        ref={formRef}
        onFinish={onFinish}
        requiredMark={false}
      >
        <div className={Classes["row"]}>
          <FormItemComponent name="weekday_desc" label={Dictionary.day}>
            <InputComponent
              width={343}
              className={Classes["input-modal"]}
              placeholder={Dictionary.day}
              disabled
            />
          </FormItemComponent>
          <FormItemComponent name="is_control">
            <div className={Classes["switch-container"]}>
              <span>
                {Dictionary.status} {Dictionary.control} /{" "}
                {Dictionary.deControl}
              </span>
              <SwitchComponent
                defaultChecked={is_control}
                onChange={() =>
                  dispatch(payaSatnaPol({ is_control: !is_control }))
                }
              />
            </div>
          </FormItemComponent>
        </div>
        <div className={Classes["row-2"]}>
          <FormItemComponent
            name="start_time"
            label={Dictionary.hour + " " + Dictionary.start}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                pattern: /(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/,
                message: Dictionary.onlyHour,
              },
            ]}
          >
            <InputComponent
              maxLength={8}
              className={Classes["input-modal"]}
              width={343}
              placeholder={Dictionary.hour + " " + Dictionary.end}
            />
          </FormItemComponent>
          <FormItemComponent
            name="end_time"
            label={Dictionary.hour + " " + Dictionary.end}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                pattern: /(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/,
                message: Dictionary.onlyHour,
              },
            ]}
          >
            <InputComponent
              maxLength={8}
              className={Classes["input-modal"]}
              width={343}
              placeholder={Dictionary.hour + " " + Dictionary.end}
            />
          </FormItemComponent>
        </div>

        <FormItemComponent
          shouldUpdate
          button
          className={Classes["edit-menu-buttons"]}
        >
          <ButtonComponent
            type="primary"
            htmlType="submit"
            classNameBtn={Classes["menu-edit-modal-confirm-button"]}
          >
            {Dictionary.confirm}
          </ButtonComponent>
          <ButtonComponent
            classNameBtn={Classes["menu-edit-modal-cancel-button"]}
            type="default"
            onClick={() => {
              dispatch(
                payaSatnaPol({
                  showEditSettingModal: false,
                  record: "",
                  is_control: false,
                })
              );
              form.resetFields();
            }}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default EditSettingModal;
