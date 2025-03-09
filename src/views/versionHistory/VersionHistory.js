import { Form } from "antd";
import CustomIcon from "components/customIcon/CustomIcon";
import TableComponent from "components/table/TableComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import { searchVersionsHistory } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import { createSearchObject } from "helpers/CreateSearchObject";
import Dictionary from "helpers/Dictionary";
import useErrorHandler from "helpers/useErrorHandler";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { versionHistory } from "store/reducers/versionHistory/versionHistoryReducer";
import Variables from "assets/styles/_Variables.scss";
import Eye from "assets/images/icon/VisibleGrey.svg";
import FormItemComponent from "components/formItem/FormItemComponent";
import FormComponent from "components/form/FormComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import ButtonComponent from "components/button/ButtonComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import Classes from "views/versionHistory/styles/versionHistory.module.scss";
import HeaderPage from "components/headerPage/HeaderPage";
import ModalComponent from "components/modalComponent/ModalComponent";
import VersionDetails from "views/versionControl/pageComponent/VersionsDetails";
import PaginationComponent from "components/pagination/PaginationComponent";

const VersionHistory = () => {
  const historiesData = useSelector((state) => state.versionHistory.value);
  const [sortBy, setSortBy] = useState("-createdDate");
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
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
  const items = [
    { id: 1, value: "ANDROID", text: "ANDROID" },
    { id: 3, value: "BROWSER", text: "BROWSER" },
    { id: 4, value: "IOS", text: "IOS" },
  ];

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      ...currentParams,
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination({ pageNumber, recordsPerPage });
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
    const newQueryParam = {
      pageNumber: 1,
      recordsPerPage: pagination.recordsPerPage,
      ...values,
    };
    setSearchParams(newQueryParam);
    dispatch(versionHistory({ showDeleteBtn: true }));
    setPagination({ ...pagination, pageNumber: 1 });
  };

  const handleDetails = (record) => {
    const apps = [];
    const checkSums = [];
    if (record?.operating_system?.toLowerCase() !== "browser") {
      record?.checksums &&
        Object?.keys(record?.checksums)?.forEach((item, index) => {
          checkSums.push({
            version: item,
            checksum: Object?.values(record?.checksums)[index],
          });
        });
    }
    record?.download_links &&
      Object.keys(record?.download_links).forEach((item, index) => {
        apps.push({
          app: item,
          link: Object?.values(record.download_links)[index],
        });
      });
    dispatch(
      versionHistory({
        record: record,
        eyeModal: true,
        links: apps,
        checkSums: checkSums,
        description: record.description,
      })
    );
  };

  const resetSearch = () => {
    const newQueryParam = {
      pageNumber: 1,
      recordsPerPage: pagination.recordsPerPage,
    };
    setSearchParams(newQueryParam);
    setPagination(newQueryParam);
    dispatch(
      versionHistory({ showDeleteBtn: false, reload: !historiesData.reload })
    );
    form.resetFields();
  };

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

  const handleResetSearch = () => {
    if (
      searchParams.get("operatingSystem") ||
      searchParams.get("description") ||
      searchParams.get("currentVersion")
    ) {
      dispatch(versionHistory({ showDeleteBtn: true }));
    } else {
      dispatch(versionHistory({ showDeleteBtn: false }));
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      operatingSystem: searchParams.get("operatingSystem"),
      description: searchParams.get("description"),
      currentVersion: searchParams.get("currentVersion"),
    });
    handleResetSearch();
  }, []);

  const createTable = (sortItem) => {
    searchVersionsHistory(
      createSearchObject(searchParams, {
        operation: "equals",
        sortBy: sortItem,
      })
    )
      .then((res) => {
        dispatch(
          versionHistory({
            list: res?.data?.data,
            endRow: res?.data.end_row,
            startRow: res?.data.start_row,
            totalRows: res?.data.total_rows,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      createTable(sortBy);
      handleResetSearch();
    }
  }, [searchParams]);

  const columns = [
    {
      title: Dictionary.systemType,
      key: "operating_system",
      dataIndex: "operating_system",
      width: "15%",
      render: (record) => (
        <span className={Classes["td-margin"]}> {record}</span>
      ),
    },
    {
      title: Dictionary.minVersion,
      key: "min_version",
      dataIndex: "min_version",
      width: "10%",
      render: (record) => (
        <span className={Classes["td-margin"]}> {record}</span>
      ),
    },
    {
      title: Dictionary.versionNumber,
      key: "current_version",
      dataIndex: "current_version",
      width: "10%",
      render: (record) => (
        <span className={Classes["td-margin"]}> {record}</span>
      ),
    },
    {
      title: Dictionary.date,
      key: "date",
      dataIndex: "date",
      width: "12%",
      render: (record) => (
        <span className={Classes["td-margin"]}>
          {" "}
          {record ? record?.split(" ")[0] : "--"}{" "}
        </span>
      ),
    },
    {
      title: Dictionary.hour,
      key: "date",
      dataIndex: "date",
      width: "12%",
      render: (record) => (
        <span className={Classes["td-margin"]}>
          {" "}
          {record ? record?.split(" ")[1] : "--"}{" "}
        </span>
      ),
    },
    {
      title: Dictionary.downloadLinks,
      key: "download_links",
      dataIndex: "download_links",
      width: "10%",
      render: (record) => (
        <span className={Classes["td-margin"]}>
          {" "}
          {record
            ? `${Object.keys(record).length} ${Dictionary.link}`
            : "--"}{" "}
        </span>
      ),
    },
    {
      title: Dictionary.modifiedfeatures,
      key: "description",
      dataIndex: "description",
      width: "25%",
      render: (record) => (
        <span className={Classes["td-margin"]}>
          {" "}
          {`${record?.length} ${Dictionary.item}`}
        </span>
      ),
    },
    {
      key: "description",
      dataIndex: "description",
      width: "10%",
      render: (_field, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginLeft: "8px",
          }}
        >
          <TooltipComponent title={Dictionary.details}>
            <CustomIcon
              src={Eye}
              size={24}
              name={`list-users-${record?.id}-recovery`}
              color={Variables.LogoGreenDark}
              onClick={() => {
                handleDetails(record);
              }}
            />
          </TooltipComponent>
        </div>
      ),
    },
  ];

  return (
    <div>
      <ModalComponent
        width={918}
        title={`${Dictionary.version} ${Dictionary.details}`}
        open={historiesData.eyeModal}
        maskClosable={false}
        onCancel={() => dispatch(versionHistory({ eyeModal: false }))}
      >
        <VersionDetails
          onCancel={() => dispatch(versionHistory({ eyeModal: false }))}
          list={historiesData}
          type={"history"}
        />
      </ModalComponent>
      <HeaderPage
        title={Dictionary.versionsArchive}
        back={"/basic-data/versions"}
      />
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent name="operatingSystem">
          <SelectComponent
            name="operatingSystem"
            width={176}
            placeholder="درگاه"
            items={items}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent name="currentVersion">
          <InputSearchComponent
            width={176}
            placeholder={Dictionary.versionNumber}
          />
        </FormItemComponent>
        <FormItemComponent name="description">
          <InputSearchComponent
            width={500}
            placeholder={Dictionary.modifiedfeatures}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["search-history-btn"]}>
          {historiesData.showDeleteBtn && (
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
            loading={isLoading}
            classNameBtn={""}
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
      <TableComponent
        columns={columns}
        dataSource={historiesData.list}
        count={historiesData.totalRows}
        loading={isLoading}
      />
      {historiesData.totalRows >= 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={historiesData.totalRows}
        />
      )}
    </div>
  );
};

export default VersionHistory;
