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
import {
  openAccount,
  resetOpenAccount,
} from "store/reducers/openAccount/openAccountReducer";
import StatusComponent from "components/status/StatusComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import AuthenticatedCustomer from "./pageComponent/AuthenticatedCustomer";
import { getAllOpenAccount, getUploadedFiles } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import Variables from "assets/styles/_Variables.scss";
import { findStatus } from "helpers/FindStatus";
import DateFormat from "components/dateFormat/DateFormat";
import { createSearchObject } from "helpers/CreateSearchObject";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { b64toBlob } from "helpers/convertBase64ToBlob";
import { MatchAuthority } from "helpers/MatchAuthority";
import SortableTitle from "components/sortableTitle/SortableTitle";
import AddDescriptionForBlacklist from "views/blackList/pageComponent/AddDescriptionForBlacklist";
import Styles from "views/blackList/styles/addDescriptionForBlacklist.module.scss";
import { blacklist } from "store/reducers/blacklist/blacklistReducer";
import { registerForget } from "store/reducers/registerForget/registerForgetReducer";

const items = [
  { id: 1, value: "تایید شد", text: "تایید شده" },
  { id: 2, value: "در انتظار تایید", text: "در انتظار تایید" },
  { id: 3, value: "رد شد", text: "رد شده" },
];

const OpenAccount = () => {
  const navigate = useNavigate();
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const openAccountData = useSelector((state) => state.openAccount.value);
  const registerForgetData = useSelector((state) => state.registerForget.value);
  const blacklistData = useSelector((state) => state.blacklist.value);
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
    showHistoryBtn: false,
  });
  useEffect(() => {
    dispatch(resetOpenAccount());
  }, []);
  useEffect(() => {
    if (userInfoData.username !== "admin") {
      setPermissions({
        view: MatchAuthority(
          userInfoData.authorities,
          "Get:/api/bo/account/open/authentication/download/v1"
        ),
        showHistoryBtn: MatchAuthority(
          userInfoData.authorities,
          "Post:/api/bo/account/open/authentication/history/search/v1"
        ),
      });
    } else {
      setPermissions({
        view: true,
        showHistoryBtn: true,
      });
    }
  }, [userInfoData.authorities]);

  const getFile = (record, name) => {
    getUploadedFiles({
      type: name,
      referenceNumber: record.referenceNumber,
      identificationCode: record.nationalId,
    })
      .then((res) => {
        const type = res.headers["content-disposition"].substring(
          res.headers["content-disposition"].lastIndexOf(".") + 1
        );
        const blob =
          name === "VIDEO"
            ? b64toBlob(res.data.file, `video/${type}`)
            : b64toBlob(res.data.file, `img/${type}`);
        const urlObject = window.URL.createObjectURL(new Blob([blob]));
        name === "ID_CARD_PHOTO" &&
          dispatch(openAccount({ avatar: { file: urlObject, type: type } }));
        name === "ID_CARD" &&
          dispatch(
            openAccount({
              idCard: {
                id: 0,
                label: Dictionary.nationalIdImg,
                file: urlObject,
                type: type,
              },
            })
          );
        name === "ID_CARD_BACK" &&
          dispatch(
            openAccount({
              backIdCard: {
                id: 1,
                label: Dictionary.nationalIdImg2,
                file: urlObject,
                type: type,
              },
            })
          );
        name === "SIGN" &&
          dispatch(
            openAccount({
              sign: {
                id: 4,
                label: Dictionary.signatureImg,
                file: urlObject,
                type: type,
              },
            })
          );
        name === "VIDEO" &&
          dispatch(openAccount({ video: { src: urlObject, type: type } }));
      })
      .catch(() => {
        name === "ID_CARD_PHOTO" &&
          dispatch(openAccount({ avatarError: true }));
        name === "ID_CARD" && dispatch(openAccount({ idCardError: true }));
        name === "ID_CARD_BACK" &&
          dispatch(openAccount({ backIdCardError: true }));
        name === "SIGN" && dispatch(openAccount({ signError: true }));
        name === "VIDEO" && dispatch(openAccount({ videoError: true }));
      });
  };
  const openOneRecord = (record) => {
    dispatch(
      openAccount({
        modal: true,
        record: record,
        videoError: false,
        avatarError: false,
        idCardError: false,
        backIdCardError: false,
        signError: false,
      })
    );
    getFile(record, "ID_CARD_PHOTO");
    getFile(record, "ID_CARD");
    getFile(record, "ID_CARD_BACK");
    getFile(record, "SIGN");
    getFile(record, "VIDEO");
  };
  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination({ pageNumber, recordsPerPage });
  };
  // sortBy: "createdDate",
  // ["status","-createdDate"]

  const handleSort = (column) => {
    dispatch(openAccount({ sortColumn: column }));
    if (openAccountData.sortType[column] === "") {
      dispatch(openAccount({ sortBy: column }));
    } else if (openAccountData.sortType[column] === "inc") {
      dispatch(openAccount({ sortBy: `-${column}` }));
    } else if (openAccountData.sortType[column] === "desc") {
      dispatch(openAccount({ sortBy: "-createdDate" }));
    }
  };

  const crateTable = (sortItem) => {
    const filtered = {
      ...createSearchObject(searchParams, { sortBy: sortItem }),
    };
    getAllOpenAccount({
      ...filtered,
      criteria: {
        operation: "and",
        criteria: filtered.criteria.criteria,
      },
    })
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
            status: node.account_creation_status,
            referenceNumber: node.reference_number,
            registerDate: node.created_date,
            actionType: node.event_description,
            errorExpression: node.error_desc,
            statusDescription: node.account_status,
            text: node.video_expression,
          });
        });
        dispatch(
          openAccount({ list: convertList, total: res.data.total_rows })
        );
      })
      .then(() => {
        if (openAccountData.sortColumn) {
          const keys = Object.keys(openAccountData.sortType).filter(
            (p) => p !== openAccountData.sortColumn
          );
          const newSort = {};
          keys.forEach((p) => (newSort[p] = ""));
          if (openAccountData.sortType[openAccountData.sortColumn] === "") {
            dispatch(
              openAccount({
                sortType: { [openAccountData.sortColumn]: "inc", ...newSort },
              })
            );
          } else if (
            openAccountData.sortType[openAccountData.sortColumn] === "inc"
          ) {
            dispatch(
              openAccount({
                sortType: { [openAccountData.sortColumn]: "desc", ...newSort },
              })
            );
          } else if (
            openAccountData.sortType[openAccountData.sortColumn] === "desc"
          ) {
            dispatch(
              openAccount({
                sortType: { [openAccountData.sortColumn]: "", ...newSort },
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
    if (searchParams.get("pageNumber")) {
      crateTable(openAccountData.sortBy);
      handleResatSearch();
    }
  }, [searchParams, openAccountData.update, openAccountData.sortBy]);

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
      fullName: searchParams.get("fullName"),
      mobileNumber: searchParams.get("mobileNumber"),
      referenceNumber: searchParams.get("referenceNumber"),
      accountStatus: searchParams.get("accountStatus"),
      pageNumber: searchParams.get("pageNumber") || 1,
      recordsPerPage: searchParams.get("recordsPerPage") || 10,
    });
    handleResatSearch();
  }, []);

  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: 50,
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
      title: () => {
        return (
          <SortableTitle
            sort={openAccountData.sortType.referenceNumber}
            onClick={() => handleSort("referenceNumber")}
            text={Dictionary.traceNumber}
          />
        );
      },
      key: "referenceNumber",
      dataIndex: "referenceNumber",
      width: "17%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={openAccountData.sortType.fullname}
            onClick={() => handleSort("fullname")}
            text={Dictionary.fullName}
          />
        );
      },
      key: "fullName",
      dataIndex: "fullName",
      width: "17%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={openAccountData.sortType.identificationCode}
            onClick={() => handleSort("identificationCode")}
            text={Dictionary.nationalId}
          />
        );
      },
      key: "nationalId",
      dataIndex: "nationalId",
      width: "17%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: Dictionary.actionType,
      key: "actionType",
      dataIndex: "actionType",
      width: "17%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return Dictionary.openAccount;
      },
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={openAccountData.sortType.createdDate}
            onClick={() => handleSort("createdDate")}
            text={Dictionary.registerDate}
            className={Classes["rotate-vertically"]}
          />
        );
      },
      key: "registerDate",
      dataIndex: "registerDate",
      className: "table-th-date",
      width: "17%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return <DateFormat value={text} />;
      },
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={openAccountData.sortType.accountStatus}
            onClick={() => handleSort("accountStatus")}
            text={Dictionary.status}
          />
        );
      },
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
  const handleResatSearch = () => {
    if (
      searchParams.get("referenceNumber") ||
      searchParams.get("fullname") ||
      searchParams.get("identificationCode") ||
      searchParams.get("mobileNumber") ||
      searchParams.get("accountStatus")
    ) {
      dispatch(openAccount({ showDeleteBtn: true }));
    } else {
      dispatch(openAccount({ showDeleteBtn: false }));
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
      setSearchParams(newQueryParam);
      dispatch(openAccount({ showDeleteBtn: true, sortColumn: "" }));
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
    dispatch(openAccount({ showDeleteBtn: false, sortColumn: "" }));
    form.resetFields();
  };

  return (
    <div>
      <HeaderPage
        title={Dictionary.authenticationCustomers}
        addIcon={false}
        onClick={
          permissions.showHistoryBtn
            ? () =>
                navigate("/authentication/open-account/history-open-account")
            : ""
        }
        buttonText={Dictionary.failedOpenAccounts}
      />
      <ModalComponent
        title={Dictionary.authenticatedCustomer}
        open={openAccountData.modal}
        width={918}
        className={Classes["open-account-modal"]}
        onCancel={() =>
          dispatch(
            openAccount({
              idCard: {},
              backIdCard: {},
              docs: [],
              sign: {},
              avatar: {},
              video: "",
              videoURL: "",
              modal: false,
            })
          )
        }
      >
        <AuthenticatedCustomer getFile={getFile} />
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
            maxLength={14}
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
            maxLength={40}
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
        <FormItemComponent name="accountStatus">
          <SelectComponent
            name="accountStatus"
            width={176}
            placeholder={Dictionary.status}
            items={items}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["list-card-btn"]}>
          {openAccountData.showDeleteBtn && (
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
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </Form>
      <TableComponent
        columns={columns}
        dataSource={openAccountData.list}
        count={pagination.recordsPerPage}
      />
      {openAccountData.total > 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={openAccountData.total}
        />
      )}
    </div>
  );
};
export default OpenAccount;
