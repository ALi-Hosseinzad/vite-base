import React, { useEffect, useState } from "react";
import Dictionary from "helpers/Dictionary";
import Classes from "views/payaSatnaPol/styles/ReasonList.module.scss";
import {
  payaSatnaPol,
  payaSatnaPolState,
} from "store/reducers/payaSatnaPol/PayaSatnaPolReducer";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "components/table/TableComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import ChipComponent from "components/chipComponent/ChipComponent";
import { getSettingsList } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import Edit from "assets/images/icon/Edit.svg";
import EditSettingModal from "./EditSettingModal";
import Variables from "assets/styles/_Variables.scss";

const DailyControlHour = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const payaSatnaPolData = useSelector(payaSatnaPolState);
  const { reloadDaily, permissions, dailyList } = payaSatnaPolData;

  useEffect(() => {
    crateTable();
  }, [reloadDaily]);

  const crateTable = () => {
    getSettingsList()
      .then((res) => {
        dispatch(payaSatnaPol({ dailyList: res.data }));
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const showEditSetting = (record) => {
    dispatch(payaSatnaPol({ showEditSettingModal: true, record: record }));
  };

  const columns = [
    {
      title: Dictionary.transferType,
      key: "transfer_type",
      dataIndex: "transfer_type",
      width: "10%",
      render: () => <>{Dictionary.satna}</>,
    },
    {
      key: "weekday_desc",
      dataIndex: "weekday_desc",
      title: Dictionary.day,
      width: "10%",
      render: (record) => <>{record}</>,
    },
    {
      title: `${Dictionary.hour} ${Dictionary.start}`,
      key: "start_time",
      dataIndex: "start_time",
      width: "10%",
      render: (record) => <>{record}</>,
    },
    {
      title: `${Dictionary.hour} ${Dictionary.end}`,
      key: "end_time",
      dataIndex: "end_time",
      width: "10%",
      render: (record) => <>{record}</>,
    },
    {
      title: `${Dictionary.status} ${Dictionary.control}`,
      render: (record) => (
        <>
          {record.is_controled ? (
            <ChipComponent active>{Dictionary.control}</ChipComponent>
          ) : (
            <ChipComponent red>{Dictionary.deControl}</ChipComponent>
          )}
        </>
      ),
    },
    {
      key: "status",
      dataIndex: "status",
      width: "7%",
      className: Classes["record-status"],
      render: (_field, record) => (
        <TooltipComponent
          title={Dictionary.edit}
          onClick={
            permissions.editSetting ? () => showEditSetting(record) : () => ""
          }
        >
          <CustomIcon
            src={Edit}
            size={24}
            name={`reason-record-${record.id}-edit`}
            color={
              permissions.editSetting
                ? Variables.LogoGreenDark
                : Variables.GreenLight7
            }
            cursor={!permissions.editSetting ? "default" : "pointer"}
          />
        </TooltipComponent>
      ),
    },
  ];
  return (
    <div className={Classes["wrapper"]}>
      <EditSettingModal />
      <TableComponent columns={columns} dataSource={dailyList} count={7} />
    </div>
  );
};
export default DailyControlHour;
