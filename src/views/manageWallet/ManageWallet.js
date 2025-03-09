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
import Classes from "./styles/ManageWallet.module.scss";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { MatchAuthority } from "helpers/MatchAuthority";
import { userInfoState } from "store/reducers/userInfo/UserInfoReducer";
import { createSearchObject } from "helpers/CreateSearchObject";
import {
  manageWallet,
  manageWalletState,
  resetManageWallet,
} from "store/reducers/manageWallet/ManageWalletReducer";
import { searchWallet } from "helpers/APIFunction";
import { nationalCodeValidation } from "helpers/nationalIdValidation";

const ManageWallet = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const manageWalletData = useSelector(manageWalletState);
  const { showDeleteBtn, list, permissions } = manageWalletData;
  const userInfoData = useSelector(userInfoState);

  useEffect(() => {
    return () => {
      dispatch(resetManageWallet());
    };
  }, []);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        manageWallet({
          permissions: {
            view: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/wallet/list/v1"
            ),
          },
        })
      );
    } else {
      dispatch(manageWallet({ permissions: { view: true } }));
    }
  }, [userInfoData.authorities]);

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
      title: Dictionary.id + " " + Dictionary.wallet,
      key: "wallet_account_number",
      dataIndex: "wallet_account_number",
      width: "20%",
    },
    {
      title: Dictionary.nationalId,
      key: "ff_identification_code",
      dataIndex: "ff_identification_code",
      width: "20%",
      render: (text) => text || "--",
    },
    {
      title: Dictionary.customerId,
      key: "customer_number",
      dataIndex: "customer_number",
      width: "15%",
      render: (text) => text || "--",
    },
    {
      title: Dictionary.balance + " (" + Dictionary.rial + ") ",
      key: "balance",
      dataIndex: "balance",
      width: "15%",
      render: (text) => (
        <p style={{ direction: "ltr" }}>{Number(text).toLocaleString("en")}</p>
      ),
    },

    {
      title: Dictionary.desc,
      key: "description",
      dataIndex: "description",
      width: "15%",
      render: (text) => text || "--",
    },
    {
      title: Dictionary.type + " " + Dictionary.wallet,
      key: "wallet_type",
      dataIndex: "wallet_type",
      width: "10%",
      render: (text) => text?.code || "--",
    },
  ];

  const createTable = () => {
    searchWallet(createSearchObject(searchParams, { sortBy: "-createdDate" }))
      .then((res) => {
        dispatch(
          manageWallet({
            list: res?.data?.data,
            endRow: res.data.end_row,
            startRow: res.data.start_row,
            totalRows: res.data.total_rows,
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
      searchParams.get("walletAccountNumber")
    ) {
      dispatch(manageWallet({ showDeleteBtn: true }));
    } else {
      dispatch(manageWallet({ showDeleteBtn: false }));
    }
  };
  const onFinish = (values) => {
    Object.keys(values).forEach(
      (key) =>
        (values[key] === undefined ||
          values[key] === null ||
          values[key] === "") &&
        delete values[key]
    );
    if (Object.keys(values).length > 0) {
      const newQueryParam = {
        pageNumber: 1,
        recordsPerPage: 500,
        ...values,
      };
      setSearchParams(newQueryParam);
      dispatch(manageWallet({ showDeleteBtn: true }));
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
    dispatch(manageWallet({ showDeleteBtn: false, list: [] }));
    form.resetFields();
  };

  useEffect(() => {
    if (
      searchParams.get("ffIdentificationCode") ||
      searchParams.get("walletAccountNumber")
    ) {
      form.setFieldsValue({
        walletAccountNumber: searchParams.get("walletAccountNumber"),
        ffIdentificationCode: searchParams.get("ffIdentificationCode"),
      });
      handleResetSearch();
      createTable();
    }
  }, [searchParams]);

  return (
    permissions.view && (
      <div>
        <HeaderPage
          title={
            Dictionary.show + " " + Dictionary.details + " " + Dictionary.wallet
          }
        />
        <FormComponent
          layout="inline"
          onFinish={onFinish}
          form={form}
          ref={formRef}
          className={Classes["account-search-bar"]}
        >
          <FormItemComponent
            name="ffIdentificationCode"
            rules={[
              {
                min: 10,
                message: Dictionary.checkInput,
              },
              {
                pattern: /^[0-9]+$/,
                message: Dictionary.checkInput,
              },
              () => ({
                validator(_, value) {
                  if (value && !nationalCodeValidation(value)) {
                    return Promise.reject(new Error(Dictionary.idNotValid));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputSearchComponent
              name="ffIdentificationCode"
              placeholder={Dictionary.nationalId}
              maxLength={10}
              className={Classes["account-search-bar-input"]}
            />
          </FormItemComponent>
          <FormItemComponent
            name="walletAccountNumber"
            rules={[
              {
                min: 16,
                message: Dictionary.checkInput,
              },
              {
                max: 16,
                message: Dictionary.checkInput,
              },
              {
                pattern: /^[0-9]+$/,
                message: Dictionary.checkInput,
              },
            ]}
          >
            <InputSearchComponent
              name="walletAccountNumber"
              placeholder={Dictionary.id + " " + Dictionary.wallet}
              maxLength={16}
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
        {searchParams.get("ffIdentificationCode") ||
        searchParams.get("walletAccountNumber") ? (
          <TableComponent columns={columns} dataSource={list} />
        ) : (
          ""
        )}
      </div>
    )
  );
};

export default ManageWallet;
