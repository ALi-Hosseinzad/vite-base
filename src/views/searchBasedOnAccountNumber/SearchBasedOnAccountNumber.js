import React, { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import TableComponent from "components/table/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import HeaderPage from "components/headerPage/HeaderPage";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import FormComponent from "components/form/FormComponent";
import Classes from "./styles/SearchBasedOnAccountNumber.module.scss";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { MatchAuthority } from "helpers/MatchAuthority";
import StatusComponent from "components/status/StatusComponent";
import {
  resetSearchBasedOnAccountNumber,
  searchBasedOnAccountNumber,
  searchBasedOnAccountNumberState,
} from "store/reducers/searchBasedOnAccountNumber/SearchBasedOnAccountNumberReducer";
import { getDataOfAccount } from "helpers/APIFunction";
import { userInfoState } from "store/reducers/userInfo/UserInfoReducer";
import { createSearchObject } from "helpers/CreateSearchObject";

const SearchBasedOnAccountNumber = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParam] = useState(Object.fromEntries([...searchParams]));
  const searchBasedOnAccountNumberData = useSelector(
    searchBasedOnAccountNumberState
  );
  const { showDeleteBtn, list, CTA } = searchBasedOnAccountNumberData;
  const userInfoData = useSelector(userInfoState);

  useEffect(() => {
    return () => {
      dispatch(resetSearchBasedOnAccountNumber());
    };
  }, []);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        searchBasedOnAccountNumber({
          permissions: {
            view: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/account/account-permissions/v1"
            ),
          },
        })
      );
    } else {
      dispatch(searchBasedOnAccountNumber({ permissions: { view: true } }));
    }
  }, [userInfoData.authorities]);

  useEffect(() => {
    if (
      searchParams.get("ffIdentificationCode") ||
      searchParams.get("ffAccountNumber")
    ) {
      form.setFieldsValue({
        ffAccountNumber: queryParam?.ffAccountNumber,
        ffIdentificationCode: queryParam?.ffIdentificationCode,
      });
      handleResetSearch();
      createTable();
    }
  }, []);

  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: 50,
      fixed: "right",
      render: (_text, _record, index) => (
        <span style={{ color: "#888" }}>{index + 1}</span>
      ),
    },
    {
      title: Dictionary.accNo,
      key: "account_number",
      dataIndex: "account_number",
      width: 180,
      render: (text) => text || "--",
    },
    {
      title: `${Dictionary.owner} ${Dictionary.account}`,
      key: "account_description",
      dataIndex: "account_description",
      width: 300,
      render: (text) => text || "--",
    },
    {
      title: Dictionary.nationalId,
      key: "identification_code",
      dataIndex: "identification_code",
      width: 180,
      render: (text) => text || "--",
    },
    {
      title: Dictionary.fullName,
      key: "full_name",
      dataIndex: "full_name",
      width: 300,
      render: (text) => text || "--",
    },
    {
      title: `${Dictionary.register} ${Dictionary.in} Hibank`,
      key: "has_customer",
      dataIndex: "has_customer",
      width: 150,
      render: (text) => {
        if (text === true)
          return (
            <StatusComponent
              style={{ width: "70px", padding: "4px 8px" }}
              type="success"
              title={Dictionary.done}
            />
          );
        else
          return (
            <StatusComponent
              style={{ width: "70px", padding: "4px 8px" }}
              type="rejected"
              title={Dictionary.field}
            />
          );
      },
    },
    {
      title: `${Dictionary.status} ${Dictionary.account}`,
      key: "status",
      dataIndex: "status",
      width: 200,
      render: (text, record) => (
        <div>
          {text === "deleted" && (
            <StatusComponent
              className={Classes["account-status"]}
              type="pending"
              title={record.fa_status}
            />
          )}
          {text === "deny" && (
            <div className={Classes["account-deny-status"]}>
              {record.fa_status}
            </div>
          )}
          {(text === "execute" ||
            text === "agent" ||
            text === "create" ||
            text === "view" ||
            text === "superagent") && (
            <StatusComponent
              className={Classes["account-status"]}
              type="success"
              title={record.fa_status}
            />
          )}
        </div>
      ),
    },
    {
      title: `${Dictionary.access}${Dictionary.ha} ${Dictionary.account}`,
      key: "permission",
      dataIndex: "permission",
      width: 1400,
      render: (_text, record) => (
        <div className={Classes["account-access-part"]}>
          {record.permission?.map((item) => (
            <StatusComponent
              key={item.permission}
              style={{ marginLeft: 16 }}
              className={Classes["account-status"]}
              type="success"
              title={item.permission_description || "--"}
            />
          ))}
        </div>
      ),
    },
    {
      key: "operation",
      width: 1,
      fixed: "left",
      render: () => <>{""}</>,
    },
  ];

  const createTable = () => {
    getDataOfAccount(
      createSearchObject(searchParams, { sortBy: "-createdDate" })
    )
      .then((res) => {
        dispatch(
          searchBasedOnAccountNumber({
            list: res?.data?.data,
            endRow: res.data.end_row,
            startRow: res.data.start_row,
            totalRows: res.data.total_rows,
            CTA: false,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };
  const handleResetSearch = () => {
    if (
      searchParams.get("ffIdentificationCode") ||
      searchParams.get("ffAccountNumber")
    ) {
      dispatch(searchBasedOnAccountNumber({ showDeleteBtn: true }));
    } else {
      dispatch(searchBasedOnAccountNumber({ showDeleteBtn: false }));
    }
  };
  const onFinish = (values) => {
    if (
      values.ffAccountNumber !== undefined ||
      values.ffIdentificationCode !== undefined
    ) {
      dispatch(searchBasedOnAccountNumber({ CTA: true }));
      Object.keys(values).forEach(
        (key) =>
          (values[key] === undefined ||
            values[key] === null ||
            values[key] === "") &&
          delete values[key]
      );
      const newQueryParam = {
        pageNumber: 1,
        recordsPerPage: 500,
        ...values,
      };
      setSearchParams(newQueryParam);
      dispatch(searchBasedOnAccountNumber({ showDeleteBtn: true }));
    } else {
      dispatch(
        setNotificationData({
          message: "یک مورد انتخاب  کنید",
          type: "error",
          time: 5000,
        })
      );
    }
  };

  const resetSearch = () => {
    const newQueryParam = {
      pageNumber: 1,
      recordsPerPage: 500,
    };
    setSearchParams(newQueryParam);
    dispatch(
      searchBasedOnAccountNumber({ showDeleteBtn: false, CTA: false, list: [] })
    );
    form.resetFields();
  };

  useEffect(() => {
    if (CTA) {
      createTable();
      handleResetSearch();
    }
  }, [CTA]);

  return (
    <div>
      <HeaderPage title={Dictionary.searchBasedOnAccountNumber} />
      <FormComponent
        layout="inline"
        onFinish={onFinish}
        form={form}
        ref={formRef}
        className={Classes["account-search-bar"]}
      >
        <FormItemComponent
          name="ffAccountNumber"
          rules={[
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
            name="ffAccountNumber"
            placeholder={Dictionary.accNo}
            maxLength={13}
            className={Classes["account-search-bar-input"]}
          />
        </FormItemComponent>
        <FormItemComponent
          name="ffIdentificationCode"
          rules={[
            {
              min: 10,
              message: Dictionary.checkInput,
            },
            {
              max: 11,
              message: Dictionary.checkInput,
            },
            {
              pattern: /^[0-9]+$/,
              message: Dictionary.checkInput,
            },
          ]}
        >
          <InputSearchComponent
            name="ffIdentificationCode"
            placeholder={Dictionary.personalCode}
            maxLength={11}
            className={Classes["account-search-bar-input"]}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["account-search-bar-btn"]}>
          {showDeleteBtn && (
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
            htmlType={Dictionary.search}
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
      {list?.length > 0 && (
        <TableComponent
          columns={columns}
          dataSource={list}
          scroll={{ x: 3320, y: 530 }}
          tableLayout="unset"
        />
      )}
    </div>
  );
};
export default SearchBasedOnAccountNumber;
