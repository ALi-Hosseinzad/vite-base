import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import HeaderPage from "components/headerPage/HeaderPage";
import ButtonComponent from "components/button/ButtonComponent";
import { Form } from "antd";
import Classes from "views/customer/styles/Customer.module.scss";
import FormItemComponent from "components/formItem/FormItemComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import {
  listCustomers,
  resetListCustomers,
} from "store/reducers/listCustomers/listCustomersReducer";
import ModalComponent from "components/modalComponent/ModalComponent";
import SwitchComponent from "components/switch/SwitchComponent";
import Lock from "assets/images/icon/Lock.svg";
import Unlock from "assets/images/icon/Unlock.svg";
import Key from "assets/images/icon/Key.svg";
import Edit from "assets/images/icon/Edit.svg";
import TooltipComponent from "components/tooltip/TooltipComponent";
import AddNewCustomer from "./pageComponent/AddNewCustomer";
import PaginationComponent from "components/pagination/PaginationComponent";
import TableComponent from "components/table/TableComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import RecoveryPassword from "./pageComponent/RecoveryPassword";
import EditUsernameAndMobile from "./pageComponent/EditUsernameAndMobile";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import {
  disableCustomer,
  enableCustomer,
  getTrace,
  recoveryPassword,
  searchCustomers,
  unlockCustomer,
} from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { createSearchObject } from "helpers/CreateSearchObject";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import CancelModal from "components/cancelModal/CancelModal";
import Variables from "assets/styles/_Variables.scss";
import { MatchAuthority } from "helpers/MatchAuthority";
import SortableTitle from "components/sortableTitle/SortableTitle";

const Customers = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const listCustomersData = useSelector((state) => state.listCustomers.value);
  const userInfoData = useSelector((state) => state.userInfo.value);
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });
  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination(newQueryParam);
  };
  const [permissions, setPermissions] = useState({
    recovery: true,
    enable: true,
    block: true,
    edit: true,
    create: true,
  });
  useEffect(() => {
    dispatch(resetListCustomers());
  }, []);
  useEffect(() => {
    if (userInfoData.username !== "admin") {
      setPermissions({
        recovery: MatchAuthority(
          userInfoData.authorities,
          "Put:/api/bo/customer/recovery-password/v1"
        ),
        enable:
          MatchAuthority(
            userInfoData.authorities,
            "Post:/api/bo/customer/identification-code/{identificationCode}/disable/v1"
          ) &&
          MatchAuthority(
            userInfoData.authorities,
            "Post:/api/bo/customer/identification-code/{identificationCode}/enable/v1"
          ),
        block: MatchAuthority(
          userInfoData.authorities,
          "Post:/api/bo/customer/identification-code/{identificationCode}/unlock/v1"
        ),
        edit:
          MatchAuthority(
            userInfoData.authorities,
            "Put:/api/bo/customer/identification-code/{identificationCode}/username/v1"
          ) &&
          MatchAuthority(
            userInfoData.authorities,
            "Put:/api/bo/customer/identification-code/{identificationCode}/mobile/v1"
          ),
        create:
          MatchAuthority(userInfoData.authorities, "Get:/api/bo/trace-id/v1") &&
          MatchAuthority(
            userInfoData.authorities,
            "Post:/api/bo/registration/register/v1"
          ) &&
          MatchAuthority(
            userInfoData.authorities,
            "Post:/api/bo/registration/define-username-password/v1"
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

  const createTable = (sortItem) => {
    searchCustomers(createSearchObject(searchParams, { sortBy: sortItem }))
      .then((res) => {
        const convert = res.data?.data?.map((node) => {
          return {
            id: node.id,
            firstname: node.firstname,
            lastname: node.lastname,
            fullname: node.firstname + " " + node.lastname,
            identificationCode: node.identification_code,
            mobileNumber: node.mobile_number,
            isEnabled: node.is_enabled,
            lock: node.is_locked,
            username: node.username,
          };
        });
        dispatch(
          listCustomers({
            list: convert,
            endRow: res.data.end_row,
            startRow: res.data.start_row,
            totalRows: res.data.total_rows,
          })
        );
      })
      .then(() => {
        if (listCustomersData.sortColumn) {
          const keys = Object.keys(listCustomersData.sortType).filter(
            (p) => p !== listCustomersData.sortColumn
          );
          const newSort = {};
          keys.forEach((p) => (newSort[p] = ""));
          if (listCustomersData.sortType[listCustomersData.sortColumn] === "") {
            dispatch(
              listCustomers({
                sortType: { [listCustomersData.sortColumn]: "inc", ...newSort },
              })
            );
          } else if (
            listCustomersData.sortType[listCustomersData.sortColumn] === "inc"
          ) {
            dispatch(
              listCustomers({
                sortType: {
                  [listCustomersData.sortColumn]: "desc",
                  ...newSort,
                },
              })
            );
          } else if (
            listCustomersData.sortType[listCustomersData.sortColumn] === "desc"
          ) {
            dispatch(
              listCustomers({
                sortType: { [listCustomersData.sortColumn]: "", ...newSort },
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
      searchParams.get("isEnabled") ||
      searchParams.get("identificationCode") ||
      searchParams.get("mobileNumber") ||
      searchParams.get("fullname")
    ) {
      dispatch(listCustomers({ showDeleteBtn: true }));
    } else {
      dispatch(listCustomers({ showDeleteBtn: false }));
    }
  };
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
      dispatch(listCustomers({ showDeleteBtn: true, sortColumn: "" }));
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
    dispatch(listCustomers({ showDeleteBtn: false, sortColumn: "" }));
    form.resetFields();
  };
  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      createTable(listCustomersData.sortBy);
      handleResetSearch();
    }
  }, [searchParams, listCustomersData.reload, listCustomersData.sortBy]);

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
      identificationCode: searchParams.get("identificationCode"),
      mobileNumber: searchParams.get("mobileNumber"),
      fullname: searchParams.get("fullname"),
      pageNumber: searchParams.get("pageNumber") || 1,
      recordsPerPage: searchParams.get("recordsPerPage") || 10,
    });
    handleResetSearch();
    dispatch(listCustomers({ modal: false }));
  }, []);
  const handleRecovery = (record) => {
    if (permissions.recovery) {
      recoveryPassword({
        identification_code: record.identificationCode,
        otp_gateway_type: "BO_WEB",
      })
        .then(() =>
          dispatch(
            listCustomers({
              recoveryModal: true,
              recoveryStep: 1,
              record: record,
            })
          )
        )
        .catch(() => errorHandler(errorResponse));
    }
  };
  const handleSort = (column) => {
    dispatch(listCustomers({ sortColumn: column }));
    if (listCustomersData.sortType[column] === "") {
      dispatch(listCustomers({ sortBy: column }));
    } else if (listCustomersData.sortType[column] === "inc") {
      dispatch(listCustomers({ sortBy: `-${column}` }));
    } else if (listCustomersData.sortType[column] === "desc") {
      dispatch(listCustomers({ sortBy: "-createdDate" }));
    }
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
      key: "isEnabled",
      dataIndex: "isEnabled",
      width: "90px",
      render: (_field, record) => (
        <TooltipComponent
          title={!record.isEnabled ? Dictionary.enable : Dictionary.disable}
        >
          <SwitchComponent
            disabled={!permissions.enable}
            defaultChecked={record.isEnabled}
            onChange={() => {
              if (record.isEnabled) {
                disableCustomer(record.identificationCode)
                  .then(() =>
                    dispatch(
                      listCustomers({
                        reload: !listCustomersData.reload,
                        record: {
                          ...listCustomersData.record,
                          isEnabled: false,
                        },
                      })
                    )
                  )
                  .catch(() => errorHandler(errorResponse));
              } else {
                enableCustomer(record.identificationCode)
                  .then(() =>
                    dispatch(
                      listCustomers({
                        reload: !listCustomersData.reload,
                        record: {
                          ...listCustomersData.record,
                          isEnabled: true,
                        },
                      })
                    )
                  )
                  .catch(() => errorHandler(errorResponse));
              }
            }}
          />
        </TooltipComponent>
      ),
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={listCustomersData.sortType.identificationCode}
            onClick={() => handleSort("identificationCode")}
            text={Dictionary.nationalId}
          />
        );
      },
      key: "identificationCode",
      dataIndex: "identificationCode",
      width: "25%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={listCustomersData.sortType.mobileNumber}
            onClick={() => handleSort("mobileNumber")}
            text={Dictionary.mobile}
          />
        );
      },
      key: "mobileNumber",
      dataIndex: "mobileNumber",
      width: "25%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={listCustomersData.sortType.fullname}
            onClick={() => handleSort("fullname")}
            text={Dictionary.fullName}
          />
        );
      },
      key: "fullname",
      dataIndex: "fullname",
      width: "25%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={listCustomersData.sortType.isLocked}
            onClick={() => handleSort("isLocked")}
          />
        );
      },
      key: "lock",
      dataIndex: "lock",
      width: "56px",
      render: (_field, record) => {
        return (
          <div className={Classes["list-customers-action"]}>
            <TooltipComponent
              title={permissions.block && record.lock && Dictionary.unlock}
            >
              <span
                onClick={() => {
                  if (permissions.block) {
                    record.lock
                      ? unlockCustomer(record.identificationCode)
                          .then(() => {
                            dispatch(
                              listCustomers({
                                reload: !listCustomersData.reload,
                              })
                            );
                            dispatch(
                              setNotificationData({
                                message: Dictionary.successfulChanges,
                                type: "success",
                                time: 5000,
                              })
                            );
                          })
                          .catch(() => errorHandler(errorResponse))
                      : "";
                  }
                }}
              >
                <CustomIcon
                  src={record.lock ? Lock : Unlock}
                  size={24}
                  name={`list-customers-${record.id}-lock`}
                  color={
                    record.lock && permissions.block
                      ? Variables.NotifRed
                      : record.lock && !permissions.block
                      ? Variables.GreenLight7
                      : !record.lock && permissions.block
                      ? Variables.LogoGreenDark
                      : !record.lock && !permissions.block
                      ? Variables.GreenLight7
                      : ""
                  }
                />
              </span>
            </TooltipComponent>
          </div>
        );
      },
    },
    {
      key: "status",
      dataIndex: "status",
      width: "80px",
      className: "table-th-status",
      render: (_field, record) => (
        <div className={Classes["list-customers-action"]}>
          {/* <TooltipComponent title={Dictionary.services}>
            <span className={Classes["list-customers-action-btn"]}>
            <CustomIcon src={Widgets} size={24} name={`list-customers-${record.id}-widgets`} color={record.services ? "#2B9570" : "#CBE2D1"} />
            </span>
          </TooltipComponent> */}
          <TooltipComponent title={Dictionary.recovery}>
            <span
              className={Classes["list-customers-action-btn"]}
              onClick={() => handleRecovery(record)}
            >
              <CustomIcon
                src={Key}
                size={24}
                name={`list-customers-${record.id}-key`}
                color={
                  permissions.recovery
                    ? Variables.LogoGreenDark
                    : Variables.GreenLight7
                }
              />
            </span>
          </TooltipComponent>
          <TooltipComponent title={Dictionary.edit}>
            <span
              className={Classes["list-customers-action-btn-last"]}
              onClick={() =>
                permissions.edit &&
                dispatch(
                  listCustomers({
                    editUsernameAndMobileModal: true,
                    record: record,
                  })
                )
              }
            >
              <CustomIcon
                src={Edit}
                size={24}
                name={`list-customers-${record.id}-edit`}
                color={
                  permissions.edit
                    ? Variables.LogoGreenDark
                    : Variables.GreenLight7
                }
              />
            </span>
          </TooltipComponent>
        </div>
      ),
    },
  ];
  const items = [
    { id: 1, value: true, text: "فعال" },
    { id: 2, value: false, text: "غیرفعال" },
  ];
  return (
    <div>
      {permissions.create ? (
        <HeaderPage
          title={Dictionary.listCustomers}
          onClick={() => {
            getTrace()
              .then((res) => {
                dispatch(
                  listCustomers({
                    traceId: res.data.trace_id,
                    modal: true,
                    current: 0,
                  })
                );
              })
              .catch(() => errorHandler(errorResponse));
          }}
          buttonText={Dictionary.addCustomer}
        />
      ) : (
        <HeaderPage title={Dictionary.listCustomers} />
      )}
      <ModalComponent
        title={Dictionary.addNewCustomer}
        open={listCustomersData.modal}
        onCancel={() =>
          listCustomersData.current === 0 || listCustomersData.current === 4
            ? dispatch(
                listCustomers({
                  modal: false,
                  current: 0,
                  resetFields: !listCustomersData.resetFields,
                })
              )
            : dispatch(listCustomers({ modal: false, cancelModal: true }))
        }
      >
        <AddNewCustomer />
      </ModalComponent>
      <CancelModal
        visible={listCustomersData.cancelModal}
        clickConfirm={() => {
          dispatch(resetListCustomers(listCustomersData.list));
          dispatch(
            listCustomers({ resetFields: !listCustomersData.resetFields })
          );
        }}
        clickCancel={() =>
          dispatch(listCustomers({ modal: true, cancelModal: false }))
        }
      />
      <ModalComponent
        title={`${Dictionary.recoveryPassword} ${Dictionary.customer}`}
        open={listCustomersData.recoveryModal}
        onCancel={() => dispatch(listCustomers({ recoveryModal: false }))}
      >
        <RecoveryPassword />
      </ModalComponent>
      <ModalComponent
        title={Dictionary.editUsernameAndMobile}
        open={listCustomersData.editUsernameAndMobileModal}
        onCancel={() =>
          dispatch(
            listCustomers({ editUsernameAndMobileModal: false, collapse: "" })
          )
        }
      >
        <EditUsernameAndMobile />
      </ModalComponent>
      <Form
        className={Classes["list-customers-form"]}
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent
          name="isEnabled"
          className={Classes["list-customers-form-item"]}
        >
          <SelectComponent
            name="isEnabled"
            width={176}
            placeholder={Dictionary.status}
            items={items}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent
          name="identificationCode"
          className={Classes["list-customers-form-item"]}
        >
          <InputSearchComponent
            width={176}
            placeholder={Dictionary.nationalCode}
            maxLength={11}
          />
        </FormItemComponent>
        <FormItemComponent
          name="mobileNumber"
          className={Classes["list-customers-form-item"]}
        >
          <InputSearchComponent
            width={176}
            placeholder={Dictionary.mobile}
            maxLength={11}
          />
        </FormItemComponent>
        <FormItemComponent
          name="fullname"
          className={Classes["list-customers-form-item"]}
        >
          <InputSearchComponent
            width={176}
            placeholder={Dictionary.fullName}
            maxLength={32}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["list-customers-btn"]}>
          {listCustomersData.showDeleteBtn && (
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
            loading={isLoading}
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </Form>
      <TableComponent
        columns={columns}
        dataSource={listCustomersData.list}
        count={listCustomersData.totalRows}
      />
      {listCustomersData.totalRows >= 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={listCustomersData.totalRows}
        />
      )}
    </div>
  );
};
export default Customers;
