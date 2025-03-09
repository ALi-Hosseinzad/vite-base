import React, { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import Dictionary from "helpers/Dictionary";
import Edit from "assets/images/icon/Edit.svg";
import { getHubList } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import View from "assets/images/icon/MenuIcon.svg";
import useErrorHandler from "helpers/useErrorHandler";
import Variables from "assets/styles/_Variables.scss";
import { useDispatch, useSelector } from "react-redux";
import Classes from "./styles/AddCreditHub.module.scss";
import { MatchAuthority } from "helpers/MatchAuthority";
import CustomIcon from "components/customIcon/CustomIcon";
import HeaderPage from "components/headerPage/HeaderPage";
import TableComponent from "components/table/TableComponent";
import ButtonComponent from "components/button/ButtonComponent";
import { createSearchObject } from "helpers/CreateSearchObject";
import TooltipComponent from "components/tooltip/TooltipComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { userInfoState } from "store/reducers/userInfo/UserInfoReducer";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import SelectComponent from "components/SelectComponent/SelectComponent";
import PaginationComponent from "components/pagination/PaginationComponent";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import {
  creditHub,
  creditHubState,
  resetCreditHub,
} from "store/reducers/creditHub/creditHubReducer";

const CreditHub = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const errorHandler = useErrorHandler();
  const userInfoData = useSelector(userInfoState);
  const creditHubData = useSelector(creditHubState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentParams] = useState(Object.fromEntries([...searchParams]));
  const { totalRows, refresh, list, showDeleteBtn, permissions } =
    creditHubData;
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });

  const items = [
    { id: 0, value: "CANCEL", text: "لغو" },
    { id: 1, value: "RETURN", text: "عودت" },
    { id: 2, value: "ACCEPT", text: "تایید" },
    { id: 3, value: "FAILED", text: "ناموفق" },
    { id: 4, value: "IN_PROGRESS", text: "درحال پردازش" },
    { id: 5, value: "SENT_TO_BRANCH", text: "تایید و ارسال به شعبه" },
  ];

  useEffect(() => {
    return () => dispatch(resetCreditHub());
  }, []);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        creditHub({
          permissions: {
            view:
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/details/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/request-list/v1"
              ),
            edit:
              MatchAuthority(
                userInfoData.authorities,
                "Get:/api/bo/credit-hub/reagents/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/inquiry-sama/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/inquiry-grade/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/register-info/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/change-status/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/inquiry-samat/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/upload-documents/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Delete:/api/bo/credit-hub/delete-documents/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/inquiry-judicial-order/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/non-mandatory-inquiries/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/inquiry-military-service-using/v1"
              ),
            addAssurance: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/credit-hub/add-assurance/v1"
            ),
          },
        })
      );
    } else {
      dispatch(
        creditHub({
          permissions: { view: true, edit: true, addAssurance: true },
        })
      );
    }
  }, [userInfoData.authorities]);

  useEffect(() => {
    let newQueryParam = {
      pageNumber: pagination.pageNumber,
      recordsPerPage: pagination.recordsPerPage,
    };
    for (const [key, value] of searchParams.entries()) {
      if (key !== "pageNumber" && key !== "recordsPerPage") {
        newQueryParam[key] = value;
      }
    }
    setSearchParams(newQueryParam);
  }, [pagination.pageNumber, pagination.recordsPerPage]);

  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      crateTable();
    }
  }, [refresh, searchParams]);

  useEffect(() => {
    if (
      searchParams.get("identificationCode") ||
      searchParams.get("backofficeStatus")
    ) {
      form.setFieldsValue({
        identificationCode: searchParams.get("identificationCode"),
        backofficeStatus: searchParams.get("backofficeStatus"),
      });
      dispatch(creditHub({ showDeleteBtn: true }));
    } else {
      dispatch(creditHub({ showDeleteBtn: false }));
    }
  }, []);

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
        recordsPerPage: pagination.recordsPerPage,
        ...values,
      };
      setSearchParams(newQueryParam);
      dispatch(creditHub({ showDeleteBtn: true }));
      setPagination({ ...pagination, pageNumber: 1 });
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

  const crateTable = () => {
    getHubList(createSearchObject(searchParams, { sortBy: "-createdDate" }))
      .then((res) => {
        dispatch(
          creditHub({ list: res?.data.data, totalRows: res.data.total_rows })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const handleEdit = (record) => {
    if (
      (permissions.edit && record.backoffice_status === "IN_PROGRESS") ||
      record.backoffice_status === "RETURN"
    ) {
      dispatch(creditHub({ record: record, type: "edit" }));
      navigate({
        pathname: "/loan/credit-hub/add",
        search: `reference=${record.reference_number}`,
      });
    }
  };

  const handleDetail = (record) => {
    if (record.reference_number) {
      navigate({
        pathname: "/loan/credit-hub/view",
        search: `reference=${record.reference_number}`,
      });
    } else {
      dispatch(
        setNotificationData({
          message: Dictionary.notValid,
          type: "error",
          time: 3000,
        })
      );
    }
  };
  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      ...currentParams,
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination({ pageNumber, recordsPerPage });
    setSearchParams(newQueryParam);
  };

  const resetSearch = () => {
    const newQueryParam = {
      pageNumber: 1,
      recordsPerPage: pagination.recordsPerPage,
    };
    setPagination({ pageNumber: 1, recordsPerPage: pagination.recordsPerPage });
    setSearchParams(newQueryParam);
    dispatch(creditHub({ showDeleteBtn: false, refresh: !refresh }));
    form.resetFields();
  };

  const columns = [
    {
      width: 70,
      key: "index",
      dataIndex: "index",
      render: (_text, _record, index) => {
        if (pagination.pageNumber === 1) {
          return (
            <span className={Classes["list-customer-pagination"]}>
              {index + 1}
            </span>
          );
        } else {
          return (
            <span className={Classes["list-customer-pagination"]}>
              {((pagination.pageNumber === 0
                ? pagination.pageNumber + 1
                : pagination.pageNumber) -
                1) *
                pagination.recordsPerPage +
                (index + 1)}
            </span>
          );
        }
      },
    },
    {
      width: "15%",
      key: "identification_code",
      title: Dictionary.nationalId,
      dataIndex: "identification_code",
      render: (record) => record || "--",
    },
    {
      width: "20%",
      key: "amount",
      dataIndex: "amount",
      title: Dictionary.amount + "(" + Dictionary.rial + ")",
      render: (record) => (record ? record.toLocaleString("en") : "--"),
    },
    {
      width: "8%",
      key: "installment_number",
      dataIndex: "installment_number",
      title: Dictionary.quantity + " " + Dictionary.installments,
      render: (record) => record || "--",
    },
    {
      width: "8%",
      key: "branch_code",
      dataIndex: "branch_code",
      title: Dictionary.branchCode,
      render: (record) => record || "--",
    },
    {
      width: "15%",
      key: "reference_number",
      title: Dictionary.traceCode,
      dataIndex: "reference_number",
      render: (record) => record || "--",
    },
    {
      width: "15%",
      title: Dictionary.status,
      key: "back_office_status_desc",
      dataIndex: "back_office_status_desc",
      render: (record) => record || "--",
    },
    {
      width: "7%",
      key: "services",
      dataIndex: "services",
      render: (_field, record) => (
        <div className={Classes["appSettings-row-icon"]}>
          <TooltipComponent
            title={
              permissions.view && Dictionary.page + " " + Dictionary.details
            }
          >
            <CustomIcon
              src={View}
              size={24}
              name={`credit-${record.id}-show`}
              onClick={permissions.view ? () => handleDetail(record) : () => {}}
              cursor={permissions.view ? "pointer" : "default"}
              color={
                permissions.view
                  ? Variables.LogoGreenDark
                  : Variables.GreenLight7
              }
            />
          </TooltipComponent>
        </div>
      ),
    },
    {
      key: "services",
      dataIndex: "services",
      width: "7%",
      render: (_field, record) => (
        <div className={Classes["appSettings-row-icon"]}>
          <TooltipComponent
            title={
              ((permissions.edit &&
                record.backoffice_status === "IN_PROGRESS") ||
                (permissions.edit && record.backoffice_status === "RETURN")) &&
              Dictionary.edit
            }
          >
            <CustomIcon
              size={24}
              src={Edit}
              name={`credit-${record.id}-edit`}
              onClick={
                (permissions.edit &&
                  record.backoffice_status === "IN_PROGRESS") ||
                (permissions.edit && record.backoffice_status === "RETURN")
                  ? () => handleEdit(record)
                  : () => {}
              }
              cursor={
                (permissions.edit &&
                  record.backoffice_status === "IN_PROGRESS") ||
                (permissions.edit && record.backoffice_status === "RETURN")
                  ? "pointer"
                  : "default"
              }
              color={
                (permissions.edit &&
                  record.backoffice_status === "IN_PROGRESS") ||
                (permissions.edit && record.backoffice_status === "RETURN")
                  ? Variables.LogoGreenDark
                  : Variables.GreenLight7
              }
            />
          </TooltipComponent>
        </div>
      ),
    },
  ];

  return (
    <div>
      {permissions.edit ? (
        <HeaderPage
          title={Dictionary.creditHub}
          onClick={() => navigate("/loan/credit-hub/add")}
          buttonText={Dictionary.add + " " + Dictionary.creditHub}
        />
      ) : (
        <HeaderPage title={Dictionary.creditHub} />
      )}
      <Form
        className={Classes["list-customers-form"]}
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent
          name="identificationCode"
          className={Classes["list-customers-form-item"]}
        >
          <InputSearchComponent
            placeholder={Dictionary.nationalId}
            maxLength={10}
            name="identificationCode"
          />
        </FormItemComponent>
        <FormItemComponent name="backofficeStatus">
          <SelectComponent
            prefix
            showSearch
            width={230}
            items={items}
            name="backofficeStatus"
            placeholder={Dictionary.status}
            className={Classes["search-authority-group"]}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["list-customers-btn"]}>
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
            type="primary"
            htmlType={Dictionary.search}
            classNameBtn={Classes["list-customers-btn-button"]}
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </Form>
      <TableComponent columns={columns} dataSource={list} />
      {totalRows > 10 && (
        <PaginationComponent
          responsive={true}
          total={totalRows}
          current={pagination.pageNumber}
          pageSize={pagination.recordsPerPage}
          onPaginationHandler={onPaginationHandler}
        />
      )}
    </div>
  );
};

export default CreditHub;
