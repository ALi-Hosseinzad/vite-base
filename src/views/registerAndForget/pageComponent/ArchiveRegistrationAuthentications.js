import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import HeaderPage from "components/headerPage/HeaderPage";
import ButtonComponent from "components/button/ButtonComponent";
import { Form } from "antd";
import Classes from "views/listCards/styles/ListCards.module.scss";
import FormItemComponent from "components/formItem/FormItemComponent";
import TableComponent from "components/table/TableComponent";
import PaginationComponent from "components/pagination/PaginationComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import StatusComponent from "components/status/StatusComponent";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { findStatus } from "helpers/FindStatus";
import DateFormat from "components/dateFormat/DateFormat";
import { createSearchObject } from "helpers/CreateSearchObject";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import SortableTitle from "components/sortableTitle/SortableTitle";
import { getArchiveRegistrationAuthentications } from "helpers/APIFunction";
import {
  archiveRegistrationAuthentications,
  archiveRegistrationAuthenticationsState,
} from "store/reducers/archiveRegistrationAuthentications/ArchiveRegistrationAuthenticationsReducer";

const ArchiveRegistrationAuthentications = () => {
  const [sort, setSort] = useState({ fullname: "", createdDate: "" });
  const [sortBy, setSortBy] = useState("-createdDate");
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const ArchiveRegistrationAuthenticationsData = useSelector(
    archiveRegistrationAuthenticationsState
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
  }, [searchParams, ArchiveRegistrationAuthenticationsData.update, sortBy]);

  useEffect(() => {
    form.setFieldsValue({
      identificationCode: searchParams.get("identificationCode"),
      fullName: searchParams.get("fullName"),
      mobileNumber: searchParams.get("mobileNumber"),
      referenceNumber: searchParams.get("referenceNumber"),
      pageNumber: searchParams.get("pageNumber") || 1,
      recordsPerPage: searchParams.get("recordsPerPage") || 10,
    });
    handleResatSearch();
  }, []);

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
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
    getArchiveRegistrationAuthentications(
      createSearchObject(searchParams, { sortBy: sortItem })
    )
      .then((res) => {
        const convertList = [];
        res.data.data?.map((node) => {
          convertList.push({
            id: node.id,
            fullName: node.fullname,
            firstName: node.firstname,
            lastName: node.lastname,
            nationalId: node.identification_code,
            mobile: node.mobile_number,
            offlineAuthentication: node.offline_authentication,
            referenceNumber: node.reference_number,
            registerDate: node.created_date,
            actionType: node.event_desc,
            errorDesc: node.error_desc,
            statusDescription: node.offline_auth_status,
            desc: node.error_desc,
            videoExpression: node.video_expression,
          });
        });
        dispatch(
          archiveRegistrationAuthentications({
            list: convertList,
            total: res.data.total_rows,
          })
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
      searchParams.get("identificationCode")
    ) {
      dispatch(archiveRegistrationAuthentications({ showDeleteBtn: true }));
    } else {
      dispatch(archiveRegistrationAuthentications({ showDeleteBtn: false }));
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
      dispatch(archiveRegistrationAuthentications({ showDeleteBtn: true }));
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
    dispatch(archiveRegistrationAuthentications({ showDeleteBtn: false }));
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
      width: 150,
      render: (text) => {
        return text ? text : "--";
      },
    },
    {
      title: Dictionary.actionType,
      key: "actionType",
      dataIndex: "actionType",
      width: 120,
      render: (text) => {
        return text ? text : "--";
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
      key: "offlineAuthentication",
      dataIndex: "offlineAuthentication",
      width: 180,
      render: (_field, record) => (
        <StatusComponent
          type={findStatus(record.offlineAuthentication)}
          title={record.statusDescription}
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
        title={Dictionary.failedAuthentications}
        back={"/authentication/register-forget"}
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
        <FormItemComponent className={Classes["list-card-btn"]}>
          {ArchiveRegistrationAuthenticationsData.showDeleteBtn && (
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
          scroll={{ x: 1500, y: 550 }}
          columns={columns}
          dataSource={ArchiveRegistrationAuthenticationsData.list}
          count={pagination.recordsPerPage}
          tableLayout="unset"
        />
      </div>
      {ArchiveRegistrationAuthenticationsData.total > 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={ArchiveRegistrationAuthenticationsData.total}
        />
      )}
    </div>
  );
};
export default ArchiveRegistrationAuthentications;
