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
  listBranches,
  resetBranches,
} from "store/reducers/listBranches/listBranchesReducer";
import Edit from "assets/images/icon/Edit.svg";
import Visible from "assets/images/icon/VisibleGrey.svg";
import FormComponent from "components/form/FormComponent";
import Classes from "./styles/Branches.module.scss";
import TooltipComponent from "components/tooltip/TooltipComponent";
import SwitchComponent from "components/switch/SwitchComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import ChipComponent from "components/chipComponent/ChipComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import AddNewBranchModal from "./pageComponent/AddNewBranchModal";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import useErrorHandler from "helpers/useErrorHandler";
import {
  getAllServices,
  searchBranches,
  updateBranch,
} from "helpers/APIFunction";
import { createSearchObject } from "helpers/CreateSearchObject";
import { errorResponse } from "helpers/APIService";
import SortableTitle from "components/sortableTitle/SortableTitle";
import ViewBranchModal from "./pageComponent/ViewBranchModal";
import { MatchAuthority } from "helpers/MatchAuthority";
import Variables from "assets/styles/_Variables.scss";
const Branches = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const listBranchesData = useSelector((state) => state.listBranches.value);
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });
  const userInfoData = useSelector((state) => state.userInfo.value);
  const [permissions, setPermissions] = useState({
    edit: true,
    create: true,
    view: true,
  });

  useEffect(() => {
    dispatch(resetBranches());
  }, []);
  const handleDetails = (record) => {
    dispatch(listBranches({ modal: true, record: record }));
  };
  const onChange = (record) => {
    updateBranch({
      branch_code: record.branchCode,
      branch_name: record.branchName,
      is_enabled: !record.isEnabled,
      address: record.address,
      end_ip: record.end_ip,
      fax: record.fax,
      id: record.id,
      ip: record.ip,
      latitude: record.latitude,
      list_ip: record.list_ip,
      longitude: record.longitude,
      phone: record.phone,
      postal_code: record.postal_code,
      province: record.province,
      province_code: record.province_code,
      region: record.region,
      branch_ministration_keys: record.services.map(
        (b) => b.branch_ministration_key
      ),
      start_ip: record.start_ip,
      version: record.version,
    })
      .then(() => dispatch(listBranches({ reload: !listBranchesData.reload })))
      .catch(() => errorHandler(errorResponse));
  };

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination(newQueryParam);
  };
  const crateTable = (sortItem) => {
    searchBranches(createSearchObject(searchParams, { sortBy: sortItem }))
      .then((res) => {
        const convert = res.data?.data?.map((node) => {
          return {
            id: node.id,
            isEnabled: node.is_enabled,
            branchCode: node.branch_code,
            branchName: node.branch_name,
            province: node.province,
            services: node.rf_branch_ministration,
            address: node.address,
            end_ip: node.end_ip,
            fax: node.fax,
            ip: node.ip,
            latitude: node.latitude,
            list_ip: node.list_ip,
            longitude: node.longitude,
            phone: node.phone,
            postal_code: node.postal_code,
            province_code: node.province_code,
            region: node.region,
            start_ip: node.start_ip,
            atmCount: node.atm_count,
            version: node.version,
          };
        });
        dispatch(
          listBranches({
            list: convert,
            endRow: res.data.end_row,
            startRow: res.data.start_row,
            totalRows: res.data.total_rows,
          })
        );
      })
      .then(() => {
        if (listBranchesData.sortColumn) {
          const keys = Object.keys(listBranchesData.sortType).filter(
            (p) => p !== listBranchesData.sortColumn
          );
          const newSort = {};
          keys.forEach((p) => (newSort[p] = ""));
          if (listBranchesData.sortType[listBranchesData.sortColumn] === "") {
            dispatch(
              listBranches({
                sortType: { [listBranchesData.sortColumn]: "inc", ...newSort },
              })
            );
          } else if (
            listBranchesData.sortType[listBranchesData.sortColumn] === "inc"
          ) {
            dispatch(
              listBranches({
                sortType: { [listBranchesData.sortColumn]: "desc", ...newSort },
              })
            );
          } else if (
            listBranchesData.sortType[listBranchesData.sortColumn] === "desc"
          ) {
            dispatch(
              listBranches({
                sortType: { [listBranchesData.sortColumn]: "", ...newSort },
              })
            );
          }
        }
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };
  useEffect(() => {
    if (userInfoData.username !== "admin") {
      setPermissions({
        edit:
          MatchAuthority(userInfoData.authorities, "Put:/api/bo/branch/v1") &&
          MatchAuthority(
            userInfoData.authorities,
            "Post:/api/bo/province/search/v1"
          ),
        create:
          MatchAuthority(userInfoData.authorities, "Post:/api/bo/branch/v1") &&
          MatchAuthority(
            userInfoData.authorities,
            "Post:/api/bo/province/search/v1"
          ),
        view:
          MatchAuthority(
            userInfoData.authorities,
            "Post:/api/bo/branch/search/v1"
          ) &&
          MatchAuthority(
            userInfoData.authorities,
            "Get:/api/bo/branch-ministration/v1"
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
      crateTable(listBranchesData.sortBy);
    }
  }, [searchParams, listBranchesData.reload, listBranchesData.sortBy]);
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
      branchCode: searchParams.get("branchCode"),
      branchName: searchParams.get("branchName"),
      ["rfBranchMinistration.faMinistrationName"]: searchParams.get(
        "rfBranchMinistration.faMinistrationName"
      ),
      pageNumber: searchParams.get("pageNumber") || 1,
      recordsPerPage: searchParams.get("recordsPerPage") || 10,
    });
    handleResatSearch();
    dispatch(listBranches({ modal: false }));
  }, []);
  const handleResatSearch = () => {
    if (
      searchParams.get("isEnabled") ||
      searchParams.get("branchCode") ||
      searchParams.get("branchName") ||
      searchParams.get("rfBranchMinistration.faMinistrationName")
    ) {
      dispatch(listBranches({ showDeleteBtn: true }));
    } else {
      dispatch(listBranches({ showDeleteBtn: false }));
    }
  };
  const items = [
    { id: 1, value: "true", text: "فعال" },
    { id: 2, value: "false", text: "غیرفعال" },
  ];

  const handleSort = (column) => {
    dispatch(listBranches({ sortColumn: column }));
    if (listBranchesData.sortType[column] === "") {
      dispatch(listBranches({ sortBy: column }));
    } else if (listBranchesData.sortType[column] === "inc") {
      dispatch(listBranches({ sortBy: `-${column}` }));
    } else if (listBranchesData.sortType[column] === "desc") {
      dispatch(listBranches({ sortBy: "-createdDate" }));
    }
  };
  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: "3%",
      render: (_text, _record, index) => {
        if (pagination.pageNumber === 1) {
          return <span className={Classes["index-branch"]}>{index + 1}</span>;
        } else {
          return (
            <span className={Classes["index-branch"]}>
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
      width: "7%",
      render: (_field, record) => (
        <TooltipComponent
          title={!record.checked ? Dictionary.enable : Dictionary.disable}
        >
          <SwitchComponent
            checked={record.isEnabled}
            onChange={() => permissions.edit && onChange(record)}
            disabled={!permissions.edit}
          />
        </TooltipComponent>
      ),
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={listBranchesData.sortType.branchCode}
            onClick={() => handleSort("branchCode")}
            text={Dictionary.branchCode}
          />
        );
      },
      key: "branchCode",
      dataIndex: "branchCode",
      width: "10%",
    },
    {
      title: `${Dictionary.name} ${Dictionary.branch}`,
      key: "branchName",
      dataIndex: "branchName",
      width: "20%",
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={listBranchesData.sortType["rfProvince.faName"]}
            onClick={() => handleSort("rfProvince.faName")}
            text={Dictionary.province}
          />
        );
      },
      key: "province",
      dataIndex: "province",
      width: "16%",
    },
    {
      title: Dictionary.services,
      key: "services",
      dataIndex: "services",
      width: "34%",
      render: (_field, record) => (
        <>
          {_field.length === 0 ? (
            "-"
          ) : (
            <div className={Classes["servicesContainer"]}>
              <>
                <div>
                  {_field?.slice(0, 3).map((item) => (
                    <ChipComponent key={item.id}>
                      {item.fa_ministration_name}
                    </ChipComponent>
                  ))}
                </div>
                {_field.length > 3 && (
                  <p onClick={() => handleDetails(record)}>
                    + {_field.slice(3).length} {Dictionary.service}
                  </p>
                )}
              </>
            </div>
          )}
        </>
      ),
    },
    {
      key: "status",
      dataIndex: "status",
      width: "5%",
      render: (_field, record) => (
        <div>
          <TooltipComponent
            title={Dictionary.details}
            onClick={() => handleDetails(record)}
          >
            <CustomIcon
              src={Visible}
              size={24}
              name={`list-customers-${record.id}-view`}
              color="#2b9570"
            />
          </TooltipComponent>
        </div>
      ),
    },
    {
      key: "services",
      dataIndex: "services",
      width: "5%",
      className: "table-th-status",
      render: (_field, record) => (
        <div>
          <TooltipComponent
            title={Dictionary.edit}
            onClick={() =>
              permissions.edit &&
              dispatch(
                listBranches({ record: record, addModal: true, edit: true })
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
      dispatch(listBranches({ showDeleteBtn: true, sortColumn: "" }));
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
    dispatch(listBranches({ showDeleteBtn: false, sortColumn: "" }));
    form.resetFields();
  };
  useEffect(() => {
    getAllServices()
      .then((res) => {
        const convert = res.data.map((i) => {
          return {
            id: i.id,
            value: i.fa_ministration_name,
            text: i.fa_ministration_name,
            key: i.branch_ministration_key,
          };
        });
        dispatch(listBranches({ services: convert }));
      })
      .catch(() => errorHandler(errorResponse));
  }, []);
  return (
    <div>
      {permissions.create ? (
        <HeaderPage
          title={`${Dictionary.list} ${Dictionary.branches}`}
          onClick={() => dispatch(listBranches({ addModal: true }))}
          buttonText={`${Dictionary.branch} ${Dictionary.new}`}
        />
      ) : (
        <HeaderPage title={`${Dictionary.list} ${Dictionary.branches}`} />
      )}
      <ModalComponent
        className={Classes["newBranchModal"]}
        width={918}
        title={
          listBranchesData.edit === false
            ? Dictionary.addNewBranch
            : `${Dictionary.edit} ${Dictionary.branch}`
        }
        open={listBranchesData.addModal}
        onCancel={() =>
          dispatch(listBranches({ addModal: false, edit: false }))
        }
      >
        <AddNewBranchModal />
      </ModalComponent>
      <ModalComponent
        width={918}
        title={`${Dictionary.details} ${Dictionary.branch} `}
        open={listBranchesData.modal}
        onCancel={() => dispatch(listBranches({ modal: false }))}
      >
        <ViewBranchModal />
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
        <FormItemComponent name="branchCode">
          <InputSearchComponent
            width={176}
            name="branchCode"
            placeholder={Dictionary.branchCode}
          />
        </FormItemComponent>
        <FormItemComponent name="branchName">
          <InputSearchComponent
            width={176}
            name="branchName"
            placeholder={`${Dictionary.name} ${Dictionary.branch}`}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent name="rfBranchMinistration.faMinistrationName">
          <SelectComponent
            name="rfBranchMinistration_faMinistrationName"
            width={176}
            placeholder={Dictionary.services}
            items={listBranchesData?.services}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["branches-search-bar-btn"]}>
          {listBranchesData.showDeleteBtn && (
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
        dataSource={listBranchesData.list}
        count={listBranchesData.totalRows}
      />
      {listBranchesData.totalRows >= 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={listBranchesData.totalRows}
        />
      )}
    </div>
  );
};
export default Branches;
