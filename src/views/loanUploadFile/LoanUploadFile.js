import React, { useEffect } from "react";
import HeaderPage from "components/headerPage/HeaderPage";
import Dictionary from "helpers/Dictionary";
import TabsBar from "components/tabsBar/TabsBar";
import { useDispatch, useSelector } from "react-redux";
import { MatchAuthority } from "helpers/MatchAuthority";
import Classes from "views/loan/styles/Loan.module.scss";
import * as XLSX from "xlsx";
import { userInfoState } from "store/reducers/userInfo/UserInfoReducer";
import { useSearchParams } from "react-router-dom";
import {
  loanUploadFile,
  loanUploadFileState,
  resetLoanUploadFile,
} from "store/reducers/loan/LoanUploadFileReducer";
import UploadIcon from "assets/images/icon/Upload.svg";
import MarriageLoanFiles from "./pages/MarriageLoanFiles";
import {
  uploadChildbearingLoanUploadFilesList,
  uploadMarriageLoanUploadFilesList,
} from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import ChildbearingLoanFiles from "./pages/ChildbearingLoanFiles";

const LoanUploadFile = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const userInfoData = useSelector(userInfoState);
  const [, setSearchParams] = useSearchParams();
  const loanUploadFileData = useSelector(loanUploadFileState);
  const {
    permissions,
    marriageReload,
    childbearingReload,
    uploadFileLoading,
    activeTab,
  } = loanUploadFileData;

  const validArrayMarriage = [
    "شماره مشتری",
    "شماره ملي",
    "نام شخص",
    "نام خانوادگی",
    "تاریخ تولد",
    "کد رهگیری",
    "تاریخ ثبت نام",
    "کد شعبه",
    "تاریخ تعیین شعبه",
    "وضعیت وام ازدواج",
    "تاریخ وضعیت",
    "نام بانک",
    "نام استان",
    "نام شهر یا سرپرستی",
    "وضعیت ایثارگری",
    "شماره تلفن ثابت",
    "شماره تلفن همراه",
    "جنسیت",
    "تاریخ ازدواج",
    "مبلغ تسهیلات",
  ];
  const validArrayChildbearing = [
    "شماره مشتری",
    "شماره ملي پدر",
    "نام پدر",
    "نام خانوادگی پدر",
    "شماره ملی فرزند",
    "تاریخ تولد فرزند",
    "نام و نام خانوادگی فرزند",
    "جنسیت",
    "کد رهگیری",
    "تاریخ ثبت نام",
    "کد شعبه",
    "تاریخ تعیین شعبه",
    "وضعیت",
    "تاریخ وضعیت",
    "نام بانک",
    "نام استان",
    "نام شهرستان",
    "شماره تلفن همراه",
    "مبلغ تسهیلات",
  ];

  useEffect(() => {
    return () => dispatch(resetLoanUploadFile());
  }, []);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        loanUploadFile({
          permissions: {
            viewMarriageFiles: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/withholding-loan/auth/search-marriage-loan-requests/v1"
            ),
            uploadFileMarriage: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/withholding-loan/auth/marriage-loan-post-data/v1"
            ),
            viewChildbearingFiles: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/withholding-loan/childbearing/search-loan-requests/v1"
            ),
            uploadFileChildbearing: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/withholding-loan/childbearing/upload-data/v1"
            ),
          },
        })
      );
    } else {
      dispatch(
        loanUploadFile({
          permissions: {
            viewMarriageFiles: true,
            viewChildbearingFiles: true,
            uploadFileMarriage: true,
            uploadFileChildbearing: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  const items = [
    {
      label: Dictionary.files + " " + Dictionary.marriage,
      key: "marriage",
      children: <MarriageLoanFiles />,
    },
    {
      label: Dictionary.files + " " + Dictionary.childbearing,
      key: "childbearing",
      children: <ChildbearingLoanFiles />,
    },
  ];

  const onChangeTab = (key) => {
    dispatch(loanUploadFile({ activeTab: key }));
  };

  const onChangeInput = (event) => {
    if (activeTab === "marriage") {
      ExcelToJSONMarriage(event);
    } else if (activeTab === "childbearing") {
      ExcelToJSONchildbearing(event);
    }
  };

  let checker = (arr, target) => target.every((v) => arr.includes(v));

  const ExcelToJSONMarriage = (event) => {
    if (permissions.uploadFileMarriage) {
      dispatch(loanUploadFile({ uploadFileLoading: true }));
      const reader = new FileReader();
      reader.onload = async function (e) {
        const data = e.target.result;
        const workbook = XLSX?.read(data, { type: "binary" });
        // Here is your object
        const XL_row_object = XLSX?.utils?.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]]
        );
        const filtered = XL_row_object?.filter(
          (f) => Object.keys(f).length > 1
        );
        const keys = Object.keys(filtered[0]);
        if (checker(keys, validArrayMarriage)) {
          const converted = filtered?.map((n) => {
            let customer_number = n["شماره مشتری"] || null;
            let identification_code = n["شماره ملي"] || null;
            let first_name = n["نام شخص"] || null;
            let last_name = n["نام خانوادگی"] || null;
            let birth_date = n["تاریخ تولد"] || null;
            let central_bank_trace_id = n["کد رهگیری"] || null;
            let submit_date = n["تاریخ ثبت نام"] || null;
            let branch_code = n["کد شعبه"] || null;
            let branch_acceptance_date = n["تاریخ تعیین شعبه"] || null;
            let status = n["وضعیت وام ازدواج"] || null;
            let reason_reject_payment = n["دلیل عدم پرداخت"] || null;
            let status_date = n["تاریخ وضعیت"] || null;
            let bank_name = n["نام بانک"] || null;
            let province_name = n["نام استان"] || null;
            let city_name = n["نام شهر یا سرپرستی"] || null;
            let sacrifice_quota = n["وضعیت ایثارگری"] || null;
            let phone_number = n["شماره تلفن ثابت"] || null;
            let resort_date = n["تاریخ پذیرش در شعبه"] || null;
            let mobile_number = n["شماره تلفن همراه"] || null;
            let gender = n["جنسیت"] || null;
            let marriage_date = n["تاریخ ازدواج"] || null;
            let loan_amount = n["مبلغ تسهیلات"] || null;
            return {
              customer_number,
              identification_code,
              first_name,
              last_name,
              bank_name,
              birth_date,
              central_bank_trace_id,
              submit_date,
              branch_code,
              branch_acceptance_date,
              status,
              reason_reject_payment,
              status_date,
              province_name,
              city_name,
              sacrifice_quota,
              phone_number,
              resort_date,
              mobile_number,
              gender,
              marriage_date,
              loan_amount,
            };
          });
          uploadMarriageLoanUploadFilesList(converted)
            .then(() => {
              dispatch(
                setNotificationData({
                  message: Dictionary.successfullyDone,
                  type: "success",
                  time: 2000,
                })
              );
              const newQueryParam = {
                marriagePageNumber: 1,
                marriageRecordsPerPage: 10,
              };
              setSearchParams(newQueryParam);
              dispatch(
                loanUploadFile({
                  marriageReload: !marriageReload,
                  uploadFileLoading: false,
                  resetForm: true,
                })
              );
            })
            .catch(() => {
              dispatch(loanUploadFile({ uploadFileLoading: false }));
              errorHandler(errorResponse);
            });
        } else {
          dispatch(loanUploadFile({ uploadFileLoading: false }));
          dispatch(
            setNotificationData({
              message: Dictionary.errorXlsxFile,
              type: "error",
              time: 3000,
            })
          );
        }
      };
      reader.onerror = function (ex) {
        dispatch(loanUploadFile({ uploadFileLoading: false }));
        dispatch(
          setNotificationData({
            message: Dictionary.errorXlsxFile,
            type: "error",
            time: 3000,
          })
        );
      };
      reader.readAsBinaryString(event.target.files[0]);
    } else {
      dispatch(
        setNotificationData({
          message: Dictionary.accessPage,
          type: "error",
          time: 2000,
        })
      );
    }
  };

  const ExcelToJSONchildbearing = (event) => {
    if (permissions.uploadFileChildbearing) {
      dispatch(loanUploadFile({ uploadFileLoading: true }));
      const reader = new FileReader();
      reader.onload = async function (e) {
        const data = e.target.result;
        const workbook = XLSX?.read(data, { type: "binary" });
        // Here is your object
        const XL_row_object = XLSX?.utils?.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]]
        );
        const filtered = XL_row_object?.filter(
          (f) => Object.keys(f).length > 1
        );
        const keys = Object.keys(filtered[0]);
        let checker = (arr, target) => target.every((v) => arr.includes(v));
        if (checker(keys, validArrayChildbearing)) {
          const converted = filtered?.map((n) => {
            let customer_number = n["شماره مشتری"] || null;
            let father_identification_code = n["شماره ملي پدر"] || null;
            let father_first_name = n["نام پدر"] || null;
            let father_last_name = n["نام خانوادگی پدر"] || null;
            let child_birth_date = n["تاریخ تولد فرزند"] || null;
            let central_bank_trace_id = n["کد رهگیری"] || null;
            let submit_date = n["تاریخ ثبت نام"] || null;
            let branch_code = n["کد شعبه"] || null;
            let branch_acceptance_date = n["تاریخ تعیین شعبه"] || null;
            let status = n["وضعیت"] || null;
            let verify_reject_reason = n["دلیل عدم پرداخت"] || null;
            let status_date = n["تاریخ وضعیت"] || null;
            let bank_name = n["نام بانک"] || null;
            let province = n["نام استان"] || null;
            let city = n["نام شهرستان"] || null;
            let child_fullname = n["نام و نام خانوادگی فرزند"] || null;
            let resort_date = n["تاریخ پذیرش در شعبه"] || null;
            let mobile_number = n["شماره تلفن همراه"] || null;
            let gender = n["جنسیت"] || null;
            let child_identification_code = n["شماره ملی فرزند"] || null;
            let loan_amount = n["مبلغ تسهیلات"] || null;
            return {
              customer_number,
              father_first_name,
              father_last_name,
              father_identification_code,
              bank_name,
              child_birth_date,
              central_bank_trace_id,
              submit_date,
              branch_code,
              branch_acceptance_date,
              status,
              verify_reject_reason,
              status_date,
              province,
              city,
              child_fullname,
              resort_date,
              mobile_number,
              gender,
              child_identification_code,
              loan_amount,
            };
          });
          uploadChildbearingLoanUploadFilesList(converted)
            .then(() => {
              dispatch(
                setNotificationData({
                  message: Dictionary.successfullyDone,
                  type: "success",
                  time: 2000,
                })
              );
              const newQueryParam = {
                childbearingPageNumber: "1",
                childbearingRecordsPerPage: "10",
              };
              setSearchParams(newQueryParam);
              dispatch(
                loanUploadFile({
                  childbearingReload: !childbearingReload,
                  uploadFileLoading: false,
                  resetFormChildbearing: true,
                })
              );
            })
            .catch(() => {
              dispatch(loanUploadFile({ uploadFileLoading: false }));
              errorHandler(errorResponse);
            });
        } else {
          dispatch(loanUploadFile({ uploadFileLoading: false }));
          dispatch(
            setNotificationData({
              message: Dictionary.errorXlsxFile,
              type: "error",
              time: 3000,
            })
          );
        }
      };
      reader.onerror = function (ex) {
        dispatch(loanUploadFile({ uploadFileLoading: false }));
        dispatch(
          setNotificationData({
            message: Dictionary.errorXlsxFile,
            type: "error",
            time: 3000,
          })
        );
      };
      reader.readAsBinaryString(event.target.files[0]);
    } else {
      dispatch(
        setNotificationData({
          message: Dictionary.accessPage,
          type: "error",
          time: 2000,
        })
      );
    }
  };

  return (
    <div>
      {permissions.viewMarriageFiles && permissions.viewChildbearingFiles && (
        <>
          <HeaderPage
            acceptFile="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            buttonText={Dictionary.xcel + " " + Dictionary[activeTab]}
            title={Dictionary.uploadedFile}
            loading={uploadFileLoading}
            onChange={onChangeInput}
            srcRight={UploadIcon}
            id="BothLoanFiles"
            inputUpload={
              permissions.uploadFileChildbearing &&
              permissions.uploadFileMarriage &&
              true
            }
          />
          <TabsBar
            items={items}
            className={Classes["tabs"]}
            onChange={onChangeTab}
          />
        </>
      )}
      {permissions.viewMarriageFiles && !permissions.viewChildbearingFiles && (
        <>
          <HeaderPage
            acceptFile="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            title={Dictionary.uploadedFile + " " + Dictionary.marriage}
            buttonText={Dictionary.xcel + " " + Dictionary.marriage}
            loading={uploadFileLoading}
            onChange={ExcelToJSONMarriage}
            srcRight={UploadIcon}
            id="MarriageLoanFiles"
            inputUpload={permissions.uploadFileMarriage && true}
          />
          <MarriageLoanFiles />
        </>
      )}
      {!permissions.viewMarriageFiles && permissions.viewChildbearingFiles && (
        <>
          <HeaderPage
            acceptFile="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            title={Dictionary.uploadedFile + " " + Dictionary.childbearing}
            buttonText={Dictionary.xcel + " " + Dictionary.childbearing}
            loading={uploadFileLoading}
            onChange={ExcelToJSONchildbearing}
            srcRight={UploadIcon}
            id="childbearingLoanFiles"
            inputUpload={permissions.uploadFileChildbearing && true}
          />

          <ChildbearingLoanFiles />
        </>
      )}
    </div>
  );
};
export default LoanUploadFile;
