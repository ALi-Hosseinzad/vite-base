import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import HeaderPage from "components/headerPage/HeaderPage";
import useErrorHandler from "helpers/useErrorHandler";
import SortableTitle from "components/sortableTitle/SortableTitle";
import CustomIcon from "components/customIcon/CustomIcon";
import TicketIcon from "assets/images/icon/Ticket.svg";
import EditIcon from "assets/images/icon/Edit.svg";
import MultiColorChip from "components/multiColorChip/MultiColorChip";
import Variables from "assets/styles/_Variables.scss";
import ModalComponent from "components/modalComponent/ModalComponent";
import {
  ticketing,
  resetTicketing,
} from "store/reducers/ticketing/ticketingReducer";
import TicketInfo from "./pageComponent/TicketInfo";
import MessageHistory from "./pageComponent/MessageHistory";
import {
  getReactionSentences,
  getTicketList,
  messageList,
} from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import SearchInTicketing from "./pageComponent/SearchInTicketing";
import PaginationComponent from "components/pagination/PaginationComponent";
import TableComponent from "components/table/TableComponent";
import { createSearchObject } from "helpers/CreateSearchObject";
import Classes from "views/ticketing/styles/ticketInfo.module.scss";
import { MatchAuthority } from "helpers/MatchAuthority";
import TooltipComponent from "components/tooltip/TooltipComponent";
import AddNote from "./pageComponent/AddNote";

const Ticketing = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const path = window.location.pathname;
  const ticketingData = useSelector((state) => state.ticketing.value);
  const userInfoData = useSelector((state) => state.userInfo.value);
  const {
    objectModal,
    messageHistory,
    list,
    totalRows,
    sortBy,
    reload,
    captions,
    permissions,
    ticketingKey,
    filterObject,
    noteModal,
  } = ticketingData;
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const generatorStatus = {
    ASKED: { fontColor: Variables.LogoGreenLight, bgc: Variables.GreenLight3 },
    SEEN_BY_BACK_OFFICE: {
      fontColor: Variables.NotifRed,
      bgc: Variables.NotifPink,
    },
    ANSWERED: { fontColor: "#97C4A3", bgc: "#F7F8E2" },
    SEEN_BY_CUSTOMER: { fontColor: "#97C4A3", bgc: "#F7F8E2" },
    CLOSED: { fontColor: Variables.GreyDark3, bgc: Variables.GreyLight3 },
  };

  useEffect(() => {
    dispatch(resetTicketing());
  }, []);

  useEffect(() => {
    if (path.includes("ticket-list")) {
      dispatch(
        ticketing({
          ticketingKey: "ticketList",
          filterObject: {
            key: "status",
            value: "CLOSED",
            operation: "notEqual",
          },
        })
      );
    } else if (path.includes("closed-tickets")) {
      dispatch(
        ticketing({
          ticketingKey: "closedTickets",
          filterObject: {
            key: "status",
            value: "CLOSED",
            operation: "equals",
          },
        })
      );
    }
  }, [path]);

  useEffect(() => {
    if (userInfoData?.username !== "admin") {
      dispatch(
        ticketing({
          permissions: {
            view: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/ticketing/list/v1"
            ),
            viewMessages: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/ticketing/ticket/v1"
            ),
            ask: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/ticketing/answer/v1"
            ),
            addNote: MatchAuthority(
              userInfoData.authorities,
              "Put:/api/bo/ticketing/add-note/v1"
            ),
          },
        })
      );
    } else {
      dispatch(
        ticketing({
          permissions: {
            view: true,
            viewMessages: true,
            ask: true,
            addNote: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination(newQueryParam);
  };
  const handleResetSearch = () => {
    if (
      searchParams.get("fullName") ||
      searchParams.get("identificationCode") ||
      searchParams.get("phoneNumber") ||
      searchParams.get("status") ||
      searchParams.get("traceId")
    ) {
      dispatch(ticketing({ showDeleteBtn: true }));
    } else {
      dispatch(ticketing({ showDeleteBtn: false }));
    }
  };

  const createTable = (sortItem) => {
    const filtered = {
      ...createSearchObject(searchParams, { sortBy: sortItem }),
    };
    if (filterObject) {
      getTicketList({
        ...filtered,
        criteria: {
          operation: "and",
          criteria: [...filtered.criteria.criteria, filterObject],
        },
      })
        .then((res) => {
          dispatch(
            ticketing({
              list: res.data.data,
              endRow: res.data.end_row,
              startRow: res.data.start_row,
              totalRows: res.data.total_rows,
            })
          );
        })
        .then(() => {
          if (ticketingData.sortColumn) {
            const keys = Object.keys(ticketingData.sortType).filter(
              (p) => p !== ticketingData.sortColumn
            );
            const newSort = {};
            keys.forEach((p) => (newSort[p] = ""));
            if (ticketingData.sortType[ticketingData.sortColumn] === "") {
              dispatch(
                ticketing({
                  sortType: { [ticketingData.sortColumn]: "inc", ...newSort },
                })
              );
            } else if (
              ticketingData.sortType[ticketingData.sortColumn] === "inc"
            ) {
              dispatch(
                ticketing({
                  sortType: { [ticketingData.sortColumn]: "desc", ...newSort },
                })
              );
            } else if (
              ticketingData.sortType[ticketingData.sortColumn] === "desc"
            ) {
              dispatch(
                ticketing({
                  sortType: { [ticketingData.sortColumn]: "", ...newSort },
                })
              );
            }
          }
        })
        .catch(() => errorHandler(errorResponse));
    }
  };

  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      createTable(sortBy);
      handleResetSearch();
    }
  }, [searchParams, reload, sortBy, ticketingKey]);
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
  }, [pagination.pageNumber, pagination.recordsPerPage, ticketingKey]);

  const handleSort = (column) => {
    dispatch(ticketing({ sortColumn: column }));
    if (ticketingData.sortType[column] === "") {
      dispatch(ticketing({ sortBy: column }));
    } else if (ticketingData.sortType[column] === "inc") {
      dispatch(ticketing({ sortBy: `-${column}` }));
    } else if (ticketingData.sortType[column] === "desc") {
      dispatch(ticketing({ sortBy: "-lastModifiedDate" }));
    }
  };
  const handleClickObject = (item) => {
    if (!item?.caption) {
      if (captions?.length === 0) {
        const sentences = [];
        getReactionSentences({
          sort_by: "-lastModifiedDate",
          criteria: {
            operation: "and",
            criteria: [
              {
                key: "event",
                value: "TICKETING_CAPTION",
                operation: "equals",
              },
            ],
          },
        })
          .then((res) =>
            res.data?.data?.forEach((element) => {
              sentences.push({
                value: element.expression,
                text: element.expression,
              });
            })
          )
          .then(() =>
            dispatch(
              ticketing({
                captions: sentences,
                record: item,
                objectModal: true,
              })
            )
          )
          .catch(() => {
            errorHandler(errorResponse);
          });
      } else {
        dispatch(ticketing({ record: item, objectModal: true }));
      }
    } else {
      messageList({
        trace_id: item?.trace_id,
      })
        .then((res) =>
          dispatch(
            ticketing({
              record: item,
              messageHistory: true,
              messagesList: res?.data,
            })
          )
        )
        .catch(() => errorHandler(errorResponse));
    }
  };
  const backToTicketList = () => {
    navigate("/ticket-list");
    dispatch(ticketing({ reload: !reload }));
    onPaginationHandler(1, 10);
  };
  const goToClosedTickets = () => {
    navigate("/closed-tickets");
    dispatch(ticketing({ reload: !reload }));
    onPaginationHandler(1, 10);
  };
  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: 60,
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
            sort={ticketingData.sortType.traceId}
            onClick={() => handleSort("traceId")}
            text={Dictionary.ticketNumber}
          />
        );
      },
      dataIndex: "trace_id",
      key: "trace_id",
      width: 150,
      render: (record) => record || "--",
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={ticketingData.sortType.fullName}
            onClick={() => handleSort("fullName")}
            text={Dictionary.fullName}
          />
        );
      },
      key: "full_name",
      dataIndex: "full_name",
      width: 230,
      render: (record) => record || "--",
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={ticketingData.sortType.identificationCode}
            onClick={() => handleSort("identificationCode")}
            text={Dictionary.nationalId}
          />
        );
      },
      key: "identification_code",
      dataIndex: "identification_code",
      width: 130,
      render: (record) => record || "--",
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={ticketingData.sortType.phoneNumber}
            onClick={() => handleSort("phoneNumber")}
            text={Dictionary.mobile}
          />
        );
      },
      key: "phone_number",
      dataIndex: "phone_number",
      width: 130,
      render: (record) => record || "--",
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={ticketingData.sortType.lastModifiedDate}
            onClick={() => handleSort("lastModifiedDate")}
            text={Dictionary.time}
          />
        );
      },
      key: "last_modified_date",
      dataIndex: "last_modified_date",
      width: 180,
      render: (record) =>
        (
          <p dir="ltr" style={{ margin: "0px" }}>
            {record?.split(" ")?.join(" - ")}
          </p>
        ) || "--",
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={ticketingData.sortType.questionCaption}
            onClick={() => handleSort("questionCaption")}
            text={Dictionary.caption}
          />
        );
      },
      key: "caption",
      dataIndex: "caption",
      width: 250,
      render: (record) => record || "--",
    },
    {
      title: () => {
        return (
          <SortableTitle
            sort={ticketingData.sortType.status}
            onClick={() => handleSort("status")}
            text={Dictionary.status}
          />
        );
      },
      key: "status_description",
      dataIndex: "status_description",
      width: 200,
      render: (_field, record) =>
        _field ? (
          <MultiColorChip
            fontColor={generatorStatus[record?.status]?.fontColor || ""}
            bgc={generatorStatus[record?.status]?.bgc || ""}
          >
            {_field}
          </MultiColorChip>
        ) : (
          "--"
        ),
    },
    {
      title: Dictionary.supportsNote,
      key: "back_office_user_note",
      dataIndex: "back_office_user_note",
      width: 150,
      render: (record) => (
        <p className={Classes["supports-note-in-table"]}>{record || "--"}</p>
      ),
    },
    {
      key: "edit",
      dataIndex: "edit",
      fixed: "right",
      render: (_field, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "0 8px",
          }}
        >
          {permissions.addNote && (
            <TooltipComponent title={Dictionary.addNote}>
              <span
                onClick={() =>
                  dispatch(ticketing({ noteModal: true, record: record }))
                }
                style={{ paddingLeft: "16px" }}
              >
                <CustomIcon
                  src={EditIcon}
                  name="upload-icon"
                  size={24}
                  color={Variables.LogoGreenDark}
                />
              </span>
            </TooltipComponent>
          )}
          <TooltipComponent title={Dictionary.seeMessages}>
            <span
              onClick={() =>
                permissions.viewMessages && handleClickObject(record)
              }
            >
              <CustomIcon
                src={TicketIcon}
                size={24}
                color={
                  permissions.viewMessages
                    ? Variables.LogoGreenDark
                    : Variables.GreenLight7
                }
              />
            </span>
          </TooltipComponent>
        </div>
      ),
    },
  ];

  return !messageHistory ? (
    permissions.view && (
      <div>
        <ModalComponent
          width={918}
          title={Dictionary.chooseObject}
          open={objectModal}
          onCancel={() => {
            dispatch(ticketing({ objectModal: false, captionDescription: "" }));
          }}
        >
          <TicketInfo />
        </ModalComponent>
        <AddNote />
        {ticketingKey === "ticketList" ? (
          <HeaderPage
            title={`${Dictionary.ticket} ${Dictionary.supporting}`}
            buttonText={Dictionary.closedTickets}
            addIcon={false}
            onClick={goToClosedTickets}
          />
        ) : (
          <HeaderPage
            title={`${Dictionary.closedTickets}`}
            onClickBack={backToTicketList}
          />
        )}
        <SearchInTicketing
          setSearchParams={setSearchParams}
          setPagination={setPagination}
          pagination={pagination}
          searchParams={searchParams}
          handleResetSearch={handleResetSearch}
        />
        <TableComponent
          columns={columns}
          dataSource={list}
          count={totalRows}
          scroll={{ x: 2100, y: 550 }}
          tableLayout="unset"
          className={Classes["manage-table"]}
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
    )
  ) : (
    <MessageHistory />
  );
};
export default Ticketing;
