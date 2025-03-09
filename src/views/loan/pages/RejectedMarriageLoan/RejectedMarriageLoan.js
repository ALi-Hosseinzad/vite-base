import React, { useEffect, useRef, useState } from "react";
import Dictionary from "helpers/Dictionary";
import ButtonComponent from "components/button/ButtonComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "components/table/TableComponent";
import queryString from "query-string";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getMarriageLoanList } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import Classes from "views/loan/styles/Loan.module.scss";
import NewDatePicker from "components/newDatePicker/NewDatePicker";
import moment from "jalali-moment";
import {
  rejectedLoan,
  rejectedLoanState,
} from "store/reducers/loan/RejectedLoanReducer";

const RejectedMarriageLoan = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const thisYear = moment(Date.now()).locale("fa").format("YYYY");
  const [queryParam] = useState(queryString?.parse(location.search));
  const queryParamRejectedMarriageRecordsPerPage =
    queryParam?.rejectedMarriageRecordsPerPage >= 50
      ? 50
      : Number(queryParam?.rejectedMarriageRecordsPerPage);
  const [pagination, setPagination] = useState({
    rejectedMarriagePageNumber:
      Number(queryParam?.rejectedMarriagePageNumber) || 1,
    rejectedMarriageRecordsPerPage:
      queryParamRejectedMarriageRecordsPerPage || 10,
  });
  const RejectedMarriageLoanData = useSelector(rejectedLoanState);
  const {
    rejectedMarriageShowDeleteBtn,
    rejectedMarriageList,
    rejectedMarriageSortBy,
    rejectedMarriageTotalRows,
    rejectedMarriageReload,
    rejectedMarriage_record_date,
  } = RejectedMarriageLoanData;

  useEffect(() => {
    let newQueryParam = {
      rejectedMarriagePageNumber: pagination.rejectedMarriagePageNumber,
      rejectedMarriageRecordsPerPage: pagination.rejectedMarriageRecordsPerPage,
    };
    for (const [key, value] of searchParams.entries()) {
      if (
        key !== "rejectedMarriagePageNumber" &&
        key !== "rejectedMarriageRecordsPerPage"
      ) {
        newQueryParam[key] = value;
      }
    }
    setSearchParams(newQueryParam);
  }, [
    pagination.rejectedMarriagePageNumber,
    pagination.rejectedMarriageRecordsPerPage,
  ]);

  useEffect(() => {
    if (searchParams.get("rejectedMarriage_id_code")) {
      form.setFieldsValue({
        rejectedMarriage_id_code: searchParams.get("rejectedMarriage_id_code"),
      });
      dispatch(rejectedLoan({ rejectedMarriageShowDeleteBtn: true }));
    }
    if (searchParams.get("rejectedMarriage_record_date")) {
      const value = searchParams
        ?.get("rejectedMarriage_record_date")
        .split("/");
      dispatch(
        rejectedLoan({
          rejectedMarriage_record_date: {
            day: value[2],
            month: value[1],
            year: value[0],
          },
          rejectedMarriageShowDeleteBtn: true,
        })
      );
      form.setFieldsValue({
        rejectedMarriage_record_date: searchParams.get(
          "rejectedMarriage_record_date"
        ),
      });
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("rejectedMarriagePageNumber")) {
      crateTable();
      handleResetSearch();
    }
  }, [searchParams, rejectedMarriageReload, rejectedMarriageSortBy]);

  const onFinish = (values) => {
    Object.keys(values).forEach(
      (key) =>
        (values[key] === undefined ||
          values[key] === null ||
          values[key] === "") &&
        delete values[key]
    );
    let newQueryParam;
    if (
      rejectedMarriage_record_date.year &&
      rejectedMarriage_record_date.day &&
      rejectedMarriage_record_date.month
    ) {
      newQueryParam = {
        ...values,
        ...searchParams,
        rejectedMarriagePageNumber: 1,
        rejectedMarriageRecordsPerPage:
          pagination.rejectedMarriageRecordsPerPage,
        rejectedMarriage_record_date:
          rejectedMarriage_record_date.year +
          "/" +
          rejectedMarriage_record_date.month +
          "/" +
          rejectedMarriage_record_date.day,
      };
    } else {
      newQueryParam = {
        ...values,
        ...searchParams,
        rejectedMarriagePageNumber: 1,
        rejectedMarriageRecordsPerPage:
          pagination.rejectedMarriageRecordsPerPage,
      };
    }
    setSearchParams(newQueryParam);
    dispatch(rejectedLoan({ rejectedMarriageShowDeleteBtn: true }));
    setPagination({ ...pagination, rejectedMarriagePageNumber: 1 });
  };

  const resetSearch = () => {
    searchParams.delete("rejectedMarriage_id_code");
    searchParams.delete("rejectedMarriage_record_date");
    const newQueryParam = {
      ...searchParams,
      rejectedMarriagePageNumber: 1,
      rejectedMarriageRecordsPerPage: pagination.rejectedMarriageRecordsPerPage,
    };
    setSearchParams(newQueryParam);
    setPagination({
      rejectedMarriagePageNumber: 1,
      rejectedMarriageRecordsPerPage: pagination.rejectedMarriageRecordsPerPage,
    });
    dispatch(
      rejectedLoan({
        rejectedMarriageShowDeleteBtn: false,
        rejectedMarriageReload: !rejectedMarriageReload,
        rejectedMarriage_record_date: {
          year: "",
          month: "",
          day: "",
        },
      })
    );
    form.resetFields();
  };

  const handleResetSearch = () => {
    if (
      searchParams.get("rejectedMarriage_id_code") ||
      searchParams.get("rejectedMarriage_record_date")
    ) {
      dispatch(rejectedLoan({ rejectedMarriageShowDeleteBtn: true }));
    } else {
      dispatch(rejectedLoan({ rejectedMarriageShowDeleteBtn: false }));
    }
  };

  const onPaginationHandler = (
    rejectedMarriagePageNumber,
    rejectedMarriageRecordsPerPage
  ) => {
    const newQueryParam = {
      ...queryParam,
      rejectedMarriagePageNumber: rejectedMarriagePageNumber,
      rejectedMarriageRecordsPerPage: rejectedMarriageRecordsPerPage,
    };
    setPagination({
      rejectedMarriagePageNumber,
      rejectedMarriageRecordsPerPage,
    });
    navigate({ search: queryString.stringify(newQueryParam) });
  };

  const crateTable = () => {
    let criteria = [],
      val;
    if (
      searchParams.get("rejectedMarriage_id_code") ||
      searchParams.get("rejectedMarriage_record_date")
    ) {
      const bodySearch = {
        [searchParams.get("rejectedMarriage_id_code") && "identificationCode"]:
          searchParams.get("rejectedMarriage_id_code"),
        [searchParams.get("rejectedMarriage_record_date") && "createdDate"]:
          searchParams.get("rejectedMarriage_record_date"),
        backOfficeUserStatus: "REJECTED",
        backOfficeUserStatus: "DECLINE",
      };
      Object.keys(bodySearch).forEach((key) => {
        if (
          bodySearch[key] === undefined ||
          bodySearch[key] === null ||
          bodySearch[key] === ""
        ) {
          delete bodySearch[key];
        } else {
          criteria.push({
            operation: "or",
            criteria: [
              {
                key: key,
                value: bodySearch[key],
                operation: "equals",
              },
            ],
          });
        }
      });
      val = {
        offset:
          (pagination.rejectedMarriagePageNumber - 1) *
          pagination.rejectedMarriageRecordsPerPage,
        count: pagination.rejectedMarriageRecordsPerPage,
        [rejectedMarriageSortBy && "sort_by"]: rejectedMarriageSortBy,
        criteria: {
          operation: "and",
          criteria: criteria,
        },
      };
    } else {
      val = {
        offset:
          (pagination.rejectedMarriagePageNumber - 1) *
          pagination.rejectedMarriageRecordsPerPage,
        count: pagination.rejectedMarriageRecordsPerPage,
        [rejectedMarriageSortBy && "sort_by"]: rejectedMarriageSortBy,
        criteria: {
          criteria: [
            {
              criteria: [
                {
                  key: "backOfficeUserStatus",
                  operation: "equals",
                  value: "REJECTED",
                },
                {
                  key: "backOfficeUserStatus",
                  operation: "equals",
                  value: "DECLINE",
                },
              ],
              operation: "or",
            },
          ],
          operation: "and",
        },
      };
    }
    Object.keys(val).forEach(
      (key) =>
        (val[key] === undefined || val[key] === null || val[key] === "") &&
        delete val[key]
    );

    getMarriageLoanList(val)
      .then((res) => {
        dispatch(
          rejectedLoan({
            rejectedMarriageList: res.data?.data,
            rejectedMarriageEndRow: res.data?.end_row,
            rejectedMarriageStartRow: res.data?.start_row,
            rejectedMarriageTotalRows: res.data?.total_rows,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: 50,
      fixed: "right",
      render: (_text, _record, index) => {
        if (pagination.rejectedMarriagePageNumber === 1) {
          return <span className="pagination-column">{index + 1}</span>;
        } else {
          return (
            <span className="pagination-column">
              {((pagination.rejectedMarriagePageNumber === 0
                ? pagination.rejectedMarriagePageNumber + 1
                : pagination.rejectedMarriagePageNumber) -
                1) *
                pagination.rejectedMarriageRecordsPerPage +
                (index + 1)}
            </span>
          );
        }
      },
    },
    {
      title: `${Dictionary.track} ${Dictionary.centralBank}`,
      key: "central_bank_trace_id",
      dataIndex: "central_bank_trace_id",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: `${Dictionary.code} ${Dictionary.trace}`,
      key: "fix_trace_id",
      dataIndex: "fix_trace_id",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: `${Dictionary.nationalId} ${Dictionary.applicant}`,
      key: "identification_code",
      dataIndex: "identification_code",
      width: 250,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: `${Dictionary.record} ${Dictionary.centralBank}`,
      key: "submit_date_central_bank",
      dataIndex: "submit_date_central_bank",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: `${Dictionary.record} Hibank`,
      key: "submit_date_hi_bank",
      dataIndex: "submit_date_hi_bank",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: Dictionary.serviceDate,
      key: "resort_date",
      dataIndex: "resort_date",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },

    {
      title: Dictionary.status,
      key: "status",
      dataIndex: "status",
      width: 200,
      render: (_field, record) => (
        <div className={Classes["REJECTED-chip"]}>{record.status_desc}</div>
      ),
    },
    {
      title: Dictionary.reasonReject,
      key: "reject_reason",
      dataIndex: "reject_reason",
      width: 500,
      render: (record) => <>{record || "--"}</>,
    },
    {
      key: "operation",
      width: 1,
      fixed: "left",
      render: () => <>{""}</>,
    },
  ];

  return (
    <div>
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent name="rejectedMarriage_id_code">
          <InputSearchComponent
            name="rejectedMarriage_id_code"
            width={196}
            placeholder={Dictionary.nationalId + " " + Dictionary.applicant}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent
          name="rejectedMarriage_record_date"
          className={Classes["form-item"]}
        >
          <NewDatePicker
            start={1398}
            id="rejectedMarriage_record_date"
            end={thisYear}
            scroll={840}
            onChange={(value) =>
              dispatch(rejectedLoan({ rejectedMarriage_record_date: value }))
            }
            className={Classes["date-picker"]}
            placeholder={`${Dictionary.date} ${Dictionary.record} Hibank`}
            classNamePad={Classes["date-picker-pad"]}
            value={searchParams.get("rejectedMarriage_record_date")}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["search-part-btn"]}>
          {rejectedMarriageShowDeleteBtn && (
            <ButtonComponent
              onClick={resetSearch}
              htmlType="button"
              type="text-danger"
            >
              {Dictionary.clean}
            </ButtonComponent>
          )}
          <ButtonComponent type="primary" htmlType={Dictionary.search}>
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
      <TableComponent
        scroll={{ x: 2010, y: 530 }}
        columns={columns}
        dataSource={rejectedMarriageList}
        count={rejectedMarriageTotalRows}
        tableLayout="unset"
      />
      {rejectedMarriageTotalRows > 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.rejectedMarriageRecordsPerPage}
          current={pagination.rejectedMarriagePageNumber}
          total={rejectedMarriageTotalRows}
        />
      )}
    </div>
  );
};
export default RejectedMarriageLoan;
