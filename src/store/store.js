import { enableMapSet } from "immer";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import toastDataReducer from "store/reducers/toast/toastReducer";
import listCardsReducer from "store/reducers/listCards/listCardsReducer";
import listCustomersReducer from "store/reducers/listCustomers/listCustomersReducer";
import listBanksReducer from "store/reducers/listBanks/listBanksReducer";
import listBranchesReducer from "store/reducers/listBranches/listBranchesReducer";
import charitiesReducer from "store/reducers/charity/charityReducer";
import addNewCardsReducer from "store/reducers/addNewCards/addNewCardsReducer";
import limitationReducer from "store/reducers/limitation/limitationReducer";
import versionsReducer from "store/reducers/versions/versionsReducer";
import versionHistoryReducer from "store/reducers/versionHistory/versionHistoryReducer";
import registerForgetReducer from "store/reducers/registerForget/registerForgetReducer";
import usersReducer from "store/reducers/users/UsersReducer";
import openAccountReducer from "store/reducers/openAccount/openAccountReducer";
import groupsReducer from "store/reducers/groups/groupsReducer";
import accountReducer from "store/reducers/account/accountReducer";
import rolesReducer from "store/reducers/roles/rolesReducer";
import userInfoReducer from "store/reducers/userInfo/UserInfoReducer";
import branchCustomersReducer from "store/reducers/branchCustomers/BranchCustomers";
import timeOutReducer from "store/reducers/timeOut/timeOutReducer";
import historyOpenAccountReducer from "store/reducers/historyOpenAccount/historyOpenAccountReducer";
import blacklistReducer from "store/reducers/blacklist/blacklistReducer";
import expressionReducer from "store/reducers/expression/expressionReducer";
import manageMenuReducer from "store/reducers/manageMenu/manageMenuReducer";
import PayaSatnaPolReducer from "store/reducers/payaSatnaPol/PayaSatnaPolReducer";
import archiveRegistrationAuthenticationsReducer from "store/reducers/archiveRegistrationAuthentications/ArchiveRegistrationAuthenticationsReducer";
import servicesReducer from "store/reducers/servicesManagement/servicesReducer";
import customerServiceReducer from "store/reducers/customerServices/customerServiceReducer";
import ticketingReducer from "store/reducers/ticketing/ticketingReducer";
import specificationReducer from "store/reducers/specification/specificationReducer";
import SearchBasedOnAccountNumberReducer from "store/reducers/searchBasedOnAccountNumber/SearchBasedOnAccountNumberReducer";
import representativeReducer from "store/reducers/representative/representativeReducer";
import RejectedLoanReducer from "store/reducers/loan/RejectedLoanReducer";
import companiesReducer from "store/reducers/companies/companiesReducer";
import LoanReducer from "store/reducers/loan/LoanReducer";
import LoanUploadFileReducer from "store/reducers/loan/LoanUploadFileReducer";
import MarriageLoanReducer from "store/reducers/loan/MarriageLoanReducer";
import ChildbearingLoanReducer from "store/reducers/loan/ChildbearingLoanReducer";
import AccountingDocumentsReducer from "store/reducers/accountingDocuments/AccountingDocumentsReducer";
import TurnoverReducer from "store/reducers/accountingDocuments/TurnoverReducer";
import WalletTypeReducer from "store/reducers/walletType/WalletTypeReducer";
import ManageWalletReducer from "store/reducers/manageWallet/ManageWalletReducer";
import TranTypesReducer from "store/reducers/tranTypes/TranTypesReducer";
import FeeReducer from "store/reducers/fee/FeeReducer";
import AppSettingsReducer from "store/reducers/appSettings/AppSettingsReducer";
import creditHubReducer from "store/reducers/creditHub/creditHubReducer";

enableMapSet();

const appReducer = combineReducers({
  account: accountReducer,
  listCards: listCardsReducer,
  openAccount: openAccountReducer,
  users: usersReducer,
  toastData: toastDataReducer,
  listCustomers: listCustomersReducer,
  listBanks: listBanksReducer,
  listBranches: listBranchesReducer,
  charities: charitiesReducer,
  limitation: limitationReducer,
  versions: versionsReducer,
  registerForget: registerForgetReducer,
  addNewCards: addNewCardsReducer,
  groups: groupsReducer,
  roles: rolesReducer,
  userInfo: userInfoReducer,
  branchCustomers: branchCustomersReducer,
  timeOut: timeOutReducer,
  expression: expressionReducer,
  versionHistory: versionHistoryReducer,
  historyOpenAccount: historyOpenAccountReducer,
  blacklist: blacklistReducer,
  manageMenu: manageMenuReducer,
  payaSatnaPol: PayaSatnaPolReducer,
  archiveRegistrationAuthentications: archiveRegistrationAuthenticationsReducer,
  services: servicesReducer,
  customerService: customerServiceReducer,
  ticketing: ticketingReducer,
  specification: specificationReducer,
  searchBasedOnAccountNumber: SearchBasedOnAccountNumberReducer,
  marriageLoan: MarriageLoanReducer,
  loan: LoanReducer,
  representative: representativeReducer,
  rejectedLoan: RejectedLoanReducer,
  loanUploadFile: LoanUploadFileReducer,
  companies: companiesReducer,
  childbearingLoan: ChildbearingLoanReducer,
  accountingDocuments: AccountingDocumentsReducer,
  turnover: TurnoverReducer,
  walletType: WalletTypeReducer,
  manageWallet: ManageWalletReducer,
  tranTypes: TranTypesReducer,
  fee: FeeReducer,
  appSettings: AppSettingsReducer,
  creditHub: creditHubReducer,
});

const rootReducer = (state, action) => {
  if (action.type.includes("resetReducers")) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
