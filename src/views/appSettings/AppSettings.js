import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import CustomIcon from "components/customIcon/CustomIcon";
import TooltipComponent from "components/tooltip/TooltipComponent";
import Edit from "assets/images/icon/Edit.svg";
import TableComponent from "components/table/TableComponent";
import Classes from "./styles/AppSettings.module.scss";
import HeaderPage from "components/headerPage/HeaderPage";
import queryString from "query-string";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PaginationComponent from "components/pagination/PaginationComponent";
import Delete from "assets/images/icon/Delete.svg";
import {
  appSettings,
  appSettingsState,
  resetAppSettings,
} from "store/reducers/appSettings/AppSettingsReducer";
import { getAllAppSettings } from "helpers/APIFunction";
import DeleteAppSetting from "./pageComponents/DeleteAppSetting";
import AddOrEditAppSetting from "./pageComponents/AddOrEditAppSetting";

const AppSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const errorHandler = useErrorHandler();
  const AppSettingsData = useSelector(appSettingsState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParam] = useState(queryString?.parse(location.search));
  const { totalRows, refresh, list, showDeleteBtn } = AppSettingsData;
  const queryParamRecordsPerPage =
    searchParams.get("count") >= 50 ? 50 : Number(searchParams.get("count"));
  const [pagination, setPagination] = useState({
    offset: Number(searchParams.get("offset")) || 1,
    count: queryParamRecordsPerPage || 10,
  });

  useEffect(() => {
    return () => {
      dispatch(resetAppSettings());
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
    if (searchParams.get("offset")) {
      crateTable();
    }
  }, [refresh, searchParams]);

  const crateTable = () => {
    let body = Object.fromEntries(searchParams.entries());
    body.offset = ((body.offset - 1) * body.count).toString();

    getAllAppSettings(body)
      .then((res) => {
        dispatch(appSettings({ list: res?.data }));
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const handleEdit = (record) => {
    dispatch(
      appSettings({
        record: record,
        type: "edit",
        showAddNewAppSettingsModal: true,
      })
    );
  };

  const onPaginationHandler = (offset, count) => {
    const newQueryParam = { ...queryParam, offset: offset, count: count };
    setPagination({ offset, count });
    navigate({ search: queryString.stringify(newQueryParam) });
  };

  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: "7%",
      className: "first-column",
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
      title: Dictionary.name + " " + Dictionary.item,
      key: "item_name",
      dataIndex: "item_name",
      width: "20%",
      render: (record) => record || "--",
    },
    {
      title: "Android",
      key: "android_value",
      dataIndex: "android_value",
      width: "15%",
      render: (record) => record || "--",
    },
    {
      title: "Browser",
      key: "browser_value",
      dataIndex: "browser_value",
      width: "15%",
      render: (record) => record || "--",
    },
    {
      title: "Ios",
      key: "ios_value",
      dataIndex: "ios_value",
      width: "35%",
      render: (record) => record || "--",
    },
    {
      key: "services",
      dataIndex: "services",
      width: "7%",
      className: "table-th-status",
      render: (_field, record) => (
        <div className={Classes["appSettings-row-icon"]}>
          <TooltipComponent title={Dictionary.edit}>
            <CustomIcon
              src={Edit}
              size={24}
              name={`app-settings-${record.id}-edit`}
              onClick={() => handleEdit(record)}
            />
          </TooltipComponent>
          <TooltipComponent title={Dictionary.delete}>
            <CustomIcon
              src={Delete}
              size={24}
              name={`app-settings-${record.id}-delete`}
              onClick={() =>
                dispatch(
                  appSettings({ deleteAppSettingsModal: true, record: record })
                )
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
        title={`${Dictionary.settings} ${Dictionary.system} ${Dictionary.ha}`}
        onClick={() =>
          dispatch(
            appSettings({ showAddNewAppSettingsModal: true, type: "add" })
          )
        }
        buttonText={`${Dictionary.add} ${Dictionary.settings} ${Dictionary.new} `}
      />
      <DeleteAppSetting />
      <AddOrEditAppSetting />
      <TableComponent columns={columns} dataSource={list} />
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

export default AppSettings;
