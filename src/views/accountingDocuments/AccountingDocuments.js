import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import HeaderPage from "components/headerPage/HeaderPage";
import ButtonComponent from "components/button/ButtonComponent";
import { Form } from "antd";
import Classes from "./styles/Customer.module.scss";
import FormItemComponent from "components/formItem/FormItemComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import ModalComponent from "components/modalComponent/ModalComponent";
import PaginationComponent from "components/pagination/PaginationComponent";
import TableComponent from "components/table/TableComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import { searchGl } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { createSearchObject } from "helpers/CreateSearchObject";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import Variables from "assets/styles/_Variables.scss";
import { MatchAuthority } from "helpers/MatchAuthority";
import Visible from "assets/images/icon/Change.svg";
import { accountingDocuments } from "store/reducers/accountingDocuments/AccountingDocumentsReducer";
import AddNewDocument from "./pageComponent/AddNewDocument";

const AccDocuments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const accDocumentsData = useSelector(
    (state) => state.accountingDocuments.value
  );
  const { permissions, reload, modal, showDeleteBtn, list, totalRows } =
    accDocumentsData;
  const userInfoData = useSelector((state) => state.userInfo.value);
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });
  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination(newQueryParam);
  };

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        accountingDocuments({
          permissions: {
            viewList: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/gl/search/v1"
            ),
            viewTurnover: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/gl/transaction-search/v1"
            ),
            create: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/gl/add/v1"
            ),
          },
        })
      );
    } else {
      dispatch(
        accountingDocuments({
          permissions: {
            viewList: true,
            viewTurnover: true,
            create: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  const createTable = () => {
    searchGl(
      createSearchObject(searchParams, {
        operation: "contains",
        sortBy: "-createdDate",
      })
    )
      .then((res) => {
        dispatch(
          accountingDocuments({
            list: res.data?.data,
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
    if (searchParams.get("code")) {
      dispatch(accountingDocuments({ showDeleteBtn: true }));
    } else {
      dispatch(accountingDocuments({ showDeleteBtn: false }));
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
        recordsPerPage: pagination.recordsPerPage,
        ...values,
      };
      setSearchParams(newQueryParam);
      dispatch(accountingDocuments({ showDeleteBtn: true, sortColumn: "" }));
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
  const resetSearch = () => {
    const newQueryParam = {
      pageNumber: 1,
      recordsPerPage: pagination.recordsPerPage,
    };
    setSearchParams(newQueryParam);
    dispatch(accountingDocuments({ showDeleteBtn: false, sortColumn: "" }));
    form.resetFields();
  };
  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      createTable();
      handleResetSearch();
    }
  }, [searchParams, reload]);

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
    form.setFieldsValue({
      code: searchParams.get("code"),
      pageNumber: searchParams.get("pageNumber") || 1,
      recordsPerPage: searchParams.get("recordsPerPage") || 10,
    });
    handleResetSearch();
    dispatch(accountingDocuments({ modal: false }));
  }, []);
  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: "50px",
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
      title: Dictionary.code,
      key: "code",
      dataIndex: "code",
      width: "20%",
    },
    {
      title: Dictionary.desc,
      key: "description",
      dataIndex: "description",
      width: "50%",
    },
    {
      title: Dictionary.balance + " (" + Dictionary.rial + ") ",
      key: "balance",
      dataIndex: "balance",
      width: "20%",
      render: (text) => (
        <p style={{ direction: "ltr" }}>{Number(text).toLocaleString("en")}</p>
      ),
    },
    {
      title: Dictionary.turnover,
      key: "lock",
      dataIndex: "lock",
      width: "10%",
      render: (_field, record) => {
        return (
          <div className={Classes["list-customers-action"]}>
            <span
              onClick={() => {
                if (permissions.viewTurnover) {
                  // dispatch(marriageLoan({ record: record }));
                  navigate({
                    pathname: "/manage-gl/turnover",
                    search: createSearchParams({
                      glCode: record.code,
                    }).toString(),
                  });
                }
              }}
            >
              <CustomIcon
                src={Visible}
                size={24}
                name={`list-customers-${record.id}-lock`}
                color={
                  !permissions.viewTurnover
                    ? Variables.GreenLight7
                    : Variables.LogoGreenDark
                }
              />
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {permissions.create ? (
        <HeaderPage
          title={Dictionary.accountingDocuments}
          onClick={() => {
            dispatch(accountingDocuments({ modal: true, current: 0 }));
          }}
          buttonText={Dictionary.addAccountingDocument}
        />
      ) : (
        <HeaderPage title={Dictionary.accountingDocuments} />
      )}
      <ModalComponent
        title={Dictionary.addAccountingDocument}
        open={modal}
        onCancel={() =>
          dispatch(accountingDocuments({ modal: false, cancelModal: true }))
        }
      >
        <AddNewDocument />
      </ModalComponent>
      <Form
        className={Classes["list-customers-form"]}
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent
          name="code"
          className={Classes["list-customers-form-item"]}
        >
          <InputSearchComponent placeholder={Dictionary.code} maxLength={10} />
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
      <TableComponent columns={columns} dataSource={list} count={totalRows} />
      {totalRows >= 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={totalRows}
        />
      )}
    </div>
  );
};
export default AccDocuments;
