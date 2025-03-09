import React, { useEffect, useRef, useState } from "react";
import Dictionary from "helpers/Dictionary";
import ButtonComponent from "components/button/ButtonComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getMarriageLoanUploadFilesList } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import PaginationComponent from "components/pagination/PaginationComponent";
import Classes from "views/loan/styles/Loan.module.scss";
import {
  loanUploadFile,
  loanUploadFileState,
} from "store/reducers/loan/LoanUploadFileReducer";
import TableComponent from "components/table/TableComponent";

const MarriageLoanFiles = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParam] = useState(queryString?.parse(location.search));
  const queryParamMarriageRecordsPerPage =
    queryParam?.marriageRecordsPerPage >= 50
      ? 50
      : Number(queryParam?.marriageRecordsPerPage);
  const [pagination, setPagination] = useState({
    marriagePageNumber: Number(queryParam?.marriagePageNumber) || 1,
    marriageRecordsPerPage: queryParamMarriageRecordsPerPage || 10,
  });
  const LoanUploadFileData = useSelector(loanUploadFileState);
  const {
    marriageShowDeleteBtn,
    marriageList,
    marriageSortBy,
    marriageTotalRows,
    marriageReload,
    resetForm,
  } = LoanUploadFileData;

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
      searchParams.get("marriage_central_bank_trace_id") ||
      searchParams.get("marriage_id_code")
    ) {
      form.setFieldsValue({
        marriage_central_bank_trace_id: searchParams.get(
          "marriage_central_bank_trace_id"
        ),
        marriage_id_code: searchParams.get("marriage_id_code"),
      });
      dispatch(loanUploadFile({ marriageShowDeleteBtn: true }));
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("marriagePageNumber")) {
      crateTable();
      handleResetSearch();
    }
  }, [searchParams, marriageSortBy, marriageReload]);

  useEffect(() => {
    if (resetForm) {
      form.resetFields();
      dispatch(loanUploadFile({ resetForm: false }));
    }
  }, [resetForm]);

  const onFinish = (values) => {
    Object.keys(values).forEach(
      (key) =>
        (values[key] === undefined ||
          values[key] === null ||
          values[key] === "") &&
        delete values[key]
    );
    let newQueryParam;
    newQueryParam = {
      ...values,
      ...searchParams,
      marriagePageNumber: 1,
      marriageRecordsPerPage: pagination.marriageRecordsPerPage,
    };
    setSearchParams(newQueryParam);
    dispatch(loanUploadFile({ marriageShowDeleteBtn: true }));
    setPagination({ ...pagination, marriagePageNumber: 1 });
  };

  const resetSearch = () => {
    searchParams.delete("marriage_identification_code");
    searchParams.delete("marriage_central_bank_trace_id");
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
      loanUploadFile({
        marriageShowDeleteBtn: false,
        marriageReload: !marriageReload,
      })
    );
    form.resetFields();
  };

  const handleResetSearch = () => {
    if (
      searchParams.get("marriage_identification_code") ||
      searchParams.get("marriage_central_bank_trace_id")
    ) {
      dispatch(loanUploadFile({ marriageShowDeleteBtn: true }));
    } else {
      dispatch(loanUploadFile({ marriageShowDeleteBtn: false }));
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
      searchParams.get("marriage_central_bank_trace_id") ||
      searchParams.get("marriage_identification_code")
    ) {
      const bodySearch = {
        [searchParams.get("marriage_identification_code") &&
        "identificationCode"]: searchParams.get("marriage_identification_code"),
        [searchParams.get("marriage_central_bank_trace_id") &&
        "centralBankTraceId"]: searchParams.get(
          "marriage_central_bank_trace_id"
        ),
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
        offset: (
          (pagination.marriagePageNumber - 1) *
          pagination.marriageRecordsPerPage
        ).toString(),
        count: pagination.marriageRecordsPerPage.toString(),
        [marriageSortBy && "sort_by"]: marriageSortBy,
        criteria: { operation: "and", criteria: criteria },
      };
    } else {
      val = {
        offset: (
          (pagination.marriagePageNumber - 1) *
          pagination.marriageRecordsPerPage
        ).toString(),
        count: pagination.marriageRecordsPerPage.toString(),
        [marriageSortBy && "sort_by"]: marriageSortBy,
      };
    }
    Object.keys(val).forEach(
      (key) =>
        (val[key] === undefined || val[key] === null || val[key] === "") &&
        delete val[key]
    );

    getMarriageLoanUploadFilesList(val)
      .then((res) => {
        const convertList = [];
        res?.data?.data.forEach((node, index) => {
          const convertObj = { id: index, ...node };
          convertList.push(convertObj);
        });
        dispatch(
          loanUploadFile({
            marriageList: convertList,
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
      dataIndex: "index",
      key: "index",
      width: 50,
      fixed: "right",
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
      title: `${Dictionary.traceCode} ${Dictionary.centralBank}`,
      key: "central_bank_trace_id",
      dataIndex: "central_bank_trace_id",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: Dictionary.nationalId,
      key: "identification_code",
      dataIndex: "identification_code",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: Dictionary.name,
      key: "first_name",
      dataIndex: "first_name",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: Dictionary.lastName,
      key: "last_name",
      dataIndex: "last_name",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: `${Dictionary.number} ${Dictionary.mobile}`,
      key: "mobile_number",
      dataIndex: "mobile_number",
      width: 200,
      render: (record) => <>{record?.toString()?.padStart(11, "0") || "--"}</>,
    },
    {
      title: `${Dictionary.date} ${Dictionary.register}`,
      key: "submit_date",
      dataIndex: "submit_date",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: Dictionary.branchCode,
      key: "branch_code",
      dataIndex: "branch_code",
      width: 150,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: `${Dictionary.date} ${Dictionary.selectBranch}`,
      key: "branch_acceptance_date",
      dataIndex: "branch_acceptance_date",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: `${Dictionary.date} ${Dictionary.acceptance}`,
      key: "resort_date",
      dataIndex: "resort_date",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: `${Dictionary.number} ${Dictionary.phone}`,
      key: "phone_number",
      dataIndex: "phone_number",
      width: 200,
      render: (record) => <>{record?.toString()?.padStart(11, "0") || "--"}</>,
    },
    {
      title: Dictionary.status,
      key: "status",
      dataIndex: "status",
      width: 300,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: `${Dictionary.date} ${Dictionary.selectStatus}`,
      key: "status_date",
      dataIndex: "status_date",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: Dictionary.isar,
      key: "sacrifice_quota",
      dataIndex: "sacrifice_quota",
      width: 200,
      render: (record) => <>{record ? Dictionary.have : "--"}</>,
    },
    {
      title: Dictionary.loanAmount,
      key: "loan_amount",
      dataIndex: "loan_amount",
      width: 200,
      render: (_field, record) => (
        <>
          {record.loan_amount
            ? Number(record.loan_amount).toLocaleString("en")
            : "--"}
        </>
      ),
    },
    {
      title: Dictionary.rejectReasonPay,
      key: "reason_reject_payment",
      dataIndex: "reason_reject_payment",
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
        <FormItemComponent name="marriage_identification_code">
          <InputSearchComponent
            name="marriage_identification_code"
            width={196}
            placeholder={Dictionary.nationalId + " " + Dictionary.applicant}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent
          name="marriage_central_bank_trace_id"
          className={Classes["form-item"]}
        >
          <InputSearchComponent
            name="marriage_central_bank_trace_id"
            width={196}
            placeholder={Dictionary.traceCode + " " + Dictionary.centralBank}
            maxLength={10}
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
        scroll={{ x: 3300, y: 530 }}
        columns={columns}
        dataSource={marriageList}
        count={pagination.marriageRecordsPerPage}
        tableLayout="unset"
      />
      {marriageTotalRows > 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.marriageRecordsPerPage}
          current={pagination.marriagePageNumber}
          total={marriageTotalRows}
        />
      )}
    </div>
  );
};
export default MarriageLoanFiles;
