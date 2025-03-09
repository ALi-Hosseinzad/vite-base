import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  permissions: { viewMarriage: true, viewChildbearing: true, uploadFile: false },
  marriageShowDeleteBtn: false,
  marriageList: [],
  marriageSortBy: "-createdDate",
  marriageTotalRows: "",
  activeTab: "marriage",
  childbearingShowDeleteBtn: false,
  childbearingList: [],
  childbearingSortBy: "-createdDate",
  childbearingTotalRows: "",
  childbearingReload: false,
  resetFormChildbearing: false,
  resetForm: false,
};

export const loanUploadFileSlice = createSlice({
  name: "loanUploadFile",
  initialState: { value: initialStateValue },
  reducers: {
    loanUploadFile: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetLoanUploadFile: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { loanUploadFile, resetLoanUploadFile } = loanUploadFileSlice.actions;
export const loanUploadFileState = (state) => state.loanUploadFile.value;
export default loanUploadFileSlice.reducer;
