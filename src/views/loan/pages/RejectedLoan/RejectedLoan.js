import React, { useEffect } from "react";
import HeaderPage from "components/headerPage/HeaderPage";
import Dictionary from "helpers/Dictionary";
import TabsBar from "components/tabsBar/TabsBar";
import { useDispatch, useSelector } from "react-redux";
import { loan, loanState } from "store/reducers/loan/LoanReducer";
import Classes from "views/loan/styles/Loan.module.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userInfoState } from "store/reducers/userInfo/UserInfoReducer";
import { MatchAuthority } from "helpers/MatchAuthority";
import { resetRejectedLoan } from "store/reducers/loan/RejectedLoanReducer";
import RejectedMarriageLoan from "../RejectedMarriageLoan/RejectedMarriageLoan";
import RejectedChildbearingLoan from "../RejectedChildbearingLoan/RejectedChildbearingLoan";

const RejectedLoan = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loanData = useSelector(loanState);
  const [searchParams] = useSearchParams();
  const userInfoData = useSelector(userInfoState);
  const { permissions } = loanData;

  useEffect(() => {
    return () => dispatch(resetRejectedLoan());
  }, []);

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
            viewMarriageDetails: true,
            editMarriage: true,
            viewChildbearing: true,
            viewChildbearingDetails: true,
            editChildbearing: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  const items = [
    {
      label: Dictionary.loan + " " + Dictionary.marriage,
      key: "rejected-marriage",
      children: <RejectedMarriageLoan />,
    },
    {
      label: Dictionary.loan + " " + Dictionary.childbearing,
      key: "rejected-childBearing",
      children: <RejectedChildbearingLoan />,
    },
  ];

  const handleBackToLoan = () => {
    dispatch(resetRejectedLoan());
    navigate("/loan/supportance-loan");
  };

  return (
    <div>
      {permissions.viewMarriage && permissions.viewChildbearing && (
        <>
          <HeaderPage
            title={Dictionary.rejectedFiles}
            onClickBack={handleBackToLoan}
            addIcon={false}
          />
          <TabsBar
            items={items}
            className={Classes["tabs"]}
            defaultActiveKey={searchParams.get("activeKey")}
          />
        </>
      )}
      {permissions.viewMarriage && !permissions.viewChildbearing && (
        <>
          <HeaderPage
            title={Dictionary.rejectedFiles + " " + Dictionary.marriage}
            onClickBack={handleBackToLoan}
            addIcon={false}
          />
          <RejectedMarriageLoan />
        </>
      )}
      {!permissions.viewMarriage && permissions.viewChildbearing && (
        <>
          <HeaderPage
            title={
              Dictionary.loan +
              " " +
              Dictionary.supportance +
              " " +
              Dictionary.childbearing
            }
            onClickBack={handleBackToLoan}
            addIcon={false}
          />
          <RejectedChildbearingLoan />
        </>
      )}
    </div>
  );
};
export default RejectedLoan;
