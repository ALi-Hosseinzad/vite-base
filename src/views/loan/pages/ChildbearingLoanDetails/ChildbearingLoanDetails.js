import React, { useEffect } from "react";
import HeaderPage from "components/headerPage/HeaderPage";
import Dictionary from "helpers/Dictionary";
import TabsBar from "components/tabsBar/TabsBar";
import Classes from "views/loan/styles/Loan.module.scss";
import ChildbearingLoanDetailsApplicantInfo from "../ChildbearingLoanDetailsApplicantInfo/ChildbearingLoanDetailsApplicantInfo";
import ChildbearingLoanDetailsGuarantorInfo from "../ChildbearingLoanDetailsGuarantorInfo/ChildbearingLoanDetailsGuarantorInfo";
import ChildbearingLoanDetailsSupplementaryInfo from "../ChildbearingLoanDetailsSupplementaryInfo/ChildbearingLoanDetailsSupplementaryInfo";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useNavigate } from "react-router-dom";
import { resetChildbearingLoanRecord } from "store/reducers/loan/ChildbearingLoanReducer";
import { loan } from "store/reducers/loan/LoanReducer";
import { userInfoState } from "store/reducers/userInfo/UserInfoReducer";
import { MatchAuthority } from "helpers/MatchAuthority";

const ChildbearingLoanDetails = () => {
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
      label:
        Dictionary.firstInfo +
        " " +
        Dictionary.child +
        " و " +
        Dictionary.applicant,
      key: "item-10",
      children: <ChildbearingLoanDetailsApplicantInfo />,
    },
    {
      label: Dictionary.firstInfo + " " + Dictionary.guarantor,
      key: "item-11",
      children: <ChildbearingLoanDetailsGuarantorInfo />,
    },
    {
      label: Dictionary.supplementaryInfo,
      key: "item-12",
      children: <ChildbearingLoanDetailsSupplementaryInfo />,
    },
  ];

  const onCancel = () => {
    dispatch(resetChildbearingLoanRecord());
    navigate({
      pathname: "/loan/supportance-loan",
      search: createSearchParams({ activeKey: "childbearing" }).toString(),
    });
  };

  return (
    <>
      <HeaderPage
        title={
          Dictionary.details +
          " " +
          Dictionary.file +
          " " +
          Dictionary.childbearing
        }
        onClickBack={onCancel}
        addIcon={false}
      />
      <TabsBar items={items} className={Classes["tabs"]} />
    </>
  );
};
export default ChildbearingLoanDetails;
