import React, { useEffect } from "react";
import { Steps } from "antd";
import Dictionary from "helpers/Dictionary";
import Queries from "../pageComponents/Queries";
import Uploads from "../pageComponents/Uploads";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Information from "../pageComponents/Information";
import { MatchAuthority } from "helpers/MatchAuthority";
import Classes from "../styles/AddCreditHub.module.scss";
import HeaderPage from "components/headerPage/HeaderPage";
import { userInfoState } from "store/reducers/userInfo/UserInfoReducer";
import {
  creditHub,
  creditHubState,
} from "store/reducers/creditHub/creditHubReducer";

const AddCreditHub = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const userInfoData = useSelector(userInfoState);
  const creditHubData = useSelector(creditHubState);
  const { step } = creditHubData;
  const { Step } = Steps;

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

  const steps = [
    { title: Dictionary.registerInformation, content: <Information /> },
    { title: Dictionary.validation, content: <Queries /> },
    {
      title: Dictionary.upload + " " + Dictionary.documents,
      content: <Uploads />,
    },
  ];

  return (
    <div>
      <HeaderPage
        title={
          searchParams.get("reference")
            ? Dictionary.edit + " " + Dictionary.creditHub
            : Dictionary.add + " " + Dictionary.creditHub
        }
        back={"/loan/credit-hub"}
      />
      <Steps
        className={Classes["register-steps-header"]}
        current={step}
        labelPlacement="vertical"
      >
        {steps.map((item, index) => (
          <Step key={index} title={item.title} />
        ))}
      </Steps>
      <div className={Classes["steps-content"]}>{steps[step].content}</div>
    </div>
  );
};

export default AddCreditHub;
