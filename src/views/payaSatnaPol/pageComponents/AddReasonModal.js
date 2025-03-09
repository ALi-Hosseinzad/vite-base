import React, { useEffect, useRef } from "react";
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
import { addNewReason, editReason } from "helpers/APIFunction";
import { setNotificationData } from "store/reducers/toast/toastReducer";

const AddReasonModal = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const payaSatnaPolData = useSelector(payaSatnaPolState);
  const { record, type, is_enabled, reload, showAddReason } = payaSatnaPolData;

  useEffect(() => {
    form.resetFields();
    if (record && type === "edit") {
      form.setFieldsValue({
        reason_description: record?.reason_description,
        reason: record?.reason,
        pol_reason: record?.pol_reason,
      });
      dispatch(payaSatnaPol({ is_enabled: record?.is_enabled }));
    }
  }, [record, type]);

  const onFinish = (values) => {
    if (type === "add") {
      if (
        values.reason_description === "" &&
        values.reason === "" &&
        values.pol_reason === ""
      ) {
        dispatch(
          setNotificationData({
            message: Dictionary.chooseOneAtLeast,
            type: "error",
            time: 3000,
          })
        );
      } else if (values.reason === "" && values.pol_reason === "") {
        dispatch(
          setNotificationData({
            message: Dictionary.chooseOneReason,
            type: "error",
            time: 3000,
          })
        );
      } else {
        addNewReason({
          reason_description: values.reason_description,
          reason: values.reason || null,
          pol_reason: values.pol_reason || null,
          is_enabled: is_enabled,
        })
          .then(() => {
            dispatch(
              payaSatnaPol({
                showAddReason: false,
                is_enabled: false,
                type: "",
                reload: !reload,
              })
            );
          })
          .catch(() => {
            errorHandler(errorResponse);
          });
      }
    } else if (type === "edit") {
      if (
        values.reason_description === record?.reason_description &&
        values.reason === record?.reason &&
        values.pol_reason === record?.pol_reason &&
        is_enabled === record?.is_enabled
      ) {
        dispatch(
          setNotificationData({
            message: Dictionary.chooseOneAtLeast,
            type: "error",
            time: 3000,
          })
        );
      } else if (values.reason === "" && values.pol_reason === "") {
        dispatch(
          setNotificationData({
            message: Dictionary.chooseOneReason,
            type: "error",
            time: 3000,
          })
        );
      } else {
        editReason({
          id: record.id,
          reason_description: values.reason_description,
          reason: values.reason || null,
          pol_reason: values.pol_reason || null,
          is_enabled: is_enabled,
        })
          .then(() => {
            dispatch(
              payaSatnaPol({
                showAddReason: false,
                record: "",
                is_enabled: false,
                type: "",
                reload: !reload,
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
      title={`${type === "add" ? Dictionary.add : Dictionary.edit} ${
        Dictionary.reason
      } ${Dictionary.transfer} ${Dictionary.satna} ${Dictionary.and} ${
        Dictionary.paya
      } ${Dictionary.and} ${Dictionary.pol}`}
      open={showAddReason}
      maskClosable={false}
      onCancel={() => {
        dispatch(payaSatnaPol({ showAddReason: false, record: "" }));
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
        <div className={Classes["row-2"]}>
          <FormItemComponent
            name="reason_description"
            label={Dictionary.title + " " + Dictionary.reason}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                pattern: /^[\u0600-\u06FF\-‌ s]+$/,
                message: Dictionary.onlyFarsi,
              },
            ]}
          >
            <InputComponent
              width={343}
              placeholder={Dictionary.title + " " + Dictionary.reason}
            />
          </FormItemComponent>
          <FormItemComponent name="is_enabled">
            <div
              className={Classes["switch-container"]}
              style={{ marginTop: "16px" }}
            >
              <span>{Dictionary.statusEnable}</span>
              <SwitchComponent
                defaultChecked={is_enabled}
                onChange={() =>
                  dispatch(payaSatnaPol({ is_enabled: !is_enabled }))
                }
              />
            </div>
          </FormItemComponent>
        </div>
        <div className={Classes["row-2"]}>
          <FormItemComponent
            name="reason"
            label={`${Dictionary.code} ${Dictionary.reason} ${Dictionary.satna} ${Dictionary.and} ${Dictionary.paya}`}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                pattern: /^[0-9]+$/,
                message: Dictionary.onlyNumber,
              },
              { max: 3, message: Dictionary.codeError },
            ]}
          >
            <InputComponent
              className={Classes["input-modal"]}
              width={343}
              placeholder={`${Dictionary.code} ${Dictionary.reason} ${Dictionary.satna} ${Dictionary.and} ${Dictionary.paya}`}
            />
          </FormItemComponent>
          <FormItemComponent
            name="pol_reason"
            label={`${Dictionary.code} ${Dictionary.reason} ${Dictionary.pol}`}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                pattern: /^[0-9]+$/,
                message: Dictionary.onlyNumber,
              },
              { max: 3, message: Dictionary.codeError },
            ]}
          >
            <InputComponent
              className={Classes["input-modal"]}
              width={343}
              placeholder={`${Dictionary.code} ${Dictionary.reason} ${Dictionary.pol}`}
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
              dispatch(payaSatnaPol({ showAddReason: false, record: "" }));
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

export default AddReasonModal;
