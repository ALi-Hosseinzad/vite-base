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
import {
  listBanks,
  resetBanks,
} from "store/reducers/listBanks/listBanksReducer";
import Edit from "assets/images/icon/Edit.svg";
import FormComponent from "components/form/FormComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import SwitchComponent from "components/switch/SwitchComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import Classes from "./styles/Bank.module.scss";
import ModalComponent from "components/modalComponent/ModalComponent";
import AddNewBankModal from "./pageComponent/AddNewBankModal";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import useErrorHandler from "helpers/useErrorHandler";
import SortableTitle from "components/sortableTitle/SortableTitle";
import { MatchAuthority } from "helpers/MatchAuthority";
import { searchBanks, updateBank } from "helpers/APIFunction";
import { createSearchObject } from "helpers/CreateSearchObject";
import { errorResponse } from "helpers/APIService";
import Variables from "assets/styles/_Variables.scss";
const Accounts = () => {
  const items = [
    { id: 1, value: "true", text: "فعال" },
    { id: 2, value: "false", text: "غیرفعال" },
  ];
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
    create: true,
  });
  const [form] = Form.useForm();
  const formRef = useRef();
  const listBanksData = useSelector((state) => state.listBanks.value);
  const userInfoData = useSelector((state) => state.userInfo.value);

  useEffect(() => {
    dispatch(resetBanks());
  }, []);

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination(newQueryParam);
  };
  const crateTable = (sortItem) => {
    searchBanks(createSearchObject(searchParams, { sortBy: sortItem }))
      .then((res) => {
        const convert = res.data?.data?.map((node) => {
          return {
            bankCode: node.bank_code,
            bankName: node.bank_name,
            bin: node.bin,
            isEnable: node.is_enabled,
            id: node.id,
          };
        });
        dispatch(
          listBanks({
            list: convert,
            endRow: res.data.end_row,
            startRow: res.data.start_row,
            totalRows: res.data.total_rows,
          })
        );
      })
      .then(() => {
        if (listBanksData.sortColumn) {
          const keys = Object.keys(listBanksData.sortType).filter(
            (p) => p !== listBanksData.sortColumn
          );
          const newSort = {};
          keys.forEach((p) => (newSort[p] = ""));
          if (listBanksData.sortType[listBanksData.sortColumn] === "") {
            dispatch(
              listBanks({
                sortType: { [listBanksData.sortColumn]: "inc", ...newSort },
              })
            );
          } else if (
            listBanksData.sortType[listBanksData.sortColumn] === "inc"
          ) {
            dispatch(
              listBanks({
                sortType: { [listBanksData.sortColumn]: "desc", ...newSort },
              })
            );
          } else if (
            listBanksData.sortType[listBanksData.sortColumn] === "desc"
          ) {
            dispatch(
              listBanks({
                sortType: { [listBanksData.sortColumn]: "", ...newSort },
              })
            );
          }
        }
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const handleSort = (column) => {
    dispatch(listBanks({ sortColumn: column }));
    if (listBanksData.sortType[column] === "") {
      dispatch(listBanks({ sortBy: column }));
    } else if (listBanksData.sortType[column] === "inc") {
      dispatch(listBanks({ sortBy: `-${column}` }));
    } else if (listBanksData.sortType[column] === "desc") {
      dispatch(listBanks({ sortBy: "-createdDate" }));
    }
  };
  const onChange = (record) => {
    updateBank({
      bank_name: record.bankName,
      bank_code: record.bankCode,
      is_enabled: !record.isEnable,
    })
      .then(() => dispatch(listBanks({ reload: !listBanksData.reload })))
      .catch(() => errorHandler(errorResponse));
  };

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      setPermissions({
        edit: MatchAuthority(
          userInfoData.authorities,
          "Put:/api/bo/bank/update/v1"
        ),
        create: MatchAuthority(
          userInfoData.authorities,
          "Post:/api/bo/bank/add/v1"
        ),
      });
    } else {
      setPermissions({
        edit: true,
        create: true,
      });
    }
  }, [userInfoData.authorities]);
  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      crateTable(listBanksData.sortBy);
    }
  }, [listBanksData.reload, searchParams, listBanksData.sortBy]);
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
      isEnabled: searchParams.get("isEnabled"),
      bankCode: searchParams.get("bankCode"),
      bankName: searchParams.get("bankName"),
      bin: searchParams.get("bin"),
      pageNumber: searchParams.get("pageNumber") || 1,
      recordsPerPage: searchParams.get("recordsPerPage") || 10,
    });
    handleResatSearch();
    dispatch(listBanks({ modal: false }));
  }, []);
  const handleResatSearch = () => {
    if (
      searchParams.get("isEnabled") ||
      searchParams.get("bankCode") ||
      searchParams.get("bankName") ||
      searchParams.get("bin")
    ) {
      dispatch(listBanks({ showDeleteBtn: true }));
    } else {
      dispatch(listBanks({ showDeleteBtn: false }));
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
    {
      key: "switch",
      dataIndex: "switch",
      width: "7%",
      render: (_field, record) => (
        <TooltipComponent
          title={!record.isEnable ? Dictionary.enable : Dictionary.disable}
        >
          <SwitchComponent
            checked={record.isEnable}
            onChange={() => permissions.edit && onChange(record)}
            disabled={!permissions.edit}
          />
        </TooltipComponent>
      ),
    },
    {
      width: "13%",
      title: Dictionary.bankCode,
      key: "bankCode",
      dataIndex: "bankCode",
    },
    {
      width: "25%",
      title: () => {
        return (
          <SortableTitle
            sort={listBanksData.sortType.bankName}
            onClick={() => handleSort("bankName")}
            text={`${Dictionary.name} ${Dictionary.bank}`}
          />
        );
      },

      key: "bankName",
      dataIndex: "bankName",
    },
    {
      width: "45%",
      title: "Bin",
      key: "bin",
      dataIndex: "bin",
      render: (_field, record) => <div>{record.bin?.join(" - ")}</div>,
    },
    {
      key: "status",
      dataIndex: "status",
      width: "7%",
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
                dispatch(listBanks({ modal: true, record: record, edit: true }))
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
    if (values) {
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
      dispatch(listBanks({ showDeleteBtn: true, sortColumn: "" }));
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
    dispatch(listBanks({ showDeleteBtn: false, sortColumn: "" }));
    form.resetFields();
  };

  return (
    <div>
      {permissions.create ? (
        <HeaderPage
          title={`${Dictionary.list} ${Dictionary.bank}`}
          onClick={() => dispatch(listBanks({ modal: true }))}
          buttonText={`${Dictionary.bank} ${Dictionary.new}`}
        />
      ) : (
        <HeaderPage title={`${Dictionary.list} ${Dictionary.bank}`} />
      )}
      <ModalComponent
        title={`${Dictionary.add} ${Dictionary.bank}`}
        open={listBanksData.modal}
        onCancel={() =>
          dispatch(listBanks({ modal: false, edit: false, record: {} }))
        }
      >
        <AddNewBankModal />
      </ModalComponent>
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent name="isEnabled">
          <SelectComponent
            name="isEnabled"
            width={176}
            placeholder={Dictionary.status}
            items={items}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent name="bankCode">
          <InputSearchComponent
            width={178}
            name="bankCode"
            placeholder={Dictionary.bankCode}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent name="bankName">
          <InputSearchComponent
            width={178}
            name="bankName"
            placeholder={`${Dictionary.name} ${Dictionary.bank}`}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent name="bin">
          <InputSearchComponent
            width={178}
            name="bin"
            placeholder="Bin"
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["bank-search-bar-btn"]}>
          {listBanksData.showDeleteBtn && (
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
      <TableComponent columns={columns} dataSource={listBanksData.list} />
      {listBanksData.totalRows >= 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={listBanksData.totalRows}
        />
      )}
    </div>
  );
};
export default Accounts;
