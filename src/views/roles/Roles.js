import React, { Fragment, useEffect, useRef, useState } from "react";
import { Form, Table } from "antd";
import PaginationComponent from "components/pagination/PaginationComponent";
import queryString from "query-string";
import TableComponent from "components/table/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import HeaderPage from "components/headerPage/HeaderPage";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import Edit from "assets/images/icon/Edit.svg";
import Visible from "assets/images/icon/VisibleGrey.svg";
import FormComponent from "components/form/FormComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import ChipComponent from "components/chipComponent/ChipComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import Delete from "assets/images/icon/Delete.svg";
import { groups, resetGroups } from "store/reducers/groups/groupsReducer";
import { roles, resetRoles } from "store/reducers/roles/rolesReducer";
import Classes from "views/roles/styles/roles.module.scss";
import AddNewGroupAuthority from "views/groupAuthority/AddNewGroupAuthority";
import {
  deleteRole,
  getAllAuthorityGroup,
  getAllMenu,
  searchAllRoles,
} from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { createSearchObject } from "helpers/CreateSearchObject";
import AddNewRole from "./pageComponent/AddNewRole";
import RoleDetails from "./pageComponent/RoleDetails";

const Roles = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [groupSearch, setGroupSearch] = useState([]);
  const rolesData = useSelector((state) => state.roles.value);
  const [queryParam] = useState(queryString?.parse(location.search));
  const queryParamRecordsPerPage =
    queryParam?.recordsPerPage >= 50 ? 50 : Number(queryParam?.recordsPerPage);
  const [pagination, setPagination] = useState({
    pageNumber: Number(queryParam?.pageNumber) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });
  const errorHandler = useErrorHandler();
  const [operation, setOperation] = useState("");

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
      title: `${Dictionary.title} ${Dictionary.role}`,
      key: "role_description",
      dataIndex: "role_description",
      width: "15%",
      render: (record) => <>{record}</>,
    },
    {
      title: `${Dictionary.groups}‌`,
      key: "authority_groups",
      dataIndex: "authority_groups",
      width: "35%",
      render: (_field, record) => (
        <>
          <div className={Classes["authority-authorities-list"]}>
            <>
              <div>
                {_field?.slice(0, 3).map((item) => (
                  <ChipComponent>{item.group_description}</ChipComponent>
                ))}
              </div>
              {_field?.length > 3 && (
                <p onClick={() => handleDetails(record)}>
                  + {_field.slice(3)?.length} {Dictionary.item}
                </p>
              )}
            </>
          </div>
        </>
      ),
    },
    {
      title: `${Dictionary.servicesMenu}`,
      key: "menus",
      dataIndex: "menus",
      width: "36%",
      render: (_field, record) => (
        <>
          <div className={Classes["authority-authorities-list"]}>
            <>
              <div>
                {_field?.slice(0, 2).map((item) => (
                  <ChipComponent>{item.menu_description}</ChipComponent>
                ))}
              </div>
              {_field.length > 2 && (
                <p onClick={() => handleDetails(record)}>
                  + {_field.slice(2).length} {Dictionary.item}
                </p>
              )}
            </>
          </div>
        </>
      ),
    },
    {
      key: "status",
      dataIndex: "status",
      width: "7%",
      className: "table-th-status",
      render: (_field, record) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TooltipComponent
            title={Dictionary.details}
            onClick={() => handleDetails(record)}
          >
            <CustomIcon
              src={Visible}
              size={24}
              name={`list-customers-${record.id}-edit`}
              color="#2b9570"
            />
          </TooltipComponent>
          <TooltipComponent
            title={Dictionary.edit}
            onClick={() => handleEdit(record)}
          >
            <CustomIcon
              src={Edit}
              size={24}
              name={`list-customers-${record.id}-edit`}
            />
          </TooltipComponent>
          <TooltipComponent
            title={Dictionary.delete}
            onClick={() => handleDelete(record)}
          >
            <CustomIcon
              src={Delete}
              size={24}
              name={`list-customers-${record.id}-edit`}
            />
          </TooltipComponent>
        </div>
      ),
    },
  ];

  // ####### handlers #######
  // ####### handlers #######
  // ####### handlers #######

  const handleDetails = (record) => {
    dispatch(roles({ detailsModal: true, record: record }));
  };

  const handleEdit = (record) => {
    dispatch(
      roles({
        editModal: true,
        step: "edit",
        roleTitle: { text: record?.role_description, error: false },
        roleKey: { text: record?.role_key, error: false },
        choiceList: record?.authority_groups.map((item) => item),
        choiceListKey: record?.authority_groups.map((item) => item.group_key),
        menuChoiceList: record?.menus.map((item) => item),
        menuChoiceListKey: record?.menus.map((item) => item.menu_key),
        groupSearchValue: "",
        menuSearchValue: "",
        groupChoiceSearchValue: "",
        menuChoiceSearchValue: "",
      })
    );
  };
  const handleDelete = (record) => {
    if (record.role_key) {
      deleteRole(record.role_key)
        .then(() => {
          dispatch(roles({ reload: !rolesData.reload }));
          dispatch(
            setNotificationData({
              message: Dictionary.successfullyDone,
              type: "success",
              time: 5000,
            })
          );
        })
        .catch(() => errorHandler(errorResponse));
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
  const crateTable = () => {
    searchAllRoles(createSearchObject(searchParams, { operation: operation }))
      .then((res) => {
        const convert = res.data?.data?.map((node) => {
          return {
            id: node?.id,
            role_description: node?.role_description,
            role_key: node?.role_key,
            authority_groups: node?.authority_groups,
            menus: node?.menus,
          };
        });
        dispatch(
          roles({
            list: convert,
            endRow: res?.data.end_row,
            startRow: res?.data.start_row,
            totalRows: res?.data.total_rows,
          })
        );
      })
      .catch(() => errorHandler(errorResponse));
  };
  const handleResetSearch = () => {
    if (
      searchParams.get("rfBackofficeAuthorityGroups.groupKey") ||
      searchParams.get("roleDescription")
    ) {
      dispatch(roles({ showDeleteBtn: true }));
    } else {
      dispatch(roles({ showDeleteBtn: false }));
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
      Object.keys(values).forEach((key) => {
        if (key === "rfBackofficeAuthorities.authorityKey") {
          setOperation("equals");
        } else {
          setOperation("contains");
        }
      });
      setSearchParams(newQueryParam);
      dispatch(roles({ showDeleteBtn: true }));
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
    dispatch(roles({ showDeleteBtn: false, reload: !rolesData.reload }));
    form.resetFields();
  };

  // ###### useEffect ######
  // ###### useEffect ######
  // ###### useEffect ######

  useEffect(() => {
    form.setFieldsValue({
      "rfBackofficeAuthorityGroups.groupKey": searchParams.get(
        "rfBackofficeAuthorityGroups.groupKey"
      ),
      roleDescription: searchParams.get("roleDescription"),
    });
    handleResetSearch();
  }, []);

  useEffect(() => {
    getAllAuthorityGroup({ offset: "0", count: "1000" })
      .then((res) => {
        dispatch(
          roles({ groupsList: res?.data?.data, searchList: res?.data?.data })
        );
        const convertList = [];
        res?.data?.data?.forEach((node) => {
          const convertObj = {
            id: node.id,
            value: node.group_key,
            text: node.group_description,
          };
          convertList.push(convertObj);
        });
        setGroupSearch(convertList);
      })
      .catch(() => errorHandler(errorResponse));
  }, []);

  useEffect(() => {
    getAllMenu()
      .then((res) => {
        dispatch(roles({ menuList: res?.data, searchMenuList: res?.data }));
        const convertList = [];
        res?.data?.forEach((node) => {
          const convertObj = {
            id: node.id,
            value: node.menu_key,
            text: node.menu_description,
          };
          convertList.push(convertObj);
        });
      })
      .catch(() => errorHandler(errorResponse));
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
      crateTable();
      handleResetSearch();
    }
  }, [searchParams, rolesData.reload]);

  // ###### return ######
  // ###### return ######
  // ###### return ######

  return (
    <Fragment>
      <HeaderPage
        title={Dictionary.groups}
        onClick={() => {
          dispatch(
            resetRoles({
              list: rolesData.list,
              searchList: rolesData.searchList,
              groupsList: rolesData.groupsList,
              searchMenuList: rolesData.searchMenuList,
              menuList: rolesData.menuList,
            })
          );
          dispatch(roles({ addModal: true }));
        }}
        buttonText={`${Dictionary.role} ${Dictionary.new}`}
      />
      <ModalComponent
        className={Classes["newBranchModal"]}
        width={918}
        title={`${Dictionary.add} ${Dictionary.role} ${Dictionary.new}`}
        open={rolesData.addModal}
        onCancel={() => dispatch(roles({ addModal: false }))}
      >
        <AddNewRole />
      </ModalComponent>
      <ModalComponent
        width={918}
        title={`${Dictionary.details} ${Dictionary.group}`}
        open={rolesData.detailsModal}
        onCancel={() => dispatch(roles({ detailsModal: false }))}
      >
        <RoleDetails />
      </ModalComponent>
      <ModalComponent
        className={Classes["newBranchModal"]}
        width={918}
        title={`${Dictionary.editGroupAuthority}`}
        open={rolesData.editModal}
        onCancel={() => dispatch(roles({ editModal: false }))}
      >
        <AddNewRole />
      </ModalComponent>
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent name="roleDescription">
          <InputSearchComponent
            name="roleDescription"
            placeholder={`${Dictionary.title} ${Dictionary.role}`}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent name="rfBackofficeAuthorityGroups.groupKey">
          <SelectComponent
            name="rfBackofficeAuthorityGroups_groupKey"
            width={400}
            placeholder={Dictionary.groups}
            items={groupSearch}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["groups-search-bar-btn"]}>
          {rolesData.showDeleteBtn && (
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
            loading={isLoading}
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
      <TableComponent
        className={Classes["table-group"]}
        columns={columns}
        dataSource={rolesData?.list}
        loading={isLoading}
        count={rolesData?.totalRows}
      />
      {rolesData?.totalRows >= 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={rolesData?.totalRows}
        />
      )}
    </Fragment>
  );
};
export default Roles;
