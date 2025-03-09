import React, { useEffect } from "react";
import Dictionary from "helpers/Dictionary";
import TabsBar from "components/tabsBar/TabsBar";
import { useDispatch, useSelector } from "react-redux";
import { loan } from "store/reducers/loan/LoanReducer";
import { MatchAuthority } from "helpers/MatchAuthority";
import Classes from "views/loan/styles/Loan.module.scss";
import HeaderPage from "components/headerPage/HeaderPage";
import { createSearchParams, useNavigate } from "react-router-dom";
import { userInfoState } from "store/reducers/userInfo/UserInfoReducer";
import { resetMarriageLoanRecord } from "store/reducers/loan/MarriageLoanReducer";
import MarriageLoanDetailsSpouseInfo from "../MarriageLoanDetailsSpouseInfo/MarriageLoanDetailsSpouseInfo";
import MarriageLoanDetailsApplicantInfo from "../MarriageLoanDetailsApplicantInfo/MarriageLoanDetailsApplicantInfo";
import MarriageLoanDetailsGuarantorInfo from "../MarriageLoanDetailsGuarantorInfo/MarriageLoanDetailsGuarantorInfo";
import MarriageLoanDetailsSupplementaryInfo from "../MarriageLoanDetailsSupplementaryInfo/MarriageLoanDetailsSupplementaryInfo";

const MarriageLoanDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfoData = useSelector(userInfoState);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        loan({
          permissions: {
            viewMarriage: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/withholding-loan/auth/search/v1"
            ),
            viewMarriageDetails:
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/withholding-loan/auth/marriage-loan-guarantor-info/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/withholding-loan/auth/marriage-loan-spouse-info/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/withholding-loan/auth/marriage-loan-supplementary-info/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/withholding-loan/auth/marriage-download-documents/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/withholding-loan/auth/marriage-loan-customer-info/v1"
              ),
            editMarriage:
              MatchAuthority(
                userInfoData.authorities,
                "Get:/api/bo/withholding-loan/auth/marriage-loan-get-status/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/withholding-loan/auth/marriage-loan-change-status/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/withholding-loan/auth/marriage-loan-upload-documents/v1"
              ),
            viewChildbearing: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/withholding-loan/childbearing/search/v1"
            ),
            viewChildbearingDetails:
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/withholding-loan/childbearing/guarantor-info/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/withholding-loan/childbearing/supplementary-info/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/withholding-loan/childbearing/download-documents/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/withholding-loan/childbearing/customer-info/v1"
              ),
            editChildbearing:
              MatchAuthority(
                userInfoData.authorities,
                "Get:/api/bo/withholding-loan/auth/marriage-loan-get-status/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/withholding-loan/childbearing/change-status/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/withholding-loan/childbearing/upload-documents/v1"
              ),
            deleteDocumentMarriage: MatchAuthority(
              userInfoData.authorities,
              "Delete:/api/bo/withholding-loan/auth/marriage-delete-documents/v1"
            ),
            deleteDocumentChildBearing: MatchAuthority(
              userInfoData.authorities,
              "Delete:/api/bo/withholding-loan/childbearing/delete-documents/v1"
            ),
          },
        })
      );
    } else {
      dispatch(
        loan({
          permissions: {
            viewMarriage: true,
            editMarriage: true,
            viewChildbearing: true,
            editChildbearing: true,
            viewMarriageDetails: true,
            deleteDocumentMarriage: true,
            viewChildbearingDetails: true,
            deleteDocumentChildBearing: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  const items = [
    {
      label: Dictionary.firstInfo + " " + Dictionary.applicant,
      key: "item-101",
      children: <MarriageLoanDetailsApplicantInfo />,
    },
    {
      label: Dictionary.firstInfo + " " + Dictionary.spouse,
      key: "item-102",
      children: <MarriageLoanDetailsSpouseInfo />,
    },
    {
      label: Dictionary.firstInfo + " " + Dictionary.guarantor,
      key: "item-103",
      children: <MarriageLoanDetailsGuarantorInfo />,
    },
    {
      label: Dictionary.supplementaryInfo,
      key: "item-104",
      children: <MarriageLoanDetailsSupplementaryInfo />,
    },
  ];

  const onCancel = () => {
    dispatch(resetMarriageLoanRecord());
    navigate({
      pathname: "/loan/supportance-loan",
      search: createSearchParams({ activeKey: "marriage" }).toString(),
    });
  };

  return (
    <>
      <HeaderPage
        title={
          Dictionary.details + " " + Dictionary.file + " " + Dictionary.marriage
        }
        onClickBack={onCancel}
        addIcon={false}
      />
      <TabsBar items={items} className={Classes["tabs"]} />
    </>
  );
};
export default MarriageLoanDetails;
