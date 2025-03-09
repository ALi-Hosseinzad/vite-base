import React, { useEffect, useRef, useState } from "react";
import NewDatePicker from "components/newDatePicker/NewDatePicker";
import Dictionary from "helpers/Dictionary";
import { useDispatch, useSelector } from "react-redux";
import moment from "jalali-moment";
import ButtonComponent from "components/button/ButtonComponent";
import Classes from "./styles/Turnover.module.scss";
import HeaderPage from "components/headerPage/HeaderPage";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { Form } from "antd";
import {
  resetTurnover,
  turnover,
  turnoverState,
} from "store/reducers/accountingDocuments/TurnoverReducer";
import TableComponent from "components/table/TableComponent";
import PaginationComponent from "components/pagination/PaginationComponent";
import { searchTransactionGl } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";

const Turnover = () => {
  const navigate = useNavigate();
  const thisYear = moment(Date.now()).locale("fa").format("YYYY");
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const turnoverData = useSelector(turnoverState);
  const { list, totalRows } = turnoverData;
  const [form] = Form.useForm();
  const formRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams?.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });
  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination(newQueryParam);
  };
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
      title: Dictionary.traceCode,
      key: "trace_id",
      dataIndex: "trace_id",
      width: "15%",
    },
    {
      title: Dictionary.amountTransaction + " (" + Dictionary.rial + ") ",
      key: "amount",
      dataIndex: "amount",
      width: "20%",
      render: (text) => (
        <p style={{ direction: "ltr" }}>{Number(text).toLocaleString("en")}</p>
      ),
    },
    {
      title: Dictionary.actions,
      key: "cr_dr",
      dataIndex: "cr_dr",
      width: "15%",
      render: (text) => (
        <p
          className={
            text === "CREDIT"
              ? Classes["green"]
              : text === "DEBIT"
              ? Classes["red"]
              : ""
          }
        >
          {text === "CREDIT"
            ? Dictionary.credit
            : text === "DEBIT"
            ? Dictionary.debit
            : ""}
        </p>
      ),
    },
    {
      title: Dictionary.date,
      key: "created_date",
      dataIndex: "created_date",
      width: "20%",
    },
    {
      title: Dictionary.desc + " " + Dictionary.transaction,
      key: "description",
      dataIndex: "description",
      width: "30%",
    },
  ];

  const onCancel = () => {
    navigate("/manage-gl");
  };
  const onFinish = (values) => {
    if (values) {
      const newQueryParam = {
        pageNumber: 1,
        recordsPerPage: pagination.recordsPerPage,
        createDateFrom:
          values.from.year + "/" + values.from.month + "/" + values.from.day,
        createDateTo:
          values.to.year + "/" + values.to.month + "/" + values.to.day,
        glCode: searchParams?.get("glCode"),
      };
      setSearchParams(newQueryParam);
      dispatch(turnover({ showDeleteBtn: true, sortColumn: "" }));
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
  const createTable = () => {
    if (searchParams?.get("createDateFrom")) {
      searchTransactionGl({
        offset: `${
          (searchParams.get("pageNumber") - 1) *
          searchParams.get("recordsPerPage")
        }`,
        count: searchParams?.get("recordsPerPage"),
        criteria: {
          operation: "and",
          criteria: [
            {
              key: "createdDate",
              value: [
                searchParams?.get("createDateFrom"),
                searchParams?.get("createDateTo"),
              ],
              operation: "between",
            },
            {
              key: "glCode",
              value: searchParams?.get("glCode"),
              operation: "equals",
            },
          ],
        },
      })
        .then((res) => {
          dispatch(
            turnover({
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
    }
  };
  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      createTable();
    }
    return () => {
      dispatch(resetTurnover());
    };
  }, [searchParams]);
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
    if (searchParams.get("createDateFrom")) {
      const val = searchParams.get("createDateFrom").split("/");
      form.setFieldsValue({
        from: { day: val[2], month: val[1], year: val[0] },
      });
    }
    if (searchParams.get("createDateTo")) {
      const val = searchParams.get("createDateTo").split("/");
      form.setFieldsValue({ to: { day: val[2], month: val[1], year: val[0] } });
    }
  }, []);
  return (
    <div>
      <HeaderPage
        title={
          Dictionary.turnover +
          " " +
          Dictionary.document +
          " " +
          searchParams.get("glCode")
        }
        onClickBack={onCancel}
        addIcon={false}
      />
      <FormComponent
        layout="inline"
        onFinish={onFinish}
        form={form}
        ref={formRef}
        className={Classes["account-search-bar"]}
      >
        <FormItemComponent
          name="from"
          className={Classes["form-item"]}
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
          ]}
        >
          <NewDatePicker
            start={1401}
            id="from"
            end={thisYear}
            scroll={0}
            className={Classes["date-picker"]}
            placeholder={Dictionary.from}
            classNamePad={Classes["date-picker-pad"]}
            defaultValue={searchParams.get("createDateFrom")}
          />
        </FormItemComponent>
        <FormItemComponent
          name="to"
          className={Classes["form-item"]}
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                let dateFromToMillisecond = `${getFieldValue("from").year}${
                  getFieldValue("from").month
                }${getFieldValue("from").day}`;
                let dateToMillisecond = `${value.year}${value.month}${value.day}`;
                if (dateFromToMillisecond <= dateToMillisecond) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(Dictionary.differenceBetweenTwoDates)
                );
              },
            }),
          ]}
        >
          <NewDatePicker
            start={1401}
            id="to"
            end={thisYear}
            scroll={0}
            className={Classes["date-picker"]}
            placeholder={Dictionary.to}
            classNamePad={Classes["date-picker-pad"]}
            defaultValue={searchParams.get("createDateTo")}
          />
        </FormItemComponent>

        <FormItemComponent className={Classes["account-search-bar-btn"]}>
          <ButtonComponent
            classNameBtn={Classes["account-search-btn"]}
            type="primary"
            htmlType={Dictionary.search}
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
      {searchParams?.get("createDateFrom") && (
        <TableComponent columns={columns} dataSource={list} count={totalRows} />
      )}
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
export default Turnover;
