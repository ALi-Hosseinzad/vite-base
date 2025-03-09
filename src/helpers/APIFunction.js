import MockData from "constants/MockData";
import APIService from "./APIService";
import packageJson from "../../package.json";

const isProduction = process.env.REACT_APP_profile === "development";
// const isProduction = false;
const api = "/api/bo";
const v1 = packageJson.apiVersion;

export const getUsersList = () => {
  if (isProduction) {
    return APIService.post(`${api}/user/search/${packageJson.apiVersion}`, {});
  }
  return MockData.getUsersList();
};
export const getCurrentUser = () => {
  if (isProduction) {
    return APIService.get(`${api}/user/current-user/${packageJson.apiVersion}`);
  }
  return MockData.getCurrentUser();
};
export const logout = () => {
  if (isProduction) {
    return APIService.get(
      `${api}/authentication/logout/${packageJson.apiVersion}`
    );
  }
  return MockData.logout();
};
export const login = (payload) => {
  if (isProduction) {
    return APIService.post(
      `${api}/authentication/backoffice-login/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.login();
};
export const getAllRoles = () => {
  if (isProduction) {
    return APIService.get(`${api}/role/all/${packageJson.apiVersion}`);
  }
  return MockData.getAllRoles;
};
export const getCardsList = (payload) => {
  if (isProduction) {
    return APIService.post(`${api}/raw-cards/issued/search/v2`, payload);
  }
  return MockData.getCardsList();
};
export const getUserInfo = () => {
  if (isProduction) {
    return APIService.get(`${api}/user/info/${packageJson.apiVersion}`);
  }
  return MockData.getUserInfo();
};
export const getAllOpenAccount = (payload) => {
  if (isProduction) {
    return APIService.post(
      `${api}/account/open/authentication/search/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.getAllOpenAccount();
};
export const getUploadedFiles = (params) => {
  if (isProduction) {
    return APIService.getWithoutLoading(
      `${api}/account/open/authentication/download/${packageJson.apiVersion}?documentType=${params.type}&referenceNumber=${params.referenceNumber}&identificationCode=${params.identificationCode}`
    );
  }
  return MockData.getUploadedFiles(params);
};
export const confirmOpeningAccount = (payload) => {
  if (isProduction) {
    return APIService.post(
      `${api}/account/open/authentication/verify/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.confirmOpeningAccount(payload);
};
export const getRegisterAndForget = (payload) => {
  if (isProduction) {
    return APIService.post(
      `${api}/registration/offline-authentication/search/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.getRegisterAndForget(payload);
};
export const getUploadedFilesRegisterForget = (params) => {
  if (isProduction) {
    return APIService.getWithoutLoading(
      `${api}/registration/offline-authentication/download/${packageJson.apiVersion}?identificationCode=${params.identificationCode}&referenceNumber=${params.referenceNumber}&documentType=${params.type}`
    );
  }
  return MockData.getUploadedFilesRegisterForget(params);
};
export const confirmRegisterForget = (payload) => {
  if (isProduction) {
    return APIService.post(
      `${api}/registration/offline-authentication/verify/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.confirmRegisterForget(payload);
};
export const updateRawCard = (payload) => {
  if (isProduction) {
    return APIService.put(
      `${api}/raw-cards/set-invalid/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.updateRawCard(payload);
};
export const printCard = (payload) => {
  if (isProduction) {
    return APIService.post(
      `${api}/raw-cards/send-card/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.printCard(payload);
};
export const getAllUsers = (payload) => {
  if (isProduction) {
    return APIService.post(
      `${api}/user/search/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.getAllUsers();
};
export const setChangePassword = (params) => {
  if (isProduction) {
    return APIService.post(
      `${api}/user/change-password/identification-code/${params}/${packageJson.apiVersion}`,
      {}
    );
  }
  return MockData.setChangePassword();
};
export const unlockUser = (params) => {
  if (isProduction) {
    return APIService.post(
      `${api}/user/unlock/identification-code/${params}/${packageJson.apiVersion}`,
      {}
    );
  }
  return MockData.unlockUser();
};
export const disableUser = (params) => {
  if (isProduction) {
    return APIService.post(
      `${api}/user/disable/identification-code/${params}/${packageJson.apiVersion}`,
      {}
    );
  }
  return MockData.disableUser();
};
export const enableUser = (params) => {
  if (isProduction) {
    return APIService.post(
      `${api}/user/enable/identification-code/${params}/${packageJson.apiVersion}`,
      {}
    );
  }
  return MockData.enableUser();
};
export const changePassword = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/user/change-password/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.changePassword();
};
export const getAccountsList = (params) => {
  if (isProduction) {
    return APIService.get(
      `${api}/account/account-info/${params.identificationCode}/${packageJson.apiVersion}?customerType=${params.customerType}`
    );
  }
  return MockData.getAccountsList();
};
export const addAccountsNumberToAccount = (body) => {
  if (isProduction) {
    return APIService.post(`${api}/account/${packageJson.apiVersion}`, body);
  }
  return MockData.getAccountsNumberToAccount();
};
export const searchCustomers = (payload) => {
  if (isProduction) {
    return APIService.post(
      `${api}/customer/search/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.searchCustomers(payload);
};
export const unlockCustomer = (params) => {
  if (isProduction) {
    return APIService.post(
      `${api}/customer/identification-code/${params}/unlock/${packageJson.apiVersion}`
    );
  }
  return MockData.unlockCustomer(payload);
};
export const enableCustomer = (param) => {
  if (isProduction) {
    return APIService.post(
      `${api}/customer/identification-code/${param}/enable/${packageJson.apiVersion}`
    );
  }
  return MockData.enableCustomer(payload);
};
export const disableCustomer = (param) => {
  if (isProduction) {
    return APIService.post(
      `${api}/customer/identification-code/${param}/disable/${packageJson.apiVersion}`
    );
  }
  return MockData.disableCustomer(payload);
};
export const changeMobile = (param, payload) => {
  if (isProduction) {
    return APIService.put(
      `${api}/customer/identification-code/${param}/mobile/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.changeMobile(payload);
};
export const verifyChangeMobile = (param, payload) => {
  if (isProduction) {
    return APIService.put(
      `${api}/customer/identification-code/${param}/verify-mobile/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.verifyChangeMobile(payload);
};
export const changeUsername = (param, payload) => {
  if (isProduction) {
    return APIService.put(
      `${api}/customer/identification-code/${param}/username/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.changeUsername(payload);
};
export const verifyChangeUsername = (param, payload) => {
  if (isProduction) {
    return APIService.put(
      `${api}/customer/identification-code/${param}/verify-username/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.verifyChangeUsername(payload);
};

export const recoveryPassword = (payload) => {
  if (isProduction) {
    return APIService.put(
      `${api}/customer/recovery-password/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.recoveryPassword(payload);
};

export const VerifyRecoveryPassword = (payload) => {
  if (isProduction) {
    return APIService.put(
      `${api}/customer/verify-recovery-password/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.VerifyRecoveryPassword(payload);
};
export const registration = (payload) => {
  if (isProduction) {
    return APIService.post(
      `${api}/registration/register/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.registration(payload);
};
export const getTrace = () => {
  if (isProduction) {
    return APIService.get(`${api}/trace-id/${packageJson.apiVersion}`);
  }
  return MockData.getTrace();
};
export const verifyRegistrationOtp = (payload) => {
  if (isProduction) {
    return APIService.post(
      `${api}/otp/registration-verify-otp/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.verifyRegistrationOtp(payload);
};
export const defineUsername = (payload) => {
  if (isProduction) {
    return APIService.post(
      `${api}/registration/define-username-password/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.defineUsername(payload);
};
export const getAllAuthority = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/authority/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getAllAuthority();
};
export const addAuthorityGroup = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/authority-group/add/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.addAuthorityGroup();
};
export const getAllAuthorityGroup = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/authority-group/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getAllAuthorityGroup();
};
export const deleteAuthorityGroup = (params) => {
  if (isProduction) {
    return APIService.delete(
      `${api}/authority-group/delete/group-key/${params}/${packageJson.apiVersion}`
    );
  }
  return MockData.deleteAuthorityGroup();
};
export const updateAuthorityGroup = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/authority-group/update/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.updateAuthorityGroup();
};
export const searchAllRoles = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/role/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.searchAllRoles();
};
export const getAllMenu = () => {
  if (isProduction) {
    return APIService.get(`${api}/menu/all/${packageJson.apiVersion}`);
  }
  return MockData.getAllMenu();
};
export const addNewBoRole = (body) => {
  if (isProduction) {
    return APIService.post(`${api}/role/add/${packageJson.apiVersion}`, body);
  }
  return MockData.addNewBoRole();
};
export const updateBoRole = (body) => {
  if (isProduction) {
    return APIService.put(`${api}/role/update/${packageJson.apiVersion}`, body);
  }
  return MockData.updateBoRole();
};
export const deleteRole = (params) => {
  if (isProduction) {
    return APIService.delete(
      `${api}/role/delete/role-key/${params}/${packageJson.apiVersion}`
    );
  }
  return MockData.deleteRole();
};
export const addNewUser = (body) => {
  if (isProduction) {
    return APIService.post(`${api}/user/add/${packageJson.apiVersion}`, body);
  }
  return MockData.addNewUser();
};
export const updateUser = (body) => {
  if (isProduction) {
    return APIService.put(`${api}/user/update/${packageJson.apiVersion}`, body);
  }
  return MockData.updateUser();
};
export const getCardColors = () => {
  if (isProduction) {
    return APIService.get(
      `${api}/account/open/card-colors/${packageJson.apiVersion}`
    );
  }
  return MockData.getCardColors();
};
export const uploadNewCards = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/raw-cards/add/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.uploadNewCards();
};
export const getAllVersions = () => {
  if (isProduction) {
    return APIService.get(`${api}/app-version/all/${packageJson.apiVersion}`);
  }
  return MockData.getAllVersions();
};
export const getAllAppVersions = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/app-release/history/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getAllAppVersions();
};
export const updateVersions = (body) => {
  if (isProduction) {
    return APIService.put(`${api}/app-version/${packageJson.apiVersion}`, body);
  }
  return MockData.updateVersions();
};
export const editVersions = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/app-release/edit/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.editVersions();
};
export const addNewVersion = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/app-release/add/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.addNewVersion();
};
export const deleteVersion = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/app-release/delete/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.deleteVersion();
};
export const getBranchCustomer = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/profile/referred/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getBranchCustomer();
};
export const exportCardList = (body, responseType) => {
  if (isProduction) {
    return APIService.post(
      `${api}/raw-cards/issued/export-excel/${packageJson.apiVersion}`,
      body,
      responseType
    );
  }
  return MockData.exportCardList();
};
export const sendReferralCode = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/profile/sms-referral-code/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.sendReferralCode();
};
export const ForceChangePass = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/user/change-expired-password/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.ForceChangePass(payload);
};
export const getCharity = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/charity/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getCharity(payload);
};
export const updateCharity = (body) => {
  if (isProduction) {
    return APIService.put(`${api}/charity/${packageJson.apiVersion}`, body);
  }
  return MockData.updateCharity(payload);
};
export const addCharity = (body) => {
  if (isProduction) {
    return APIService.post(`${api}/charity/${packageJson.apiVersion}`, body);
  }
  return MockData.addCharity(payload);
};
export const getAllActiveBranches = () => {
  if (isProduction) {
    return APIService.get(`${api}/branch/enabled/${packageJson.apiVersion}`);
  }
  return MockData.getAllActiveBranches();
};
export const searchBranches = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/branch/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.searchBranches();
};
export const getAllServices = () => {
  if (isProduction) {
    return APIService.get(
      `${api}/branch-ministration/${packageJson.apiVersion}`
    );
  }
  return MockData.getAllServices();
};
export const addBranch = (body) => {
  if (isProduction) {
    return APIService.post(`${api}/branch/${packageJson.apiVersion}`, body);
  }
  return MockData.addBranch();
};
export const getReactionSentences = (body) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/expression/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getReactionSentences();
};
export const searchBanks = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/bank/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.searchBanks();
};
export const updateBank = (body) => {
  if (isProduction) {
    return APIService.put(`${api}/bank/update/${packageJson.apiVersion}`, body);
  }
  return MockData.updateBank(payload);
};
export const addBank = (body) => {
  if (isProduction) {
    return APIService.post(`${api}/bank/add/${packageJson.apiVersion}`, body);
  }
  return MockData.addBank(payload);
};
export const updateBranch = (body) => {
  if (isProduction) {
    return APIService.put(`${api}/branch/${packageJson.apiVersion}`, body);
  }
  return MockData.updateBranch();
};
export const getAllProvince = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/province/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getAllProvince();
};
export const searchVersionsHistory = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/app-version/history/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.searchVersionsHistory(payload);
};
export const getAllHistoryOpenAccount = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/account/open/authentication/history/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getAllHistoryOpenAccount();
};
export const searchBlackList = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/black-list/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.searchBlackList(payload);
};
export const addToBlackList = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/black-list/add/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.addToBlackList(payload);
};
export const deleteBlackList = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/black-list/delete/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.deleteBlackList(payload);
};
export const addUpdateExpression = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/expression/add-update/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.addUpdateExpression(payload);
};
export const deleteExpression = (params) => {
  if (isProduction) {
    return APIService.delete(
      `${api}/expression/delete/${params}/${packageJson.apiVersion}`
    );
  }
  return MockData.deleteExpression();
};
export const searchMenu = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/menu/authenticated/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.searchMenu(payload);
};
export const updateMenu = (payload) => {
  if (isProduction) {
    return APIService.put(
      `${api}/menu/update/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.updateMenu(payload);
};
export const sortMenu = (payload) => {
  if (isProduction) {
    return APIService.put(
      `${api}/menu/positions/${packageJson.apiVersion}`,
      payload
    );
  }
  return MockData.sortMenu(payload);
};
export const searchCustomerLimit = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/limit/modified-transfer-limit/customer/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.searchCustomerLimit(payload);
};
export const addCustomerLimit = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/limit/modified-transfer-limit/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.addCustomerLimit(payload);
};
export const editCustomerLimit = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/limit/modified-transfer-limit/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.editCustomerLimit(payload);
};
export const getCustomerName = (param) => {
  if (isProduction) {
    return APIService.get(
      `${api}/customer/identification-code/${param}/customer-or-corporate/${packageJson.apiVersion}`
    );
  }
  return MockData.getCustomerName();
};
export const getReasonsList = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/transfer/reasons/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getReasonsList();
};
export const addNewReason = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/transfer/add/reason/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.addNewReason();
};
export const getSettingsList = () => {
  if (isProduction) {
    return APIService.get(`${api}/satna-setting/${packageJson.apiVersion}`);
  }
  return MockData.getSettingsList();
};
export const getArchiveRegistrationAuthentications = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/registration/offline-authentication/history/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getAllHistoryOpenAccount();
};
export const getAuthenticatedServices = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/facility/all-login/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getAuthenticatedServices(payload);
};
export const editAuthenticationService = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/facility/edit-login-facility/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.editAuthenticationService(payload);
};
export const getAnonymousServices = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/facility/all-not-login/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getAnonymousServices(payload);
};
export const editAnonymousService = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/facility/edit-not-login-facility/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.editAnonymousService(payload);
};
export const getCustomerServices = (param) => {
  if (isProduction) {
    return APIService.get(
      `${api}/facility/get-all-facilities/${packageJson.apiVersion}?identificationCode=${param}`
    );
  }
  return MockData.getCustomerServices();
};
export const disableNotLoginService = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/facility/not-login/disable-facility/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.disableNotLoginService(payload);
};
export const enableNotLoginService = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/facility/not-login/remove-from-disabled-facilities/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.enableNotLoginService(payload);
};
export const disableLoginService = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/facility/disable-facility/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.disableLoginService(payload);
};
export const enableLoginService = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/facility/remove-from-disabled-facilities/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.enableLoginService(payload);
};
export const disableBiometricService = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/facility/biometric/disable/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.disableBiometricService(payload);
};
export const enableBiometricService = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/facility/biometric/remove-from-disabled-facilities/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.enableBiometricService(payload);
};
export const editReason = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/transfer/update/reason/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.editReason(payload);
};
export const editSettingPayaSatna = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/satna-setting/update/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.editSettingPayaSatna(payload);
};
export const getTicketList = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/ticketing/list/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getTicketList(payload);
};
export const getMessageList = (param) => {
  if (isProduction) {
    return APIService.get(
      `${api}/ticketing/ticket/${packageJson.apiVersion}?traceId=${param}`
    );
  }
  return MockData.getMessageList();
};
export const answerTickets = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/ticketing/answer/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.answerTickets(payload);
};
export const getSpecificationGroup = () => {
  if (isProduction) {
    return APIService.getWithoutLoading(
      `${api}/specification-group/all/${packageJson.apiVersion}`
    );
  }
  return MockData.getSpecificationGroup(payload);
};
export const getSpecificationsList = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/specification-item/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getSpecificationsList(payload);
};
export const editSpecificationItem = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/specification-item/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.editSpecificationItem(payload);
};
export const deleteRedisCache = () => {
  if (isProduction) {
    return APIService.delete(
      `${api}/specification-item/delete-all-redis-data/${packageJson.apiVersion}`
    );
  }
  return MockData.deleteRedisCache(payload);
};
export const messageList = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/ticketing/ticket/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.messageList(payload);
};
export const transferHamAfarinData = () => {
  if (isProduction) {
    return APIService.get(`${api}/account/add-hamafarin-accounts/v1`);
  }
  return MockData.transferHamAfarinData();
};
export const transferNullRecordsHamAfarinData = () => {
  if (isProduction) {
    return APIService.get(`${api}/account/add-null-hamafarin-accounts/v1`);
  }
  return MockData.transferHamAfarinData();
};
export const getDataOfAccount = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/account/account-permissions/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getDataOfAccount();
};
export const getRepresentative = (param) => {
  if (isProduction) {
    return APIService.get(`${api}/pichak/superagent/account/${param}/v1`);
  }
  return MockData.getRepresentative();
};
export const checkNationalId = (param) => {
  if (isProduction) {
    return APIService.get(
      `${api}/pichak/superagent/identification-code/${param}/v1`
    );
  }
  return MockData.checkNationalId();
};
export const addRepresentative = (body) => {
  if (isProduction) {
    return APIService.post(`${api}/pichak/superagent/add/v1`, body);
  }
  return MockData.addRepresentative();
};

export const dismissalRepresentative = (body) => {
  if (isProduction) {
    return APIService.put(`${api}/pichak/superagent/delete/v1`, body);
  }
  return MockData.dismissalRepresentative();
};
export const updateAccountsType = () => {
  if (isProduction) {
    return APIService.get(`${api}/account/status/${packageJson.apiVersion}`);
  }
  return MockData.updateAccountsType();
};
export const getAccountSigners = (params) => {
  if (isProduction) {
    return APIService.get(
      `${api}/agent/${params}/get-signer/${packageJson.apiVersion}`
    );
  }
  return MockData.getAccountSigners();
};
export const getAccountAgents = (params) => {
  if (isProduction) {
    return APIService.get(
      `${api}/agent/${params}/get/${packageJson.apiVersion}`
    );
  }
  return MockData.getAccountAgents();
};
export const checkNationalId2 = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/agent/customerInquiry/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.checkNationalId2();
};
export const addRepresentative2 = (body) => {
  if (isProduction) {
    return APIService.post(`${api}/agent/add/${packageJson.apiVersion}`, body);
  }
  return MockData.addRepresentative2();
};
export const dismissalRepresentative2 = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/agent/delete/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.dismissalRepresentative2();
};
export const callDotin = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/call-dotin/post/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.callDotin();
};
export const addVipCustomer = (body) => {
  if (isProduction) {
    return APIService.post(`${api}/vip/${packageJson.apiVersion}`, body);
  }
  return MockData.addVipCustomer();
};
export const deleteVipCustomer = (param) => {
  if (isProduction) {
    return APIService.delete(
      `${api}/vip/${packageJson.apiVersion}?identificationCode=${param}`
    );
  }
  return MockData.deleteVipCustomer();
};
export const searchVipCustomer = (body) => {
  if (isProduction) {
    return APIService.post(`${api}/vip/search/${packageJson.apiVersion}`, body);
  }
  return MockData.searchVipCustomer();
};
export const getMarriageLoanList = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/withholding-loan/auth/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getMarriageLoanList();
};
export const getStatusLoanList = () => {
  if (isProduction) {
    return APIService.get(
      `${api}/withholding-loan/auth/marriage-loan-get-status/${packageJson.apiVersion}`
    );
  }
  return MockData.getMarriageLoanList();
};
export const getMarriageLoanDetailsInfo = (body, params) => {
  if (isProduction) {
    return APIService.post(
      `${api}/withholding-loan/auth/marriage-loan-${params}-info/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getMarriageLoanDetailsApplicantInfo();
};
export const getMarriageLoanDetailsInfoWithoutLoading = (body, params) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/withholding-loan/auth/marriage-loan-${params}-info/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getMarriageLoanDetailsApplicantInfo();
};
export const getMarriageLoanDetailsImages = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/withholding-loan/auth/marriage-download-documents/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getMarriageLoanDetailsImages();
};
export const changeMarriageLoanStatus = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/withholding-loan/auth/marriage-loan-change-status/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.changeMarriageLoanStatus();
};
export const getMarriageLoanUploadFilesList = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/withholding-loan/auth/search-marriage-loan-requests/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getMarriageLoanUploadFilesList();
};
export const uploadMarriageLoanUploadFilesList = (body) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/withholding-loan/auth/marriage-loan-post-data/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.uploadMarriageLoanUploadFilesList();
};
export const getListOfCompany = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/loan/company/list/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getListOfCompany();
};
export const addCompany = (params, body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/loan/company/add/${packageJson.apiVersion}?companyCode=${params.companyCode}&companyName=${params.companyName}`,
      body,
      { headers: { "Content-Type": " multipart/form-data" } }
    );
  }
  return MockData.addCompany();
};
export const addPlan = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/loan/company/plan/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.addPlan();
};
export const getCompanyPlans = (param) => {
  if (isProduction) {
    return APIService.get(
      `${api}/loan/company/plan/${packageJson.apiVersion}?company_code=${param}`
    );
  }
  return MockData.getCompanyPlans();
};
export const editCompany = (params, body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/loan/company/${packageJson.apiVersion}?isActive=${params.isActive}&companyName=${params.companyName}&companyCode=${params.companyCode}`,
      body,
      { headers: { "Content-Type": " multipart/form-data" } }
    );
  }
  return MockData.editCompany();
};
export const editPlanOfCompany = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/loan/company/plan/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.editPlanOfCompany();
};
export const sendCardV2 = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/cards-operation/send-card/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.sendCardV2();
};
export const exportCardListV2 = (body, responseType) => {
  if (isProduction) {
    return APIService.post(
      `${api}/raw-cards/issued/export-excel/v2`,
      body,
      responseType
    );
  }
  return MockData.exportCardListV2();
};
export const getChildbearingLoanList = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/withholding-loan/childbearing/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getChildbearingLoanList();
};
export const getChildbearingLoanDetailsInfo = (body, params) => {
  if (isProduction) {
    return APIService.post(
      `${api}/withholding-loan/childbearing/${params}-info/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getChildbearingLoanDetailsApplicantInfo();
};
export const getChildbearingLoanDetailsImages = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/withholding-loan/childbearing/download-documents/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getChildbearingLoanDetailsImages();
};
export const changeChildbearingLoanStatus = (body) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/withholding-loan/childbearing/change-status/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getChildbearingLoanDetailsImages();
};
export const getChildbearingLoanUploadFilesList = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/withholding-loan/childbearing/search-loan-requests/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getChildbearingLoanUploadFilesList();
};
export const uploadChildbearingLoanUploadFilesList = (body) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/withholding-loan/childbearing/upload-data/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.uploadChildbearingLoanUploadFilesList();
};
export const getAllAppSettings = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/client-spec/all/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getAllAppSettings();
};
export const deleteOneAppSettings = (param) => {
  if (isProduction) {
    return APIService.delete(
      `${api}/client-spec/delete/${packageJson.apiVersion}?itemName=${param}`
    );
  }
  return MockData.getAllAppSettings();
};
export const addNewAppSettings = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/client-spec/save/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.addNewAppSettings();
};
export const getAllExpressionEvents = (params) => {
  if (isProduction) {
    return APIService.getWithoutLoading(
      `${api}/expression/get-all-expression-event/${packageJson.apiVersion}`
    );
  }
  return MockData.getAllExpressionEvents(params);
};
export const getTokenToCallDotin = (body) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/call-dotin/token/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getTokenToCallDotin();
};
export const searchGl = (body) => {
  if (isProduction) {
    return APIService.post(`${api}/gl/search/${packageJson.apiVersion}`, body);
  }
  return MockData.searchGl();
};
export const searchTransactionGl = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/gl/transaction-search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.searchTransactionGl();
};
export const addDocument = (body) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/gl/add/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.addDocument();
};
export const searchWalletType = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/wallet/typelist/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.searchWalletType();
};
export const searchWallet = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/wallet/list/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.searchWallet();
};
export const addWalletType = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/wallet/auth/add/wallet-type/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.addWalletType();
};
export const editWalletType = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/wallet/edit/wallet-type/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.editWalletType();
};
export const searchTranType = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/wallet/transactiontypelist/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.searchTranType();
};
export const updateTranType = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/wallet/edit/wallet-transactiontype/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.updateTranType();
};
export const getAllServicesFee = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/fee/fee-config/search/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getAllServicesFee();
};
export const updateServicesFee = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/fee/fee-config/update/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.updateServicesFee();
};
export const uploadMarriageLoanFile = (body, params) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/withholding-loan/auth/marriage-loan-upload-documents/${packageJson.apiVersion}?identificationCode=${params.identificationCode}&description=${params.description}&referenceNumber=${params.referenceNumber}`,
      body,
      { headers: { "Content-Type": " multipart/form-data" } }
    );
  }
  return MockData.uploadMarriageLoanFile();
};
export const deleteMarriageLoanFile = (params) => {
  if (isProduction) {
    return APIService.delete(
      `${api}/withholding-loan/auth/marriage-delete-documents/${packageJson.apiVersion}?identificationCode=${params.identificationCode}&documentKey=${params.key}&referenceNumber=${params.referenceNumber}`
    );
  }
  return MockData.deleteMarriageLoanFile();
};
export const uploadChildbearingLoanFile = (body, params) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/withholding-loan/childbearing/upload-documents/${packageJson.apiVersion}?identificationCode=${params.identificationCode}&description=${params.description}&referenceNumber=${params.referenceNumber}`,
      body,
      { headers: { "Content-Type": " multipart/form-data" } }
    );
  }
  return MockData.uploadMarriageLoanFile();
};
export const deleteChildbearingLoanFile = (params) => {
  if (isProduction) {
    return APIService.delete(
      `${api}/withholding-loan/childbearing/delete-documents/${packageJson.apiVersion}?fatherIdentificationCode=${params.identificationCode}&documentKey=${params.key}&referenceNumber=${params.referenceNumber}`
    );
  }
  return MockData.deleteChildbearingLoanFile();
};
export const addNoteForTicket = (body) => {
  if (isProduction) {
    return APIService.put(
      `${api}/ticketing/add-note/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.addNoteForTicket();
};
export const getLatestAppVersions = () => {
  if (isProduction) {
    return APIService.get(
      `${api}/app-release/latest/${packageJson.apiVersion}`
    );
  }
  return MockData.getLatestAppVersions();
};
export const sendUpdateGroupCards = (body) => {
  if (isProduction) {
    return APIService.post(`${api}/raw-cards/send-card-operation/${v1}`, body);
  }
  return MockData.sendUpdateGroupCards();
};
export const getSuppliers = () => {
  if (isProduction) {
    return APIService.get(
      `${api}/credit-hub/reagents/${packageJson.apiVersion}`
    );
  }
  return MockData.getSuppliers();
};
export const registerHub = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/credit-hub/register-info/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.registerHub();
};
export const uploadHubFile = (body, params) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/credit-hub/upload-documents/${packageJson.apiVersion}?referenceNumber=${params.referenceNumber}&key=${params.key}`,
      body,
      { headers: { "Content-Type": " multipart/form-data" } }
    );
  }
  return MockData.uploadHubFile();
};

export const downloadHubFile = (body) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/credit-hub/download-documents/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.downloadHubFile();
};
export const getInquiryGrade = (body) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/credit-hub/inquiry-grade/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getInquiryGrade();
};
export const getInquirySama = (body) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/credit-hub/inquiry-sama/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getInquirySama();
};
export const getInquirySamat = (body) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/credit-hub/inquiry-samat/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getInquirySamat();
};
export const nonMandatoryInquiries = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/credit-hub/non-mandatory-inquiries/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.nonMandatoryInquiries();
};
export const confirmHub = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/credit-hub/change-status/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.confirmHub();
};
export const getHubList = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/credit-hub/request-list/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getHubList();
};
export const getDetailCreditHub = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/credit-hub/details/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getDetailCreditHub();
};
export const deletePhotoCredit = (param) => {
  if (isProduction) {
    return APIService.delete(
      `${api}/credit-hub/delete-documents/${packageJson.apiVersion}?${param}`
    );
  }
  return MockData.deletePhotoCredit();
};
export const updateRawCardCity = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/account/open/set-postal-destination/${v1}`,
      body
    );
  }
  return MockData.updateRawCardCity();
};
export const getAllCitiesAndProvinces = (body) => {
  if (isProduction) {
    return APIService.getWithoutLoading(
      `${api}/account/open/get-postal-destination/${v1}`
    );
  }
  return MockData.getAllCitiesAndProvinces();
};
export const addAssurance = (body) => {
  if (isProduction) {
    return APIService.post(
      `${api}/credit-hub/add-assurance/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.addAssurance();
};
export const getInquiryJudicialAuthorities = (body) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/credit-hub/inquiry-judicial-order/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getInquiryJudicialAuthorities();
};
export const getInquiryMilitaryService = (body) => {
  if (isProduction) {
    return APIService.postWithoutLoading(
      `${api}/credit-hub/inquiry-military-service-using/${packageJson.apiVersion}`,
      body
    );
  }
  return MockData.getInquiryMilitaryService();
};
