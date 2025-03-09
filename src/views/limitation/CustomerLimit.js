import React, { useEffect, useState } from "react";
import EditCutomerLimit from "views/limitation/pageComponent/EditCustomerLimit";
import TabsBar from "components/tabsBar/TabsBar";
import Dictionary from "helpers/Dictionary";
import HeaderPage from "components/headerPage/HeaderPage";
import VIPCustomers from "./pageComponent/VIPCustomers";
import {
  limitation,
  resetLimitation,
} from "store/reducers/limitation/limitationReducer";
import { MatchAuthority } from "helpers/MatchAuthority";
import { useDispatch, useSelector } from "react-redux";

const CustomerLimit = () => {
  const dispatch = useDispatch();
  const userInfoData = useSelector((state) => state.userInfo.value);
  const listLimitationData = useSelector((state) => state.limitation.value);
  const { permissions, vipPermissions } = listLimitationData;
  const [items, setItems] = useState([]);

  useEffect(() => {
    dispatch(resetLimitation());
  }, []);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        limitation({
          permissions: {
            view: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/limit/modified-transfer-limit/customer/search/v1"
            ),
            edit: MatchAuthority(
              userInfoData.authorities,
              "Put:/api/bo/limit/modified-transfer-limit/v1"
            ),
            delete: MatchAuthority(
              userInfoData.authorities,
              "Put:/api/bo/limit/modified-transfer-limit/v1"
            ),
            create:
              MatchAuthority(
                userInfoData.authorities,
                "Get:/api/bo/customer/identification-code/{identificationCode}/customer-or-corporate/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/limit/modified-transfer-limit/v1"
              ),
          },
          vipPermissions: {
            view: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/vip/search/v1"
            ),
            delete: MatchAuthority(
              userInfoData.authorities,
              "Delete:/api/bo/vip/v1"
            ),
            create:
              MatchAuthority(
                userInfoData.authorities,
                "Get:/api/bo/customer/identification-code/{identificationCode}/customer-or-corporate/v1"
              ) &&
              MatchAuthority(userInfoData.authorities, "Post:/api/bo/vip/v1"),
          },
        })
      );
    } else {
      dispatch(
        limitation({
          permissions: {
            view: true,
            edit: true,
            delete: true,
            create: true,
          },
          vipPermissions: {
            view: true,
            delete: true,
            create: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  useEffect(() => {
    if (permissions.view && vipPermissions.view) {
      setItems([
        {
          label: Dictionary.VIPCustomers,
          key: "item-1",
          children: <VIPCustomers />,
        },
        {
          label: Dictionary.edit + " " + Dictionary.maxTransLimit,
          key: "item-2",
          children: <EditCutomerLimit />,
        },
      ]);
    } else if (permissions.view && !vipPermissions.view) {
      setItems([
        {
          label: Dictionary.edit + " " + Dictionary.maxTransLimit,
          key: "item-2",
          children: <EditCutomerLimit />,
        },
      ]);
    } else if (!permissions.view && vipPermissions.view) {
      setItems([
        {
          label: Dictionary.VIPCustomers,
          key: "item-1",
          children: <VIPCustomers />,
        },
      ]);
    }
  }, [permissions, vipPermissions]);

  return (
    <div>
      <HeaderPage
        title={`${Dictionary.maxTransLimit} ${Dictionary.daily} ${Dictionary.customer}`}
      />
      <TabsBar items={items} />
    </div>
  );
};

export default CustomerLimit;
