import { Form } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputComponent from "components/input/InputComponent";
import SwitchComponent from "components/switch/SwitchComponent";
import {
  editAnonymousService,
  editAuthenticationService,
} from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import Dictionary from "helpers/Dictionary";
import useErrorHandler from "helpers/useErrorHandler";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { services } from "store/reducers/servicesManagement/servicesReducer";
import Classes from "views/servicesManagement/styles/editService.module.scss";

const EditService = () => {
  const servicesData = useSelector((state) => state.services.value);
  const record = servicesData.record;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();

  const onFinish = () => {
    if (record.is_for_mobile || record.is_for_web || record.is_for_pwa) {
      if (servicesData.serviceType === "AUTHENTICATED") {
        editAuthenticationService({
          facility_key: record.facility_key,
          is_for_pwa: record.is_for_pwa ? 1 : 0,
          is_for_web: record.is_for_web ? 1 : 0,
          is_for_mobile: record.is_for_mobile ? 1 : 0,
          allow_user_disable: record.allow_user_disable ? 1 : 0,
          is_biometric: record.is_biometric_available ? 1 : 0,
        })
          .then(() =>
            dispatch(
              services({
                editModal: false,
                record: "",
                reload: !servicesData.reload,
              })
            )
          )
          .catch(() => errorHandler(errorResponse));
      } else if (servicesData.serviceType === "ANONYMOUS") {
        editAnonymousService({
          facility_key: record.facility_key,
          is_for_pwa: record.is_for_pwa ? 1 : 0,
          is_for_web: record.is_for_web ? 1 : 0,
          is_for_mobile: record.is_for_mobile ? 1 : 0,
          allow_user_disable: record.allow_user_disable ? 1 : 0,
          is_biometric: record.is_biometric_available ? 1 : 0,
        })
          .then(() =>
            dispatch(
              services({
                editModal: false,
                record: "",
                reload: !servicesData.reload,
              })
            )
          )
          .catch(() => errorHandler(errorResponse));
      }
    } else {
      dispatch(services({ editModal: false, warningModal: true }));
    }
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      facilityDescription: record?.facility_description,
      facilityKey: record?.facility_key,
      allowUserDisable: record?.allow_user_disable,
      isBiometricAvailable: record?.is_biometric_available,
      isForMobile: record?.is_for_mobile,
      isForWeb: record?.is_for_web,
      isForPwa: record?.is_for_pwa,
    });
  }, [servicesData.editModal]);

  return (
    <div>
      <FormComponent
        className={Classes["form-edit-service"]}
        layout="vertical"
        form={form}
        ref={formRef}
        onFinish={onFinish}
        requiredMark={false}
      >
        <div className={Classes["row"]}>
          <FormItemComponent
            name="facilityDescription"
            label={Dictionary.serviceTitle}
          >
            <InputComponent
              className={Classes["input-modal"]}
              width={343}
              disabled={true}
            />
          </FormItemComponent>
          <FormItemComponent name="facilityKey" label={"Key"}>
            <InputComponent
              className={Classes["input-modal"]}
              width={343}
              disabled={true}
            />
          </FormItemComponent>
        </div>
        <div className={Classes["row"]}>
          <FormItemComponent name="allowUserDisable">
            <div className={Classes["switch-container"]}>
              <span>{Dictionary.disableByUserOption}</span>
              <SwitchComponent
                defaultChecked={record?.allow_user_disable}
                onChange={() => {
                  dispatch(
                    services({
                      record: {
                        ...record,
                        allow_user_disable: !record?.allow_user_disable,
                      },
                    })
                  );
                }}
              />
            </div>
          </FormItemComponent>{" "}
          <FormItemComponent name="isBiometricAvailable">
            <div
              className={
                servicesData.serviceType === "ANONYMOUS"
                  ? Classes["switch-container-disable"]
                  : Classes["switch-container"]
              }
            >
              <span>{Dictionary.activeForBiometricLogin}</span>
              <SwitchComponent
                disabled={
                  servicesData.serviceType === "ANONYMOUS" ? true : false
                }
                defaultChecked={record?.is_biometric_available}
                onChange={() => {
                  dispatch(
                    services({
                      record: {
                        ...record,
                        is_biometric_available: !record?.is_biometric_available,
                      },
                    })
                  );
                }}
              />
            </div>
          </FormItemComponent>
        </div>
        <div className={Classes["service-edit-modal-status-container"]}>
          <p>{Dictionary.status}</p>
          <div className={Classes["row"]}>
            <FormItemComponent name="isForMobile">
              <div className={Classes["three-switch-container"]}>
                <span>Mobile</span>
                <SwitchComponent
                  defaultChecked={record?.is_for_mobile}
                  onChange={() => {
                    dispatch(
                      services({
                        record: {
                          ...record,
                          is_for_mobile: !record?.is_for_mobile,
                        },
                      })
                    );
                  }}
                />
              </div>
            </FormItemComponent>{" "}
            <FormItemComponent name="isForWeb">
              <div className={Classes["three-switch-container"]}>
                <span>Web</span>
                <SwitchComponent
                  defaultChecked={record?.is_for_web}
                  onChange={() => {
                    dispatch(
                      services({
                        record: { ...record, is_for_web: !record?.is_for_web },
                      })
                    );
                  }}
                />
              </div>
            </FormItemComponent>
            <FormItemComponent name="isForPwa">
              <div className={Classes["three-switch-container"]}>
                <span>PWA</span>
                <SwitchComponent
                  defaultChecked={record?.is_for_pwa}
                  onChange={() => {
                    dispatch(
                      services({
                        record: { ...record, is_for_pwa: !record?.is_for_pwa },
                      })
                    );
                  }}
                />
              </div>
            </FormItemComponent>
          </div>
        </div>
        <FormItemComponent
          shouldUpdate
          button
          className={Classes["edit-service-modal-buttons"]}
        >
          <ButtonComponent
            type="primary"
            htmlType="submit"
            classNameBtn={Classes["edit-service-modal-confirm-button"]}
          >
            {Dictionary.confirm}
          </ButtonComponent>
          <ButtonComponent
            type="default"
            classNameBtn={Classes["edit-service-modal-cancel-button"]}
            onClick={() => dispatch(services({ editModal: false, record: "" }))}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
    </div>
  );
};

export default EditService;
