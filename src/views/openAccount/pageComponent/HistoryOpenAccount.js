import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import HeaderPage from "components/headerPage/HeaderPage";
import ButtonComponent from "components/button/ButtonComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import { Form } from "antd";
import Classes from "views/listCards/styles/ListCards.module.scss";
import FormItemComponent from "components/formItem/FormItemComponent";
import TableComponent from "components/table/TableComponent";
import PaginationComponent from "components/pagination/PaginationComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import StatusComponent from "components/status/StatusComponent";
import { getAllOpenAccount } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { findStatus } from "helpers/FindStatus";
import DateFormat from "components/dateFormat/DateFormat";
import { createSearchObject } from "helpers/CreateSearchObject";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import SortableTitle from "components/sortableTitle/SortableTitle";
import { historyOpenAccount } from "store/reducers/historyOpenAccount/historyOpenAccountReducer";

const items = [
  { id: 1, value: "تایید شد", text: "تایید شده" },
  { id: 2, value: "رد شد", text: "رد شده" },
];

const HistoryOpenAccount = () => {
  const [sort, setSort] = useState({
    referenceNumber: "",
    fullname: "",
    identificationCode: "",
    status: "",
    createdDate: "",
  });
  const [sortBy, setSortBy] = useState("-createdDate");
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const historyOpenAccountData = useSelector(
    (state) => state.historyOpenAccount.value
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });

  useEffect(() => {
    let newQueryParam = {
      pageNumber: pagination.pageNumber,
      recordsPerPage: pagination.recordsPerPage,
      status: "ERROR",
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
      crateTable(sortBy);
      handleResatSearch();
    }
  }, [searchParams, historyOpenAccountData.update, sortBy]);

  useEffect(() => {
    form.setFieldsValue({
      identificationCode: searchParams.get("identificationCode"),
      fullname: searchParams.get("fullname"),
      mobileNumber: searchParams.get("mobileNumber"),
      referenceNumber: searchParams.get("referenceNumber"),
      accountStatus: searchParams.get("accountStatus"),
      pageNumber: searchParams.get("pageNumber") || 1,
      recordsPerPage: searchParams.get("recordsPerPage") || 10,
    });
    handleResatSearch();
  }, []);

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination({ pageNumber, recordsPerPage });
  };

  const handleSort = (column) => {
    if (sort[column] === "") {
      setSort({ ...sort, [column]: "inc" });
      setSortBy(column);
    } else if (sort[column] === "inc") {
      setSort({ ...sort, [column]: "desc" });
      setSortBy(`-${column}`);
    } else if (sort[column] === "desc") {
      setSort({ ...sort, [column]: "" });
      setSortBy("-createdDate");
    }
  };

  const crateTable = (sortItem) => {
    getAllOpenAccount(createSearchObject(searchParams, { sortBy: sortItem }))
      .then((res) => {
        const convertList = [];
        res.data.data?.map((node) => {
          convertList.push({
            id: node.id,
            referenceNumber: node.reference_number,
            firstName: node.firstname,
            lastName: node.lastname,
            nationalId: node.identification_code,
            mobileNumber: node.mobile_number,
            videoExpression: node.video_expression,
            registerDate: node.created_date,
            status: node.account_creation_status,
            accountStatus: node.account_status,
            desc: node.error_desc,
            fullName: node.fullname,
          });
        });
        dispatch(
          historyOpenAccount({ list: convertList, total: res.data.total_rows })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const handleResatSearch = () => {
    if (
      searchParams.get("referenceNumber") ||
      searchParams.get("fullname") ||
      searchParams.get("mobileNumber") ||
      searchParams.get("identificationCode") ||
      searchParams.get("accountStatus")
    ) {
      dispatch(historyOpenAccount({ showDeleteBtn: true }));
    } else {
      dispatch(historyOpenAccount({ showDeleteBtn: false }));
    }
  };
  const onFinish = (values) => {
    if (values) {
      Object.keys(values).forEach(
        (key) =>
          (values[key] === undefined ||
            values[key] === null ||
            values[key] === "") &&
          delete values[key]
      );
      const newQueryParam = {
        pageNumber: 1,
        recordsPerPage: pagination.recordsPerPage,
        status: "ERROR",
        ...values,
      };
      setSearchParams(newQueryParam);
      dispatch(historyOpenAccount({ showDeleteBtn: true }));
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
      status: "ERROR",
    };
    setSearchParams(newQueryParam);
    dispatch(historyOpenAccount({ showDeleteBtn: false }));
    form.resetFields();
  };
  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: 50,
      render: (_text, _record, index) => {
        if (pagination.pageNumber === 1) {
          return <span className="pagination-column">{index + 1}</span>;
        } else {
          return (
            <span className="pagination-column">
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
      title: Dictionary.traceNumber,
      key: "referenceNumber",
      dataIndex: "referenceNumber",
      width: 200,
      render: (text) => {
        return text ? text : "--";
      },
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={sort.fullname}
            onClick={() => handleSort("fullname")}
            text={Dictionary.fullName}
          />
        );
      },
      key: "fullName",
      dataIndex: "fullName",
      width: 200,
      render: (text) => {
        return text ? text : "--";
      },
    },
    {
      title: Dictionary.nationalId,
      key: "nationalId",
      dataIndex: "nationalId",
      width: 130,
      render: (text) => {
        return text ? text : "--";
      },
    },
    {
      title: Dictionary.actionType,
      key: "actionType",
      dataIndex: "actionType",
      width: 120,
      render: () => {
        return Dictionary.openAccount;
      },
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={sort.createdDate}
            onClick={() => handleSort("createdDate")}
            text={Dictionary.registerDate}
            className={Classes["rotate-vertically"]}
          />
        );
      },
      key: "registerDate",
      dataIndex: "registerDate",
      className: "table-th-date",
      width: 150,
      render: (text) => {
        return text ? <DateFormat value={text} /> : "--";
      },
    },
    {
      title: Dictionary.status + " " + Dictionary.authentication,
      key: "accountStatus",
      dataIndex: "accountStatus",
      width: 200,
      render: (_field, record) => (
        <StatusComponent
          type={findStatus(record.status)}
          title={record.accountStatus}
        />
      ),
    },
    {
      title: Dictionary.rejectReason,
      key: "desc",
      dataIndex: "desc",
      className: "table-th-desc",
      render: (text) => {
        return text ? text : "--";
      },
    },
  ];

  return (
    <div>
      <HeaderPage
        title={Dictionary.failedOpenAccounts}
        back={"/authentication/open-account"}
      />
      <Form
        className={Classes["list-cards-form"]}
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent
          name="referenceNumber"
          className={Classes["list-cards-form-item"]}
        >
          <InputSearchComponent
            name="referenceNumber"
            width={176}
            placeholder={Dictionary.traceNumber}
            maxLength={14}
          />
        </FormItemComponent>
        <FormItemComponent
          name="fullname"
          className={Classes["list-cards-form-item"]}
        >
          <InputSearchComponent
            name="fullname"
            width={176}
            placeholder={Dictionary.fullName}
            maxLength={40}
          />
        </FormItemComponent>
        <FormItemComponent
          name="identificationCode"
          className={Classes["list-cards-form-item"]}
        >
          <InputSearchComponent
            width={176}
            name="identificationCode"
            placeholder={Dictionary.nationalId}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent
          name="mobileNumber"
          className={Classes["list-cards-form-item"]}
        >
          <InputSearchComponent
            width={176}
            name="mobileNumber"
            placeholder={Dictionary.mobile}
            maxLength={11}
          />
        </FormItemComponent>
        <FormItemComponent name="accountStatus">
          <SelectComponent
            name="accountStatus"
            width={176}
            placeholder={Dictionary.status}
            items={items}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["list-card-btn"]}>
          {historyOpenAccountData.showDeleteBtn && (
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
            classNameBtn={Classes["list-card-btn-button"]}
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </Form>
      <div>
        <TableComponent
          scroll={{ x: 1520, y: 550 }}
          columns={columns}
          dataSource={historyOpenAccountData.list}
          count={pagination.recordsPerPage}
          tableLayout="unset"
        />
      </div>
      {historyOpenAccountData.total > 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={historyOpenAccountData.total}
        />
      )}
    </div>
  );
};
export default HistoryOpenAccount;
