import React, { useEffect } from "react";
import HeaderPage from "components/headerPage/HeaderPage";
import Dictionary from "helpers/Dictionary";
import TabsBar from "components/tabsBar/TabsBar";
import { useDispatch, useSelector } from "react-redux";
import { MatchAuthority } from "helpers/MatchAuthority";
import {
  representative,
  representativeState,
  resetRepresentative,
} from "store/reducers/representative/representativeReducer";
import RepresentativeChoose from "./representativeChoose/RepresentativeChoose";
import RepresentativeCheque from "./representativeCheque/RepresentativeCheque";
import Classes from "views/representative/styles/Representative.module.scss";

const Representative = () => {
  const dispatch = useDispatch();
  const userInfoData = useSelector((state) => state.userInfo.value);
  const representativeData = useSelector(representativeState);
  const { permissions } = representativeData;

  useEffect(() => {
    return () => dispatch(resetRepresentative());
  }, []);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        representative({
          permissions: {
            edit:
              MatchAuthority(
                userInfoData.authorities,
                "Get:/api/bo/pichak/superagent/account/{accountNumber}/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/pichak/superagent/identification-code/{identificationCode}/v1"
              ),
            view: MatchAuthority(
              userInfoData.authorities,
              "Get:/api/bo/pichak/superagent/account/{accountNumber}/v1"
            ),
            create:
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/agent/customerInquiry/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/agent/add/v1"
              ),
            viewSetting:
              MatchAuthority(
                userInfoData.authorities,
                "Get:/api/bo/agent/{accountNumber}/get/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Get:/api/bo/agent/{accountNumber}/get-signer/v1"
              ),
            delete: MatchAuthority(
              userInfoData.authorities,
              "Put:/api/bo/agent/delete/v1"
            ),
          },
        })
      );
    } else {
      dispatch(
        representative({
          permissions: {
            view: true,
            edit: true,
            create: true,
            viewSetting: true,
            delete: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  const items = [
    {
      label: Dictionary.select + " " + Dictionary.representative,
      key: "item-10",
      children: <RepresentativeChoose />,
    },
    {
      label: Dictionary.representativeCheque,
      key: "item-20",
      children: <RepresentativeCheque />,
    },
  ];

  return (
    <div>
      <HeaderPage
        title={Dictionary.representative + " " + Dictionary.account}
      />
      {permissions.view && permissions.viewSetting && (
        <TabsBar items={items} className={Classes["tabs"]} />
      )}
      {permissions.view && !permissions.viewSetting && (
        <>
          <p>{Dictionary.representativeCheque} </p>
          <RepresentativeCheque />
        </>
      )}
      {!permissions.view && permissions.viewSetting && (
        <>
          <p>{Dictionary.select + " " + Dictionary.representative}</p>
          <RepresentativeChoose />
        </>
      )}
    </div>
  );
};
export default Representative;
