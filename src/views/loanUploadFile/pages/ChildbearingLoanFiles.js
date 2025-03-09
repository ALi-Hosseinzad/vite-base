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
import { getChildbearingLoanUploadFilesList } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import PaginationComponent from "components/pagination/PaginationComponent";
import Classes from "views/loan/styles/Loan.module.scss";
import {
  loanUploadFile,
  loanUploadFileState,
} from "store/reducers/loan/LoanUploadFileReducer";
import TableComponent from "components/table/TableComponent";

const ChildbearingLoanFiles = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParam] = useState(queryString?.parse(location.search));
  const queryParamChildbearingRecordsPerPage =
    queryParam?.ChildbearingRecordsPerPage >= 50
      ? 50
      : Number(queryParam?.ChildbearingRecordsPerPage);
  const [pagination, setPagination] = useState({
    childbearingPageNumber: Number(queryParam?.ChildbearingPageNumber) || 1,
    childbearingRecordsPerPage: queryParamChildbearingRecordsPerPage || 10,
  });
  const LoanUploadFileData = useSelector(loanUploadFileState);
  const {
    childbearingShowDeleteBtn,
    childbearingList,
    childbearingSortBy,
    childbearingTotalRows,
    childbearingReload,
    resetFormChildbearing,
  } = LoanUploadFileData;

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
      searchParams.get("childbearing_central_bank_trace_id") ||
      searchParams.get("childbearing_id_code")
    ) {
      form.setFieldsValue({
        childbearing_central_bank_trace_id: searchParams.get(
          "childbearing_central_bank_trace_id"
        ),
        childbearing_id_code: searchParams.get("childbearing_id_code"),
      });
      dispatch(loanUploadFile({ childbearingShowDeleteBtn: true }));
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("childbearingPageNumber")) {
      crateTable();
      handleResetSearch();
    }
  }, [searchParams, childbearingSortBy, childbearingReload]);

  useEffect(() => {
    if (resetFormChildbearing) {
      form.resetFields();
      dispatch(loanUploadFile({ resetForm: false }));
    }
  }, [resetFormChildbearing]);

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
      childbearingPageNumber: 1,
      childbearingRecordsPerPage: pagination.childbearingRecordsPerPage,
    };
    setSearchParams(newQueryParam);
    dispatch(loanUploadFile({ childbearingShowDeleteBtn: true }));
    setPagination({ ...pagination, childbearingPageNumber: 1 });
  };

  const resetSearch = () => {
    searchParams.delete("childbearing_identification_code");
    searchParams.delete("childbearing_central_bank_trace_id");
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
      loanUploadFile({
        childbearingShowDeleteBtn: false,
        childbearingReload: !childbearingReload,
      })
    );
    form.resetFields();
  };

  const handleResetSearch = () => {
    if (
      searchParams.get("childbearing_identification_code") ||
      searchParams.get("childbearing_central_bank_trace_id")
    ) {
      dispatch(loanUploadFile({ childbearingShowDeleteBtn: true }));
    } else {
      dispatch(loanUploadFile({ childbearingShowDeleteBtn: false }));
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
      searchParams.get("childbearing_central_bank_trace_id") ||
      searchParams.get("childbearing_identification_code")
    ) {
      const bodySearch = {
        [searchParams.get("childbearing_identification_code") &&
        "fatherIdentificationCode"]: searchParams.get(
          "childbearing_identification_code"
        ),
        [searchParams.get("childbearing_central_bank_trace_id") &&
        "centralBankTraceId"]: searchParams.get(
          "childbearing_central_bank_trace_id"
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
          (pagination.childbearingPageNumber - 1) *
          pagination.childbearingRecordsPerPage
        ).toString(),
        count: pagination.childbearingRecordsPerPage.toString(),
        [childbearingSortBy && "sort_by"]: childbearingSortBy,
        criteria: { operation: "and", criteria: criteria },
      };
    } else {
      val = {
        offset: (
          (pagination.childbearingPageNumber - 1) *
          pagination.childbearingRecordsPerPage
        ).toString(),
        count: pagination.childbearingRecordsPerPage.toString(),
        [childbearingSortBy && "sort_by"]: childbearingSortBy,
      };
    }
    Object.keys(val).forEach(
      (key) =>
        (val[key] === undefined || val[key] === null || val[key] === "") &&
        delete val[key]
    );

    getChildbearingLoanUploadFilesList(val)
      .then((res) => {
        const convertList = [];
        res?.data?.data.forEach((node, index) => {
          const convertObj = { id: index, ...node };
          convertList.push(convertObj);
        });
        dispatch(
          loanUploadFile({
            childbearingList: convertList,
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
      width: 50,
      fixed: "right",
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
      title: `${Dictionary.traceCode} ${Dictionary.centralBank}`,
      key: "central_bank_trace_id",
      dataIndex: "central_bank_trace_id",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: Dictionary.nationalId,
      key: "father_identification_code",
      dataIndex: "father_identification_code",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: Dictionary.name,
      key: "father_first_name",
      dataIndex: "father_first_name",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: Dictionary.lastName,
      key: "father_last_name",
      dataIndex: "father_last_name",
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
      title: `${Dictionary.nationalId} ${Dictionary.child}`,
      key: "child_identification_code",
      dataIndex: "child_identification_code",
      width: 200,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: `${Dictionary.name} ${Dictionary.and} ${Dictionary.lastName} ${Dictionary.child}`,
      key: "child_fullname",
      dataIndex: "child_fullname",
      width: 300,
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: `${Dictionary.birthDate} ${Dictionary.child}`,
      key: "child_birth_date",
      dataIndex: "child_birth_date",
      width: 200,
      render: (record) => <>{record || "--"}</>,
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
        <FormItemComponent name="childbearing_identification_code">
          <InputSearchComponent
            name="childbearing_identification_code"
            width={196}
            placeholder={Dictionary.nationalId + " " + Dictionary.applicant}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent
          name="childbearing_central_bank_trace_id"
          className={Classes["form-item"]}
        >
          <InputSearchComponent
            name="childbearing_central_bank_trace_id"
            width={196}
            placeholder={Dictionary.traceCode + " " + Dictionary.centralBank}
            maxLength={10}
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
        scroll={{ x: 3700, y: 530 }}
        columns={columns}
        dataSource={childbearingList}
        count={pagination.childbearingRecordsPerPage}
        tableLayout="unset"
      />
      {childbearingTotalRows > 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.childbearingRecordsPerPage}
          current={pagination.childbearingPageNumber}
          total={childbearingTotalRows}
        />
      )}
    </div>
  );
};
export default ChildbearingLoanFiles;
