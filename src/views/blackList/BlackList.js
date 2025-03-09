import { Form } from "antd";
import CustomIcon from "components/customIcon/CustomIcon";
import TableComponent from "components/table/TableComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import { addToBlackList, searchBlackList } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import { createSearchObject } from "helpers/CreateSearchObject";
import useErrorHandler from "helpers/useErrorHandler";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import SortableTitle from "components/sortableTitle/SortableTitle";
import Dictionary from "helpers/Dictionary";
import Classes from "./styles/blacklist.module.scss";
import {
  blacklist,
  resetBlacklist,
} from "store/reducers/blacklist/blacklistReducer";
import ChipComponent from "components/chipComponent/ChipComponent";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import ButtonComponent from "components/button/ButtonComponent";
import HeaderPage from "components/headerPage/HeaderPage";
import VisibleGrey from "assets/images/icon/VisibleGrey.svg";
import { nationalCodeValidation } from "helpers/nationalIdValidation";
import PaginationComponent from "components/pagination/PaginationComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import { MatchAuthority } from "helpers/MatchAuthority";
import BlackListDetails from "./pageComponent/BlackListDetails";
import AddBlackList from "./pageComponent/AddBlackList";
import EmptyTablePlaceHolder from "assets/images/placeholder/EmptyTablePlaceHolder.svg";

const BlackList = () => {
  const errorHandler = useErrorHandler();
  const [sortBy, setSortBy] = useState("-createdDate");
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const blacklistData = useSelector((state) => state.blacklist.value);
  const userInfoData = useSelector((state) => state.userInfo.value);
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
    dispatch(resetBlacklist());
  }, []);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        blacklist({
          permissions: {
            view: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/black-list/search/v1"
            ),
            create: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/black-list/add/v1"
            ),
            delete: MatchAuthority(
              userInfoData.authorities,
              "Put:/api/bo/black-list/delete/v1"
            ),
          },
        })
      );
    } else {
      dispatch(
        blacklist({ permissions: { view: true, create: true, delete: true } })
      );
    }
  }, [userInfoData.authorities]);

  const createTable = (sortItem) => {
    searchBlackList(
      createSearchObject(searchParams, {
        operation: "equals",
        sortBy: sortItem,
      })
    )
      .then((res) => {
        dispatch(
          blacklist({
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

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination({ pageNumber, recordsPerPage });
  };

  const handleResetSearch = () => {
    if (
      searchParams.get("identificationCode") ||
      searchParams.get("fullname") ||
      searchParams.get("event")
    ) {
      dispatch(blacklist({ showDeleteBtn: true }));
    } else {
      dispatch(blacklist({ showDeleteBtn: false }));
    }
  };

  const resetSearch = () => {
    const newQueryParam = {
      pageNumber: 1,
      recordsPerPage: pagination.recordsPerPage,
    };
    setSearchParams(newQueryParam);
    dispatch(resetBlacklist({ permissions: blacklistData.permissions }));
    form.resetFields();
  };
  const handleSort = () => {};

  const onFinish = (values) => {
    Object.keys(values).forEach(
      (key) =>
        (values[key] === undefined ||
          values[key] === null ||
          values[key] === "") &&
        delete values[key]
    );
    if (Object.keys(values).length > 0) {
      const newQueryParam = {
        pageNumber: 1,
        recordsPerPage: pagination.recordsPerPage,
        ...values,
      };
      setSearchParams(newQueryParam);
      if (
        searchParams.get("identificationCode") ||
        searchParams.get("fullname") ||
        searchParams.get("event")
      ) {
        dispatch(blacklist({ showDeleteBtn: true }));
      }
      setPagination({ ...pagination, pageNumber: 1 });
      dispatch(blacklist({ CTA: true }));
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
      identificationCode: searchParams.get("identificationCode"),
      event: searchParams.get("event"),
      pageNumber: searchParams.get("pageNumber") || 1,
      recordsPerPage: searchParams.get("recordsPerPage") || 10,
    });
    handleResetSearch();
    dispatch(blacklist({ modal: false }));
  }, []);

  useEffect(() => {
    if (blacklistData.CTA) {
      if (searchParams.get("pageNumber")) {
        createTable(sortBy);
        handleResetSearch();
      }
    }
  }, [searchParams, blacklistData.reload, sortBy, blacklistData.CTA]);

  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: "5%",
      render: (_text, _record, index) => {
        if (pagination.pageNumber === 1) {
          return (
            <span style={{ marginRight: "12px" }} className="pagination-column">
              {index + 1}
            </span>
          );
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
      title: () => {
        return (
          <SortableTitle
            onClick={() => handleSort("mobileNumber")}
            text={Dictionary.service}
          />
        );
      },
      key: "block_events",
      dataIndex: "block_events",
      width: "20%",
      render: (_field, record) => (
        <div style={{ display: "flex" }}>
          <ChipComponent red={true}>{record.event_description}</ChipComponent>
        </div>
      ),
    },
    {
      title: () => {
        return (
          <SortableTitle
            onClick={() => handleSort("identificationCode")}
            text={Dictionary.nationalId}
          />
        );
      },
      key: "identification_code",
      dataIndex: "identification_code",
      width: "10%",
      render: (record) => record,
    },
    {
      title: () => {
        return (
          <SortableTitle
            onClick={() => handleSort("fullname")}
            text={`${Dictionary.name} ${Dictionary.and} ${Dictionary.lastName}`}
          />
        );
      },
      key: "fullname",
      dataIndex: "fullname",
      width: "20%",
      render: (record) => (record ? record : "--"),
    },
    {
      title: () => {
        return (
          <SortableTitle
            onClick={() => handleSort("mobileNumber")}
            text={Dictionary.reason}
          />
        );
      },
      key: "block_description",
      dataIndex: "block_description",
      width: "40%",
      render: (record) => record,
    },
    {
      key: "edit",
      dataIndex: "edit",
      width: "5%",
      render: (_field, record) => (
        <div className={Classes["edit-icon"]}>
          <TooltipComponent title={Dictionary.details}>
            <CustomIcon
              src={VisibleGrey}
              size={24}
              color="#2b9570"
              onClick={() => {
                dispatch(blacklist({ detailsModal: true, record: record }));
              }}
            />
          </TooltipComponent>
        </div>
      ),
    },
  ];

  return (
    <div>
      {blacklistData.permissions.create && blacklistData.permissions.delete ? (
        <HeaderPage
          title={Dictionary.blackList}
          onClick={() => {
            dispatch(blacklist({ addModal: true }));
          }}
          buttonText={`${Dictionary.customer} ${Dictionary.new}`}
        />
      ) : (
        <HeaderPage title={Dictionary.blackListOfCustomer} />
      )}
      <ModalComponent
        title={`${Dictionary.status} ${Dictionary.lock} ${Dictionary.customer}`}
        width={918}
        open={blacklistData.detailsModal}
        onCancel={() => dispatch(blacklist({ detailsModal: false }))}
      >
        <BlackListDetails />
      </ModalComponent>
      <ModalComponent
        title={Dictionary.addToBlackList}
        width={918}
        open={blacklistData.addModal}
        onCancel={() => dispatch(blacklist({ addModal: false }))}
      >
        <AddBlackList />
      </ModalComponent>
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent
          name="identificationCode"
          rules={[
            {
              required: false,
            },
            () => ({
              validator(_, value) {
                if (value && !nationalCodeValidation(value)) {
                  return Promise.reject(new Error(Dictionary.idNotValid));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputSearchComponent
            width={176}
            placeholder={`${Dictionary.nationalId}`}
          />
        </FormItemComponent>
        <FormItemComponent name="fullname">
          <InputSearchComponent
            width={176}
            placeholder={`${Dictionary.name} ${Dictionary.and} ${Dictionary.lastName}`}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent name="event">
          <SelectComponent
            name="event"
            width={240}
            placeholder={Dictionary.service}
            items={blacklistData.items}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["blacklist-search-bar-btn"]}>
          {blacklistData.showDeleteBtn && (
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
            classNameBtn={Classes["users-btn"]}
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
      {blacklistData.list?.length > 0 ? (
        <TableComponent
          columns={columns}
          dataSource={blacklistData.list}
          count={blacklistData.totalRows}
          loading={isLoading}
        />
      ) : (
        <div className={Classes["table-placeholder"]}>
          <CustomIcon src={EmptyTablePlaceHolder} size={100} />
          <p>{Dictionary.searchIdentificationCode}</p>
        </div>
      )}
      {blacklistData.totalRows >= 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={blacklistData.totalRows}
        />
      )}
    </div>
  );
};

export default BlackList;
