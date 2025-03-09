import React, { Fragment, useEffect, useRef, useState } from "react";
import { Form, Table } from "antd";
import Dictionary from "helpers/Dictionary";
import Print from "assets/images/icon/Print.svg";
import PrintCard from "./pageComponent/PrintCard";
import { useSearchParams } from "react-router-dom";
import { errorResponse } from "helpers/APIService";
import Tracking from "assets/images/icon/Frame.svg";
import useErrorHandler from "helpers/useErrorHandler";
import Variables from "assets/styles/_Variables.scss";
import { useDispatch, useSelector } from "react-redux";
import Location from "assets/images/icon/Branches.svg";
import { MatchAuthority } from "helpers/MatchAuthority";
import CustomIcon from "components/customIcon/CustomIcon";
import HeaderPage from "components/headerPage/HeaderPage";
import DownloadIcon from "assets/images/icon/Download.svg";
import SelectColor from "components/SelectColor/SelectColor";
import ButtonComponent from "components/button/ButtonComponent";
import SendCustomerModal from "./pageComponent/SendCustomerModal";
import Classes from "views/listCards/styles/ListCards.module.scss";
import SortableTitle from "components/sortableTitle/SortableTitle";
import TooltipComponent from "components/tooltip/TooltipComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import { userInfoState } from "store/reducers/userInfo/UserInfoReducer";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import SelectComponent from "components/SelectComponent/SelectComponent";
import PaginationComponent from "components/pagination/PaginationComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import SelectCityOrProvinceModal from "./pageComponent/SelectCityOrProvinceToCardModal";
import {
  listCards,
  listCardsState,
  resetListCards,
} from "store/reducers/listCards/listCardsReducer";
import {
  exportCardListV2,
  getCardColors,
  getCardsList,
  sendUpdateGroupCards,
} from "helpers/APIFunction";

const items = [
  { id: 1, value: "DELIVERED", text: "تحویل شده" },
  { id: 2, value: "SENT", text: "در انتظار تایید" },
  { id: 3, value: "LOGICALLY_ISSUED", text: "ارسال به مشتری" },
];
const typeItems = [
  { id: 1, value: "EXTEND", text: "تمدید" },
  { id: 2, value: "REPLICATE", text: "المثنی" },
  { id: 3, value: "RECOLOR", text: "تغییر رنگ" },
  { id: 4, value: "ISSUE_NEW", text: "صدور جدید" },
];

const ListCards = () => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const errorHandler = useErrorHandler();
  const userInfoData = useSelector(userInfoState);
  const listCardsData = useSelector(listCardsState);
  const [exportValues, setExportValues] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParamCount =
    searchParams.get("count") >= 100 ? 10 : Number(searchParams.get("count"));
  const [pagination, setPagination] = useState({
    offset: Number(searchParams.get("offset")) || 0,
    count: queryParamCount || 10,
  });
  const {
    height,
    permissions,
    selectedRowKeys,
    selectedRows,
    update,
    showPrint,
  } = listCardsData;

  useEffect(() => {
    return () => dispatch(resetListCards());
  }, []);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        listCards({
          permissions: {
            edit: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/raw-cards/send-card-operation/v1"
            ),
            send:
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/raw-cards/send-card/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/cards-operation/send-card/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Get:/api/bo/account/open/get-postal-destination/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/account/open/set-postal-destination/v1"
              ),
          },
        })
      );
    } else {
      dispatch(listCards({ permissions: { edit: true, send: true } }));
    }
  }, [userInfoData.authorities]);

  const onPaginationHandler = (offset, count) => {
    const newQueryParam = { offset: (offset - 1) * count, count: count };
    setPagination(newQueryParam);
  };

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    if (newSelectedRowKeys.length > 0) {
      dispatch(
        listCards({
          selectedRowKeys: newSelectedRowKeys,
          selectedRows: selectedRows,
          height: 500,
        })
      );
    } else {
      dispatch(
        listCards({
          selectedRowKeys: newSelectedRowKeys,
          selectedRows: selectedRows,
          height: 550,
        })
      );
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange,
  };

  const crateTable = (sortItem) => {
    let obj = new Object();
    for (const [key, value] of searchParams.entries()) {
      obj[key] = value;
    }
    obj.sort_by = sortItem;
    getCardsList(obj)
      .then((res) => {
        const convert = res.data?.data?.map((node, index) => {
          return {
            id: index,
            key: index,
            lastName: node.lastname,
            firstName: node.firstname,
            cardColor: node?.card_color,
            postalCode: node.postal_code,
            status: node?.operation_status,
            mobileNumber: node.mobile_number,
            accountNumber: node.account_number,
            referenceNumber: node.reference_number,
            identificationCode: node.identification_code,
            fullName: node.firstname + " " + node.lastname,
            statusDescription: node.receive_status_description,
            ...node,
          };
        });
        dispatch(
          listCards({
            list: convert,
            endRow: res.data?.end_row,
            startRow: res.data?.start_row,
            totalRows: res.data?.total_rows,
          })
        );
        setExportValues({ ...obj, count: res.data.total_rows, offset: "0" });
      })
      .then(() => {
        if (listCardsData.sortColumn) {
          const keys = Object.keys(listCardsData.sortType).filter(
            (p) => p !== listCardsData.sortColumn
          );
          const newSort = {};
          keys.forEach((p) => (newSort[p] = ""));
          if (listCardsData.sortType[listCardsData.sortColumn] === "") {
            dispatch(
              listCards({
                sortType: { [listCardsData.sortColumn]: "inc", ...newSort },
              })
            );
          } else if (
            listCardsData.sortType[listCardsData.sortColumn] === "inc"
          ) {
            dispatch(
              listCards({
                sortType: { [listCardsData.sortColumn]: "desc", ...newSort },
              })
            );
          } else if (
            listCardsData.sortType[listCardsData.sortColumn] === "desc"
          ) {
            dispatch(
              listCards({
                sortType: { [listCardsData.sortColumn]: "", ...newSort },
              })
            );
          }
        }
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const exportList = () => {
    exportCardListV2(exportValues, { responseType: "blob" })
      .then((res) => {
        const url = URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `listCards.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const handleSort = (column) => {
    dispatch(listCards({ sortColumn: column }));
    if (listCardsData.sortType[column] === "") {
      dispatch(listCards({ sortBy: column }));
    } else if (listCardsData.sortType[column] === "inc") {
      dispatch(listCards({ sortBy: `-${column}` }));
    } else if (listCardsData.sortType[column] === "desc") {
      dispatch(listCards({ sortBy: "-createdDate" }));
    }
  };

  const handleResatSearch = () => {
    if (
      searchParams.get("card_color") ||
      searchParams.get("mobile_number") ||
      searchParams.get("card_operation") ||
      searchParams.get("account_number") ||
      searchParams.get("operation_state") ||
      searchParams.get("identification_code")
    ) {
      dispatch(listCards({ showDeleteBtn: true }));
    } else {
      dispatch(listCards({ showDeleteBtn: false }));
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
      const newQueryParam = { offset: 0, count: pagination.count, ...values };
      setSearchParams(newQueryParam);
      dispatch(listCards({ showDeleteBtn: true, sortColumn: "" }));
      setPagination({ ...pagination, offset: 0 });
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
    const newQueryParam = { offset: 0, count: pagination.count };
    setSearchParams(newQueryParam);
    dispatch(
      listCards({
        showDeleteBtn: false,
        sortColumn: "",
        selectedRowKeys: [],
        selectedRows: [],
        height: 550,
      })
    );
    form.resetFields();
  };

  useEffect(() => {
    if (searchParams.get("offset")) {
      crateTable(listCardsData.sortBy);
      handleResatSearch();
    }
  }, [searchParams, listCardsData.update, listCardsData.sortBy]);

  useEffect(() => {
    let newQueryParam = { offset: pagination.offset, count: pagination.count };
    for (const [key, value] of searchParams.entries()) {
      if (key !== "offset" && key !== "count") {
        newQueryParam[key] = value;
      }
    }
    setSearchParams(newQueryParam);
  }, [pagination.offset, pagination.count]);

  useEffect(() => {
    form.setFieldsValue({
      offset: searchParams.get("offset") || 0,
      count: searchParams.get("count") || 100,
      card_color: searchParams.get("card_color"),
      mobile_number: searchParams.get("mobile_number"),
      account_number: searchParams.get("account_number"),
      card_operation: searchParams.get("card_operation"),
      operation_state: searchParams.get("operation_state"),
      identification_code: searchParams.get("identification_code"),
    });
    handleResatSearch();
  }, []);

  useEffect(() => {
    getCardColors()
      .then((res) => {
        const convert = res.data?.map((node) => {
          return {
            text: node?.name,
            value: node?.code,
          };
        });
        dispatch(listCards({ colors: convert }));
      })
      .catch(() => errorHandler(errorResponse));
  }, []);

  const updateGroupCards = () => {
    if (permissions.edit) {
      let body = [];
      if (selectedRows.length > 0) {
        selectedRows.forEach((item) => {
          if (item.township) {
            const convertObj = {
              reference_number: item.referenceNumber,
              identification_code: item.identificationCode,
              is_from_account_creation: item.from_account_creation,
            };
            body.push(convertObj);
          }
        });
        if (body?.length === selectedRows.length) {
          sendUpdateGroupCards(body)
            .then(() => {
              dispatch(
                listCards({
                  selectedRowKeys: [],
                  selectedRows: [],
                  update: !update,
                })
              );
            })
            .catch(() => {
              errorHandler(errorResponse);
            });
        } else {
          dispatch(
            setNotificationData({
              message:
                "شهر یا استانی برای تمامی سطرهای انتخاب شده تعریف نشده است.",
              type: "error",
              time: 3000,
            })
          );
        }
      } else {
        dispatch(
          setNotificationData({
            message: "سطری انتخاب نشده است!",
            type: "error",
            time: 3000,
          })
        );
      }
    } else {
      dispatch(
        setNotificationData({
          message: "شما به این سرویس دسترسی ندارید.",
          type: "error",
          time: 3000,
        })
      );
    }
  };

  const columns = [
    {
      width: 70,
      fixed: "left",
      dataIndex: "index",
      render: (_text, _record, index) => {
        if (pagination.offset === 1) {
          return <span className="pagination-column">{index + 1}</span>;
        } else {
          return (
            <span className="pagination-column">
              {pagination.offset + (index + 1)}
            </span>
          );
        }
      },
    },
    Table.SELECTION_COLUMN,
    {
      title: () => {
        return (
          <SortableTitle
            sort={listCardsData.sortType.cardColor}
            onClick={() => handleSort("cardColor")}
          />
        );
      },
      width: 50,
      fixed: "left",
      dataIndex: "cardColor",
      render: (_field, record) => {
        return (
          <div
            className={Classes["card-color"]}
            style={{ backgroundColor: `#${record?.cardColor}` }}
          ></div>
        );
      },
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={listCardsData.sortType["pan"]}
            onClick={() => handleSort("pan")}
            text={Dictionary.cardNumber}
          />
        );
      },
      width: 200,
      fixed: "left",
      dataIndex: "pan",
      render: (text) => {
        if (text === null) return "--";
        else
          return (
            <Fragment>
              <span>{text.match(/\d{4}/g)[0]}</span>
              <span className={Classes["list-cards-card-row"]}>
                {text.match(/\d{4}/g)[1]}
              </span>
              <span className={Classes["list-cards-card-row"]}>
                {text.match(/\d{4}/g)[2]}
              </span>
              <span className={Classes["list-cards-card-row"]}>
                {text.match(/\d{4}/g)[3]}
              </span>
            </Fragment>
          );
      },
    },
    {
      width: 180,
      title: Dictionary.accNo,
      dataIndex: "accountNumber",
      render: (record) => record || "--",
    },
    {
      width: 150,
      title: Dictionary.nationalId,
      dataIndex: "identificationCode",
      render: (record) => record || "--",
    },
    {
      width: 220,
      dataIndex: "fullName",
      title: Dictionary.fullName,
      render: (record) => record || "--",
    },
    {
      width: 220,
      dataIndex: "iban",
      title: Dictionary.number + " " + Dictionary.IBan,
      render: (record) => record || "--",
    },
    {
      width: 150,
      title: Dictionary.mobile,
      dataIndex: "mobileNumber",
      render: (record) => record || "--",
    },
    {
      width: 250,
      dataIndex: "postal_barcode",
      title: Dictionary.barcode + " " + Dictionary.postalPack,
      render: (record) => record || "--",
    },
    {
      width: 150,
      title: Dictionary.traceCode,
      dataIndex: "referenceNumber",
      render: (record) => record || "--",
    },
    {
      width: 100,
      title: Dictionary.type,
      dataIndex: "card_operation_description",
      render: (record) => record || "--",
    },
    {
      width: 200,
      dataIndex: "township",
      title: Dictionary.cityOrProvince,
      render: (record) => record || "--",
    },
    {
      width: 170,
      dataIndex: "created_date",
      title: Dictionary.requestDate,
      className: Classes["time-row"],
      render: (text) => {
        if (!text) return "--";
        else return text?.split(" ")?.reverse()?.join(" - ");
      },
    },
    {
      width: 180,
      title: Dictionary.issueDate,
      className: Classes["time-row"],
      dataIndex: "physical_issued_date",
      render: (text) => {
        if (!text) return "--";
        else return text?.split(" ")?.reverse()?.join(" - ");
      },
    },
    {
      width: 180,
      dataIndex: "receive_date",
      title: Dictionary.deliverDate,
      className: Classes["time-row"],
      render: (text) => {
        if (!text) return "--";
        else return text?.split(" ")?.reverse()?.join(" - ");
      },
    },
    {
      title: Dictionary.status,
      dataIndex: "services",
      className: "table-th-status",
      fixed: "right",
      render: (_field, record) => (
        <div className={Classes["list-cards-status"]}>
          {(record.status === "DELIVERED" || record.status === "SENT") && (
            <div className={Classes["list-cards-status-part"]}>
              <div
                className={
                  record.status === "DELIVERED"
                    ? Classes["list-cards-status-success"]
                    : Classes["list-cards-status-pending"]
                }
              >
                {record.statusDescription}
              </div>
              <TooltipComponent title={Dictionary.print}>
                <CustomIcon
                  size={20}
                  src={Print}
                  name={`print-icon-${record.id}`}
                  color={
                    permissions.send
                      ? Variables.LogoGreenDark
                      : Variables.GreenLight7
                  }
                  onClick={() =>
                    permissions.send &&
                    dispatch(listCards({ showPrint: true, record: record }))
                  }
                />
              </TooltipComponent>
            </div>
          )}
          {record.status === "LOGICALLY_ISSUED" && (
            <ButtonComponent
              type="default"
              name="print-icon"
              htmlType={Dictionary.sendToCustomer}
              classNameLeftIcon={Classes["list-cards-status-btn-icon"]}
              colorLeft={
                permissions.send
                  ? Variables.LogoGreenDark
                  : Variables.GreenLight7
              }
              onClick={() =>
                permissions.send &&
                dispatch(
                  listCards({ showSendCustomerModal: true, record: record })
                )
              }
              classNameBtn={`${Classes["list-cards-status-btn"]} ${
                !permissions.send && Classes["list-cards-status-btn-disable"]
              }`}
            >
              {record.statusDescription}
            </ButtonComponent>
          )}
          <TooltipComponent
            title={
              permissions.send &&
              Dictionary.select + " " + Dictionary.cityOrProvince
            }
          >
            <CustomIcon
              size={24}
              src={Location}
              name={`location-icon-${record.id}`}
              className={Classes["list-cards-status-btn-last"]}
              color={
                permissions.send
                  ? Variables.LogoGreenDark
                  : Variables.GreenLight7
              }
              onClick={() =>
                permissions.send &&
                dispatch(listCards({ showSelectModal: true, record: record }))
              }
            />
          </TooltipComponent>
          <TooltipComponent
            title={
              record.postal_barcode &&
              Dictionary.trace + " " + Dictionary.postalPack
            }
          >
            <a
              className={Classes["list-cards-status-btn-last"]}
              style={
                record.postal_barcode
                  ? { cursor: "pointer" }
                  : { cursor: "default" }
              }
              href={
                record.postal_barcode &&
                `https://tracking.post.ir/search.aspx?id=${record.postal_barcode}`
              }
              target="_blank"
            >
              <CustomIcon
                size={24}
                src={Tracking}
                name={`barcode-${record.id}-track`}
                cursor={record.postal_barcode ? "pointer" : "default"}
                color={
                  record.postal_barcode
                    ? Variables.LogoGreenDark
                    : Variables.GreenLight7
                }
              />
            </a>
          </TooltipComponent>
        </div>
      ),
    },
  ];

  return (
    <div>
      {permissions.send ? (
        <HeaderPage
          title={Dictionary.listCards}
          onClick={listCardsData.list?.length > 0 ? exportList : ""}
          srcRight={listCardsData.list?.length > 0 ? DownloadIcon : ""}
          buttonText={listCardsData.list?.length > 0 ? Dictionary.exclFile : ""}
        />
      ) : (
        <HeaderPage title={Dictionary.listCards} />
      )}
      <ModalComponent
        width={842}
        open={showPrint}
        title={Dictionary.print + " " + Dictionary.card}
        onCancel={() => dispatch(listCards({ showPrint: false }))}
      >
        <PrintCard />
      </ModalComponent>
      <SendCustomerModal />
      <SelectCityOrProvinceModal />
      <Form
        className={Classes["list-cards-form"]}
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent
          name="identification_code"
          className={Classes["list-cards-form-item"]}
        >
          <InputSearchComponent
            width={176}
            name="identification_code"
            placeholder={Dictionary.nationalId}
            maxLength={10}
          />
        </FormItemComponent>
        <FormItemComponent
          name="account_number"
          className={Classes["list-cards-form-item"]}
        >
          <InputSearchComponent
            width={176}
            name="account_number"
            placeholder={Dictionary.accNo}
            maxLength={13}
          />
        </FormItemComponent>
        <FormItemComponent name="card_color">
          <SelectColor
            width={176}
            items={listCardsData?.colors}
            prefix
            name="card_color"
            placeholder={`${Dictionary.color} ${Dictionary.card}`}
          >
            {listCardsData?.colors.map((item) => (
              <Option
                className={Classes["color-option"]}
                value={item.value}
                key={item.id}
              >
                <div>
                  <div style={{ backgroundColor: `#${item.value}` }}></div>
                  <p>{item.text}</p>
                </div>
              </Option>
            ))}
          </SelectColor>
        </FormItemComponent>
        <FormItemComponent
          name="mobile_number"
          className={Classes["list-cards-form-item"]}
        >
          <InputSearchComponent
            name="mobile_number"
            width={176}
            placeholder={Dictionary.mobile}
            maxLength={11}
          />
        </FormItemComponent>
        <FormItemComponent name="operation_state">
          <SelectComponent
            name="operation_state"
            width={176}
            placeholder={Dictionary.status}
            items={items}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent name="card_operation">
          <SelectComponent
            name="card_operation"
            width={176}
            placeholder={Dictionary.type}
            items={typeItems}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["list-card-btn"]}>
          {listCardsData.showDeleteBtn && (
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
      {permissions.edit && selectedRowKeys.length > 0 && (
        <div className={Classes["select-part"]}>
          <p>
            {Dictionary.rowSelected}: {selectedRowKeys.length}
          </p>
          <ButtonComponent
            type="primary"
            htmlType="button"
            classNameBtn={Classes["list-card-btn-button"]}
            onClick={updateGroupCards}
          >
            {Dictionary.sendSelectedRows}
          </ButtonComponent>
        </div>
      )}
      <Table
        size="small"
        columns={columns}
        pagination={false}
        tableLayout="unset"
        scroll={{ x: 2800, y: height }}
        dataSource={listCardsData?.list}
        className={Classes["manage-table"]}
        rowSelection={permissions?.edit ? rowSelection : null}
      />
      {listCardsData?.totalRows > 10 && (
        <PaginationComponent
          responsive={true}
          pageSize={pagination.count}
          total={listCardsData.totalRows}
          onPaginationHandler={onPaginationHandler}
          current={pagination.offset / pagination.count + 1}
        />
      )}
    </div>
  );
};
export default ListCards;
