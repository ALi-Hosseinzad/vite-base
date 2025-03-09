import React, { useEffect, useRef, useState } from "react";
import {
  getAllExpressionEvents,
  getReactionSentences,
} from "helpers/APIFunction";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import useErrorHandler from "helpers/useErrorHandler";
import { useSearchParams } from "react-router-dom";
import { createSearchObject } from "helpers/CreateSearchObject";
import { errorResponse } from "helpers/APIService";
import {
  expression,
  resetExpression,
} from "store/reducers/expression/expressionReducer";
import TableComponent from "components/table/TableComponent";
import Dictionary from "helpers/Dictionary";
import Edit from "assets/images/icon/Edit.svg";
import Delete from "assets/images/icon/Delete.svg";
import TooltipComponent from "components/tooltip/TooltipComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import Classes from "views/expression/styles/expression.module.scss";
import HeaderPage from "components/headerPage/HeaderPage";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import ButtonComponent from "components/button/ButtonComponent";
import PaginationComponent from "components/pagination/PaginationComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import AddEditExpression from "./pageComponents/AddEditExpression";
import DeleteExpression from "./pageComponents/DeleteExpression";
import { MatchAuthority } from "helpers/MatchAuthority";
import Variables from "assets/styles/_Variables.scss";
import SortableTitle from "components/sortableTitle/SortableTitle";

const Expression = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const expressionData = useSelector((state) => state.expression.value);
  const userInfoData = useSelector((state) => state.userInfo.value);
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });

  useEffect(() => {
    dispatch(resetExpression());
  }, []);

  const handleSort = (column) => {
    dispatch(expression({ sortColumn: column }));
    if (expressionData.sortType[column] === "") {
      dispatch(expression({ sortBy: column }));
    } else if (expressionData.sortType[column] === "inc") {
      dispatch(expression({ sortBy: `-${column}` }));
    } else if (expressionData.sortType[column] === "desc") {
      dispatch(expression({ sortBy: "-createdDate" }));
    }
  };
  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        expression({
          permissions: {
            create: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/expression/add-update/v1"
            ),
            edit: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/expression/add-update/v1"
            ),
            delete: MatchAuthority(
              userInfoData.authorities,
              "Delete:/api/bo/expression/delete/{id}/v1"
            ),
            view: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/expression/search/v1"
            ),
          },
        })
      );
    } else {
      dispatch(
        expression({
          permissions: {
            create: true,
            edit: true,
            delete: true,
            view: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination(newQueryParam);
  };

  const createTable = (sortItem) => {
    getReactionSentences(
      createSearchObject(searchParams, {
        operation: "equals",
        sortBy: sortItem,
      })
    )
      .then((res) => {
        const convert = res.data?.data?.map((node) => {
          return {
            event: node.event,
            eventDescription: node.event_description,
            expression: node.expression,
            id: node.id,
          };
        });
        dispatch(
          expression({
            list: convert,
            endRow: res.data.end_row,
            startRow: res.data.start_row,
            totalRows: res.data.total_rows,
          })
        );
      })
      .then(() => {
        if (expressionData.sortColumn) {
          const keys = Object.keys(expressionData.sortType).filter(
            (p) => p !== expressionData.sortColumn
          );
          const newSort = {};
          keys.forEach((p) => (newSort[p] = ""));
          if (expressionData.sortType[expressionData.sortColumn] === "") {
            dispatch(
              expression({
                sortType: { [expressionData.sortColumn]: "inc", ...newSort },
              })
            );
          } else if (
            expressionData.sortType[expressionData.sortColumn] === "inc"
          ) {
            dispatch(
              expression({
                sortType: { [expressionData.sortColumn]: "desc", ...newSort },
              })
            );
          } else if (
            expressionData.sortType[expressionData.sortColumn] === "desc"
          ) {
            dispatch(
              expression({
                sortType: { [expressionData.sortColumn]: "", ...newSort },
              })
            );
          }
        }
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const onFinish = (values) => {
    Object.keys(values).forEach(
      (key) =>
        (values[key] === undefined ||
          values[key] === null ||
          values[key] === "") &&
        delete values[key]
    );
    if (Object.keys(values)?.length > 0) {
      const newQueryParam = {
        pageNumber: 1,
        recordsPerPage: pagination.recordsPerPage,
        ...values,
      };
      setSearchParams(newQueryParam);
      dispatch(expression({ showDeleteBtn: true, sortColumn: "" }));
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

  const handleResatSearch = () => {
    if (searchParams.get("event") || searchParams.get("expression")) {
      dispatch(expression({ showDeleteBtn: true }));
    } else {
      dispatch(expression({ showDeleteBtn: false }));
    }
  };

  const handleEdit = (record) => {
    dispatch(expression({ state: "edit", record: record, addModal: true }));
  };

  const handleAdd = () => {
    dispatch(expression({ addModal: true, state: "add" }));
  };

  const handleDelete = (record) => {
    dispatch(expression({ record: record, deleteModal: true }));
  };

  const resetSearch = () => {
    const newQueryParam = {
      pageNumber: 1,
      recordsPerPage: pagination.recordsPerPage,
    };
    setSearchParams(newQueryParam);
    dispatch(expression({ showDeleteBtn: false, sortColumn: "" }));
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue({
      expression: searchParams.get("expression"),
      event: searchParams.get("event"),
      pageNumber: searchParams.get("pageNumber") || 1,
      recordsPerPage: searchParams.get("recordsPerPage") || 10,
    });
    handleResatSearch();
  }, []);

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
    if (searchParams.get("pageNumber")) {
      createTable(expressionData.sortBy);
      handleResatSearch();
    }
  }, [searchParams, expressionData.reload, expressionData.sortBy]);

  useEffect(() => {
    getAllExpressionEvents()
      .then((res) => {
        const resWithId = [];
        res?.data?.forEach((node, index) => {
          const convertObj = {
            id: index + 1,
            value: node.value,
            text: node.description,
          };
          resWithId.push(convertObj);
        });
        dispatch(expression({ searchItems: resWithId }));
      })
      .catch(() => errorHandler(errorResponse));
  }, []);

  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: "3%",
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
      title: () => {
        return (
          <SortableTitle
            sort={expressionData.sortType.expression}
            onClick={() => handleSort("expression")}
            text={Dictionary.sentenceText}
          />
        );
      },
      key: "expression",
      dataIndex: "expression",
      width: "42%",
      render: (record) => record,
    },
    {
      title: Dictionary.happen,
      key: "eventDescription",
      dataIndex: "eventDescription",
      width: "42%",
      render: (record) => record,
    },
    {
      key: "edit",
      dataIndex: "edit",
      width: "7%",
      className: "table-th-status",
      render: (_field, record) => (
        <div className={Classes["expression-table-icon"]}>
          <TooltipComponent title={Dictionary.edit}>
            <span
              onClick={() =>
                expressionData.permissions.edit && handleEdit(record)
              }
              className={
                !expressionData.permissions.edit && Classes["cursor-permission"]
              }
            >
              <CustomIcon
                src={Edit}
                size={24}
                name={`expression-${record?.id}-edit`}
                color={
                  expressionData.permissions.edit
                    ? Variables.LogoGreenDark
                    : Variables.GreenLight7
                }
              />
            </span>
          </TooltipComponent>
          <TooltipComponent title={Dictionary.delete}>
            <span
              onClick={() =>
                expressionData.permissions.delete && handleDelete(record)
              }
              className={
                !expressionData.permissions.delete &&
                Classes["cursor-permission"]
              }
            >
              <CustomIcon
                src={Delete}
                size={24}
                name={`expression-${record?.id}-trash`}
                color={
                  expressionData.permissions.delete
                    ? Variables.NotifRed
                    : Variables.NotifPink
                }
              />
            </span>
          </TooltipComponent>
        </div>
      ),
    },
  ];
  return (
    <div>
      <ModalComponent
        title={
          expressionData.state === "edit"
            ? `${Dictionary.edit} ${Dictionary.sentence}`
            : `${Dictionary.sentence} ${Dictionary.new}`
        }
        open={expressionData.addModal}
        width={918}
        onCancel={() => dispatch(expression({ addModal: false, record: "" }))}
      >
        <AddEditExpression />
      </ModalComponent>
      <ModalComponent
        title={`${Dictionary.delete} ${Dictionary.sentence}`}
        open={expressionData.deleteModal}
        width={540}
        className={Classes["delete-modal"]}
        onCancel={() =>
          dispatch(expression({ deleteModal: false, record: "" }))
        }
      >
        <DeleteExpression />
      </ModalComponent>
      {expressionData.permissions.create ? (
        <HeaderPage
          title={Dictionary.expressions}
          buttonText={`${Dictionary.sentence} ${Dictionary.new}`}
          onClick={handleAdd}
        />
      ) : (
        <HeaderPage title={Dictionary.expressions} />
      )}
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent name="expression">
          <InputSearchComponent
            width={500}
            placeholder={Dictionary.sentenceText}
          />
        </FormItemComponent>
        <FormItemComponent name="event">
          <SelectComponent
            name="event"
            width={500}
            placeholder={Dictionary.happen}
            items={expressionData.searchItems}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["expression-search-bar-btn"]}>
          {expressionData.showDeleteBtn && (
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
            htmlType="submit"
            loading={isLoading}
            classNameBtn={Classes["expression-btn"]}
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
      <TableComponent
        columns={columns}
        dataSource={expressionData.list}
        count={expressionData.totalRows}
        loading={isLoading}
      />
      {expressionData.totalRows > 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={expressionData.totalRows}
        />
      )}
    </div>
  );
};

export default Expression;
