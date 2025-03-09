import ChipComponent from "components/chipComponent/ChipComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import TableComponent from "components/table/TableComponent";
import {
  getAnonymousServices,
  getAuthenticatedServices,
} from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import Dictionary from "helpers/Dictionary";
import useErrorHandler from "helpers/useErrorHandler";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetServices,
  services,
} from "store/reducers/servicesManagement/servicesReducer";
import Classes from "views/servicesManagement/styles/services.module.scss";
import Edit from "assets/images/icon/Edit.svg";
import TooltipComponent from "components/tooltip/TooltipComponent";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import { Form, Select } from "antd";
import SelectComponent from "components/SelectComponent/SelectComponent";
import ButtonComponent from "components/button/ButtonComponent";
import Filter from "assets/images/icon/Filter.svg";
import DropDown from "assets/images/icon/DropDown.svg";
import SearchIcon from "assets/images/icon/Search.svg";
import HeaderPage from "components/headerPage/HeaderPage";
import ModalComponent from "components/modalComponent/ModalComponent";
import EditService from "./pageComponent/EditService";
import WarningModal from "./pageComponent/WarningModal";
import { useSearchParams } from "react-router-dom";
import { createSearchObject } from "helpers/CreateSearchObject";
import Variables from "assets/styles/_Variables.scss";
import { MatchAuthority } from "helpers/MatchAuthority";

const Services = () => {
  const dispatch = useDispatch();
  const servicesData = useSelector((state) => state.services.value);
  const userInfoData = useSelector((state) => state.userInfo.value);
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const formRef = useRef();
  const [state, setState] = useState(false);
  const [expand, setExpand] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const path = window.location.pathname;

  useEffect(() => {
    dispatch(resetServices());
  }, []);

  useEffect(() => {
    if (path.includes("anonymous-services")) {
      dispatch(services({ serviceType: "ANONYMOUS" }));
    } else if (path.includes("authenticated-services")) {
      dispatch(services({ serviceType: "AUTHENTICATED" }));
    }
  }, [path]);

  useEffect(() => {
    const branches = [];
    servicesData.list
      .filter((q) => q.parent_id === null)
      .forEach((q) => {
        branches.push(createBranch(q));
      });
    dispatch(services({ tableData: branches }));
  }, [servicesData.list]);

  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      createTable();
      handleResetSearch();
    }
  }, [servicesData.reload, searchParams, servicesData.serviceType]);

  useEffect(() => {
    let newQueryParam = {
      pageNumber: 1,
      recordsPerPage: 500,
    };
    for (const [key, value] of searchParams.entries()) {
      if (key !== "pageNumber" && key !== "recordsPerPage") {
        newQueryParam[key] = value;
      }
    }
    setSearchParams(newQueryParam);
    if (Object.keys(newQueryParam).length > 2) {
      setExpand(true);
    }
  }, [servicesData.serviceType]);

  useEffect(() => {
    form.setFieldsValue({
      isFinancial: searchParams.get("isFinancial"),
      facilityKey: searchParams.get("facilityKey"),
      facilityDescription: searchParams.get("facilityDescription"),
      isServiceActive: searchParams.get("isServiceActive"),
    });
    handleResetSearch();
  }, []);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        services({
          permissions: {
            view:
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/facility/all-login/search/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/facility/all-not-login/search/v1"
              ),
            edit:
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/facility/all-login/search/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/facility/all-not-login/search/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Put:/api/bo/facility/edit-login-facility/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Put:/api/bo/facility/edit-not-login-facility/v1"
              ),
          },
        })
      );
    } else {
      dispatch(
        services({
          Permissions: {
            edit: true,
            view: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  // #####handlers#####
  // #####handlers#####
  // #####handlers#####

  const handleResetSearch = () => {
    if (
      searchParams.get("isFinancial") ||
      searchParams.get("facilityKey") ||
      searchParams.get("facilityDescription") ||
      searchParams.get("isServiceActive")
    ) {
      dispatch(services({ showDeleteBtn: true }));
    } else {
      dispatch(services({ showDeleteBtn: false }));
    }
  };

  const createTable = () => {
    if (servicesData.serviceType === "AUTHENTICATED") {
      getAuthenticatedServices(
        createSearchObject(searchParams, { sortBy: "facilityKey" })
      )
        .then((res) => dispatch(services({ list: res.data })))
        .catch(() => errorHandler(errorResponse));
    } else if (servicesData.serviceType === "ANONYMOUS") {
      getAnonymousServices(
        createSearchObject(searchParams, { sortBy: "facilityKey" })
      )
        .then((res) => dispatch(services({ list: res.data })))
        .catch(() => errorHandler(errorResponse));
    }
  };

  const createBranch = (root) => {
    const menu = { ...root };
    const children = servicesData.list?.filter((q) => q.parent_id === menu.id);
    if (children === null || children.length === 0) return menu;
    menu["children"] = [];
    children.forEach((p) => menu["children"].push(createBranch(p)));
    return menu;
  };

  const onFinish = (values) => {
    if (values) {
      setExpand(true);
      dispatch(services({ showDeleteBtn: true }));
      Object.keys(values).forEach(
        (key) =>
          (values[key] === undefined ||
            values[key] === null ||
            values[key] === "") &&
          delete values[key]
      );
      setSearchParams({ pageNumber: 1, recordsPerPage: 500, ...values });
    }
  };

  const resetSearch = () => {
    setExpand(false);
    const newQueryParam = {
      pageNumber: 1,
      recordsPerPage: 500,
    };
    setSearchParams(newQueryParam);
    dispatch(services({ showDeleteBtn: false }));
    form.resetFields();
  };

  const columns = [
    {
      key: "activeDeactiveService",
      dataIndex: "activeDeactiveService",
      render: (_field, record) =>
        !record?.is_for_mobile && !record?.is_for_web && !record?.is_for_pwa ? (
          <ChipComponent
            className={Classes["services-table-status-chip"]}
            red={true}
          >
            {" "}
            {Dictionary.deactiveService}{" "}
          </ChipComponent>
        ) : (
          <ChipComponent className={Classes["services-table-status-chip"]}>
            {Dictionary.activeService}{" "}
          </ChipComponent>
        ),
      width: "12%",
    },
    {
      title: (
        <span style={{ marginRight: "23px" }}> {Dictionary.serviceTitle}</span>
      ),
      key: "facility_description",
      dataIndex: "facility_description",
      width: "18%",
      render: (_field, record) => (
        <span
          className={
            !record?.is_for_mobile && !record?.is_for_web && !record?.is_for_pwa
              ? Classes["services-table-cell"]
              : null
          }
        >
          {_field}
        </span>
      ),
    },
    {
      title: Dictionary.serviceType,
      key: "is_financial",
      dataIndex: "is_financial",
      width: "10%",
      width: "8%",
      render: (_field, record) => (
        <span
          className={
            !record?.is_for_mobile && !record?.is_for_web && !record?.is_for_pwa
              ? Classes["services-table-cell"]
              : null
          }
        >
          {_field ? Dictionary.financial : Dictionary.notFinancial}
        </span>
      ),
    },
    {
      title: "Key",
      key: "facility_key",
      dataIndex: "facility_key",
      width: "22%",
      render: (_field, record) => (
        <span
          className={
            !record?.is_for_mobile && !record?.is_for_web && !record?.is_for_pwa
              ? Classes["services-table-cell"]
              : null
          }
        >
          {_field}
        </span>
      ),
    },
    {
      title: Dictionary.allowUserDisable,
      key: "allow_user_disable",
      dataIndex: "allow_user_disable",
      render: (_field, record) =>
        _field ? (
          <ChipComponent
            disabled={
              !record?.is_for_mobile &&
              !record?.is_for_web &&
              !record?.is_for_pwa
                ? true
                : false
            }
            className={Classes["chips-of-services-page"]}
          >
            {" "}
            {Dictionary.active}{" "}
          </ChipComponent>
        ) : (
          <ChipComponent
            disabled={
              !record?.is_for_mobile &&
              !record?.is_for_web &&
              !record?.is_for_pwa
                ? true
                : false
            }
            className={Classes["chips-of-services-page"]}
            red={true}
          >
            {" "}
            {Dictionary.deactive}{" "}
          </ChipComponent>
        ),
      width: "8%",
    },
    {
      title: Dictionary.biometricSensor,
      key: "is_biometric_available",
      dataIndex: "is_biometric_available",
      render: (_field, record) =>
        _field ? (
          <ChipComponent
            disabled={
              !record?.is_for_mobile &&
              !record?.is_for_web &&
              !record?.is_for_pwa
                ? true
                : false
            }
            className={Classes["chips-of-services-page"]}
          >
            {" "}
            {Dictionary.active}{" "}
          </ChipComponent>
        ) : (
          <ChipComponent
            disabled={
              !record?.is_for_mobile &&
              !record?.is_for_web &&
              !record?.is_for_pwa
                ? true
                : false
            }
            className={Classes["chips-of-services-page"]}
            red={true}
          >
            {" "}
            {Dictionary.deactive}{" "}
          </ChipComponent>
        ),
      width: "8%",
    },
    {
      title: "Mobile",
      key: "is_for_mobile",
      dataIndex: "is_for_mobile",
      render: (_field, record) =>
        _field ? (
          <ChipComponent
            disabled={
              !record?.is_for_mobile &&
              !record?.is_for_web &&
              !record?.is_for_pwa
                ? true
                : false
            }
            className={Classes["chips-of-services-page"]}
          >
            {" "}
            {Dictionary.active}{" "}
          </ChipComponent>
        ) : (
          <ChipComponent
            disabled={
              !record?.is_for_mobile &&
              !record?.is_for_web &&
              !record?.is_for_pwa
                ? true
                : false
            }
            className={Classes["chips-of-services-page"]}
            red={true}
          >
            {" "}
            {Dictionary.deactive}{" "}
          </ChipComponent>
        ),
      width: "7%",
    },
    {
      title: "Web",
      key: "is_for_web",
      dataIndex: "is_for_web",
      render: (_field, record) =>
        _field ? (
          <ChipComponent
            disabled={
              !record?.is_for_mobile &&
              !record?.is_for_web &&
              !record?.is_for_pwa
                ? true
                : false
            }
            className={Classes["chips-of-services-page"]}
          >
            {" "}
            {Dictionary.active}{" "}
          </ChipComponent>
        ) : (
          <ChipComponent
            disabled={
              !record?.is_for_mobile &&
              !record?.is_for_web &&
              !record?.is_for_pwa
                ? true
                : false
            }
            className={Classes["chips-of-services-page"]}
            red={true}
          >
            {" "}
            {Dictionary.deactive}{" "}
          </ChipComponent>
        ),
      width: "7%",
    },
    {
      title: "PWA",
      key: "is_for_pwa",
      dataIndex: "is_for_pwa",
      render: (_field, record) =>
        _field ? (
          <ChipComponent
            disabled={
              !record?.is_for_mobile &&
              !record?.is_for_web &&
              !record?.is_for_pwa
                ? true
                : false
            }
            className={Classes["chips-of-services-page"]}
          >
            {" "}
            {Dictionary.active}{" "}
          </ChipComponent>
        ) : (
          <ChipComponent
            disabled={
              !record?.is_for_mobile &&
              !record?.is_for_web &&
              !record?.is_for_pwa
                ? true
                : false
            }
            className={Classes["chips-of-services-page"]}
            red={true}
          >
            {" "}
            {Dictionary.deactive}{" "}
          </ChipComponent>
        ),
      width: "7%",
    },
    {
      key: "edit",
      dataIndex: "edit",
      render: (_field, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginLeft: "8px",
          }}
          onClick={() => {
            servicesData.permissions.edit &&
              dispatch(services({ record: record, editModal: true }));
          }}
        >
          <TooltipComponent title={Dictionary.edit}>
            <CustomIcon
              src={Edit}
              size={24}
              color={
                servicesData.permissions.edit
                  ? Variables.LogoGreenDark
                  : Variables.GreenLight7
              }
            />
          </TooltipComponent>
        </div>
      ),
      width: "5%",
    },
  ];

  const items = {
    isFinancial: [
      { id: 1, value: true, text: "مالی" },
      { id: 2, value: false, text: "غیر مالی" },
    ],
    isServiceActive: [
      { id: 1, value: true, text: "خدمت فعال" },
      { id: 2, value: false, text: "خدمت غیر فعال" },
    ],
  };

  return (
    <div style={{ height: "100%" }}>
      <ModalComponent
        width={918}
        className={Classes["services-modals"]}
        title={`${Dictionary.editService} - ${Dictionary.withLogin}`}
        open={servicesData.editModal}
        maskClosable={false}
        onCancel={() => dispatch(services({ editModal: false, record: "" }))}
      >
        <EditService />
      </ModalComponent>
      <ModalComponent
        width={540}
        className={Classes["services-modals"]}
        title={Dictionary.toDeactivateService}
        open={servicesData.warningModal}
        maskClosable={false}
        onCancel={() => dispatch(services({ editModal: false }))}
      >
        <WarningModal />
      </ModalComponent>
      <HeaderPage
        title={
          servicesData.serviceType === "AUTHENTICATED"
            ? Dictionary.systemServicesManagement
            : Dictionary.anonymousServicesManagement
        }
      />
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent name="facilityDescription">
          <InputSearchComponent
            width={176}
            placeholder={Dictionary.serviceTitle}
          />
        </FormItemComponent>
        <FormItemComponent
          name="isFinancial"
          className={Classes["services-search-form-item"]}
        >
          <SelectComponent
            name="isFinancial"
            width={176}
            placeholder={Dictionary.serviceType}
            items={items.isFinancial}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent
          name="facilityKey"
          className={Classes["services-search-form-item"]}
        >
          <InputSearchComponent width={400} placeholder="key" />
        </FormItemComponent>
        <FormItemComponent
          name="isServiceActive"
          className={Classes["services-search-form-item"]}
        >
          <SelectComponent
            name="isServiceActive"
            width={176}
            placeholder={Dictionary.status}
            items={items.isServiceActive}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["services-search-btn"]}>
          {servicesData.showDeleteBtn && (
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
      <div style={{ height: "90%" }}>
        {servicesData.tableData.length !== 0 &&
          (expand ? (
            <TableComponent
              columns={columns}
              dataSource={servicesData.tableData}
              className={Classes["services-table"]}
              expandable={{ defaultExpandAllRows: true }}
            />
          ) : (
            <TableComponent
              columns={columns}
              dataSource={servicesData.tableData}
              className={Classes["services-table"]}
              expandable={{ defaultExpandAllRows: false }}
            />
          ))}
      </div>
    </div>
  );
};

export default Services;
