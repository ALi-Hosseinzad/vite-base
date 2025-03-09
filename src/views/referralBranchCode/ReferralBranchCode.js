import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import HeaderPage from "components/headerPage/HeaderPage";
import ButtonComponent from "components/button/ButtonComponent";
import { Form } from "antd";
import Classes from "views/customer/styles/Customer.module.scss";
import FormItemComponent from "components/formItem/FormItemComponent";
import {
  branchCustomers,
  resetBranchCustomers,
} from "store/reducers/branchCustomers/BranchCustomers";
import ModalComponent from "components/modalComponent/ModalComponent";
import PaginationComponent from "components/pagination/PaginationComponent";
import TableComponent from "components/table/TableComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import { MatchAuthority } from "helpers/MatchAuthority";
import SortableTitle from "components/sortableTitle/SortableTitle";
import useErrorHandler from "helpers/useErrorHandler";
import { getBranchCustomer } from "helpers/APIFunction";
import { createSearchObject } from "helpers/CreateSearchObject";
import SendSmsToCustomer from "./pageComponent/SendSmsToCustomer";
import { errorResponse } from "helpers/APIService";
import CustomerPlaceHolder from "assets/images/placeholder/CustomerPlaceHolder.svg";
import CustomIcon from "components/customIcon/CustomIcon";

const ReferralBranchCode = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const branchCustomersData = useSelector(
    (state) => state.branchCustomers.value
  );
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
    create: true,
  });

  const crateTable = (sortItem) => {
    getBranchCustomer(createSearchObject(searchParams, { sortBy: sortItem }))
      .then((res) => {
        const convert = res.data?.data?.map((node) => {
          return {
            id: node.id,
            firstname: node.firstname,
            lastname: node.lastname,
            fullname: node.firstname + " " + node.lastname,
            createdDate: node.created_date,
            branch: node.branch,
            branchCode: node.branch_code,
            mobileNumber: node.mobile_number,
          };
        });
        dispatch(
          branchCustomers({
            list: convert,
            endRow: res.data.end_row,
            startRow: res.data.start_row,
            totalRows: res.data.total_rows,
          })
        );
      })
      .then(() => {
        if (branchCustomersData.sortColumn) {
          const keys = Object.keys(branchCustomersData.sortType).filter(
            (p) => p !== branchCustomersData.sortColumn
          );
          const newSort = {};
          keys.forEach((p) => (newSort[p] = ""));
          if (
            branchCustomersData.sortType[branchCustomersData.sortColumn] === ""
          ) {
            dispatch(
              branchCustomers({
                sortType: {
                  [branchCustomersData.sortColumn]: "inc",
                  ...newSort,
                },
              })
            );
          } else if (
            branchCustomersData.sortType[branchCustomersData.sortColumn] ===
            "inc"
          ) {
            dispatch(
              branchCustomers({
                sortType: {
                  [branchCustomersData.sortColumn]: "desc",
                  ...newSort,
                },
              })
            );
          } else if (
            branchCustomersData.sortType[branchCustomersData.sortColumn] ===
            "desc"
          ) {
            dispatch(
              branchCustomers({
                sortType: { [branchCustomersData.sortColumn]: "", ...newSort },
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
      searchParams.get("rfBranch.branchCode") ||
      searchParams.get("rfBranch.branchName") ||
      searchParams.get("fullname") ||
      searchParams.get("mobileNumber")
    ) {
      dispatch(branchCustomers({ showDeleteBtn: true }));
    } else {
      dispatch(branchCustomers({ showDeleteBtn: false }));
    }
  };
  const onFinish = (values) => {
    dispatch(branchCustomers({ CTA: true }));
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
      if (
        searchParams.get("rfBranch.branchCode") ||
        searchParams.get("rfBranch.branchName") ||
        searchParams.get("fullname") ||
        searchParams.get("mobileNumber")
      ) {
        dispatch(branchCustomers({ showDeleteBtn: true, sortColumn: "" }));
      }
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
    dispatch(
      branchCustomers({
        showDeleteBtn: false,
        CTA: false,
        list: [],
        sortColumn: "",
      })
    );
    form.resetFields();
  };

  // ######## useEffect ########
  // ######## useEffect ########
  // ######## useEffect ########

  useEffect(() => {
    dispatch(resetBranchCustomers());
  }, []);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      setPermissions({
        create: MatchAuthority(
          userInfoData.authorities,
          "Post:/api/bo/profile/sms-referral-code/v1"
        ),
      });
    } else {
      setPermissions({
        create: true,
      });
    }
  }, [userInfoData.authorities]);

  useEffect(() => {
    if (branchCustomersData.CTA) {
      if (searchParams.get("pageNumber")) {
        crateTable(branchCustomersData.sortBy);
        handleResetSearch();
      }
    }
  }, [
    searchParams,
    branchCustomersData.reload,
    branchCustomersData.sortBy,
    branchCustomersData.CTA,
  ]);

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
      fullname: searchParams.get("fullname"),
      mobileNumber: searchParams.get("mobileNumber"),
      "rfBranch.branchName": searchParams.get("rfBranch.branchName"),
      "rfBranch.branchCode": searchParams.get("rfBranch.branchCode"),
      pageNumber: searchParams.get("pageNumber") || 1,
      recordsPerPage: searchParams.get("recordsPerPage") || 10,
    });
    handleResetSearch();
    dispatch(branchCustomers({ modal: false }));
  }, []);

  const handleSort = (column) => {
    dispatch(branchCustomers({ sortColumn: column }));
    if (branchCustomersData.sortType[column] === "") {
      dispatch(branchCustomers({ sortBy: column }));
    } else if (branchCustomersData.sortType[column] === "inc") {
      dispatch(branchCustomers({ sortBy: `-${column}` }));
    } else if (branchCustomersData.sortType[column] === "desc") {
      dispatch(branchCustomers({ sortBy: "-createdDate" }));
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
      title: () => {
        return (
          <SortableTitle
            sort={branchCustomersData.sortType.fullname}
            onClick={() => handleSort("fullname")}
            text={Dictionary.fullName}
          />
        );
      },
      key: "fullname",
      dataIndex: "fullname",
      width: "20%",
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={branchCustomersData.sortType.mobileNumber}
            onClick={() => handleSort("mobileNumber")}
            text={Dictionary.mobile}
          />
        );
      },
      key: "mobileNumber",
      dataIndex: "mobileNumber",
      width: "20%",
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={branchCustomersData.sortType.createdDate}
            onClick={() => handleSort("createdDate")}
            text={Dictionary.joinDate}
          />
        );
      },
      key: "createdDate",
      dataIndex: "createdDate",
      width: "15%",
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={branchCustomersData.sortType.branch}
            onClick={() => handleSort("branch")}
            text={`${Dictionary.name} ${Dictionary.branch}`}
          />
        );
      },
      key: "branch",
      dataIndex: "branch",
      width: "15%",
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={branchCustomersData.sortType.branchCode}
            onClick={() => handleSort("branchCode")}
            text={Dictionary.branchCode}
          />
        );
      },
      key: "branchCode",
      dataIndex: "branchCode",
    },
  ];
  return (
    <div>
      {permissions.create ? (
        <HeaderPage
          title={Dictionary.customersWithReferralBranchCode}
          onClick={() => {
            dispatch(resetBranchCustomers({ modal: true }));
          }}
          buttonText={Dictionary.addCustomer}
        />
      ) : (
        <HeaderPage title={Dictionary.listCustomers} />
      )}
      <ModalComponent
        title={Dictionary.inviteNewCustomerWithReferralCode}
        open={branchCustomersData.modal}
        onCancel={() => dispatch(branchCustomers({ modal: false }))}
      >
        <SendSmsToCustomer />
      </ModalComponent>

      <Form
        className={Classes["list-customers-form"]}
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
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
        {userInfoData.username === "admin" && (
          <>
            <FormItemComponent
              name="rfBranch.branchName"
              className={Classes["list-customers-form-item"]}
            >
              <InputSearchComponent
                width={176}
                placeholder={`${Dictionary.name} ${Dictionary.branch}`}
                maxLength={100}
              />
            </FormItemComponent>
            <FormItemComponent
              name="rfBranch.branchCode"
              className={Classes["list-customers-form-item"]}
            >
              <InputSearchComponent
                width={176}
                placeholder={Dictionary.branchCode}
                maxLength={8}
              />
            </FormItemComponent>
          </>
        )}
        <FormItemComponent className={Classes["list-customers-btn"]}>
          {branchCustomersData.showDeleteBtn && (
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
      {branchCustomersData.list?.length > 0 ? (
        <TableComponent
          columns={columns}
          dataSource={branchCustomersData.list}
          count={branchCustomersData.totalRows}
        />
      ) : (
        <div className={Classes["table-placeholder"]}>
          <CustomIcon src={CustomerPlaceHolder} size={283} />
        </div>
      )}
      {branchCustomersData.totalRows >= 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={branchCustomersData.totalRows}
        />
      )}
    </div>
  );
};
export default ReferralBranchCode;
