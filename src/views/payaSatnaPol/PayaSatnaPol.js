import React, { useEffect } from "react";
import HeaderPage from "components/headerPage/HeaderPage";
import Dictionary from "helpers/Dictionary";
import TabsBar from "components/tabsBar/TabsBar";
import DailyControlHour from "./pageComponents/DailyControlHour";
import ReasonList from "./pageComponents/ReasonList";
import { useDispatch, useSelector } from "react-redux";
import { MatchAuthority } from "helpers/MatchAuthority";
import {
  payaSatnaPol,
  resetPayaSatnaPol,
} from "store/reducers/payaSatnaPol/PayaSatnaPolReducer";

const PayaSatnaPol = () => {
  const dispatch = useDispatch();
  const userInfoData = useSelector((state) => state.userInfo.value);

  useEffect(() => {
    return () => {
      dispatch(resetPayaSatnaPol());
    };
  }, []);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        payaSatnaPol({
          permissions: {
            view: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/transfer/reasons/v1"
            ),
            edit: MatchAuthority(
              userInfoData.authorities,
              "Put:/api/bo/transfer/update/reason/v1"
            ),
            create: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/transfer/add/reason/v1"
            ),
            editSetting: MatchAuthority(
              userInfoData.authorities,
              "Put:/api/bo/satna-setting/update/v1"
            ),
            viewSetting: MatchAuthority(
              userInfoData.authorities,
              "Get:/api/bo/satna-setting/v1"
            ),
          },
        })
      );
    } else {
      dispatch(
        payaSatnaPol({
          permissions: {
            view: true,
            edit: true,
            create: true,
            editSetting: true,
            viewSetting: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  const items = [
    {
      label: Dictionary.dailyHour,
      key: "item-1",
      children: <DailyControlHour />,
    },
    {
      label: Dictionary.list + " " + Dictionary.reason,
      key: "item-2",
      children: <ReasonList />,
    },
  ];

  return (
    <div>
      <HeaderPage
        title={
          Dictionary.satna +
          " " +
          Dictionary.and +
          " " +
          Dictionary.paya +
          " " +
          Dictionary.and +
          " " +
          Dictionary.pol
        }
      />
      <TabsBar items={items} />
    </div>
  );
};
export default PayaSatnaPol;
