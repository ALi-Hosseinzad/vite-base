import React, { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import moment from "jalali-moment";
import queryString from "query-string";
import Dictionary from "helpers/Dictionary";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import Variables from "assets/styles/_Variables.scss";
import { useDispatch, useSelector } from "react-redux";
import Visible from "assets/images/icon/VisibleGrey.svg";
import Classes from "views/loan/styles/Loan.module.scss";
import FormComponent from "components/form/FormComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import { getMarriageLoanList } from "helpers/APIFunction";
import { loanState } from "store/reducers/loan/LoanReducer";
import TableComponent from "components/table/TableComponent";
import ButtonComponent from "components/button/ButtonComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import NewDatePicker from "components/newDatePicker/NewDatePicker";
import FormItemComponent from "components/formItem/FormItemComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import { getStatusListOfLoan } from "store/middleware/getStatusLoanList";
import PaginationComponent from "components/pagination/PaginationComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import {
  marriageLoan,
  marriageLoanState,
} from "store/reducers/loan/MarriageLoanReducer";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const MarriageLoan = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const thisYear = moment(Date.now()).locale("fa").format("YYYY");
  const [queryParam] = useState(queryString?.parse(location.search));
  const queryParamMarriageRecordsPerPage =
    queryParam?.marriageRecordsPerPage >= 50
      ? 50
      : Number(queryParam?.marriageRecordsPerPage);
  const [pagination, setPagination] = useState({
    marriagePageNumber: Number(queryParam?.marriagePageNumber) || 1,
    marriageRecordsPerPage: queryParamMarriageRecordsPerPage || 10,
  });
  const loanData = useSelector(loanState);
  const { permissions } = loanData;
  const MarriageLoanData = useSelector(marriageLoanState);
  const {
    marriageShowDeleteBtn,
    marriageList,
    marriageSortBy,
    marriageTotalRows,
    marriageReload,
    marriage_record_date,
    statusList,
  } = MarriageLoanData;

  useEffect(() => {
    if (statusList.length === 0) {
      dispatch(getStatusListOfLoan(errorHandler));
    }
  }, []);

  useEffect(() => {
    let newQueryParam = {
      marriagePageNumber: pagination.marriagePageNumber,
      marriageRecordsPerPage: pagination.marriageRecordsPerPage,
    };
    for (const [key, value] of searchParams.entries()) {
      if (key !== "marriagePageNumber" && key !== "marriageRecordsPerPage") {
        newQueryParam[key] = value;
      }
    }
    setSearchParams(newQueryParam);
  }, [pagination.marriagePageNumber, pagination.marriageRecordsPerPage]);

  useEffect(() => {
    if (
      searchParams.get("marriage_id_code") ||
      searchParams.get("central_bank_trace_id")
    ) {
      form.setFieldsValue({
        marriage_id_code: searchParams.get("marriage_id_code"),
        central_bank_trace_id: searchParams.get("central_bank_trace_id"),
      });
      dispatch(marriageLoan({ marriageShowDeleteBtn: true }));
    }
    if (searchParams.get("marriage_record_date")) {
      form.setFieldsValue({
        marriage_record_date: searchParams.get("marriage_record_date"),
      });
      const val = searchParams.get("marriage_record_date").split("/");
      dispatch(
        marriageLoan({
          marriage_record_date: { day: val[2], month: val[1], year: val[0] },
          marriageShowDeleteBtn: true,
        })
      );
    }
    if (searchParams.get("marriage_status")) {
      form.setFieldsValue({
        marriage_status: items?.find(
          (item) => item.value === searchParams.get("marriage_status")
        ),
      });
      dispatch(marriageLoan({ marriageShowDeleteBtn: true }));
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("marriagePageNumber")) {
      crateTable();
      handleResetSearch();
    }
  }, [searchParams, marriageReload, marriageSortBy]);

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
      marriage_record_date.year &&
      marriage_record_date.day &&
      marriage_record_date.month
    ) {
      newQueryParam = {
        ...values,
        ...searchParams,
        marriagePageNumber: 1,
        marriageRecordsPerPage: pagination.marriageRecordsPerPage,
        marriage_record_date:
          marriage_record_date.year +
          "/" +
          marriage_record_date.month +
          "/" +
          marriage_record_date.day,
      };
    } else {
      newQueryParam = {
        ...values,
        ...searchParams,
        marriagePageNumber: 1,
        marriageRecordsPerPage: pagination.marriageRecordsPerPage,
      };
    }
    setSearchParams(newQueryParam);
    dispatch(marriageLoan({ marriageShowDeleteBtn: true }));
    setPagination({ ...pagination, marriagePageNumber: 1 });
  };

  const resetSearch = () => {
    searchParams.delete("marriage_status");
    searchParams.delete("marriage_id_code");
    searchParams.delete("marriage_record_date");
    searchParams.delete("central_bank_trace_id");
    const newQueryParam = {
      ...searchParams,
      marriagePageNumber: 1,
      marriageRecordsPerPage: pagination.marriageRecordsPerPage,
    };
    setSearchParams(newQueryParam);
    setPagination({
      marriagePageNumber: 1,
      marriageRecordsPerPage: pagination.marriageRecordsPerPage,
    });
    dispatch(
      marriageLoan({
        marriageShowDeleteBtn: false,
        marriageReload: !marriageReload,
        marriage_record_date: { year: "", month: "", day: "" },
      })
    );
    form.resetFields();
  };

  const handleResetSearch = () => {
    if (
      searchParams.get("marriage_status") ||
      searchParams.get("marriage_id_code") ||
      searchParams.get("marriage_record_date") ||
      searchParams.get("central_bank_trace_id")
    ) {
      dispatch(marriageLoan({ marriageShowDeleteBtn: true }));
    } else {
      dispatch(marriageLoan({ marriageShowDeleteBtn: false }));
    }
  };

  const onPaginationHandler = (marriagePageNumber, marriageRecordsPerPage) => {
    const newQueryParam = {
      ...queryParam,
      marriagePageNumber: marriagePageNumber,
      marriageRecordsPerPage: marriageRecordsPerPage,
    };
    setPagination({ marriagePageNumber, marriageRecordsPerPage });
    navigate({ search: queryString.stringify(newQueryParam) });
  };

  const crateTable = () => {
    let criteria = [],
      val;
    if (
      searchParams.get("marriage_id_code") ||
      searchParams.get("marriage_record_date") ||
      searchParams.get("marriage_status") ||
      searchParams.get("central_bank_trace_id")
    ) {
      const bodySearch = {
        [searchParams.get("marriage_id_code") && "identificationCode"]:
          searchParams.get("marriage_id_code"),
        [searchParams.get("marriage_record_date") && "createdDate"]:
          searchParams.get("marriage_record_date"),
        [searchParams.get("marriage_status") && "backOfficeUserStatus"]:
          searchParams.get("marriage_status"),
        [searchParams.get("central_bank_trace_id") && "centralBankTraceId"]:
          searchParams.get("central_bank_trace_id"),
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
              { key: key, value: bodySearch[key], operation: "equals" },
            ],
          });
        }
      });
      val = {
        offset:
          (pagination.marriagePageNumber - 1) *
          pagination.marriageRecordsPerPage,
        count: pagination.marriageRecordsPerPage,
        [marriageSortBy && "sort_by"]: marriageSortBy,
        criteria: { operation: "and", criteria: criteria },
      };
    } else {
      val = {
        offset:
          (pagination.marriagePageNumber - 1) *
          pagination.marriageRecordsPerPage,
        count: pagination.marriageRecordsPerPage,
        [marriageSortBy && "sort_by"]: marriageSortBy,
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
          marriageLoan({
            marriageList: res.data?.data,
            marriageEndRow: res.data?.end_row,
            marriageStartRow: res.data?.start_row,
            marriageTotalRows: res.data?.total_rows,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const columns = [
    {
      width: "3%",
      key: "index",
      dataIndex: "index",
      render: (_text, _record, index) => {
        if (pagination.marriagePageNumber === 1) {
          return <span className="pagination-column">{index + 1}</span>;
        } else {
          return (
            <span className="pagination-column">
              {((pagination.marriagePageNumber === 0
                ? pagination.marriagePageNumber + 1
                : pagination.marriagePageNumber) -
                1) *
                pagination.marriageRecordsPerPage +
                (index + 1)}
            </span>
          );
        }
      },
    },
    {
      width: "12%",
      key: "central_bank_trace_id",
      dataIndex: "central_bank_trace_id",
      title: `${Dictionary.code} ${Dictionary.track} ${Dictionary.centralBank}`,
      render: (record) => <>{record || "--"}</>,
    },
    {
      width: "12%",
      key: "fix_trace_id",
      dataIndex: "fix_trace_id",
      title: `${Dictionary.code} ${Dictionary.trace}`,
      render: (record) => <>{record || "--"}</>,
    },
    {
      width: "10%",
      key: "identification_code",
      dataIndex: "identification_code",
      title: `${Dictionary.nationalId} ${Dictionary.applicant}`,
      render: (record) => <>{record || "--"}</>,
    },
    {
      width: "12%",
      key: "submit_date_central_bank",
      dataIndex: "submit_date_central_bank",
      title: `${Dictionary.date} ${Dictionary.record} ${Dictionary.centralBank}`,
      render: (record) => <>{record || "--"}</>,
    },
    {
      width: "12%",
      key: "submit_date_hi_bank",
      dataIndex: "submit_date_hi_bank",
      title: `${Dictionary.date} ${Dictionary.record} Hibank`,
      render: (record) => <>{record || "--"}</>,
    },
    {
      width: "10%",
      key: "resort_date",
      dataIndex: "resort_date",
      title: Dictionary.serviceDate,
      render: (record) => <>{record || "--"}</>,
    },
    {
      width: "7%",
      key: "action",
      className: "",
      dataIndex: "action",
      render: (_field, record) => (
        <TooltipComponent
          title={
            permissions.viewMarriageDetails
              ? Dictionary.show + " " + Dictionary.data
              : false
          }
        >
          <CustomIcon
            size={24}
            src={Visible}
            name={`reason-record-${record.id}-edit`}
            cursor={permissions.viewMarriageDetails ? "pointer" : "not-allowed"}
            color={
              permissions.viewMarriageDetails
                ? Variables.LogoGreenDark
                : Variables.GreenLight7
            }
            onClick={
              permissions.viewMarriageDetails
                ? () => {
                    dispatch(marriageLoan({ record: record }));
                    navigate({
                      pathname: "/loan/supportance-loan/marriage-loan-details",
                      search: createSearchParams({
                        fix_trace_id: record.fix_trace_id,
                        reference_number: record.reference_number,
                        identification_code: record.identification_code,
                      }).toString(),
                    });
                  }
                : () => ""
            }
          />
        </TooltipComponent>
      ),
    },
    {
      key: "status",
      dataIndex: "status",
      title: `${Dictionary.status}`,
      width: "20%",
      render: (_field, record) => (
        <div className={Classes[`${record.status}-chip`]}>
          {record.status_desc}
        </div>
      ),
    },
  ];

  const items = [
    { id: 1, value: "IN_PROGRESS", text: "در انتظار پذیرش شعبه" },
    { id: 2, value: "ACCEPTED", text: "مراجعه به شعبه" },
    { id: 3, value: "REJECTED", text: "رد شده" },
    { id: 4, value: "CUSTOMER_MODIFY", text: "نیاز به ویرایش" },
    { id: 5, value: "RECHECK_BRANCH", text: "بررسی مجدد شعبه" },
    { id: 6, value: "DECLINE", text: "انصراف مشتری" },
  ];

  return (
    <div>
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent name="marriage_id_code">
          <InputSearchComponent
            name="marriage_id_code"
            width={196}
            placeholder={Dictionary.nationalId + " " + Dictionary.applicant}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent name="central_bank_trace_id">
          <InputSearchComponent
            width={196}
            maxLength={10}
            name="central_bank_trace_id"
            placeholder={`${Dictionary.code} ${Dictionary.track} ${Dictionary.centralBank}`}
          />
        </FormItemComponent>
        <FormItemComponent
          name="marriage_record_date"
          className={Classes["form-item"]}
        >
          <NewDatePicker
            scroll={0}
            start={1398}
            end={thisYear}
            id="marriage_record_date"
            className={Classes["date-picker"]}
            classNamePad={Classes["date-picker-pad"]}
            defaultValue={searchParams?.get("marriage_record_date")}
            placeholder={`${Dictionary.date} ${Dictionary.record} Hibank`}
            onChange={(value) =>
              dispatch(marriageLoan({ marriage_record_date: value }))
            }
          />
        </FormItemComponent>
        <FormItemComponent name="marriage_status">
          <SelectComponent
            name="marriage_status"
            width={196}
            placeholder={`${Dictionary.status} ${Dictionary.file}`}
            items={items}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["search-part-btn"]}>
          {marriageShowDeleteBtn && (
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
        columns={columns}
        dataSource={marriageList}
        count={marriageTotalRows}
      />
      {marriageTotalRows > 10 && (
        <PaginationComponent
          responsive={true}
          total={marriageTotalRows}
          current={pagination.marriagePageNumber}
          onPaginationHandler={onPaginationHandler}
          pageSize={pagination.marriageRecordsPerPage}
        />
      )}
    </div>
  );
};
export default MarriageLoan;
