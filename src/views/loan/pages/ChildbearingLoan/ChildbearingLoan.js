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
import { loanState } from "store/reducers/loan/LoanReducer";
import TableComponent from "components/table/TableComponent";
import { getChildbearingLoanList } from "helpers/APIFunction";
import ButtonComponent from "components/button/ButtonComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import NewDatePicker from "components/newDatePicker/NewDatePicker";
import FormItemComponent from "components/formItem/FormItemComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import { getStatusListOfLoan } from "store/middleware/getStatusLoanList";
import PaginationComponent from "components/pagination/PaginationComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  childbearingLoan,
  childbearingLoanState,
} from "store/reducers/loan/ChildbearingLoanReducer";

const ChildbearingLoan = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const thisYear = moment(Date.now()).locale("fa").format("YYYY");
  const [queryParam] = useState(queryString?.parse(location.search));
  const queryParamChildbearingRecordsPerPage =
    queryParam?.childbearingRecordsPerPage >= 50
      ? 50
      : Number(queryParam?.childbearingRecordsPerPage);
  const [pagination, setPagination] = useState({
    childbearingPageNumber: Number(queryParam?.childbearingPageNumber) || 1,
    childbearingRecordsPerPage: queryParamChildbearingRecordsPerPage || 10,
  });
  const loanData = useSelector(loanState);
  const { permissions } = loanData;
  const ChildbearingLoanData = useSelector(childbearingLoanState);
  const {
    statusList,
    childbearingList,
    childbearingSortBy,
    childbearingReload,
    childbearingTotalRows,
    childbearing_record_date,
    childbearingShowDeleteBtn,
  } = ChildbearingLoanData;

  useEffect(() => {
    if (statusList.length === 0) {
      dispatch(getStatusListOfLoan(errorHandler));
    }
  }, []);

  useEffect(() => {
    let newQueryParam = {
      childbearingPageNumber: pagination.childbearingPageNumber,
      childbearingRecordsPerPage: pagination.childbearingRecordsPerPage,
    };
    for (const [key, value] of searchParams.entries()) {
      if (
        key !== "childbearingPageNumber" &&
        key !== "childbearingRecordsPerPage"
      ) {
        newQueryParam[key] = value;
      }
    }
    setSearchParams(newQueryParam);
  }, [
    pagination.childbearingPageNumber,
    pagination.childbearingRecordsPerPage,
  ]);

  useEffect(() => {
    if (
      searchParams.get("childbearing_id_code") ||
      searchParams.get("central_bank_trace_id")
    ) {
      form.setFieldsValue({
        childbearing_id_code: searchParams.get("childbearing_id_code"),
        central_bank_trace_id: searchParams.get("central_bank_trace_id"),
      });
      dispatch(childbearingLoan({ childbearingShowDeleteBtn: true }));
    }
    if (searchParams.get("childbearing_record_date")) {
      const value = searchParams?.get("childbearing_record_date").split("/");
      dispatch(
        childbearingLoan({
          childbearing_record_date: {
            day: value[2],
            month: value[1],
            year: value[0],
          },
          childbearingShowDeleteBtn: true,
        })
      );
      form.setFieldsValue({
        childbearing_record_date: searchParams.get("childbearing_record_date"),
      });
    }
    if (searchParams.get("childbearing_status")) {
      form.setFieldsValue({
        childbearing_status: items?.find(
          (item) => item.value === searchParams.get("childbearing_status")
        ),
      });
      dispatch(childbearingLoan({ childbearingShowDeleteBtn: true }));
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("childbearingPageNumber")) {
      crateTable();
      handleResetSearch();
    }
  }, [searchParams]);

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
      childbearing_record_date.year &&
      childbearing_record_date.day &&
      childbearing_record_date.month
    ) {
      newQueryParam = {
        ...values,
        ...searchParams,
        childbearingPageNumber: 1,
        childbearingRecordsPerPage: pagination.childbearingRecordsPerPage,
        childbearing_record_date:
          childbearing_record_date.year +
          "/" +
          childbearing_record_date.month +
          "/" +
          childbearing_record_date.day,
      };
    } else {
      newQueryParam = {
        ...values,
        ...searchParams,
        childbearingPageNumber: 1,
        childbearingRecordsPerPage: pagination.childbearingRecordsPerPage,
      };
    }
    setSearchParams(newQueryParam);
    dispatch(childbearingLoan({ childbearingShowDeleteBtn: true }));
    setPagination({ ...pagination, childbearingPageNumber: 1 });
  };

  const resetSearch = () => {
    searchParams.delete("childbearing_status");
    searchParams.delete("childbearing_id_code");
    searchParams.delete("central_bank_trace_id");
    searchParams.delete("childbearing_record_date");
    const newQueryParam = {
      ...searchParams,
      childbearingPageNumber: 1,
      childbearingRecordsPerPage: pagination.childbearingRecordsPerPage,
    };
    setSearchParams(newQueryParam);
    setPagination({
      childbearingPageNumber: 1,
      childbearingRecordsPerPage: pagination.childbearingRecordsPerPage,
    });
    dispatch(
      childbearingLoan({
        childbearingShowDeleteBtn: false,
        childbearingReload: !childbearingReload,
        childbearing_record_date: { year: "", month: "", day: "" },
      })
    );
    form.resetFields();
  };

  const handleResetSearch = () => {
    if (
      searchParams.get("childbearing_status") ||
      searchParams.get("childbearing_id_code") ||
      searchParams.get("central_bank_trace_id") ||
      searchParams.get("childbearing_record_date")
    ) {
      dispatch(childbearingLoan({ childbearingShowDeleteBtn: true }));
    } else {
      dispatch(childbearingLoan({ childbearingShowDeleteBtn: false }));
    }
  };

  const onPaginationHandler = (
    childbearingPageNumber,
    childbearingRecordsPerPage
  ) => {
    const newQueryParam = {
      ...queryParam,
      childbearingPageNumber: childbearingPageNumber,
      childbearingRecordsPerPage: childbearingRecordsPerPage,
    };
    setPagination({ childbearingPageNumber, childbearingRecordsPerPage });
    navigate({ search: queryString.stringify(newQueryParam) });
  };

  const crateTable = () => {
    let criteria = [],
      val;
    if (
      searchParams.get("childbearing_status") ||
      searchParams.get("childbearing_id_code") ||
      searchParams.get("central_bank_trace_id") ||
      searchParams.get("childbearing_record_date")
    ) {
      const bodySearch = {
        [searchParams.get("childbearing_id_code") && "identificationCode"]:
          searchParams.get("childbearing_id_code"),
        [searchParams.get("childbearing_record_date") && "createdDate"]:
          searchParams.get("childbearing_record_date"),
        [searchParams.get("childbearing_status") && "backOfficeUserStatus"]:
          searchParams.get("childbearing_status"),
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
          (pagination.childbearingPageNumber - 1) *
          pagination.childbearingRecordsPerPage,
        count: pagination.childbearingRecordsPerPage,
        [childbearingSortBy && "sort_by"]: childbearingSortBy,
        criteria: { operation: "and", criteria: criteria },
      };
    } else {
      val = {
        offset:
          (pagination.childbearingPageNumber - 1) *
          pagination.childbearingRecordsPerPage,
        count: pagination.childbearingRecordsPerPage,
        [childbearingSortBy && "sort_by"]: childbearingSortBy,
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
          childbearingLoan({
            childbearingList: res.data?.data,
            childbearingEndRow: res.data?.end_row,
            childbearingStartRow: res.data?.start_row,
            childbearingTotalRows: res.data?.total_rows,
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
      width: "3%",
      render: (_text, _record, index) => {
        if (pagination.childbearingPageNumber === 1) {
          return <span className="pagination-column">{index + 1}</span>;
        } else {
          return (
            <span className="pagination-column">
              {((pagination.childbearingPageNumber === 0
                ? pagination.childbearingPageNumber + 1
                : pagination.childbearingPageNumber) -
                1) *
                pagination.childbearingRecordsPerPage +
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
            permissions.viewChildbearingDetails
              ? Dictionary.show + " " + Dictionary.data
              : false
          }
        >
          <CustomIcon
            src={Visible}
            onClick={
              permissions.viewChildbearingDetails
                ? () => {
                    dispatch(childbearingLoan({ record: record }));
                    navigate({
                      pathname:
                        "/loan/supportance-loan/childbearing-loan-details",
                      search: createSearchParams({
                        fix_trace_id: record.fix_trace_id,
                        reference_number: record.reference_number,
                        identification_code: record.identification_code,
                      }).toString(),
                    });
                  }
                : () => ""
            }
            color={
              permissions.viewChildbearingDetails
                ? Variables.LogoGreenDark
                : Variables.GreenLight7
            }
            size={24}
            cursor={
              permissions.viewChildbearingDetails ? "pointer" : "not-allowed"
            }
            name={`reason-record-${record.id}-edit`}
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
        <FormItemComponent name="childbearing_id_code">
          <InputSearchComponent
            width={196}
            maxLength={10}
            name="childbearing_id_code"
            placeholder={Dictionary.nationalId + " " + Dictionary.applicant}
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
          name="childbearing_record_date"
          className={Classes["form-item"]}
        >
          <NewDatePicker
            scroll={0}
            start={1401}
            end={thisYear}
            id="childbearing_record_date"
            className={Classes["date-picker"]}
            classNamePad={Classes["date-picker-pad"]}
            defaultValue={searchParams.get("childbearing_record_date")}
            placeholder={`${Dictionary.date} ${Dictionary.record} Hibank`}
            onChange={(value) =>
              dispatch(childbearingLoan({ childbearing_record_date: value }))
            }
          />
        </FormItemComponent>
        <FormItemComponent name="childbearing_status">
          <SelectComponent
            name="childbearing_status"
            width={196}
            placeholder={`${Dictionary.status} ${Dictionary.file}`}
            items={items}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["search-part-btn"]}>
          {childbearingShowDeleteBtn && (
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
        dataSource={childbearingList}
        count={childbearingTotalRows}
      />
      {childbearingTotalRows > 10 && (
        <PaginationComponent
          responsive={true}
          total={childbearingTotalRows}
          onPaginationHandler={onPaginationHandler}
          current={pagination.childbearingPageNumber}
          pageSize={pagination.childbearingRecordsPerPage}
        />
      )}
    </div>
  );
};
export default ChildbearingLoan;
