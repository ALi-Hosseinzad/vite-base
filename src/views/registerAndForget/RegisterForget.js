import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import HeaderPage from "components/headerPage/HeaderPage";
import ButtonComponent from "components/button/ButtonComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import { Form } from "antd";
import Classes from "views/listCards/styles/ListCards.module.scss";
import FormItemComponent from "components/formItem/FormItemComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import TableComponent from "components/table/TableComponent";
import PaginationComponent from "components/pagination/PaginationComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import Visible from "assets/images/icon/VisibleGrey.svg";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import StatusComponent from "components/status/StatusComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import RegisterForgetCustomer from "./pageComponent/RegisterForgetCustomer";
import {
  registerForget,
  resetRegisterForget,
} from "store/reducers/registerForget/registerForgetReducer";
import {
  getRegisterAndForget,
  getUploadedFilesRegisterForget,
} from "helpers/APIFunction";
import DateFormat from "components/dateFormat/DateFormat";
import { findStatus } from "helpers/FindStatus";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { createSearchObject } from "helpers/CreateSearchObject";
import { MatchAuthority } from "helpers/MatchAuthority";
import Variables from "assets/styles/_Variables.scss";
import SortableTitle from "components/sortableTitle/SortableTitle";
import { b64toBlob } from "helpers/convertBase64ToBlob";
import { blacklist } from "store/reducers/blacklist/blacklistReducer";
import Styles from "views/blackList/styles/addDescriptionForBlacklist.module.scss";
import AddDescriptionForBlacklist from "views/blackList/pageComponent/AddDescriptionForBlacklist";
import { openAccount } from "store/reducers/openAccount/openAccountReducer";

const items = [
  { id: 1, value: "true", text: "تایید شده" },
  { id: 2, value: "null", text: "در انتظار تایید" },
  { id: 3, value: "false", text: "رد شده" },
];
const RegisterForget = () => {
  const errorHandler = useErrorHandler();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const registerForgetData = useSelector((state) => state.registerForget.value);
  const blacklistData = useSelector((state) => state.blacklist.value);
  const openAccountData = useSelector((state) => state.openAccount.value);
  const userInfoData = useSelector((state) => state.userInfo.value);
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });

  const [permissions, setPermissions] = useState({
    view: true,
  });
  useEffect(() => {
    dispatch(resetRegisterForget());
  }, []);
  useEffect(() => {
    if (userInfoData.username === "admin") {
      setPermissions({
        view: true,
        showHistoryBtn: true,
      });
    } else {
      setPermissions({
        view: MatchAuthority(
          userInfoData.authorities,
          "Get:/api/bo/registration/offline-authentication/download/v1"
        ),
        showHistoryBtn: MatchAuthority(
          userInfoData.authorities,
          "Post:/api/bo/registration/offline-authentication/search/v1"
        ),
      });
    }
  }, [userInfoData.authorities]);

  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      crateTable(registerForgetData.sortBy);
      handleResatSearch();
    }
  }, [searchParams, registerForgetData.update, registerForgetData.sortBy]);

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
      identificationCode: searchParams.get("identificationCode"),
      fullname: searchParams.get("fullname"),
      mobileNumber: searchParams.get("mobileNumber"),
      referenceNumber: searchParams.get("referenceNumber"),
      verifyOfflineAuth: searchParams.get("verifyOfflineAuth"),
      pageNumber: searchParams.get("pageNumber") || 1,
      recordsPerPage: searchParams.get("recordsPerPage") || 10,
    });
    handleResatSearch();
  }, []);
  const crateTable = (sortItem) => {
    getRegisterAndForget(createSearchObject(searchParams, { sortBy: sortItem }))
      .then((res) => {
        const convertList = [];
        res.data.data?.map((node) => {
          convertList.push({
            id: node.id,
            fullName: node.fullname,
            firstName: node.firstname,
            lastName: node.lastname,
            nationalId: node.identification_code,
            mobile: node.mobile_number,
            status: node.offline_authentication,
            referenceNumber: node.reference_number,
            registerDate: node.created_date,
            actionType: node.event_desc,
            action:
              node.event === "INSTALL"
                ? "REGISTRATION"
                : node.event === "FORGET_PASSWORD"
                ? "FORGET_PASSWORD"
                : "",
            errorDesc: node.error_desc,
            statusDescription: node.offline_auth_status,
          });
        });
        dispatch(
          registerForget({
            list: convertList,
            endRow: res.data.end_row,
            startRow: res.data.start_row,
            totalRows: res.data.total_rows,
          })
        );
      })
      .then(() => {
        if (registerForgetData.sortColumn) {
          const keys = Object.keys(registerForgetData.sortType).filter(
            (p) => p !== registerForgetData.sortColumn
          );
          const newSort = {};
          keys.forEach((p) => (newSort[p] = ""));
          if (
            registerForgetData.sortType[registerForgetData.sortColumn] === ""
          ) {
            dispatch(
              registerForget({
                sortType: {
                  [registerForgetData.sortColumn]: "inc",
                  ...newSort,
                },
              })
            );
          } else if (
            registerForgetData.sortType[registerForgetData.sortColumn] === "inc"
          ) {
            dispatch(
              registerForget({
                sortType: {
                  [registerForgetData.sortColumn]: "desc",
                  ...newSort,
                },
              })
            );
          } else if (
            registerForgetData.sortType[registerForgetData.sortColumn] ===
            "desc"
          ) {
            dispatch(
              registerForget({
                sortType: { [registerForgetData.sortColumn]: "", ...newSort },
              })
            );
          }
        }
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const handleSort = (column) => {
    dispatch(registerForget({ sortColumn: column }));
    if (registerForgetData.sortType[column] === "") {
      dispatch(registerForget({ sortBy: column }));
    } else if (registerForgetData.sortType[column] === "inc") {
      dispatch(registerForget({ sortBy: `-${column}` }));
    } else if (registerForgetData.sortType[column] === "desc") {
      dispatch(registerForget({ sortBy: "-createdDate" }));
    }
  };
  const handleResatSearch = () => {
    if (
      searchParams.get("referenceNumber") ||
      searchParams.get("identificationCode") ||
      searchParams.get("verifyOfflineAuth") ||
      searchParams.get("mobileNumber") ||
      searchParams.get("fullname")
    ) {
      dispatch(registerForget({ showDeleteBtn: true }));
    } else {
      dispatch(registerForget({ showDeleteBtn: false }));
    }
  };
  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination(newQueryParam);
  };

  const getFile = (record, name) => {
    getUploadedFilesRegisterForget({
      type: name,
      referenceNumber: record.referenceNumber,
      identificationCode: record.nationalId,
    })
      .then((res) => {
        const type = res.headers["content-disposition"].substring(
          res.headers["content-disposition"].lastIndexOf(".") + 1
        );
        if (name === "VIDEO") {
          const blob = b64toBlob(res.data.file, `video/${type}`);
          const urlObject = window.URL.createObjectURL(new Blob([blob]));
          dispatch(
            registerForget({
              video: res.data.file,
              videoURL: urlObject,
              type: type,
              text: res.data.video_expression,
            })
          );
        }
        name === "ID_CARD_PHOTO" &&
          dispatch(
            registerForget({ avatar: { file: res.data.file, type: type } })
          );
        name === "ID_CARD" &&
          dispatch(
            registerForget({ idCard: { file: res.data.file, type: type } })
          );
      })
      .catch(() => {
        name === "ID_CARD_PHOTO" &&
          dispatch(registerForget({ avatarError: true }));
        name === "ID_CARD" && dispatch(registerForget({ idCardError: true }));
        name === "VIDEO" && dispatch(registerForget({ videoError: true }));
      });
  };

  const openOneRecord = (record) => {
    dispatch(
      registerForget({
        modal: true,
        record: record,
        videoError: false,
        avatarError: false,
        idCardError: false,
      })
    );
    getFile(record, "ID_CARD_PHOTO");
    getFile(record, "ID_CARD");
    getFile(record, "VIDEO");
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
      dispatch(registerForget({ showDeleteBtn: true, sortColumn: "" }));
      setSearchParams(newQueryParam);
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
    dispatch(registerForget({ showDeleteBtn: false, sortColumn: "" }));
    form.resetFields();
  };
  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: 70,
      render: (_text, _record, index) => {
        if (pagination.pageNumber === 1) {
          return (
            <span className={Classes["list-card-pagination"]}>{index + 1}</span>
          );
        } else {
          return (
            <span className={Classes["list-card-pagination"]}>
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
            sort={registerForgetData.sortType.referenceNumber}
            onClick={() => handleSort("referenceNumber")}
            text={Dictionary.traceNumber}
          />
        );
      },
      key: "referenceNumber",
      dataIndex: "referenceNumber",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={registerForgetData.sortType.fullname}
            onClick={() => handleSort("fullname")}
            text={Dictionary.fullName}
          />
        );
      },
      key: "fullName",
      dataIndex: "fullName",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={registerForgetData.sortType.identificationCode}
            onClick={() => handleSort("identificationCode")}
            text={Dictionary.nationalId}
          />
        );
      },
      key: "nationalId",
      dataIndex: "nationalId",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={registerForgetData.sortType.event}
            onClick={() => handleSort("event")}
            text={Dictionary.actionType}
          />
        );
      },
      key: "actionType",
      dataIndex: "actionType",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={registerForgetData.sortType.createdDate}
            onClick={() => handleSort("createdDate")}
            text={Dictionary.registerDate}
            className={Classes["rotate-vertically"]}
          />
        );
      },
      key: "registerDate",
      dataIndex: "registerDate",
      className: "table-th-date",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return <DateFormat value={text} />;
      },
    },
    {
      title: Dictionary.status,
      key: "status",
      dataIndex: "status",
      width: "12%",
      className: "table-th-status",
      render: (_field, record) => (
        <div className={Classes["list-cards-status"]}>
          <TooltipComponent title={Dictionary.show}>
            <span
              className={Classes["list-cards-status-btn-last"]}
              style={{ marginLeft: "16px" }}
              onClick={() => permissions.view && openOneRecord(record)}
            >
              <CustomIcon
                src={Visible}
                size={20}
                name={`list-customers-${record.id}-edit`}
                color={
                  permissions.view
                    ? Variables.LogoGreenDark
                    : Variables.GreenLight7
                }
              />
            </span>
          </TooltipComponent>
          <div className={Classes["list-cards-status-part"]}>
            <StatusComponent
              type={findStatus(record.status)}
              title={record.statusDescription}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <HeaderPage
        title={Dictionary.authenticatedRegister}
        addIcon={false}
        onClick={
          permissions.showHistoryBtn
            ? () =>
                navigate(
                  "/authentication/register-forget/archive-registration-authentications"
                )
            : ""
        }
        buttonText={Dictionary.failedAuthentications}
      />
      <ModalComponent
        title={`${Dictionary.authentication} ${Dictionary.customer} (${registerForgetData.record.actionType})`}
        open={registerForgetData.modal}
        width={918}
        className={Classes["open-account-modal"]}
        onCancel={() =>
          dispatch(
            registerForget({
              modal: false,
              video: "",
              videoURL: "",
              text: "",
              avatar: {},
              idCard: {},
              record: "",
            })
          )
        }
      >
        <RegisterForgetCustomer getFile={getFile} />
      </ModalComponent>
      <ModalComponent
        title={Dictionary.addToBlackList}
        open={blacklistData.blacklistModal}
        width={918}
        className={Styles["black-list-modal"]}
        onCancel={() => {
          dispatch(blacklist({ blacklistModal: false }));
          dispatch(
            registerForget({
              update: !registerForgetData.update,
              record: "",
              video: "",
            })
          );
          dispatch(
            openAccount({
              update: !openAccountData.update,
              record: "",
              video: "",
            })
          );
        }}
      >
        <AddDescriptionForBlacklist />
      </ModalComponent>
      <Form
        className={Classes["list-cards-form"]}
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent
          name="referenceNumber"
          className={Classes["list-cards-form-item"]}
        >
          <InputSearchComponent
            name="referenceNumber"
            width={176}
            placeholder={Dictionary.traceNumber}
          />
        </FormItemComponent>
        <FormItemComponent
          name="fullname"
          className={Classes["list-cards-form-item"]}
        >
          <InputSearchComponent
            name="fullname"
            width={176}
            placeholder={Dictionary.fullName}
            maxLength={32}
          />
        </FormItemComponent>
        <FormItemComponent
          name="identificationCode"
          className={Classes["list-cards-form-item"]}
        >
          <InputSearchComponent
            width={176}
            name="identificationCode"
            placeholder={Dictionary.nationalId}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent
          name="mobileNumber"
          className={Classes["list-cards-form-item"]}
        >
          <InputSearchComponent
            width={176}
            name="mobileNumber"
            placeholder={Dictionary.mobile}
            maxLength={11}
          />
        </FormItemComponent>
        <FormItemComponent name="verifyOfflineAuth">
          <SelectComponent
            name="verifyOfflineAuth"
            width={176}
            placeholder={Dictionary.status}
            items={items}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["list-card-btn"]}>
          {registerForgetData.showDeleteBtn && (
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
            classNameBtn={Classes["list-card-btn-button"]}
            loading={isLoading}
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </Form>
      {/* {registerForgetData.total > 0 && ( */}
      <TableComponent
        columns={columns}
        dataSource={registerForgetData.list}
        loading={isLoading}
        count={registerForgetData.totalRows}
      />
      {/* )} */}
      {registerForgetData.totalRows >= 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={registerForgetData.totalRows}
        />
      )}
    </div>
  );
};
export default RegisterForget;
