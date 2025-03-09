import React, { useEffect } from "react";
import Dictionary from "helpers/Dictionary";
import Detail from "../pageComponents/Detail";
import TabsBar from "components/tabsBar/TabsBar";
import { errorResponse } from "helpers/APIService";
import { useSearchParams } from "react-router-dom";
import useErrorHandler from "helpers/useErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import { MatchAuthority } from "helpers/MatchAuthority";
import { getDetailCreditHub } from "helpers/APIFunction";
import Classes from "../styles/viewCreditHub.module.scss";
import HeaderPage from "components/headerPage/HeaderPage";
import ConfirmBranch from "../pageComponents/ConfirmBranch";
import { userInfoState } from "store/reducers/userInfo/UserInfoReducer";
import {
  creditHub,
  creditHubState,
} from "store/reducers/creditHub/creditHubReducer";

const ViewCreditHub = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const [searchParams] = useSearchParams();
  const userInfoData = useSelector(userInfoState);
  const creditHubData = useSelector(creditHubState);
  const { activeTab, permissions, details } = creditHubData;

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        creditHub({
          permissions: {
            view:
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/request-list/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/details/v1"
              ),
            edit:
              MatchAuthority(
                userInfoData.authorities,
                "Get:/api/bo/credit-hub/reagents/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/inquiry-sama/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/inquiry-grade/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/register-info/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/change-status/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/inquiry-samat/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/upload-documents/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Delete:/api/bo/credit-hub/delete-documents/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/inquiry-judicial-order/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/non-mandatory-inquiries/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/credit-hub/inquiry-military-service-using/v1"
              ),
            addAssurance: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/credit-hub/add-assurance/v1"
            ),
          },
        })
      );
    } else {
      dispatch(
        creditHub({
          permissions: { view: true, edit: true, addAssurance: true },
        })
      );
    }
  }, [userInfoData.authorities]);

  const items = [
    {
      label: Dictionary.details,
      key: "details",
      children: <Detail />,
      condition: permissions.view,
    },
    {
      label: Dictionary.add + " " + Dictionary.assurance,
      key: "confirm-branch",
      children: <ConfirmBranch />,
      condition:
        (permissions.addAssurance &&
          details?.backoffice_status === "SENT_TO_BRANCH") ||
        details?.assurance_list?.length,
    },
  ];

  const onChangeTab = (key) => {
    dispatch(creditHub({ activeTab: key }));
  };

  useEffect(() => {
    getDetailCreditHub({ reference_number: searchParams.get("reference") })
      .then((res) => {
        if (res.data.document_list.length > 0) {
          let convertList = [];
          res.data.document_list?.forEach((element, index) => {
            const convertObj = {
              file: "",
              id: index,
              type: "pdf",
              error: false,
              upload: true,
              loading: false,
              viewImage: true,
              key: element.key,
              name: element.value,
            };
            convertList.push(convertObj);
          });
          dispatch(creditHub({ details: res.data, downloads: convertList }));
        } else {
          dispatch(creditHub({ details: res.data, downloads: [] }));
        }
      })
      .catch(() => errorHandler(errorResponse));
  }, []);

  return (
    <>
      <HeaderPage
        title={Dictionary.details + " " + Dictionary.creditHub}
        back="/loan/credit-hub"
      />
      <TabsBar
        items={items.filter((i) => i.condition)}
        className={Classes["tabs"]}
        onChange={onChangeTab}
        defaultActiveKey={activeTab}
      />
    </>
  );
};

export default ViewCreditHub;
