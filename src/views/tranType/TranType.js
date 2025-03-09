import Classes from "./styles/TranType.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import PaginationComponent from "components/pagination/PaginationComponent";
import TableComponent from "components/table/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import HeaderPage from "components/headerPage/HeaderPage";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import Edit from "assets/images/icon/Edit.svg";
import FormComponent from "components/form/FormComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import useErrorHandler from "helpers/useErrorHandler";
import { MatchAuthority } from "helpers/MatchAuthority";
import { searchTranType } from "helpers/APIFunction";
import { createSearchObject } from "helpers/CreateSearchObject";
import { errorResponse } from "helpers/APIService";
import Variables from "assets/styles/_Variables.scss";
import EditTranType from "./pageComponent/EditTranType";
import ModalComponent from "components/modalComponent/ModalComponent";
import {
  resetTranTypes,
  tranTypes,
  tranTypesState,
} from "store/reducers/tranTypes/TranTypesReducer";
import { setNotificationData } from "store/reducers/toast/toastReducer";
const TranType = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });
  const [permissions, setPermissions] = useState({
    edit: true,
  });
  const [form] = Form.useForm();
  const formRef = useRef();
  const tranTypesData = useSelector(tranTypesState);
  const { reload, modal, showDeleteBtn, list, totalRows } = tranTypesData;
  const userInfoData = useSelector((state) => state.userInfo.value);

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination(newQueryParam);
  };
  const crateTable = (sortItem) => {
    searchTranType(createSearchObject(searchParams, { sortBy: sortItem }))
      .then((res) => {
        dispatch(
          tranTypes({
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
  };

  const handleResatSearch = () => {
    if (searchParams.get("code")) {
      dispatch(tranTypes({ showDeleteBtn: true }));
    } else {
      dispatch(tranTypes({ showDeleteBtn: false }));
    }
  };
  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: "3%",
      render: (_text, _record, index) => {
        if (pagination.pageNumber === 1) {
          return (
            <span className={Classes["list-banks-pagination"]}>
              {index + 1}
            </span>
          );
        } else {
          return (
            <span className={Classes["list-banks-pagination"]}>
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
    { width: "13%", title: Dictionary.code, key: "code", dataIndex: "code" },
    {
      width: "20%",
      title: Dictionary.title,
      key: "title",
      dataIndex: "title",
    },
    {
      width: "20%",
      title: Dictionary.code + " " + Dictionary.document + " gl",
      key: "gl",
      dataIndex: "gl",
      render: (_field, record) => <div>{record.gl.code}</div>,
    },
    {
      width: "35%",
      title: Dictionary.desc,
      key: "description",
      dataIndex: "description",
    },

    {
      key: "status",
      dataIndex: "status",
      width: "5%",
      className: "table-th-status",
      render: (_field, record) => (
        <div className={Classes["edit-switch"]}>
          <TooltipComponent title={Dictionary.edit}>
            <CustomIcon
              src={Edit}
              size={24}
              name={`list-customers-${record.id}-edit`}
              onClick={() =>
                permissions.edit &&
                dispatch(tranTypes({ modal: true, record: record }))
              }
              color={
                permissions.edit
                  ? Variables.LogoGreenDark
                  : Variables.GreenLight7
              }
              cursor={permissions.edit ? "pointer" : "default"}
            />
          </TooltipComponent>
        </div>
      ),
    },
  ];
  const onFinish = (values) => {
    Object.keys(values).forEach(
      (key) =>
        (values[key] === undefined ||
          values[key] === null ||
          values[key] === "") &&
        delete values[key]
    );
    if (Object.keys(values).length > 0) {
      const newQueryParam = {
        pageNumber: 1,
        recordsPerPage: pagination.recordsPerPage,
        ...values,
      };
      setSearchParams(newQueryParam);
      dispatch(tranTypes({ showDeleteBtn: true, sortColumn: "" }));
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
    };
    setSearchParams(newQueryParam);
    dispatch(tranTypes({ showDeleteBtn: false, sortColumn: "" }));
    form.resetFields();
  };
  useEffect(() => {
    return () => dispatch(resetTranTypes());
  }, []);
  useEffect(() => {
    if (userInfoData.username !== "admin") {
      setPermissions({
        edit: MatchAuthority(
          userInfoData.authorities,
          "Put:/api/bo/wallet/edit/wallet-transactiontype/v1"
        ),
      });
    } else {
      setPermissions({ edit: true });
    }
  }, [userInfoData.authorities]);
  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      crateTable();
    }
  }, [reload, searchParams]);
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
    form.setFieldsValue({
      code: searchParams.get("code"),
      pageNumber: searchParams.get("pageNumber") || 1,
      recordsPerPage: searchParams.get("recordsPerPage") || 10,
    });
    handleResatSearch();
    dispatch(tranTypes({ modal: false }));
  }, []);

  return (
    <div>
      <ModalComponent
        title={`${Dictionary.edit} ${Dictionary.type} ${Dictionary.transaction}`}
        open={modal}
        onCancel={() => dispatch(tranTypes({ modal: false, record: {} }))}
      >
        <EditTranType />
      </ModalComponent>
      <HeaderPage
        title={
          Dictionary.managing +
          " " +
          Dictionary.type +
          " " +
          Dictionary.transaction
        }
      />
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
        className={Classes["account-search-bar"]}
      >
        <FormItemComponent name="code">
          <InputSearchComponent
            name="code"
            placeholder={Dictionary.code}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["account-search-bar-btn"]}>
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
      <TableComponent columns={columns} dataSource={list} />
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
export default TranType;
