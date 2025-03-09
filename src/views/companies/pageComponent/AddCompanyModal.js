import { Form, Upload } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputComponent from "components/input/InputComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import UploadFile from "components/uploadFile/UploadFile";
import { addCompany, editCompany } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import Dictionary from "helpers/Dictionary";
import useErrorHandler from "helpers/useErrorHandler";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { companies } from "store/reducers/companies/companiesReducer";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import Edit from "assets/images/icon/Edit.svg";
import Variables from "assets/styles/_Variables.scss";
import Classes from "views/companies/styles/companies.module.scss";
import { b64toBlob } from "helpers/convertBase64ToBlob";

const AddCompanyModal = () => {
  const dispatch = useDispatch();
  const [editImage, setEditImage] = useState(true);
  const companiesData = useSelector((state) => state.companies.value);
  const { addModal, logoFile, editStep, record, reload } = companiesData;
  const [form] = Form.useForm();
  const formRef = useRef();
  const fileData = new FormData();
  const errorHandler = useErrorHandler();

  useEffect(() => {
    if (editStep === "company") {
      form.setFieldsValue({
        companyName: record?.company_name,
        companyCode: record?.company_code,
      });
      setEditImage(false);
    } else {
      form.resetFields();
    }
    dispatch(companies({ logoFile: null }));
  }, [addModal]);

  const closeModal = () => {
    dispatch(companies({ addModal: false }));
  };

  useEffect(() => {
    handleFileSelect(logoFile);
  }, [logoFile]);

  const handleFileSelect = (logo) => {
    if (logo) {
      fileData.append(
        "file",
        logo,
        `${new Date().getTime()}.${logo?.name?.substring(
          logo?.name?.lastIndexOf(".") + 1
        )}`
      );
    } else {
      fileData.append("file", null);
    }
  };

  const onFinish = (values) => {
    if (editStep === "company") {
      if (!editImage) {
        const blob = b64toBlob(record?.icon_base64, "image/png");
        fileData.append("file", blob, `${new Date().getTime()}.png`);
        editCompany(
          {
            isActive: record.is_active,
            companyName: values.companyName,
            companyCode: values.companyCode,
          },
          fileData
        )
          .then(() =>
            dispatch(
              companies({
                addModal: false,
                reload: !reload,
                record: "",
                logoFile: null,
                editStep: "main",
              })
            )
          )
          .catch(() => errorHandler(errorResponse));
      } else {
        if (logoFile) {
          editCompany(
            {
              isActive: record.is_active,
              companyName: values.companyName,
              companyCode: values.companyCode,
            },
            fileData
          )
            .then(() =>
              dispatch(
                companies({
                  addModal: false,
                  reload: !reload,
                  logoFile: null,
                  editStep: "main",
                  record: "",
                })
              )
            )
            .catch(() => errorHandler(errorResponse));
        } else {
          dispatch(
            setNotificationData({
              message: Dictionary.addLogoIsEssential,
              type: "error",
              time: 5000,
            })
          );
        }
      }
    } else {
      if (logoFile) {
        addCompany(
          { companyName: values.companyName, companyCode: values.companyCode },
          fileData
        )
          .then(() =>
            dispatch(
              companies({ record: values, addPlanModal: true, addModal: false })
            )
          )
          .catch(() => errorHandler(errorResponse));
      } else {
        dispatch(
          setNotificationData({
            message: Dictionary.addLogoIsEssential,
            type: "error",
            time: 5000,
          })
        );
      }
    }
  };

  return (
    <ModalComponent
      width={918}
      title={
        editStep === "company"
          ? Dictionary.editCompanyAndPlan
          : Dictionary.addCompanyAndPlan
      }
      open={companiesData.addModal}
      onCancel={closeModal}
    >
      <FormComponent
        layout="vertical"
        form={form}
        onFinish={onFinish}
        ref={formRef}
        requiredMark={false}
        style={{ border: "none", marginBottom: "0px", paddingBottom: "0px" }}
      >
        <div className={Classes["row"]}>
          <FormItemComponent
            name="companyName"
            label={Dictionary.name + " " + Dictionary.company}
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
              name="companyName"
              placeholder={Dictionary.name + " " + Dictionary.company}
              className={Classes["add-company-input"]}
            />
          </FormItemComponent>
          <FormItemComponent
            name="companyCode"
            label={Dictionary.key + " " + Dictionary.company}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
            ]}
          >
            <InputComponent
              disabled={editStep === "company"}
              width={343}
              name="companyCode"
              placeholder={Dictionary.key + " " + Dictionary.company}
              className={Classes["add-company-input-company-code"]}
            />
          </FormItemComponent>
        </div>
        <div className={Classes["row"]}>
          {editStep === "company" && !editImage ? (
            <div>
              <p style={{ marginBottom: "4px" }}>{Dictionary.companyLogo}</p>
              <div
                className={Classes["available-image"]}
                onClick={() => setEditImage(true)}
              >
                <span>
                  <CustomIcon
                    name="edit-logo-of-company"
                    src={Edit}
                    size={20}
                  />{" "}
                  برای تغییر لوگو کلیک کنید
                </span>
                <CustomIcon
                  name={record?.icon_base64}
                  src={`data:image/png;base64,${record?.icon_base64}`}
                  size={40}
                />
              </div>
            </div>
          ) : (
            <UploadFile
              title={Dictionary.companyLogo}
              setFile={(item) => dispatch(companies({ logoFile: item }))}
              file={logoFile}
            />
          )}
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
            {editStep === "company"
              ? Dictionary.confirm
              : Dictionary.confirmContinue}
          </ButtonComponent>
          <ButtonComponent
            type="default"
            classNameBtn={Classes["cancel-button"]}
            onClick={() => dispatch(companies({ addModal: false }))}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default AddCompanyModal;
