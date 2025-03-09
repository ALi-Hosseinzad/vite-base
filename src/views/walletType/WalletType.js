import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import HeaderPage from "components/headerPage/HeaderPage";
import ButtonComponent from "components/button/ButtonComponent";
import { Form } from "antd";
import Classes from "./styles/Customer.module.scss";
import FormItemComponent from "components/formItem/FormItemComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import PaginationComponent from "components/pagination/PaginationComponent";
import TableComponent from "components/table/TableComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import { searchWalletType } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { createSearchObject } from "helpers/CreateSearchObject";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { MatchAuthority } from "helpers/MatchAuthority";
import AddNewDocument from "./pageComponent/AddNewWalletType";
import {
  walletType,
  walletTypeState,
} from "store/reducers/walletType/WalletTypeReducer";
import TooltipComponent from "components/tooltip/TooltipComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import Edit from "assets/images/icon/Edit.svg";
import Variables from "assets/styles/_Variables.scss";
const WalletType = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const walletTypeData = useSelector(walletTypeState);
  const { reload, modal, showDeleteBtn, list, totalRows, edit } =
    walletTypeData;
  const userInfoData = useSelector((state) => state.userInfo.value);
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
    create: true,
  });
  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination(newQueryParam);
  };

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      setPermissions({
        edit: MatchAuthority(
          userInfoData.authorities,
          "Put:/api/bo/wallet/edit/wallet-type/v1"
        ),
        create: MatchAuthority(
          userInfoData.authorities,
          "Post:/api/bo/wallet/auth/add/wallet-type/v1"
        ),
      });
    } else {
      setPermissions({
        edit: true,
        create: true,
      });
    }
  }, [userInfoData.authorities]);

  const createTable = () => {
    searchWalletType(
      createSearchObject(searchParams, {
        operation: "contains",
        sortBy: "-createdDate",
      })
    )
      .then((res) => {
        dispatch(
          walletType({
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
  const handleResetSearch = () => {
    if (searchParams.get("code")) {
      dispatch(walletType({ showDeleteBtn: true }));
    } else {
      dispatch(walletType({ showDeleteBtn: false }));
    }
  };
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
      dispatch(walletType({ showDeleteBtn: true, sortColumn: "" }));
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
    dispatch(walletType({ showDeleteBtn: false, sortColumn: "" }));
    form.resetFields();
  };
  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      createTable();
      handleResetSearch();
    }
  }, [searchParams, reload]);

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
    handleResetSearch();
    dispatch(walletType({ modal: false }));
  }, []);
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
      title: Dictionary.code,
      key: "code",
      dataIndex: "code",
      width: "10%",
    },

    {
      title: Dictionary.status,
      key: "status_desc",
      dataIndex: "status_desc",
      width: "15%",
    },
    {
      title: Dictionary.code + " " + Dictionary.document + " gl",
      key: "active_gl",
      dataIndex: "active_gl",
      width: "15%",
      render: (text) => <p>{text.code}</p>,
    },
    {
      title:
        Dictionary.time +
        " " +
        Dictionary.stagnation +
        " ( " +
        Dictionary.day +
        " )",
      key: "dormant_conversion_time",
      dataIndex: "dormant_conversion_time",
      width: "20%",
    },
    {
      title: Dictionary.desc,
      key: "description",
      dataIndex: "description",
      width: "30%",
    },
    {
      key: "status",
      dataIndex: "status",
      width: "10%",
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
                dispatch(
                  walletType({ modal: true, record: record, edit: true })
                )
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

  return (
    <div>
      {permissions.create ? (
        <HeaderPage
          title={Dictionary.type + " " + Dictionary.wallet}
          onClick={() => {
            dispatch(walletType({ modal: true, record: {}, edit: false }));
          }}
          buttonText={
            Dictionary.add + " " + Dictionary.type + " " + Dictionary.wallet
          }
        />
      ) : (
        <HeaderPage title={Dictionary.type + " " + Dictionary.wallet} />
      )}
      <ModalComponent
        title={
          edit
            ? Dictionary.edit + " " + Dictionary.type + " " + Dictionary.wallet
            : Dictionary.add + " " + Dictionary.type + " " + Dictionary.wallet
        }
        open={modal}
        onCancel={() =>
          dispatch(walletType({ modal: false, cancelModal: true, record: {} }))
        }
      >
        <AddNewDocument />
      </ModalComponent>
      <Form
        className={Classes["list-customers-form"]}
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent
          name="code"
          className={Classes["list-customers-form-item"]}
        >
          <InputSearchComponent placeholder={Dictionary.code} maxLength={10} />
        </FormItemComponent>

        <FormItemComponent className={Classes["list-customers-btn"]}>
          {showDeleteBtn && (
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
            htmlType={Dictionary.search}
            classNameBtn={Classes["list-customers-btn-button"]}
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </Form>
      <TableComponent columns={columns} dataSource={list} count={totalRows} />
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
export default WalletType;
