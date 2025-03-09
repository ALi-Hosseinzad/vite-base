import React, { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import TableComponent from "components/table/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import FormComponent from "components/form/FormComponent";
import Classes from "views/representative/styles/Representative.module.scss";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import { getRepresentative } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import {
  representative,
  representativeState,
} from "store/reducers/representative/representativeReducer";
import Delete from "assets/images/icon/Delete.svg";
import Add from "assets/images/icon/Add.svg";
import ModalComponent from "components/modalComponent/ModalComponent";
import AddRepresentative from "./pageComponent/AddRepresentative";
import ConfirmRepresentative from "./pageComponent/ConfirmRepresentative";
import SuccessfulRepresentative from "./pageComponent/SuccessRepresentative";
import DismissalRepresentative from "./pageComponent/DismissalRepresentative";

const RepresentativeCheque = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParam] = useState(Object.fromEntries([...searchParams]));
  const [isLoading, setIsLoading] = useState(false);
  const representativeData = useSelector(representativeState);

  useEffect(() => {
    if (queryParam.accNo) {
      form.setFieldsValue({ accNo: queryParam.accNo });
      dispatch(representative({ showDeleteBtn: true }));
    } else {
      dispatch(representative({ showDeleteBtn: false }));
      form.resetFields();
    }
  }, [queryParam]);

  useEffect(() => {
    if (representativeData.reload) {
      onFinish({ accNo: representativeData.accNo });
    }
  }, [representativeData.reload]);

  const columns = [
    {
      title: Dictionary.accNo,
      key: "account_number",
      dataIndex: "account_number",
      width: "12%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: Dictionary.corporateCode,
      key: "corporate_code",
      dataIndex: "corporate_code",
      width: "12%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: Dictionary.name + " " + Dictionary.account,
      key: "account_description",
      dataIndex: "account_description",
      width: "24%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: `${Dictionary.fullName} ${Dictionary.representative}`,
      key: "super_agent_dto",
      dataIndex: "super_agent_dto",
      width: "24%",
      render: (record) => {
        if (record === null)
          return (
            <span className={Classes["without_representative"]}>
              {Dictionary.without + " " + Dictionary.representative}
            </span>
          );
        else return record.name + " " + record.family;
      },
    },
    {
      title: `${Dictionary.nationalId} ${Dictionary.representative}`,
      key: "super_agent_dto",
      dataIndex: "super_agent_dto",
      width: "12%",
      render: (record) => {
        if (record === null) return "--";
        else return record.identification_code;
      },
    },
    {
      title: "",
      key: "super_agent_dto",
      dataIndex: "super_agent_dto",
      width: "16%",
      render: (record) => {
        if (record === null)
          return (
            <ButtonComponent
              type="default"
              htmlType="button"
              onClick={selectRepresentative}
              srcRight={Add}
            >
              {Dictionary.select + " " + Dictionary.representative}
            </ButtonComponent>
          );
        else
          return (
            <ButtonComponent
              type="default-danger"
              htmlType="button"
              onClick={dismissalRepresentative}
              srcRight={Delete}
            >
              {Dictionary.dismissal + " " + Dictionary.representative}
            </ButtonComponent>
          );
      },
    },
  ];

  const selectRepresentative = () => {
    dispatch(representative({ addModal: !representativeData.addModal }));
  };

  const dismissalRepresentative = () => {
    dispatch(representative({ dismissalModal: true }));
  };

  const getAllRepresentative = (values) => {
    setIsLoading(true);
    getRepresentative(values.accNo)
      .then((res) => {
        let convertList = [];
        convertList.push(res.data);
        dispatch(
          representative({
            accNo: values.accNo,
            list: convertList,
            showDeleteBtn: true,
            reload: false,
          })
        );
        setSearchParams(values);
      })
      .catch(() => {
        errorHandler(errorResponse);
        dispatch(
          representative({
            list: [],
            showDeleteBtn: true,
            reload: false,
          })
        );
      });
    setIsLoading(false);
  };

  const onFinish = (values) => {
    getAllRepresentative(values);
  };

  const resetSearch = () => {
    searchParams.delete("accNo");
    setSearchParams(searchParams);
    dispatch(
      representative({
        showDeleteBtn: false,
        list: [],
        reload: false,
        accNo: "",
      })
    );
    form.resetFields();
  };

  const closeModals = () => {
    representativeData?.showSuccess
      ? dispatch(
          representative({
            addModal: false,
            resultCheck: null,
            showSuccess: false,
            dismissalModal: false,
            reload: false,
            reload: true,
          })
        )
      : dispatch(
          representative({
            addModal: false,
            resultCheck: null,
            showSuccess: false,
            dismissalModal: false,
            reload: false,
          })
        );
  };

  return (
    <div>
      <ModalComponent
        maskClosable={false}
        title={`${Dictionary.select} ${Dictionary.representative} ${Dictionary.company} - ${representativeData.list[0]?.account_description}`}
        open={representativeData.addModal}
        width={representativeData?.showSuccess ? 540 : 980}
        onCancel={closeModals}
      >
        {representativeData?.showSuccess ? (
          <SuccessfulRepresentative />
        ) : representativeData?.resultCheck ? (
          <ConfirmRepresentative />
        ) : (
          <AddRepresentative />
        )}
      </ModalComponent>
      <ModalComponent
        maskClosable={false}
        title={`${Dictionary.dismissal} ${Dictionary.representative} ${Dictionary.company} - ${representativeData.list[0]?.account_description}`}
        open={representativeData.dismissalModal}
        width={540}
        onCancel={closeModals}
      >
        <DismissalRepresentative />
      </ModalComponent>
      <FormComponent
        layout="inline"
        onFinish={onFinish}
        form={form}
        ref={formRef}
        className={Classes["account-search-bar"]}
      >
        <FormItemComponent
          name="accNo"
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
            {
              min: 13,
              message: Dictionary.checkInput,
            },
            {
              max: 13,
              message: Dictionary.checkInput,
            },
            {
              pattern: /^[0-9]+$/,
              message: Dictionary.checkInput,
            },
          ]}
        >
          <InputSearchComponent
            name="accNo"
            placeholder={Dictionary.accNo}
            maxLength={13}
            className={Classes["account-search-bar-input"]}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["account-search-bar-btn"]}>
          {representativeData.showDeleteBtn && (
            <ButtonComponent
              onClick={resetSearch}
              htmlType="button"
              type="text-danger"
            >
              {Dictionary.clean}
            </ButtonComponent>
          )}
          <ButtonComponent
            classNameBtn={Classes["account-search-btn"]}
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
      {representativeData.list?.length > 0 && (
        <TableComponent
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          columns={columns}
          dataSource={representativeData.list}
          loading={isLoading}
        />
      )}
    </div>
  );
};
export default RepresentativeCheque;
