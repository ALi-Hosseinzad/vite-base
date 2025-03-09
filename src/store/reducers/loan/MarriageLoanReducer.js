import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  marriageShowDeleteBtn: false,
  marriageList: [],
  marriageSortBy: "-createdDate",
  marriageTotalRows: "",
  marriageReload: false,
  record: "",
  marriage_record_date: { year: "", month: "", day: "" },
  branch_acceptance_date: { year: "", month: "", day: "" },
  statusList: [],
  applicantInfo: {},
  applicantOtherJobs: [],
  applicantDocumentInfo: [],
  spouseInfo: {},
  spouseOtherJobs: [],
  spouseDocumentInfo: [],
  guarantorInfo: {},
  guarantorOtherJobs: [],
  guarantorDocumentInfo: [],
  supplementaryInfo: {},
  readyReactions: [],
  applicantMarriageTryAgain: true,
  guarantorInfoChildbearingTryAgain: false,
  spouseInfoChildbearingTryAgain: false,
  supplementaryInfoChildbearingTryAgain: false,
  supplementaryDocumentInfo: [],
  uploadedFiles: [],
};
const resetRecord = {
  record: "",
  childbearing_record_date: { year: "", month: "", day: "" },
  branch_acceptance_date: { year: "", month: "", day: "" },
  statusList: [],
  branch_acceptance_time: { hour: "", minute: "" },
  status: "",
  statusLoading: false,
  branch_acceptance_date_error: false,
  branch_acceptance_time_error: false,
  applicantInfo: {},
  applicantOtherJobs: [],
  applicantDocumentInfo: [],
  applicantDocumentInfoChild: [],
  guarantorInfo: {},
  guarantorOtherJobs: [],
  guarantorDocumentInfo: [],
  supplementaryInfo: {},
  readyReactions: [],
  applicantChildbearingTryAgain: false,
  guarantorInfoChildbearingTryAgain: false,
  spouseInfoChildbearingTryAgain: false,
  supplementaryInfoChildbearingTryAgain: false,
  supplementaryDocumentInfo: [],
  uploadedFiles: [],
};

export const marriageLoanSlice = createSlice({
  name: "marriageLoan",
  initialState: { value: initialStateValue },
  reducers: {
    marriageLoan: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetMarriageLoanRecord: (state) => {
      state.value = { ...state.value, ...resetRecord };
    },
    resetMarriageLoan: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { marriageLoan, resetMarriageLoan, resetMarriageLoanRecord } = marriageLoanSlice.actions;
export const marriageLoanState = (state) => state.marriageLoan.value;
export default marriageLoanSlice.reducer;
