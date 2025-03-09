import React, { useEffect } from "react";
import HeaderPage from "components/headerPage/HeaderPage";
import Dictionary from "helpers/Dictionary";
import TabsBar from "components/tabsBar/TabsBar";
import { useDispatch, useSelector } from "react-redux";
import { MatchAuthority } from "helpers/MatchAuthority";
import { loan, loanState, resetLoan } from "store/reducers/loan/LoanReducer";
import Classes from "views/loan/styles/Loan.module.scss";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import MarriageLoan from "./pages/MarriageLoan/MarriageLoan";
import { userInfoState } from "store/reducers/userInfo/UserInfoReducer";
import ChildbearingLoan from "./pages/ChildbearingLoan/ChildbearingLoan";
import { useNavigate, useSearchParams } from "react-router-dom";

const Loan = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfoData = useSelector(userInfoState);
  const loanData = useSelector(loanState);
  const { permissions } = loanData;
  const [searchParams] = useSearchParams();

  useEffect(() => {
    return () => {
      dispatch(resetLoan());
    };
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
            viewChildbearing: true,
            viewChildbearingDetails: true,
            editMarriage: true,
            editChildbearing: true,
            deleteDocumentMarriage: true,
            deleteDocumentChildBearing: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  const items = [
    {
      label: Dictionary.loan + " " + Dictionary.marriage,
      key: "marriage",
      children: <MarriageLoan />,
    },
    {
      label: Dictionary.loan + " " + Dictionary.childbearing,
      key: "childbearing",
      children: <ChildbearingLoan />,
    },
  ];

  const handleShowRejectedFiles = () => {
    if (permissions.viewMarriage || permissions.viewChildbearing) {
      navigate("/loan/supportance-loan/rejected-loans");
    } else {
      dispatch(
        setNotificationData({
          message: Dictionary.accessPage,
          type: "error",
          time: 5000,
        })
      );
    }
  };

  const onChangeTab = (key) => {
    dispatch(loan({ activeTab: key }));
  };

  return (
    <div>
      {permissions.viewMarriage && permissions.viewChildbearing && (
        <>
          <HeaderPage
            title={Dictionary.loan + " " + Dictionary.supportance}
            onClick={handleShowRejectedFiles}
            buttonText={
              (permissions.viewMarriage || permissions.viewChildbearing) &&
              Dictionary.rejectedFiles
            }
            addIcon={false}
          />
          <TabsBar
            items={items}
            className={Classes["tabs"]}
            onChange={onChangeTab}
            defaultActiveKey={searchParams.get("activeKey")}
          />
        </>
      )}
      {permissions.viewMarriage && !permissions.viewChildbearing && (
        <>
          <HeaderPage
            title={
              Dictionary.loan +
              " " +
              Dictionary.supportance +
              " " +
              Dictionary.marriage
            }
            onClick={handleShowRejectedFiles}
            buttonText={
              permissions.viewMarriage &&
              Dictionary.rejectedFiles + " " + Dictionary.marriage
            }
            addIcon={false}
          />
          <MarriageLoan />
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
            onClick={handleShowRejectedFiles}
            buttonText={
              permissions.viewChildbearing &&
              Dictionary.rejectedFiles + " " + Dictionary.childbearing
            }
            addIcon={false}
          />
          <ChildbearingLoan />
        </>
      )}
    </div>
  );
};
export default Loan;
