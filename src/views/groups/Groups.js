import React, { Fragment, useEffect, useRef, useState } from "react";
import { Form, Select, Table } from "antd";
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
import Classes from "views/groups/styles/Groups.module.scss";
import AddNewGroupAuthority from "views/groupAuthority/AddNewGroupAuthority";
import {
  deleteAuthorityGroup,
  getAllAuthority,
  getAllAuthorityGroup,
} from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import AuthorityDetails from "views/groupAuthority/AuthorityDetails";
import { errorResponse } from "helpers/APIService";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { createSearchObject } from "helpers/CreateSearchObject";

const Groups = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const groupsData = useSelector((state) => state.groups.value);
  const [queryParam] = useState(queryString?.parse(location.search));
  const queryParamRecordsPerPage =
    queryParam?.recordsPerPage >= 50 ? 50 : Number(queryParam?.recordsPerPage);
  const [pagination, setPagination] = useState({
    pageNumber: Number(queryParam?.pageNumber) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });
  const [details, setDetails] = useState({});
  const errorHandler = useErrorHandler();
  const [authoritySearch, setAuthoritySearch] = useState([]);
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
      title: `${Dictionary.title} ${Dictionary.group}`,
      key: "group_description",
      dataIndex: "group_description",
      width: "15%",
      render: (record) => <>{record}</>,
    },
    {
      title: `${Dictionary.access}‌${Dictionary.ha}`,
      key: "authorities",
      dataIndex: "authorities",
      width: "70%",
      render: (_field, record) => (
        <>
          <div className={Classes["authority-authorities-list"]}>
            <>
              <div>
                {_field?.slice(0, 4).map((item) => (
                  <ChipComponent>{item.authority_description}</ChipComponent>
                ))}
              </div>
              {_field.length > 4 && (
                <p onClick={() => handleDetails(record)}>
                  + {_field.slice(4).length} {Dictionary.item}
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
      width: "8%",
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
    dispatch(groups({ detailsModal: true, record: record }));
    setDetails(record);
  };
  const handleEdit = (record) => {
    dispatch(
      groups({
        editModal: true,
        step: "edit",
        choiceList: record?.authorities.map((item) => item),
        choiceListKey: record?.authorities.map((item) => item.authority_key),
        groupTitle: { text: record?.group_description, error: false },
        groupKey: { text: record?.group_key, error: false },
        authoritySearchValue: "",
        choiceSearchValue: "",
      })
    );
  };
  const handleDelete = (record) => {
    if (record.group_key) {
      deleteAuthorityGroup(record.group_key)
        .then(() => {
          dispatch(groups({ reload: !groupsData.reload }));
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
    getAllAuthorityGroup(
      createSearchObject(searchParams, { operation: operation })
    )
      .then((res) => {
        const convert = res.data?.data?.map((node) => {
          return {
            group_description: node?.group_description,
            group_key: node?.group_key,
            authorities: node?.authorities,
          };
        });
        dispatch(
          groups({
            list: convert,
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
    if (
      searchParams.get("rfBackofficeAuthorities.authorityKey") ||
      searchParams.get("groupDescription")
    ) {
      dispatch(groups({ showDeleteBtn: true }));
    } else {
      dispatch(groups({ showDeleteBtn: false }));
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
      dispatch(groups({ showDeleteBtn: true }));
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
    dispatch(groups({ showDeleteBtn: false, reload: !groupsData.reload }));
    form.resetFields();
  };

  // ###### useEffect ######
  // ###### useEffect ######
  // ###### useEffect ######

  useEffect(() => {
    form.setFieldsValue({
      "rfBackofficeAuthorities.authorityKey": searchParams.get(
        "rfBackofficeAuthorities.authorityKey"
      ),
      groupDescription: searchParams.get("groupDescription"),
    });
    handleResetSearch();
  }, []);

  useEffect(() => {
    getAllAuthority({ offset: "0", count: "1000" })
      .then((res) => {
        dispatch(
          groups({
            authorityList: res?.data?.data,
            searchList: res?.data?.data,
          })
        );
        const convertList = [];
        res?.data?.data?.forEach((node) => {
          const convertObj = {
            id: node.id,
            value: node.authority_key,
            text: node.authority_description,
          };
          convertList.push(convertObj);
        });
        setAuthoritySearch(convertList);
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
  }, [searchParams, groupsData.reload]);

  // ###### return ######
  // ###### return ######
  // ###### return ######

  return (
    <Fragment>
      <HeaderPage
        title={Dictionary.groups}
        onClick={() => {
          dispatch(
            resetGroups({
              list: groupsData.list,
              searchList: groupsData.searchList,
              authorityList: groupsData.authorityList,
            })
          );
          dispatch(groups({ addModal: true }));
        }}
        buttonText={`${Dictionary.group} ${Dictionary.new}`}
      />
      <ModalComponent
        className={Classes["newBranchModal"]}
        width={918}
        title={`${Dictionary.addNewGroupAuthority}`}
        open={groupsData.addModal}
        onCancel={() => dispatch(groups({ addModal: false }))}
      >
        <AddNewGroupAuthority />
      </ModalComponent>
      <ModalComponent
        width={918}
        title={`${Dictionary.details} ${Dictionary.group}`}
        open={groupsData.detailsModal}
        onCancel={() => dispatch(groups({ detailsModal: false }))}
      >
        <AuthorityDetails />
      </ModalComponent>
      <ModalComponent
        className={Classes["newBranchModal"]}
        width={918}
        title={`${Dictionary.editGroupAuthority}`}
        open={groupsData.editModal}
        onCancel={() => dispatch(groups({ editModal: false }))}
      >
        <AddNewGroupAuthority />
      </ModalComponent>
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent name="groupDescription">
          <InputSearchComponent
            name="groupDescription"
            placeholder={Dictionary.title}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent name="rfBackofficeAuthorities.authorityKey">
          <SelectComponent
            name="rfBackofficeAuthorities_authorityKey"
            showSearch
            width={400}
            className={Classes["search-authority-group"]}
            placeholder={`${Dictionary.access}‌${Dictionary.ha}`}
            items={authoritySearch}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["groups-search-bar-btn"]}>
          {groupsData.showDeleteBtn && (
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
        dataSource={groupsData?.list}
        loading={isLoading}
        count={groupsData?.totalRows}
      />
      {groupsData?.totalRows >= 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={groupsData?.totalRows}
        />
      )}
    </Fragment>
  );
};
export default Groups;
