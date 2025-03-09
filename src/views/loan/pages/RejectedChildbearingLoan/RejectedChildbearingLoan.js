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
import { getChildbearingLoanList } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import Classes from "views/loan/styles/Loan.module.scss";
import NewDatePicker from "components/newDatePicker/NewDatePicker";
import moment from "jalali-moment";
import {
  rejectedLoan,
  rejectedLoanState,
} from "store/reducers/loan/RejectedLoanReducer";

const RejectedChildbearingLoan = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const thisYear = moment(Date.now()).locale("fa").format("YYYY");
  const [queryParam] = useState(queryString?.parse(location.search));
  const queryParamRejectedChildbearingRecordsPerPage =
    queryParam?.rejectedChildbearingRecordsPerPage >= 50
      ? 50
      : Number(queryParam?.rejectedChildbearingRecordsPerPage);
  const [pagination, setPagination] = useState({
    rejectedChildbearingPageNumber:
      Number(queryParam?.rejectedChildbearingPageNumber) || 1,
    rejectedChildbearingRecordsPerPage:
      queryParamRejectedChildbearingRecordsPerPage || 10,
  });
  const RejectedChildbearingLoanData = useSelector(rejectedLoanState);
  const {
    rejectedChildbearingShowDeleteBtn,
    rejectedChildbearingList,
    rejectedChildbearingSortBy,
    rejectedChildbearingTotalRows,
    rejectedChildbearingReload,
    rejectedChildbearing_record_date,
  } = RejectedChildbearingLoanData;

  useEffect(() => {
    let newQueryParam = {
      rejectedChildbearingPageNumber: pagination.rejectedChildbearingPageNumber,
      rejectedChildbearingRecordsPerPage:
        pagination.rejectedChildbearingRecordsPerPage,
    };
    for (const [key, value] of searchParams.entries()) {
      if (
        key !== "rejectedChildbearingPageNumber" &&
        key !== "rejectedChildbearingRecordsPerPage"
      ) {
        newQueryParam[key] = value;
      }
    }
    setSearchParams(newQueryParam);
  }, [
    pagination.rejectedChildbearingPageNumber,
    pagination.rejectedChildbearingRecordsPerPage,
  ]);

  useEffect(() => {
    if (searchParams.get("rejectedChildbearing_id_code")) {
      form.setFieldsValue({
        rejectedChildbearing_id_code: searchParams.get(
          "rejectedChildbearing_id_code"
        ),
      });
      dispatch(rejectedLoan({ rejectedChildbearingShowDeleteBtn: true }));
    }
    if (searchParams.get("rejectedChildbearing_record_date")) {
      const value = searchParams
        ?.get("rejectedChildbearing_record_date")
        .split("/");
      dispatch(
        rejectedLoan({
          rejectedChildbearing_record_date: {
            day: value[2],
            month: value[1],
            year: value[0],
          },
          rejectedChildbearingShowDeleteBtn: true,
        })
      );
      form.setFieldsValue({
        rejectedChildbearing_record_date: searchParams.get(
          "rejectedChildbearing_record_date"
        ),
      });
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("rejectedChildbearingPageNumber")) {
      crateTable();
      handleResetSearch();
    }
  }, [searchParams, rejectedChildbearingReload, rejectedChildbearingSortBy]);

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
      rejectedChildbearing_record_date.year &&
      rejectedChildbearing_record_date.day &&
      rejectedChildbearing_record_date.month
    ) {
      newQueryParam = {
        ...values,
        ...searchParams,
        rejectedChildbearingPageNumber: 1,
        rejectedChildbearingRecordsPerPage:
          pagination.rejectedChildbearingRecordsPerPage,
        rejectedChildbearing_record_date:
          rejectedChildbearing_record_date.year +
          "/" +
          rejectedChildbearing_record_date.month +
          "/" +
          rejectedChildbearing_record_date.day,
      };
    } else {
      newQueryParam = {
        ...values,
        ...searchParams,
        rejectedChildbearingPageNumber: 1,
        rejectedChildbearingRecordsPerPage:
          pagination.rejectedChildbearingRecordsPerPage,
      };
    }
    setSearchParams(newQueryParam);
    dispatch(rejectedLoan({ rejectedChildbearingShowDeleteBtn: true }));
    setPagination({ ...pagination, rejectedChildbearingPageNumber: 1 });
  };

  const resetSearch = () => {
    searchParams.delete("rejectedChildbearing_id_code");
    searchParams.delete("rejectedChildbearing_record_date");
    const newQueryParam = {
      ...searchParams,
      rejectedChildbearingPageNumber: 1,
      rejectedChildbearingRecordsPerPage:
        pagination.rejectedChildbearingRecordsPerPage,
    };
    setSearchParams(newQueryParam);
    setPagination({
      rejectedChildbearingPageNumber: 1,
      rejectedChildbearingRecordsPerPage:
        pagination.rejectedChildbearingRecordsPerPage,
    });
    dispatch(
      rejectedLoan({
        rejectedChildbearingShowDeleteBtn: false,
        rejectedChildbearingReload: !rejectedChildbearingReload,
        rejectedChildbearing_record_date: {
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
      searchParams.get("rejectedChildbearing_id_code") ||
      searchParams.get("rejectedChildbearing_record_date")
    ) {
      dispatch(rejectedLoan({ rejectedChildbearingShowDeleteBtn: true }));
    } else {
      dispatch(rejectedLoan({ rejectedChildbearingShowDeleteBtn: false }));
    }
  };

  const onPaginationHandler = (
    rejectedChildbearingPageNumber,
    rejectedChildbearingRecordsPerPage
  ) => {
    const newQueryParam = {
      ...queryParam,
      rejectedChildbearingPageNumber: rejectedChildbearingPageNumber,
      rejectedChildbearingRecordsPerPage: rejectedChildbearingRecordsPerPage,
    };
    setPagination({
      rejectedChildbearingPageNumber,
      rejectedChildbearingRecordsPerPage,
    });
    navigate({ search: queryString.stringify(newQueryParam) });
  };

  const crateTable = () => {
    let criteria = [],
      val;
    if (
      searchParams.get("rejectedChildbearing_id_code") ||
      searchParams.get("rejectedChildbearing_record_date")
    ) {
      const bodySearch = {
        [searchParams.get("rejectedChildbearing_id_code") &&
        "identificationCode"]: searchParams.get("rejectedChildbearing_id_code"),
        [searchParams.get("rejectedChildbearing_record_date") && "createdDate"]:
          searchParams.get("rejectedChildbearing_record_date"),
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
          (pagination.rejectedChildbearingPageNumber - 1) *
          pagination.rejectedChildbearingRecordsPerPage,
        count: pagination.rejectedChildbearingRecordsPerPage,
        [rejectedChildbearingSortBy && "sort_by"]: rejectedChildbearingSortBy,
        criteria: {
          operation: "and",
          criteria: criteria,
        },
      };
    } else {
      val = {
        offset:
          (pagination.rejectedChildbearingPageNumber - 1) *
          pagination.rejectedChildbearingRecordsPerPage,
        count: pagination.rejectedChildbearingRecordsPerPage,
        [rejectedChildbearingSortBy && "sort_by"]: rejectedChildbearingSortBy,
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

    getChildbearingLoanList(val)
      .then((res) => {
        dispatch(
          rejectedLoan({
            rejectedChildbearingList: res.data?.data,
            rejectedChildbearingEndRow: res.data?.end_row,
            rejectedChildbearingStartRow: res.data?.start_row,
            rejectedChildbearingTotalRows: res.data?.total_rows,
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
      fixed: "left",
      render: (_text, _record, index) => {
        if (pagination.rejectedChildbearingPageNumber === 1) {
          return <span className="pagination-column">{index + 1}</span>;
        } else {
          return (
            <span className="pagination-column">
              {((pagination.rejectedChildbearingPageNumber === 0
                ? pagination.rejectedChildbearingPageNumber + 1
                : pagination.rejectedChildbearingPageNumber) -
                1) *
                pagination.rejectedChildbearingRecordsPerPage +
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
      fixed: "left",
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
  ];

  return (
    <div>
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent name="rejectedChildbearing_id_code">
          <InputSearchComponent
            name="rejectedChildbearing_id_code"
            width={196}
            placeholder={Dictionary.nationalId + " " + Dictionary.applicant}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent
          name="rejectedChildbearing_record_date"
          className={Classes["form-item"]}
        >
          <NewDatePicker
            start={1398}
            id="rejectedChildbearing_record_date"
            end={thisYear}
            scroll={840}
            onChange={(value) =>
              dispatch(
                rejectedLoan({ rejectedChildbearing_record_date: value })
              )
            }
            className={Classes["date-picker"]}
            placeholder={`${Dictionary.date} ${Dictionary.record} Hibank`}
            classNamePad={Classes["date-picker-pad"]}
            value={searchParams.get("rejectedChildbearing_record_date")}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["search-part-btn"]}>
          {rejectedChildbearingShowDeleteBtn && (
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
        dataSource={rejectedChildbearingList}
        count={rejectedChildbearingTotalRows}
        tableLayout="unset"
      />
      {rejectedChildbearingTotalRows > 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.rejectedChildbearingRecordsPerPage}
          current={pagination.rejectedChildbearingPageNumber}
          total={rejectedChildbearingTotalRows}
        />
      )}
    </div>
  );
};
export default RejectedChildbearingLoan;
