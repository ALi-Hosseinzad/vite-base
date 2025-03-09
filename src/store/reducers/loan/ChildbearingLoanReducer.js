import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  childbearingShowDeleteBtn: false,
  childbearingList: [],
  childbearingSortBy: "-createdDate",
  childbearingTotalRows: "",
  childbearingReload: false,
  record: "",
  childbearing_record_date: { year: "", month: "", day: "" },
  branch_acceptance_date: { year: "", month: "", day: "" },
  statusList: [],
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
  supplementaryInfoChildbearingTryAgain: false,
  supplementaryDocumentInfo: [],
  uploadedFiles: [],
};

export const childbearingLoanSlice = createSlice({
  name: "childbearingLoan",
  initialState: { value: initialStateValue },
  reducers: {
    childbearingLoan: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetChildbearingLoanRecord: (state) => {
      state.value = { ...state.value, ...resetRecord };
    },
    resetChildbearingLoan: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { childbearingLoan, resetChildbearingLoan, resetChildbearingLoanRecord } = childbearingLoanSlice.actions;
export const childbearingLoanState = (state) => state.childbearingLoan.value;
export default childbearingLoanSlice.reducer;
