import React, { useRef, useState, useEffect } from "react";
import SwitchComponent from "components/switch/SwitchComponent";
import TableComponent from "components/table/TableComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import Dictionary from "helpers/Dictionary";
import { useDispatch, useSelector } from "react-redux";
import CustomIcon from "components/customIcon/CustomIcon";
import Edit from "assets/images/icon/Edit.svg";
import Key from "assets/images/icon/Key.svg";
import Unlock from "assets/images/icon/Unlock.svg";
import Lock from "assets/images/icon/Lock.svg";
import HeaderPage from "components/headerPage/HeaderPage";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { Form } from "antd";
import { useSearchParams } from "react-router-dom";
import ButtonComponent from "components/button/ButtonComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import Classes from "./styles/users.module.scss";
import { users, resetUsers } from "store/reducers/users/UsersReducer";
import PaginationComponent from "components/pagination/PaginationComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import AddNewUser from "./pageComponent/AddEditUser";
import {
  disableUser,
  enableUser,
  getAllUsers,
  setChangePassword,
  unlockUser,
} from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import SuccessChangePassword from "./pageComponent/SuccessChangePassword";
import { createSearchObject } from "helpers/CreateSearchObject";
import { MatchAuthority } from "helpers/MatchAuthority";
import Variables from "assets/styles/_Variables.scss";
import SortableTitle from "components/sortableTitle/SortableTitle";
import Visible from "assets/images/icon/VisibleGrey.svg";
import DetailModal from "./pageComponent/DetailModal";

const Users = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const listUsersData = useSelector((state) => state.users.value);
  const userInfoData = useSelector((state) => state.userInfo.value);
  const [searchParams, setSearchParams] = useSearchParams();
  const errorHandler = useErrorHandler();
  const [currentParams] = useState(Object.fromEntries([...searchParams]));
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });

  const [permissions, setPermissions] = useState({
    recovery: true,
    enable: true,
    block: true,
    edit: true,
    create: true,
  });

  useEffect(() => {
    dispatch(resetUsers());
  }, []);
  useEffect(() => {
    if (userInfoData.username !== "admin") {
      setPermissions({
        recovery: MatchAuthority(
          userInfoData.authorities,
          "Post:/api/bo/user/change-password/identification-code/{identificationCode}/v1"
        ),
        enable:
          MatchAuthority(
            userInfoData.authorities,
            "Post:/api/bo/user/disable/identification-code/{identificationCode}/v1"
          ) &&
          MatchAuthority(
            userInfoData.authorities,
            "Post:/api/bo/user/enable/identification-code/{identificationCode}/v1"
          ),
        block: MatchAuthority(
          userInfoData.authorities,
          "Post:/api/bo/user/unlock/identification-code/{identificationCode}/v1"
        ),
        edit: MatchAuthority(
          userInfoData.authorities,
          "Put:/api/bo/user/update/v1"
        ),
        create: MatchAuthority(
          userInfoData.authorities,
          "Post:/api/bo/user/add/v1"
        ),
      });
    } else {
      setPermissions({
        recovery: true,
        enable: true,
        block: true,
        edit: true,
        create: true,
      });
    }
  }, [userInfoData.authorities]);

  const items = [
    { id: 1, value: true, text: "فعال" },
    { id: 2, value: false, text: "غیرفعال" },
  ];
  const lockItems = [
    { id: 1, value: true, text: "مسدود شده" },
    { id: 2, value: false, text: "غیر مسدود" },
  ];

  useEffect(() => {
    if (
      currentParams.isEnabled ||
      currentParams.personalId ||
      currentParams.nameInfo ||
      currentParams.branchCode ||
      currentParams.identificationCode ||
      currentParams.isLocked
    ) {
      form.setFieldsValue({
        isEnabled:
          currentParams.isEnabled === "true"
            ? items[0].text
            : currentParams.isEnabled === "false"
            ? items[1].text
            : "",
        branchCode: currentParams.branchCode,
        personalId: currentParams.personalId,
        nameInfo: currentParams.nameInfo,
        identificationCode: currentParams.identificationCode,
        isLocked:
          currentParams === "true"
            ? lockItems[0]?.text
            : currentParams.isLocked === "false"
            ? lockItems[1].text
            : "",
      });
      dispatch(users({ showDeleteBtn: true }));
    }
  }, [currentParams]);

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
      key: "enable",
      dataIndex: "enable",
      width: "6%",
      render: (_field, record) => (
        <TooltipComponent
          title={record?.is_enabled ? Dictionary.disable : Dictionary.enable}
        >
          <SwitchComponent
            defaultChecked={record?.is_enabled}
            onChange={() => handleEnable(record)}
            disabled={!permissions.enable}
          />
        </TooltipComponent>
      ),
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={listUsersData.sortType?.employmentCode}
            onClick={() => handleSort("employmentCode")}
            text={Dictionary.personalId}
          />
        );
      },
      key: "employment_code",
      dataIndex: "employment_code",
      width: "17%",
      render: (record) => record || Dictionary.notValid,
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={listUsersData.sortType?.identificationCode}
            onClick={() => handleSort("identificationCode")}
            text={Dictionary.nationalId}
          />
        );
      },
      key: "identification_code",
      dataIndex: "identification_code",
      width: "17%",
      render: (record) => record || Dictionary.notValid,
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={listUsersData.sortType.fullname}
            onClick={() => handleSort("fullname")}
            text={`${Dictionary.name} ${Dictionary.and} ${Dictionary.lastName}`}
          />
        );
      },
      key: "fullname",
      dataIndex: "fullname",
      width: "17%",
      render: (_field, record) => `${record?.firstname} ${record?.lastname}`,
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={listUsersData.sortType.mobileNumber}
            onClick={() => handleSort("mobileNumber")}
            text={Dictionary.mobile}
          />
        );
      },
      key: "mobile_number",
      dataIndex: "mobile_number",
      width: "12%",
      render: (record) => record || Dictionary.notValid,
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={listUsersData.sortType["rfBranch.branchCode"]}
            onClick={() => handleSort("rfBranch.branchCode")}
            text={Dictionary.userBranchId}
          />
        );
      },
      key: "branch_code",
      dataIndex: "branch_code",
      width: "12%",
      render: (record) => record || Dictionary.notValid,
    },
    {
      key: "view",
      dataIndex: "view",
      width: "4%",
      className: "table-th-center",
      render: (_field, record) => (
        <TooltipComponent title={Dictionary.details}>
          <CustomIcon
            src={Visible}
            size={24}
            name={`list-users-${record?.id}-Visible`}
            onClick={() =>
              dispatch(
                users({
                  detailModal: true,
                  record: record,
                  setRole: record.roles.map((r) => r.role_key),
                })
              )
            }
            color={Variables.LogoGreenDark}
          />
        </TooltipComponent>
      ),
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={listUsersData.sortType.isLocked}
            onClick={() => handleSort("isLocked")}
            className={Classes["unblock-sort-icon"]}
          />
        );
      },
      key: "lock",
      dataIndex: "lock",
      width: "4%",
      className: "table-th-center",
      render: (_field, record) => (
        <TooltipComponent
          title={permissions.block && record?.is_locked && Dictionary.unlock}
        >
          <CustomIcon
            src={record?.is_locked ? Lock : Unlock}
            size={24}
            cursor={record?.is_locked ? "pointer" : "default"}
            name={`list-users-${record.id}-lock`}
            onClick={record?.is_locked ? () => handleUnlock(record) : undefined}
            color={
              record.is_locked && permissions.block
                ? Variables.NotifRed
                : record.is_locked && !permissions.block
                ? Variables.GreenLight7
                : !record.is_locked && permissions.block
                ? Variables.LogoGreenDark
                : !record.is_locked && !permissions.block
                ? Variables.GreenLight7
                : ""
            }
          />
        </TooltipComponent>
      ),
    },

    {
      key: "recovery",
      dataIndex: "recovery",
      width: "4%",
      className: "table-th-center",
      render: (_field, record) => (
        <TooltipComponent title={Dictionary.recovery}>
          <CustomIcon
            src={Key}
            size={24}
            name={`list-users-${record?.id}-recovery`}
            onClick={() => handleChangePassword(record)}
            color={
              permissions.recovery
                ? Variables.LogoGreenDark
                : Variables.GreenLight7
            }
          />
        </TooltipComponent>
      ),
    },
    {
      key: "edit",
      dataIndex: "edit",
      width: "4%",
      className: "table-th-status",
      render: (_field, record) => (
        <TooltipComponent title={Dictionary.edit}>
          <CustomIcon
            src={Edit}
            size={24}
            name={`list-users-${record?.id}-edit`}
            onClick={() => {
              permissions.edit &&
                dispatch(
                  users({
                    addModal: true,
                    edit: true,
                    record: record,
                    setRole: record.roles.map((r) => r.role_key),
                  })
                );
            }}
            color={
              permissions.edit ? Variables.LogoGreenDark : Variables.GreenLight7
            }
          />
        </TooltipComponent>
      ),
    },
  ];

  const handleSort = (column) => {
    dispatch(users({ sortColumn: column }));
    if (listUsersData.sortType[column] === "") {
      dispatch(users({ sortBy: column }));
    } else if (listUsersData.sortType[column] === "inc") {
      dispatch(users({ sortBy: `-${column}` }));
    } else if (listUsersData.sortType[column] === "desc") {
      dispatch(users({ sortBy: "-createdDate" }));
    }
  };

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      ...currentParams,
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination({ pageNumber, recordsPerPage });
    setSearchParams(newQueryParam);
  };

  const handleChangePassword = (record) => {
    if (permissions.recovery) {
      if (record) {
        setChangePassword(record.identification_code)
          .then(() => dispatch(users({ changePassword: true, record: record })))
          .catch(() => errorHandler(errorResponse));
      } else {
        dispatch(
          setNotificationData({
            massage: "رکورد یافت نشد",
            type: "error",
            time: 5000,
          })
        );
      }
    }
  };

  const crateTable = (sortItem) => {
    getAllUsers(
      createSearchObject(searchParams, {
        operation: "contains",
        sortBy: sortItem,
      })
    )
      .then((res) => {
        dispatch(
          users({
            list: res?.data?.data,
            endRow: res?.data.end_row,
            startRow: res?.data.start_row,
            totalRows: res?.data.total_rows,
          })
        );
      })
      .then(() => {
        if (listUsersData.sortColumn) {
          const keys = Object.keys(listUsersData.sortType).filter(
            (p) => p !== listUsersData.sortColumn
          );
          const newSort = {};
          keys.forEach((p) => (newSort[p] = ""));
          if (listUsersData.sortType[listUsersData.sortColumn] === "") {
            dispatch(
              users({
                sortType: { [listUsersData.sortColumn]: "inc", ...newSort },
              })
            );
          } else if (
            listUsersData.sortType[listUsersData.sortColumn] === "inc"
          ) {
            dispatch(
              users({
                sortType: { [listUsersData.sortColumn]: "desc", ...newSort },
              })
            );
          } else if (
            listUsersData.sortType[listUsersData.sortColumn] === "desc"
          ) {
            dispatch(
              users({
                sortType: { [listUsersData.sortColumn]: "", ...newSort },
              })
            );
          }
        }
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };
  const handleResetSearch = () => {
    if (
      searchParams.get("employmentCode") ||
      searchParams.get("fullname") ||
      searchParams.get("rfBranch.branchCode") ||
      searchParams.get("isEnabled") ||
      searchParams.get("isLocked") ||
      searchParams.get("identificationCode")
    ) {
      dispatch(users({ showDeleteBtn: true }));
    } else {
      dispatch(users({ showDeleteBtn: false }));
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
    const newQueryParam = {
      pageNumber: 1,
      recordsPerPage: pagination.recordsPerPage,
      ...values,
    };
    setSearchParams(newQueryParam);
    dispatch(users({ showDeleteBtn: true, sortColumn: "" }));
    setPagination({ ...pagination, pageNumber: 1 });
  };

  useEffect(() => {
    form.setFieldsValue({
      "rfBranch.branchCode": searchParams.get("rfBranch.branchCode"),
      fullname: searchParams.get("fullname"),
      employmentCode: searchParams.get("employmentCode"),
      isEnabled: searchParams.get("isEnabled"),
      isLocked: searchParams.get("isLocked"),
      identificationCode: searchParams.get("identificationCode"),
    });
    handleResetSearch();
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
      crateTable(listUsersData.sortBy);
      handleResetSearch();
    }
  }, [
    searchParams,
    listUsersData.reload,
    listUsersData.enable,
    listUsersData.sortBy,
  ]);

  const handleEnable = (record) => {
    if (record) {
      if (record.is_enabled) {
        disableUser(record.identification_code)
          .then((res) => {
            dispatch(
              setNotificationData({
                message: Dictionary.successfulChanges,
                type: "success",
                time: 5000,
              })
            );
            dispatch(users({ enable: !listUsersData.enable }));
          })
          .catch(() => errorHandler(errorResponse));
      } else {
        enableUser(record.identification_code)
          .then(() => {
            dispatch(
              setNotificationData({
                message: Dictionary.successfulChanges,
                type: "success",
                time: 5000,
              })
            );
            dispatch(users({ enable: !listUsersData.enable }));
          })
          .catch(() => errorHandler(errorResponse));
      }
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
    setPagination(newQueryParam);
    dispatch(
      users({
        showDeleteBtn: false,
        reload: !listUsersData.reload,
        sortColumn: "",
      })
    );
    form.resetFields();
  };
  const handleUnlock = (record) => {
    if (permissions.block) {
      if (record) {
        unlockUser(record.identification_code)
          .then(() => {
            dispatch(
              setNotificationData({
                message: Dictionary.successfulChanges,
                type: "success",
                time: 5000,
              })
            );
            dispatch(users({ reload: !listUsersData.reload }));
          })
          .catch(() => errorHandler(errorResponse));
      } else {
        dispatch(
          setNotificationData({
            message: "یک مورد انتخاب  کنید",
            type: "error",
            time: 5000,
          })
        );
      }
    }
  };
  return (
    <div>
      <ModalComponent
        title={
          listUsersData.edit
            ? Dictionary.edit
            : `${Dictionary.add} ${Dictionary.user} ${Dictionary.new}`
        }
        open={listUsersData.addModal}
        maskClosable={false}
        onCancel={() => dispatch(users({ addModal: false, current: 0 }))}
      >
        <AddNewUser />
      </ModalComponent>
      <ModalComponent
        className={Classes["detail-modal"]}
        title={`${Dictionary.data} ${Dictionary.user}`}
        open={listUsersData.detailModal}
        onCancel={() => dispatch(users({ detailModal: false, current: 0 }))}
      >
        <DetailModal />
      </ModalComponent>
      {permissions.create ? (
        <HeaderPage
          title={Dictionary.manageUsers}
          onClick={() =>
            dispatch(
              resetUsers({
                list: listUsersData?.list,
                activeBranches: listUsersData.activeBranches,
                addModal: true,
                edit: false,
                totalRows: listUsersData.totalRows,
              })
            )
          }
          buttonText={`${Dictionary.user} ${Dictionary.new}`}
        />
      ) : (
        <HeaderPage title={Dictionary.manageUsers} />
      )}
      <ModalComponent
        title={`${Dictionary.recoveryPassword}  ${Dictionary.user}`}
        open={listUsersData.changePassword}
        maskClosable={false}
        onCancel={() => dispatch(users({ changePassword: false }))}
      >
        <SuccessChangePassword />
      </ModalComponent>
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent name="employmentCode">
          <InputSearchComponent
            width={176}
            placeholder={`${Dictionary.personalId}`}
          />
        </FormItemComponent>
        <FormItemComponent name="fullname">
          <InputSearchComponent
            width={176}
            placeholder={`${Dictionary.name} ${Dictionary.and} ${Dictionary.lastName}`}
            maxLength={32}
          />
        </FormItemComponent>
        <FormItemComponent name="rfBranch.branchCode">
          <InputSearchComponent
            width={176}
            placeholder={Dictionary.branchCode}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent name="identificationCode">
          <InputSearchComponent
            width={176}
            placeholder={Dictionary.nationalId}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent name="isEnabled">
          <SelectComponent
            name="isEnabled"
            width={176}
            placeholder={Dictionary.status}
            items={items}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent name="isLocked">
          <SelectComponent
            name="isLocked"
            width={176}
            placeholder={Dictionary.lock}
            items={lockItems}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["users-search-bar-btn"]}>
          {listUsersData.showDeleteBtn && (
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
            classNameBtn={Classes["users-btn"]}
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
      <TableComponent
        columns={columns}
        dataSource={listUsersData.list}
        count={listUsersData.total}
      />
      {listUsersData.totalRows >= 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={listUsersData.totalRows}
        />
      )}
    </div>
  );
};

export default Users;
