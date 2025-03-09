import React, { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import queryString from "query-string";
import Dictionary from "helpers/Dictionary";
import Edit from "assets/images/icon/Edit.svg";
import Delete from "assets/images/icon/Delete.svg";
import { errorResponse } from "helpers/APIService";
import VersionAdd from "./pageComponent/VersionAdd";
import Variables from "assets/styles/_Variables.scss";
import VersionEdit from "./pageComponent/VersionEdit";
import useErrorHandler from "helpers/useErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import Classes from "./styles/AppVersions.module.scss";
import { getAllAppVersions } from "helpers/APIFunction";
import CustomIcon from "components/customIcon/CustomIcon";
import HeaderPage from "components/headerPage/HeaderPage";
import VersionDelete from "./pageComponent/VersionDelete";
import FormComponent from "components/form/FormComponent";
import VisibleGrey from "assets/images/icon/VisibleGrey.svg";
import TableComponent from "components/table/TableComponent";
import VersionDetails from "./pageComponent/VersionsDetails";
import { useLocation, useSearchParams } from "react-router-dom";
import ButtonComponent from "components/button/ButtonComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import ChipComponent from "components/chipComponent/ChipComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import PaginationComponent from "components/pagination/PaginationComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import {
  resetVersions,
  versions,
  versionsState,
} from "store/reducers/versions/versionsReducer";

const AppVersions = () => {
  const formRef = useRef();
  const tableRef = useRef();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const errorHandler = useErrorHandler();
  const AppVersionsData = useSelector(versionsState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParam] = useState(queryString?.parse(location.search));
  const queryParamRecordsPerPage =
    searchParams.get("count") >= 50 ? 50 : Number(searchParams.get("count"));
  const [pagination, setPagination] = useState({
    offset: Number(searchParams.get("offset")) || 1,
    count: queryParamRecordsPerPage || 10,
  });
  const {
    totalRows,
    refresh,
    list,
    showDeleteBtn,
    showAddNewVersionModal,
    deleteVersionModal,
    editModal,
    showDetailsModal,
  } = AppVersionsData;

  useEffect(() => {
    return () => {
      dispatch(resetVersions());
    };
  }, []);

  useEffect(() => {
    let newQueryParam = {
      offset: pagination.offset,
      count: pagination.count,
    };
    for (const [key, value] of searchParams.entries()) {
      if (key !== "offset" && key !== "count") {
        newQueryParam[key] = value;
      }
    }
    setSearchParams(newQueryParam);
  }, [pagination.count, pagination.offset]);

  useEffect(() => {
    if (searchParams.get("app_version") || searchParams.get("description")) {
      form.setFieldsValue({
        app_version: searchParams.get("app_version"),
        description: searchParams.get("description"),
      });
      dispatch(versions({ showDeleteBtn: true }));
    }
    if (searchParams.get("operating_system")) {
      form.setFieldsValue({
        operating_system: items?.find(
          (item) => item.value === searchParams.get("operating_system")
        ),
      });
      dispatch(versions({ showDeleteBtn: true }));
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("offset")) {
      crateTable();
      tableRef.current?.scrollTo({ index: 0 });
    }
  }, [refresh, searchParams]);

  const crateTable = () => {
    let body = Object.fromEntries(searchParams.entries());
    body.offset = ((body.offset - 1) * body.count).toString();

    getAllAppVersions(body)
      .then((res) => {
        dispatch(
          versions({ list: res?.data?.data, totalRows: res?.data?.total_rows })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const handleDetails = (record) => {
    const apps = [];
    Object.keys(record?.download_links).forEach((item, index) => {
      apps.push({
        app: item,
        link: Object?.values(record.download_links)[index],
      });
    });
    dispatch(versions({ record: record, showDetailsModal: true, links: apps }));
  };

  const handleEdit = (record) => {
    const apps = [];
    Object.keys(record?.download_links).forEach((item, index) => {
      apps.push({
        app: item,
        link: Object.values(record.download_links)[index],
      });
    });
    dispatch(
      versions({
        record: record,
        editModal: true,
        links: apps,
        checkSums: record?.checksums,
      })
    );
  };

  const items = [
    { id: 1, value: "ANDROID", text: "ANDROID" },
    { id: 2, value: "IOS", text: "IOS" },
    { id: 3, value: "BROWSER", text: "BROWSER" },
  ];

  const onPaginationHandler = (offset, count) => {
    const newQueryParam = { ...queryParam, offset: offset, count: count };
    setPagination({ offset, count });
    setSearchParams(newQueryParam);
  };

  const onFinish = (values) => {
    Object.keys(values).forEach(
      (key) =>
        (values[key] === undefined ||
          values[key] === null ||
          values[key] === "") &&
        delete values[key]
    );
    let newQueryParam;
    newQueryParam = { ...values, offset: 1, count: pagination.count };
    setSearchParams(newQueryParam);
    dispatch(versions({ showDeleteBtn: true }));
    setPagination({ ...pagination, offset: 1 });
  };

  const resetSearch = () => {
    const newQueryParam = {
      offset: 1,
      count: pagination.count,
    };
    setPagination({ offset: 1, count: pagination.count });
    setSearchParams(newQueryParam);
    dispatch(versions({ showDeleteBtn: false, refresh: !refresh }));
    form.resetFields();
  };

  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: 50,
      className: "first-column",
      fixed: "left",
      render: (_text, _record, index) => {
        if (pagination.offset === 1) {
          return <span className="pagination-column">{index + 1}</span>;
        } else {
          return (
            <span className="pagination-column">
              {((pagination.offset === 0
                ? pagination.offset + 1
                : pagination.offset) -
                1) *
                pagination.count +
                (index + 1)}
            </span>
          );
        }
      },
    },
    {
      title: Dictionary.type + " " + Dictionary.system,
      width: 100,
      key: "operating_system",
      dataIndex: "operating_system",
      fixed: "left",
      render: (record) => record || "--",
    },
    {
      title: Dictionary.version,
      width: 100,
      key: "app_version",
      dataIndex: "app_version",
      fixed: "left",
      render: (record) => record || "--",
    },
    {
      title: "Force Update",
      width: 120,
      key: "force_update",
      dataIndex: "force_update",
      render: (record) => (
        <ChipComponent className={Classes["chip"]} red={record ? false : true}>
          {record ? Dictionary.yes : Dictionary.no}
        </ChipComponent>
      ),
    },
    {
      title: "Pre Live",
      width: 120,
      key: "pre_live",
      dataIndex: "pre_live",
      render: (record) => (
        <ChipComponent className={Classes["chip"]} red={record ? false : true}>
          {record ? Dictionary.yes : Dictionary.no}
        </ChipComponent>
      ),
    },
    {
      title: "CheckSums",
      key: "checksums",
      dataIndex: "checksums",
      width: 300,
      render: (field) => (
        <div className={Classes["modifiedFeatures2"]}>
          {field?.length > 1 ? (
            field?.map((item) => <span>{item} , </span>)
          ) : (
            <span>{field?.length === 1 ? field[0] : "--"}</span>
          )}
        </div>
      ),
    },
    {
      title: `${Dictionary.date} ${Dictionary.release}`,
      width: 180,
      key: "release_date",
      dataIndex: "release_date",
      render: (record) => (
        <span style={{ direction: "ltr", float: "right" }}>
          {record ? record.replace(" ", " - ") : "--"}
        </span>
      ),
    },
    {
      title: Dictionary.installed,
      width: 130,
      key: "installation_count",
      dataIndex: "installation_count",
      render: (record) => (record === null ? "--" : record),
    },
    {
      title: `${Dictionary.installed} ${Dictionary.active}`,
      width: 170,
      key: "active_installation_count",
      dataIndex: "active_installation_count",
      render: (record) => (record === null ? "--" : record),
    },
    {
      title: Dictionary.modifiedFeatures,
      key: "description",
      dataIndex: "description",
      width: 600,
      render: (field) => (
        <div className={Classes["modifiedFeatures"]}>
          {field?.length > 1 ? (
            field?.map((item) => <span>{item} , </span>)
          ) : (
            <span>{field?.length === 1 ? field[0] : "--"}</span>
          )}
        </div>
      ),
    },
    {
      key: "services",
      dataIndex: "services",
      width: 100,
      className: "table-th-status",
      fixed: "right",
      render: (_field, record) => (
        <div className={Classes["versions-row-icon"]}>
          <TooltipComponent title={Dictionary.details}>
            <CustomIcon
              src={VisibleGrey}
              size={24}
              name={`app-version-${record.id}-view`}
              color="#2b9570"
              onClick={() => handleDetails(record)}
            />
          </TooltipComponent>
          <TooltipComponent title={Dictionary.edit}>
            <CustomIcon
              src={Edit}
              size={24}
              name={`app-version-${record.id}-edit`}
              onClick={() => handleEdit(record)}
            />
          </TooltipComponent>
          <TooltipComponent title={record.deletable && Dictionary.delete}>
            <CustomIcon
              color={
                record.deletable ? Variables.NotifRed : Variables.NotifPink
              }
              cursor={record.deletable ? "pointer" : "default"}
              src={Delete}
              size={24}
              name={`app-version-${record.id}-delete`}
              onClick={
                record.deletable
                  ? () =>
                      dispatch(
                        versions({ deleteVersionModal: true, record: record })
                      )
                  : () => ""
              }
            />
          </TooltipComponent>
        </div>
      ),
    },
  ];

  return (
    <div>
      <HeaderPage
        title={`${Dictionary.settings} ${Dictionary.version} ${Dictionary.ha}`}
        onClick={() => dispatch(versions({ showAddNewVersionModal: true }))}
        buttonText={Dictionary.add + " " + Dictionary.newVersion}
      />
      {showDetailsModal && <VersionDetails />}
      {editModal && <VersionEdit />}
      {showAddNewVersionModal && <VersionAdd />}
      {deleteVersionModal && <VersionDelete />}
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent name="app_version">
          <InputSearchComponent
            name="app_version"
            width={196}
            placeholder={Dictionary.version}
          />
        </FormItemComponent>
        <FormItemComponent name="operating_system">
          <SelectComponent
            name="operating_system"
            width={196}
            placeholder={Dictionary.type + " " + Dictionary.system}
            items={items}
          />
        </FormItemComponent>
        <FormItemComponent name="description">
          <InputSearchComponent
            name="description"
            width={350}
            placeholder={Dictionary.modifiedFeatures}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["search-part-btn"]}>
          {showDeleteBtn && (
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
        tableLayout="unset"
        columns={columns}
        dataSource={list}
        scroll={{ y: 550, x: 2000 }}
        sticky={true}
        ref={tableRef}
      />
      {totalRows > 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.count}
          current={pagination.offset}
          total={totalRows}
        />
      )}
    </div>
  );
};

export default AppVersions;
