import React, { useEffect, useRef, useState } from "react";
import { Form, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import FormComponent from "components/form/FormComponent";
import Classes from "views/representative/styles/Representative.module.scss";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import { getAccountAgents, getAccountSigners } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import {
  representative,
  representativeState,
} from "store/reducers/representative/representativeReducer";
import Delete from "assets/images/icon/Delete.svg";
import Add from "assets/images/icon/Add.svg";
import CustomIcon from "components/customIcon/CustomIcon";
import Variables from "assets/styles/_Variables.scss";
import TooltipComponent from "components/tooltip/TooltipComponent";
import AddNewRepresentative from "./pageComponent/AddNewRepresentative";
import RemoveRepresentative from "./pageComponent/RemoveRepresentative";
import SuccessfulModal from "./pageComponent/SuccessfulModal";

const RepresentativeChoose = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const representativeData = useSelector(representativeState);
  const {
    showDeleteBtnChoose,
    signersList,
    permissions,
    agentsList,
    addNewRepresentativeModal,
    deleteRepresentativeModal,
    reloadChoose,
    expandedRowKeys,
    agentsListAsRecord,
  } = representativeData;

  useEffect(() => {
    if (searchParams.get("account")) {
      getAllRepresentativeSigners({ account: searchParams.get("account") });
      getAllRepresentativeAgents({ account: searchParams.get("account") });
    }
  }, [reloadChoose]);

  useEffect(() => {
    if (searchParams.get("account")) {
      form.setFieldsValue({ account: searchParams.get("account") });
      dispatch(representative({ showDeleteBtnChoose: true }));
    } else {
      dispatch(representative({ showDeleteBtnChoose: false }));
    }
  }, [searchParams]);

  const columns = [
    {
      title: Dictionary.accNo,
      key: "account_number",
      dataIndex: "account_number",
      width: "12%",
      render: (text) => text || "--",
    },
    {
      title: Dictionary.type + " " + Dictionary.account,
      key: "ownership_type_description",
      dataIndex: "ownership_type_description",
      width: "12%",
      render: (text) => text || "--",
    },
    {
      title: Dictionary.name + " " + Dictionary.account,
      key: "account_description",
      dataIndex: "account_description",
      width: "24%",
      render: (text) => text || "--",
    },
    {
      title: Dictionary.fullName + " " + Dictionary.signer,
      key: "full_name",
      dataIndex: "full_name",
      width: "24%",
      render: (text) => text || "--",
    },
    {
      title: Dictionary.representative,
      key: "agent_count",
      dataIndex: "agent_count",
      width: "12%",
      render: (text) => {
        if (text && text > 0) {
          return (
            <span className={Classes["without_representative"]}>
              {text} {Dictionary.representative}
            </span>
          );
        } else {
          return (
            <span className={Classes["without_representative"]}>
              {Dictionary.without + " " + Dictionary.representative}
            </span>
          );
        }
      },
    },
    {
      title: "",
      key: "action",
      dataIndex: "action",
      width: "16%",
      render: (_field, record) => (
        <ButtonComponent
          type="default"
          htmlType="button"
          disabled={!permissions.create}
          onClick={
            permissions.create ? () => selectRepresentative(record) : () => ""
          }
          srcRight={Add}
        >
          {Dictionary.select + " " + Dictionary.representative}
        </ButtonComponent>
      ),
    },
  ];

  const selectRepresentative = (e) => {
    if (permissions.create) {
      dispatch(
        representative({
          addNewRepresentativeModal: !addNewRepresentativeModal,
          record: e,
        })
      );
    }
  };

  const getAllRepresentativeSigners = (values) => {
    let convertList = [];

    getAccountSigners(values.account)
      .then((res) => {
        res?.data?.forEach((node, index) => {
          const convertObj = {
            key: index.toString(),
            ...node,
          };
          convertList.push(convertObj);
        });
        setSearchParams(values);
        dispatch(
          representative({
            account: values.account,
            showDeleteBtnChoose: true,
            signersList: convertList,
            expandedRowKeys: null,
          })
        );
      })
      .catch(() => {
        dispatch(
          representative({ showDeleteBtnChoose: false, signersList: [] })
        );
        errorHandler(errorResponse);
      });
  };

  const getAllRepresentativeAgents = (values) => {
    let convertList = [];
    getAccountAgents(values.account)
      .then((response) => {
        if (response.data?.length > 0) {
          response?.data?.forEach((node, index) => {
            const convertObj = {
              key: index.toString(),
              ...node,
            };
            convertList.push(convertObj);
          });
          dispatch(representative({ agentsList: convertList }));
        }
      })
      .catch(() => {
        dispatch(representative({ agentsList: [] }));
        errorHandler(errorResponse);
      });
  };

  const onFinish = (values) => {
    getAllRepresentativeSigners(values);
    getAllRepresentativeAgents(values);
  };

  const resetSearch = () => {
    searchParams.delete("account");
    setSearchParams(searchParams);
    dispatch(
      representative({
        account: "",
        agentsListAsRecord: [],
        agentsList: [],
        signersList: [],
        showDeleteBtnChoose: false,
      })
    );
    form.resetFields();
  };

  const expandedRowRender = () => {
    const handleDelete = (e) => {
      dispatch(
        representative({
          deleteRepresentativeModal: !deleteRepresentativeModal,
          record: e,
        })
      );
    };

    const columns = [
      {
        width: "58%",
      },
      {
        title: `${Dictionary.nationalId} ${Dictionary.representative}`,
        key: "identification_code_agent",
        dataIndex: "identification_code_agent",
        width: "12%",
        render: (text) => text || "--",
      },
      {
        title: Dictionary.fullName,
        key: "full_name_agent",
        dataIndex: "full_name_agent",
        width: "20%",
        render: (text) => text || "--",
      },
      {
        title: "",
        key: "action",
        dataIndex: "action",
        width: "10%",
        render: (_field, record) => {
          return (
            <TooltipComponent title={Dictionary.delete}>
              <span
                onClick={() => permissions.delete && handleDelete(record)}
                style={{ marginLeft: "8px" }}
              >
                <CustomIcon
                  src={Delete}
                  size={24}
                  name={`manage-menu-sort`}
                  color={
                    permissions.delete
                      ? Variables.RedNotif
                      : Variables.NotifPink
                  }
                  className={
                    !permissions.delete && Classes["cursor-permission"]
                  }
                />
              </span>
            </TooltipComponent>
          );
        },
      },
    ];

    return (
      <Table
        rowKey={(record) => record.key}
        columns={columns}
        dataSource={agentsListAsRecord}
        pagination={false}
        className={Classes["expanded-table"]}
      />
    );
  };

  const updateExpandedRowKeys = (e, r) => {
    if (e) {
      const newAgent = agentsList?.filter(
        (elm) => elm.identification_code_signer === r.identification_code
      );
      dispatch(
        representative({
          agentsListAsRecord: newAgent,
          expandedRowKeys: r.key.toString(),
        })
      );
    } else {
      dispatch(
        representative({ expandedRowKeys: null, agentsListAsRecord: [] })
      );
    }
  };

  return (
    <div>
      <AddNewRepresentative />
      <RemoveRepresentative />
      <SuccessfulModal />
      <FormComponent
        layout="inline"
        onFinish={onFinish}
        form={form}
        ref={formRef}
        className={Classes["account-search-bar"]}
      >
        <FormItemComponent
          name="account"
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
            name="account"
            placeholder={Dictionary.accNo}
            maxLength={13}
            className={Classes["account-search-bar-input"]}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["account-search-bar-btn"]}>
          {showDeleteBtnChoose && (
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
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
      {signersList?.length > 0 && (
        <Table
          rowClassName={(_record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          columns={columns}
          className={Classes["table-main"]}
          dataSource={signersList}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.agent_count > 0,
            onExpand: (expanded, record) =>
              updateExpandedRowKeys(expanded, record),
            expandRowByClick: false,
            expandedRowKeys: [expandedRowKeys],
          }}
        />
      )}
    </div>
  );
};
export default RepresentativeChoose;
