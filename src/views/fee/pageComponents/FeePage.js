import { Form, Table } from "antd";
import Dictionary from "helpers/Dictionary";
import Edit from "assets/images/icon/Edit.svg";
import { errorResponse } from "helpers/APIService";
import { useSearchParams } from "react-router-dom";
import useErrorHandler from "helpers/useErrorHandler";
import Variables from "assets/styles/_Variables.scss";
import { useDispatch, useSelector } from "react-redux";
import Classes from "views/fee/styles/Fee.Module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
import FormComponent from "components/form/FormComponent";
import React, { useEffect, useRef, useState } from "react";
import { fee, feeState } from "store/reducers/fee/FeeReducer";
import { createSearchObject } from "helpers/CreateSearchObject";
import ButtonComponent from "components/button/ButtonComponent";
import SwitchComponent from "components/switch/SwitchComponent";
import EditFeeModal from "views/fee/pageComponents/EditFeeModal";
import TooltipComponent from "components/tooltip/TooltipComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import SelectComponent from "components/SelectComponent/SelectComponent";
import { getAllServicesFee, updateServicesFee } from "helpers/APIFunction";
import PaginationComponent from "components/pagination/PaginationComponent";
import { CalculationItems, EventTimeItems, HolderItems } from "./SelectItems";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";

const FeePage = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const feeData = useSelector(feeState);
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    list,
    showDeleteBtn,
    reloadList,
    expandedRowKeys,
    totalRows,
    permissions,
    beneficiaryListAsRecord,
  } = feeData;
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });

  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      getAllFeeList();
    }
  }, [reloadList, searchParams]);

  useEffect(() => {
    if (searchParams.get("event")) {
      form.setFieldsValue({ event: searchParams.get("event") });
      dispatch(fee({ showDeleteBtn: true }));
    }
    if (searchParams.get("holderType")) {
      form.setFieldsValue({
        holderType: HolderItems.find(
          (item) => item.value === searchParams.get("holderType")
        ),
      });
      dispatch(fee({ showDeleteBtn: true }));
    }
    if (searchParams.get("calculationType")) {
      form.setFieldsValue({
        calculationType: CalculationItems?.find(
          (item) => item.value === searchParams.get("calculationType")
        ),
      });
      dispatch(fee({ showDeleteBtn: true }));
    }
    if (searchParams.get("eventTime")) {
      form.setFieldsValue({
        eventTime: EventTimeItems?.find(
          (item) => item.value === searchParams.get("eventTime")
        ),
      });
      dispatch(fee({ showDeleteBtn: true }));
    }
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

  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: "5%",
      hidden: totalRows >= 10 ? false : true,
      render: (_text, _record, index) => {
        if (pagination.pageNumber === 1) {
          return index + 1;
        } else {
          return (
            ((pagination.pageNumber === 0
              ? pagination.pageNumber + 1
              : pagination.pageNumber) -
              1) *
              pagination.recordsPerPage +
            (index + 1)
          );
        }
      },
    },
    {
      key: "enable",
      dataIndex: "enable",
      title: Dictionary.status,
      width: "8%",
      render: (_field, record) => (
        <TooltipComponent
          title={
            !record.status_boolean ? Dictionary.enable : Dictionary.disable
          }
        >
          <SwitchComponent
            disabled={!permissions.edit}
            checked={record.status_boolean}
            onChange={(e) => handleChangeStatus(record, e)}
          />
        </TooltipComponent>
      ),
    },
    {
      title: Dictionary.code + " " + Dictionary.happen,
      key: "event_code",
      dataIndex: "event_code",
      width: "8%",
      render: (text) => text || "--",
    },
    {
      title: `${Dictionary.name} ${Dictionary.happen}`,
      key: "event",
      dataIndex: "event",
      width: "15%",
      render: (text) => text || "--",
    },
    {
      title: Dictionary.time + " " + Dictionary.happen,
      key: "event_time_desc",
      dataIndex: "event_time_desc",
      width: "8%",
      render: (text) => text || "--",
    },
    {
      title: Dictionary.calculationType,
      key: "calculation_type_decs",
      dataIndex: "calculation_type_desc",
      width: "10%",
      render: (text) => text || "--",
    },
    {
      title: Dictionary.value + " " + Dictionary.fee,
      key: "calculation_var",
      dataIndex: "calculation_var",
      width: "12%",
      render: (text, record) => (
        <>
          {record.calculation_type === "FIX" && (
            <span>
              {text
                ? Number(record.calculation_var)?.toLocaleString("en") +
                  " " +
                  Dictionary.rial
                : "--"}
            </span>
          )}
          {record.calculation_type === "PERCENT" && (
            <span>{text ? record.calculation_var + " %" : "--"}</span>
          )}
        </>
      ),
    },
    {
      title: Dictionary.type + " " + Dictionary.destination,
      key: "holder_type_desc",
      dataIndex: "holder_type_desc",
      width: "12%",
      render: (text) => text || "--",
    },
    {
      title: Dictionary.number + " " + Dictionary.destination,
      key: "holder_description",
      dataIndex: "holder_description",
      width: "12%",
      render: (text) => text || "--",
    },
    {
      key: "status",
      dataIndex: "status",
      className: "table-th-status",
      width: "10%",
      render: (_field, record) => (
        <div className={Classes["list-charity-action"]}>
          <TooltipComponent title={permissions.edit && Dictionary.edit}>
            <span
              onClick={() =>
                permissions.edit &&
                dispatch(
                  fee({
                    record: { ...record, status: record.status_boolean },
                    editFeeModal: true,
                  })
                )
              }
            >
              <CustomIcon
                color={
                  permissions.edit
                    ? Variables.LogoGreenDark
                    : Variables.GreenLight7
                }
                cursor={permissions.edit ? "pointer" : "default"}
                src={Edit}
                size={24}
                name={`fee-${record.event_code}-edit-icon`}
              />
            </span>
          </TooltipComponent>
        </div>
      ),
    },
  ].filter((item) => !item.hidden);

  const getAllFeeList = () => {
    let convertList = [];

    getAllServicesFee(
      createSearchObject(searchParams, { sortBy: "-createdDate" })
    )
      .then((res) => {
        res?.data?.data?.forEach((node, index) => {
          const convertObj = {
            key: index.toString(),
            ...node,
          };
          convertList.push(convertObj);
        });
        dispatch(fee({ list: convertList, totalRows: res.data.total_rows }));
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const onFinish = (values) => {
    let newObject = {};
    for (const key in values) {
      if (
        values[key] === undefined ||
        values[key] === null ||
        values[key] === "" ||
        key === undefined ||
        key === null ||
        key === ""
      ) {
        delete values[key];
      }
      if (typeof values[key] === "object") {
        Object.assign(newObject, { [key]: values[key]?.value });
      }
      if (typeof values[key] !== "object" && values[key]?.length > 0) {
        Object.assign(newObject, { [key]: values[key] });
      }
    }
    if (Object.keys(newObject).length === 0) {
      newObject = values;
    }
    if (Object.keys(newObject).length > 0) {
      const newQueryParam = {
        pageNumber: 1,
        recordsPerPage: pagination.recordsPerPage,
        ...newObject,
      };
      setSearchParams(newQueryParam);
      dispatch(fee({ showDeleteBtn: true }));
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

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination(newQueryParam);
  };

  const resetSearch = () => {
    const newQueryParam = {
      pageNumber: 1,
      recordsPerPage: pagination.recordsPerPage,
    };
    setSearchParams(newQueryParam);
    dispatch(
      fee({
        account: "",
        agentsListAsRecord: [],
        agentsList: [],
        signersList: [],
        showDeleteBtn: false,
      })
    );
    form.resetFields();
  };

  const expandedRowRender = () => {
    const columns = [
      { width: "44%" },
      {
        title: `${Dictionary.name} ${Dictionary.beneficiary}`,
        key: "title",
        dataIndex: "title",
        width: "12%",
        render: (text) => text || "--",
      },
      {
        title: Dictionary.calculationType,
        key: "calculation_type_decs",
        dataIndex: "calculation_type_desc",
        width: "10%",
        render: (text) => text || "--",
      },
      {
        title: Dictionary.value + " " + Dictionary.fee,
        key: "calculation_var",
        dataIndex: "calculation_var",
        width: "10%",
        render: (text, record) => (
          <>
            {record.calculation_type === "FIX" && (
              <span>
                {text
                  ? Number(record.calculation_var)?.toLocaleString("en") +
                    " " +
                    Dictionary.rial
                  : "--"}
              </span>
            )}
            {record.calculation_type === "PERCENT" && (
              <span>{text ? record.calculation_var + " %" : "--"}</span>
            )}
          </>
        ),
      },
      {
        title: Dictionary.type + " " + Dictionary.destination,
        key: "holder_type_desc",
        dataIndex: "holder_type_desc",
        width: "12%",
        render: (text) => text || "--",
      },
      {
        title: Dictionary.number + " " + Dictionary.destination,
        key: "holder_description",
        dataIndex: "holder_description",
        width: "12%",
        render: (text) => text || "--",
      },
    ];

    return (
      <Table
        rowKey={(record) => record.key}
        columns={columns}
        dataSource={beneficiaryListAsRecord}
        pagination={false}
        className={Classes["expanded-table"]}
      />
    );
  };

  const updateExpandedRowKeys = (e, r) => {
    if (e) {
      dispatch(
        fee({
          beneficiaryListAsRecord: r.fee_sharing_response_dtos,
          expandedRowKeys: r.key.toString(),
        })
      );
    } else {
      dispatch(fee({ expandedRowKeys: null, beneficiaryListAsRecord: [] }));
    }
  };

  const handleChangeStatus = (e, status) => {
    if (e.fee_sharing_response_dtos.length > 0) {
      updateServicesFee({
        calculation_type: e.calculation_type,
        calculation_var: e.calculation_var,
        event: e.event,
        event_code: e.event_code,
        event_time: e.event_time,
        fee_sharing_request_dtos: e.fee_sharing_response_dtos,
        holder_description: e.holder_description,
        holder_type: e.holder_type,
        status: status,
      })
        .then(() => {
          dispatch(fee({ reloadList: !reloadList }));
        })
        .catch(() => {
          errorHandler(errorResponse);
        });
    } else {
      dispatch(
        setNotificationData({
          message: " تغییر وضعیت کارمزد، بدون انتخاب ذینفع امکان پذیر نیست!",
          type: "error",
          time: 5000,
        })
      );
    }
  };
  return (
    <div>
      <EditFeeModal />
      <FormComponent
        layout="inline"
        onFinish={onFinish}
        form={form}
        ref={formRef}
        className={Classes["search-bar"]}
      >
        <div>
          <FormItemComponent name="event">
            <InputSearchComponent
              name="event"
              placeholder={Dictionary.name + " " + Dictionary.happen}
              maxLength={30}
              className={Classes["search-bar-input"]}
            />
          </FormItemComponent>
          <FormItemComponent name="holderType">
            <SelectComponent
              name="holderType"
              showSearch
              width={230}
              className={Classes["search-authority-group"]}
              placeholder={Dictionary.type + " " + Dictionary.destination}
              items={HolderItems}
              prefix
            />
          </FormItemComponent>
          <FormItemComponent name="calculationType">
            <SelectComponent
              name="calculationType"
              showSearch
              width={230}
              className={Classes["search-authority-group"]}
              placeholder={Dictionary.calculationType}
              items={CalculationItems}
              prefix
            />
          </FormItemComponent>
          <FormItemComponent name="eventTime">
            <SelectComponent
              name="eventTime"
              showSearch
              width={230}
              className={Classes["search-authority-group"]}
              placeholder={Dictionary.time + " " + Dictionary.happen}
              items={EventTimeItems}
              prefix
            />
          </FormItemComponent>
        </div>
        <FormItemComponent className={Classes["search-bar-btn"]}>
          {showDeleteBtn && (
            <ButtonComponent
              onClick={resetSearch}
              htmlType="button"
              type="text-danger"
            >
              {Dictionary.clean}
            </ButtonComponent>
          )}
          <ButtonComponent
            classNameBtn={Classes["search-btn"]}
            type="primary"
            htmlType="submit"
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>

      <Table
        rowClassName={(_record, index) =>
          index % 2 === 0
            ? "none-bordered-table t-TcTable-row-light"
            : "none-bordered-table t-TcTable-row-gray"
        }
        columns={columns}
        className={Classes["table-main"]}
        dataSource={list}
        pagination={false}
        scroll={{ y: 550 }}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) =>
            record?.fee_sharing_response_dtos?.length > 0,
          onExpand: (expanded, record) =>
            updateExpandedRowKeys(expanded, record),
          expandRowByClick: false,
          expandedRowKeys: [expandedRowKeys],
        }}
      />
      {totalRows >= 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={totalRows}
        />
      )}
    </div>
  );
};
export default FeePage;
