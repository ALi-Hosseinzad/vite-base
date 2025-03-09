import React, { useEffect, useRef, useState } from "react";
import Dictionary from "helpers/Dictionary";
import ButtonComponent from "components/button/ButtonComponent";
import Classes from "views/payaSatnaPol/styles/ReasonList.module.scss";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { Form } from "antd";
import {
  payaSatnaPol,
  payaSatnaPolState,
} from "store/reducers/payaSatnaPol/PayaSatnaPolReducer";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "components/table/TableComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import ChipComponent from "components/chipComponent/ChipComponent";
import queryString from "query-string";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getReasonsList } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import Edit from "assets/images/icon/Edit.svg";
import AddReasonModal from "./AddReasonModal";
import { createSearchObject } from "helpers/CreateSearchObject";
import PaginationComponent from "components/pagination/PaginationComponent";
import Variables from "assets/styles/_Variables.scss";

const ReasonList = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const payaSatnaPolData = useSelector(payaSatnaPolState);
  const { sortBy, reload, permissions, reasonList, showDeleteBtn, totalRows } =
    payaSatnaPolData;
  const [queryParam] = useState(queryString?.parse(location.search));
  const queryParamRecordsPerPage =
    queryParam?.recordsPerPage >= 50 ? 50 : Number(queryParam?.recordsPerPage);
  const [pagination, setPagination] = useState({
    pageNumber: Number(queryParam?.pageNumber) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });

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
    if (
      searchParams.get("reasonDescription") ||
      searchParams.get("reason") ||
      searchParams.get("polReason")
    ) {
      form.setFieldsValue({
        reasonDescription: searchParams.get("reasonDescription"),
        reason: searchParams.get("reason"),
        polReason: searchParams.get("polReason"),
      });
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      crateTable(sortBy);
      handleResetSearch();
    }
  }, [searchParams, reload, sortBy]);

  const onFinish = (values) => {
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
      ...values,
    };
    setSearchParams(newQueryParam);
    dispatch(payaSatnaPol({ showDeleteBtn: true }));
    setPagination({ ...pagination, pageNumber: 1 });
  };

  const resetSearch = () => {
    const newQueryParam = {
      pageNumber: 1,
      recordsPerPage: pagination.recordsPerPage,
    };
    setSearchParams(newQueryParam);
    setPagination(newQueryParam);
    dispatch(payaSatnaPol({ showDeleteBtn: false, reload: !reload }));
    form.resetFields();
  };

  const handleResetSearch = () => {
    if (
      searchParams.get("reasonDescription") ||
      searchParams.get("reason") ||
      searchParams.get("polReason")
    ) {
      dispatch(payaSatnaPol({ showDeleteBtn: true }));
    } else {
      dispatch(payaSatnaPol({ showDeleteBtn: false }));
    }
  };

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      ...queryParam,
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination({ pageNumber, recordsPerPage });
    navigate({ search: queryString.stringify(newQueryParam) });
  };

  const crateTable = (sortItem) => {
    getReasonsList(createSearchObject(searchParams, { sortBy: sortItem }))
      .then((res) => {
        dispatch(
          payaSatnaPol({
            reasonList: res.data?.data,
            endRow: res.data.end_row,
            startRow: res.data.start_row,
            totalRows: res.data.total_rows,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };
  const showAddReason = () => {
    dispatch(payaSatnaPol({ showAddReason: true, type: "add" }));
  };

  const showEditReason = (record) => {
    dispatch(
      payaSatnaPol({ showAddReason: true, type: "edit", record: record })
    );
  };

  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: "5%",
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
      title: `${Dictionary.title} ${Dictionary.reason}`,
      key: "reason_description",
      dataIndex: "reason_description",
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: `${Dictionary.code} ${Dictionary.reason} ${Dictionary.satna} ${Dictionary.and} ${Dictionary.paya}`,
      key: "reason",
      dataIndex: "reason",
      width: "15%",
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: `${Dictionary.code} ${Dictionary.reason} ${Dictionary.pol}`,
      key: "pol_reason",
      dataIndex: "pol_reason",
      width: "15%",
      render: (record) => <>{record || "--"}</>,
    },
    {
      title: `${Dictionary.status}`,
      key: "is_enabled",
      dataIndex: "is_enabled",
      render: (record) => (
        <>
          {record ? (
            <ChipComponent active>{Dictionary.active}</ChipComponent>
          ) : (
            <ChipComponent red>{Dictionary.deactive}</ChipComponent>
          )}
        </>
      ),
    },
    {
      key: "status",
      dataIndex: "status",
      width: "7%",
      className: Classes["record-status"],
      render: (_field, record) => (
        <TooltipComponent
          title={Dictionary.edit}
          onClick={permissions.edit ? () => showEditReason(record) : ""}
        >
          <CustomIcon
            src={Edit}
            size={24}
            name={`reason-record-${record.id}-edit`}
            color={
              permissions.edit ? Variables.LogoGreenDark : Variables.GreenLight7
            }
            cursor={permissions.edit && "pointer"}
          />
        </TooltipComponent>
      ),
    },
  ];
  return (
    <div>
      <AddReasonModal />
      {permissions.create && (
        <ButtonComponent
          type="default"
          classNameBtn={Classes.addBtn}
          onClick={permissions.create && showAddReason}
        >
          {Dictionary.add}
        </ButtonComponent>
      )}
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent name="reasonDescription">
          <InputSearchComponent
            name="reasonDescription"
            placeholder={Dictionary.reason}
          />
        </FormItemComponent>
        <FormItemComponent name="reason">
          <InputSearchComponent
            name="reason"
            placeholder={`${Dictionary.code} ${Dictionary.reason} ${Dictionary.satna} ${Dictionary.and} ${Dictionary.paya}`}
          />
        </FormItemComponent>
        <FormItemComponent name="polReason">
          <InputSearchComponent
            name="polReason"
            placeholder={`${Dictionary.code} ${Dictionary.reason} ${Dictionary.pol}`}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["groups-search-bar-btn"]}>
          {showDeleteBtn && (
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
        dataSource={reasonList}
        count={totalRows}
      />
      {totalRows > 10 && (
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
export default ReasonList;
