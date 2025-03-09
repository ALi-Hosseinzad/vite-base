import React, { lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Layout from "container/Layout";
import ProtectedRoutes from "./ProtectedRoutes";
import { useSelector } from "react-redux";

const Index = lazy(() => import("views/home/Home"));
const ListCards = lazy(() => import("views/listCards/ListCards"));
const Banks = lazy(() => import("views/banks/Banks"));
const AssignCard = lazy(() => import("views/assignCard/AssignCard"));
const Customer = lazy(() => import("views/customer/Customer"));
const Account = lazy(() => import("views/account/Account"));
const Branches = lazy(() => import("views/branches/Branches"));
const Charity = lazy(() => import("views/charity/Charity"));
const Login = lazy(() => import("views/login/Login"));
const Missing = lazy(() => import("views/missing/Missing"));
const CustomerLimit = lazy(() => import("views/limitation/CustomerLimit"));
const AccountLimit = lazy(() => import("views/limitation/AccountLimit"));
const VersionsControl = lazy(() =>
  import("views/versionControl/VersionsControl")
);
const AppVersions = lazy(() => import("views/appVersion/AppVersions"));
const OpenAccount = lazy(() => import("views/openAccount/OpenAccount"));
const RegisterForget = lazy(() =>
  import("views/registerAndForget/RegisterForget")
);
const ForceChangePassword = lazy(() =>
  import("views/forceChangePassword/ForceChangePassword")
);
const Users = lazy(() => import("views/users/Users"));
const Groups = lazy(() => import("views/groups/Groups"));
const Roles = lazy(() => import("views/roles/Roles"));
const ReferralBranchCode = lazy(() =>
  import("views/referralBranchCode/ReferralBranchCode")
);
const HistoryOpenAccount = lazy(() =>
  import("views/openAccount/pageComponent/HistoryOpenAccount")
);
const BlackList = lazy(() => import("views/blackList/BlackList"));
const Expression = lazy(() => import("views/expression/Expression"));
const VersionHistory = lazy(() =>
  import("views/versionHistory/VersionHistory")
);
const ManageMenu = lazy(() => import("views/manageMenu/ManageMenu"));
const PayaSatnaPol = lazy(() => import("views/payaSatnaPol/PayaSatnaPol"));
const ArchiveRegistrationAuthentications = lazy(() =>
  import(
    "views/registerAndForget/pageComponent/ArchiveRegistrationAuthentications"
  )
);
const CustomerServices = lazy(() =>
  import("views/customerServices/CustomerServices")
);
const Services = lazy(() => import("views/servicesManagement/Services"));
const Ticketing = lazy(() => import("views/ticketing/Ticketing"));
const Specification = lazy(() => import("views/specification/Specification"));
const HamAfarin = lazy(() => import("views/hamAfarin/HamAfarin"));
const HamAfarinNulls = lazy(() => import("views/hamAfarin/HamAfarinNulls"));
const SearchBasedOnAccountNumber = lazy(() =>
  import("views/searchBasedOnAccountNumber/SearchBasedOnAccountNumber")
);
const representative = lazy(() =>
  import("views/representative/Representative")
);
const UpdateAccounts = lazy(() => import("views/hamAfarin/UpdateAccounts"));
const ServiceCall = lazy(() => import("views/serviceCall/ServiceCall"));
const Loan = lazy(() => import("views/loan/Loan"));
const MarriageLoanDetails = lazy(() =>
  import("views/loan/pages/MarriageLoanDetails/MarriageLoanDetails")
);
const ChildbearingLoanDetails = lazy(() =>
  import("views/loan/pages/ChildbearingLoanDetails/ChildbearingLoanDetails")
);
const RejectedLoans = lazy(() =>
  import("views/loan/pages/RejectedLoan/RejectedLoan")
);
const LoanUploadFile = lazy(() =>
  import("views/loanUploadFile/LoanUploadFile")
);
const Companies = lazy(() => import("views/companies/Companies"));
const AccountingDocuments = lazy(() =>
  import("views/accountingDocuments/AccountingDocuments")
);
const Turnover = lazy(() => import("views/turnover/Turnover"));
const ManageWallet = lazy(() => import("views/manageWallet/ManageWallet"));
const TranType = lazy(() => import("views/tranType/TranType"));
const WalletType = lazy(() => import("views/walletType/WalletType"));
const ServicesFee = lazy(() => import("views/fee/Fee"));
const AppSettings = lazy(() => import("views/appSettings/AppSettings"));
const CreditHub = lazy(() => import("views/creditHub/CreditHub"));
const AddCreditHub = lazy(() => import("views/creditHub/pages/AddCreditHub"));
const ViewCreditHub = lazy(() => import("views/creditHub/pages/ViewCreditHub"));
const MainRouter = () => {
  const userInfoData = useSelector((state) => state.userInfo.value);

  const accessRole = (path) => {
    return (
      userInfoData.list_role_menu?.has(path) ||
      userInfoData.username?.toLowerCase() === "admin"
    );
  };

  const routesList = [
    {
      path: "/account/account-manager",
      element: Account,
      accessRole: accessRole("/account/account-manager"),
    },
    {
      path: "/service-call",
      element: ServiceCall,
      accessRole: accessRole("/service-call"),
    },
    {
      path: "/customer/customer-manager",
      element: Customer,
      accessRole: accessRole("/customer/customer-manager"),
    },
    {
      path: "/customer/referral-branch-code",
      element: ReferralBranchCode,
      accessRole: accessRole("/customer/referral-branch-code"),
    },
    {
      path: "/customer/customer-services",
      element: CustomerServices,
      accessRole: accessRole("/customer/customer-services"),
    },
    {
      path: "/card/list-cards",
      element: ListCards,
      accessRole: accessRole("/card/list-cards"),
    },
    {
      path: "/card/assign-card-to-customer",
      element: AssignCard,
      accessRole: accessRole("/card/assign-card-to-customer"),
    },
    {
      path: "/basic-data/banks",
      element: Banks,
      accessRole: accessRole("/basic-data/banks"),
    },
    {
      path: "/basic-data/branches",
      element: Branches,
      accessRole: accessRole("/basic-data/branches"),
    },

    {
      path: "/basic-data/charity",
      element: Charity,
      accessRole: accessRole("/basic-data/charity"),
    },
    {
      path: "/basic-data/app-versions",
      element: VersionsControl,
      accessRole: accessRole("/basic-data/app-versions"),
    },
    {
      path: "/basic-data/app-releases",
      element: AppVersions,
      accessRole: accessRole("/basic-data/app-releases"),
    },
    {
      path: "/basic-data/app-versions/version-history",
      element: VersionHistory,
      accessRole: accessRole("/basic-data/app-versions/version-history"),
    },
    {
      path: "/basic-data/satna-paya",
      element: PayaSatnaPol,
      accessRole: accessRole("/basic-data/satna-paya"),
    },
    {
      path: "/basic-data/expressions",
      element: Expression,
      accessRole: accessRole("/basic-data/expressions"),
    },
    {
      path: "/basic-data/specification",
      element: Specification,
      accessRole: accessRole("/basic-data/specification"),
    },
    {
      path: "/basic-data/services-fee",
      element: ServicesFee,
      accessRole: accessRole("/basic-data/services-fee"),
    },
    {
      path: "/basic-data/app-settings",
      element: AppSettings,
      accessRole: accessRole("/basic-data/app-settings"),
    },
    {
      path: "/users-manager",
      element: Users,
      accessRole: accessRole("/users-manager"),
    },
    {
      path: "/limitation/customer-limit",
      element: CustomerLimit,
      accessRole: accessRole("/limitation/customer-limit"),
    },
    {
      path: "/limitation/account-limit",
      element: AccountLimit,
      accessRole: accessRole("/limitation/account-limit"),
    },
    {
      path: "/authentication/open-account",
      element: OpenAccount,
      accessRole: accessRole("/authentication/open-account"),
    },
    {
      path: "/authentication/open-account/history-open-account",
      element: HistoryOpenAccount,
      accessRole: accessRole("/authentication/open-account"),
    },
    {
      path: "/authentication/register-forget",
      element: RegisterForget,
      accessRole: accessRole("/authentication/register-forget"),
    },
    {
      path: "/authentication/register-forget/archive-registration-authentications",
      element: ArchiveRegistrationAuthentications,
      accessRole: accessRole("/authentication/register-forget"),
    },
    {
      path: "/authentication/blacklist",
      element: BlackList,
      accessRole: accessRole("/authentication/blacklist"),
    },
    {
      path: "/access/groups",
      element: Groups,
      accessRole: accessRole("/access/groups"),
    },
    {
      path: "/access/roles",
      element: Roles,
      accessRole: accessRole("/access/roles"),
    },
    {
      path: "/menu-manager/authenticated-menu",
      element: ManageMenu,
      accessRole: accessRole("/menu-manager/authenticated-menu"),
    },
    {
      path: "/menu-manager/anonymous-menu",
      element: ManageMenu,
      accessRole: accessRole("/menu-manager/anonymous-menu"),
    },
    {
      path: "/services-manager/authenticated-services",
      element: Services,
      accessRole: accessRole("/services-manager/authenticated-services"),
    },
    {
      path: "/services-manager/anonymous-services",
      element: Services,
      accessRole: accessRole("/services-manager/anonymous-services"),
    },
    {
      path: "/ticket-list",
      element: Ticketing,
      accessRole: accessRole("/ticket-list"),
    },
    {
      path: "/closed-tickets",
      element: Ticketing,
      accessRole: accessRole("/ticket-list"),
    },
    {
      path: "/hamafarin",
      element: HamAfarin,
      accessRole:
        userInfoData.username?.toLowerCase() === "admin" ? true : false,
    },
    {
      path: "/hamafarin-nulls",
      element: HamAfarinNulls,
      accessRole:
        userInfoData.username?.toLowerCase() === "admin" ? true : false,
    },
    {
      path: "/update-accounts-status",
      element: UpdateAccounts,
      accessRole:
        userInfoData.username?.toLowerCase() === "admin" ? true : false,
    },
    {
      path: "/account/search-based-on-account-number",
      element: SearchBasedOnAccountNumber,
      accessRole: accessRole("/account/search-based-on-account-number"),
    },
    {
      path: "/account/representative",
      element: representative,
      accessRole: accessRole("/account/representative"),
    },
    {
      path: "/loan/supportance-loan",
      element: Loan,
      accessRole: accessRole("/loan/supportance-loan"),
    },
    {
      path: "/loan/file-upload-loan",
      element: LoanUploadFile,
      accessRole: accessRole("/loan/file-upload-loan"),
    },
    {
      path: "/loan/supportance-loan/marriage-loan-details",
      element: MarriageLoanDetails,
      accessRole: accessRole("/loan/supportance-loan"),
    },
    {
      path: "/loan/supportance-loan/childbearing-loan-details",
      element: ChildbearingLoanDetails,
      accessRole: accessRole("/loan/supportance-loan"),
    },
    {
      path: "/loan/supportance-loan/rejected-loans",
      element: RejectedLoans,
      accessRole: accessRole("/loan/supportance-loan"),
    },
    {
      path: "/loan/companies",
      element: Companies,
      accessRole: accessRole("/loan/companies"),
    },
    {
      path: "/manage-gl",
      element: AccountingDocuments,
      accessRole: accessRole("/manage-gl"),
    },
    {
      path: "/manage-gl/turnover",
      element: Turnover,
      accessRole: accessRole("/manage-gl"),
    },
    {
      path: "/wallet/manage",
      element: ManageWallet,
      accessRole: accessRole("/wallet/manage"),
    },
    {
      path: "/wallet/tran-type",
      element: TranType,
      accessRole: accessRole("/wallet/tran-type"),
    },
    {
      path: "/wallet/wallet-type",
      element: WalletType,
      accessRole: accessRole("/wallet/wallet-type"),
    },
    {
      path: "/loan/credit-hub",
      element: CreditHub,
      accessRole: accessRole("/loan/credit-hub"),
    },
    {
      path: "/loan/credit-hub/add",
      element: AddCreditHub,
      accessRole: accessRole("/loan/credit-hub"),
    },
    {
      path: "/loan/credit-hub/view",
      element: ViewCreditHub,
      accessRole: accessRole("/loan/credit-hub"),
    },
  ];

  return (
    <Routes>
      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        {routesList.map((item) =>
          item.children ? (
            <Route
              path={item.path}
              element={
                <ProtectedRoutes roles={item.accessRole} key={item.path} />
              }
            >
              {item.children?.map((route) => (
                <Route
                  path={route.path}
                  element={<route.element />}
                  key={route.path}
                />
              ))}
            </Route>
          ) : (
            <Route
              path={item.path}
              key={item.path}
              element={
                <ProtectedRoutes roles={item.accessRole}>
                  <item.element />
                </ProtectedRoutes>
              }
            />
          )
        )}
        <Route path="/home" element={<Index />} />
      </Route>
      <Route path="/" element={<Login />} />
      <Route path="/force-change-password" element={<ForceChangePassword />} />
      <Route path="*" element={<Missing />} />
    </Routes>
  );
};

export default MainRouter;
