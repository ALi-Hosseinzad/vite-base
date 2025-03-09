import SelectComponent from "components/SelectComponent/SelectComponent";
import ButtonComponent from "components/button/ButtonComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import HeaderPage from "components/headerPage/HeaderPage";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import SwitchComponent from "components/switch/SwitchComponent";
import TableComponent from "components/table/TableComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import {
  editCompany,
  getCompanyPlans,
  getListOfCompany,
} from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import Dictionary from "helpers/Dictionary";
import useErrorHandler from "helpers/useErrorHandler";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Visible from "assets/images/icon/VisibleGrey.svg";
import Edit from "assets/images/icon/Edit.svg";
import Variables from "assets/styles/_Variables.scss";
import {
  companies,
  resetCompanies,
} from "store/reducers/companies/companiesReducer";
import Classes from "views/companies/styles/companies.module.scss";
import { Form } from "antd";
import AddCompanyModal from "./pageComponent/AddCompanyModal";
import AddPlanModal from "./pageComponent/AddPlanModal";
import EditModal from "./pageComponent/EditModal";
import { b64toBlob } from "helpers/convertBase64ToBlob";
import { useSearchParams } from "react-router-dom";
import { createSearchObject } from "helpers/CreateSearchObject";
import ViewModal from "./pageComponent/ViewModal";
import { MatchAuthority } from "helpers/MatchAuthority";
import PaginationComponent from "components/pagination/PaginationComponent";

const Companies = () => {
  const dispatch = useDispatch();
  const companiesData = useSelector((state) => state.companies.value);
  const userInfoData = useSelector((state) => state.userInfo.value);
  const { reload, permissions } = companiesData;
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const formRef = useRef();
  const fileData = new FormData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentParams] = useState(Object.fromEntries([...searchParams]));
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });

  useEffect(() => {
    dispatch(resetCompanies());
  }, []);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        companies({
          permissions: {
            update:
              MatchAuthority(
                userInfoData.authorities,
                "Put:/api/bo/loan/company/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Put:/api/bo/loan/company/plan/v1"
              ),
            read:
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/loan/company/list/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Get:/api/bo/loan/company/plan/v1"
              ),
            create:
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/loan/company/add/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/loan/company/plan/v1"
              ),
          },
        })
      );
    } else {
      dispatch(
        companies({
          permissions: {
            update: true,
            read: true,
            create: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  const items = [
    { id: 1, value: true, text: "فعال" },
    { id: 2, value: false, text: "غیرفعال" },
  ];

  useEffect(() => {
    if (currentParams.isActive || currentParams.companyName) {
      form.setFieldsValue({
        isActive:
          currentParams.isActive === "true"
            ? items[0].text
            : currentParams.isActive === "false"
            ? items[1].text
            : "",
        companyName: currentParams.companyName,
      });
      dispatch(companies({ showDeleteBtn: true }));
    }
  }, [currentParams]);

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      ...currentParams,
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination({ pageNumber, recordsPerPage });
    setSearchParams(newQueryParam);
  };

  const crateTable = (sortItem) => {
    getListOfCompany(
      createSearchObject(searchParams, {
        operation: "contains",
        sortBy: sortItem,
      })
    )
      .then((res) => {
        dispatch(
          companies({
            list: res?.data?.data,
            endRow: res?.data.end_row,
            startRow: res?.data.start_row,
            totalRows: res?.data.total_rows,
          })
        );
      })
      .then(() => {
        if (companiesData.sortColumn) {
          const keys = Object.keys(companiesData.sortType).filter(
            (p) => p !== companiesData.sortColumn
          );
          const newSort = {};
          keys.forEach((p) => (newSort[p] = ""));
          if (companiesData.sortType[companiesData.sortColumn] === "") {
            dispatch(
              companies({
                sortType: { [companiesData.sortColumn]: "inc", ...newSort },
              })
            );
          } else if (
            companiesData.sortType[companiesData.sortColumn] === "inc"
          ) {
            dispatch(
              companies({
                sortType: { [companiesData.sortColumn]: "desc", ...newSort },
              })
            );
          } else if (
            companiesData.sortType[companiesData.sortColumn] === "desc"
          ) {
            dispatch(
              companies({
                sortType: { [companiesData.sortColumn]: "", ...newSort },
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
    if (searchParams.get("companyName") || searchParams.get("isActive")) {
      dispatch(companies({ showDeleteBtn: true }));
    } else {
      dispatch(companies({ showDeleteBtn: false }));
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
    dispatch(companies({ showDeleteBtn: true, sortColumn: "" }));
    setPagination({ ...pagination, pageNumber: 1 });
  };

  useEffect(() => {
    form.setFieldsValue({
      companyName: searchParams.get("companyName"),
      isActive:
        searchParams.get("isActive") === "false"
          ? items[1].text
          : searchParams.get("isActive") === "true"
          ? items[0].text
          : null,
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
      crateTable(companiesData.sortBy);
      handleResetSearch();
    }
  }, [
    searchParams,
    companiesData.reload,
    companiesData.enable,
    companiesData.sortBy,
  ]);

  const resetSearch = () => {
    const newQueryParam = {
      pageNumber: 1,
      recordsPerPage: pagination.recordsPerPage,
    };
    setSearchParams(newQueryParam);
    setPagination(newQueryParam);
    dispatch(
      companies({ showDeleteBtn: false, reload: !reload, sortColumn: "" })
    );
    form.resetFields();
  };

  const handleActivate = (row) => {
    // const byteCharacters = atob(row.icon_base64);
    // const byteNumbers = new Array(byteCharacters.length);
    // for (let i = 0; i < byteCharacters.length; i++) {
    //   byteNumbers[i] = byteCharacters.charCodeAt(i);
    // }
    // const byteArray = new Uint8Array(byteNumbers);
    // const blob = new Blob([byteArray], { type: "image/png" });

    // ##### betereki hoseinzad :| #####
    const blob = b64toBlob(row.icon_base64, "image/png");
    fileData.append("file", blob, `${new Date().getTime()}.png`);
    editCompany(
      {
        companyCode: row.company_code,
        companyName: row.company_name,
        isActive: !row.is_active,
      },
      fileData
    )
      .then((res) => dispatch(companies({ reload: !reload })))
      .catch(() => errorHandler(errorResponse));
  };

  const handleView = (item) => {
    getCompanyPlans(item?.company_code)
      .then((res) => {
        const tableData = res?.data?.map((plan, index) => ({
          ...plan,
          key: index + 1,
        }));
        dispatch(
          companies({ planList: [...tableData], record: item, viewModal: true })
        );
      })
      .catch(() => errorHandler(errorResponse));
  };

  const columns = [
    {
      key: "switch",
      dataIndex: "switch",
      width: "7%",
      render: (_field, record) => (
        <TooltipComponent
          title={!record.is_active ? Dictionary.enable : Dictionary.disable}
        >
          <SwitchComponent
            checked={record.is_active}
            onChange={() => permissions.update && handleActivate(record)}
            disabled={!permissions.update}
          />
        </TooltipComponent>
      ),
    },
    {
      width: "20%",
      title: Dictionary.name + " " + Dictionary.company,
      key: "company_name",
      dataIndex: "company_name",
    },
    {
      width: "20%",
      title: Dictionary.key + " " + Dictionary.company,
      key: "company_code",
      dataIndex: "company_code",
    },
    {
      width: "10%",
      title: Dictionary.quantity + " " + Dictionary.plan,
      key: "plan_count",
      dataIndex: "plan_count",
      render: (record) => (
        <div
          className={Classes["plan-count"]}
        >{`${record} ${Dictionary.plan}`}</div>
      ),
    },
    {
      width: "10%",
      title: Dictionary.companyLogo,
      key: "icon_base64",
      dataIndex: "icon_base64",
      render: (record) => (
        <div>
          <img
            style={{ width: "32px", height: "32px", borderRadius: "6px" }}
            src={`data:image/png;base64,${record}`}
          ></img>
        </div>
      ),
    },
    {
      key: "view",
      dataIndex: "view",
      width: "4%",
      className: Classes["row-icon"],
      render: (_field, record) => (
        <>
          <TooltipComponent title={Dictionary.details}>
            <CustomIcon
              src={Visible}
              size={24}
              name={`list-users-${record?.id}-Visible${record?.plan_count}`}
              onClick={() => record?.plan_count !== 0 && handleView(record)}
              color={
                record?.plan_count !== 0
                  ? Variables.LogoGreenDark
                  : Variables.GreenLight7
              }
              cursor={record?.plan_count !== 0 ? "pointer" : "default"}
            />
          </TooltipComponent>
          <TooltipComponent title={Dictionary.edit}>
            <CustomIcon
              src={Edit}
              size={24}
              name={`list-users-${record?.id}-edit`}
              onClick={() =>
                permissions.update &&
                dispatch(
                  companies({
                    record: record,
                    editModal: true,
                    editStep: "main",
                  })
                )
              }
              color={
                permissions.update
                  ? Variables.LogoGreenDark
                  : Variables.GreenLight7
              }
            />
          </TooltipComponent>
        </>
      ),
    },
  ];

  const addNewCompany = () => {
    dispatch(companies({ addModal: true }));
  };

  return (
    <div>
      <EditModal />
      <AddCompanyModal />
      <AddPlanModal />
      <ViewModal />
      <HeaderPage
        title={`${Dictionary.plansAndCompanies}`}
        onClick={permissions.create && addNewCompany}
        buttonText={`${Dictionary.company} ${Dictionary.new}`}
      />
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent name="companyName">
          <InputSearchComponent
            width={196}
            name="companyName"
            placeholder={Dictionary.name + " " + Dictionary.company}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent name="isActive">
          <SelectComponent
            name="isActive"
            width={196}
            placeholder={Dictionary.status}
            items={items}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["company-search-bar-btn"]}>
          {companiesData.showDeleteBtn && (
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
      {companiesData?.list?.length > 0 && (
        <TableComponent columns={columns} dataSource={companiesData?.list} />
      )}
      {companiesData.totalRows >= 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={companiesData.totalRows}
        />
      )}
    </div>
  );
};

export default Companies;
