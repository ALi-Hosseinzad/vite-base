import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  rejectedMarriageShowDeleteBtn: false,
  rejectedMarriageList: [],
  rejectedMarriageSortBy: "-createdDate",
  rejectedMarriageTotalRows: "",
  rejectedMarriageReload: false,
  rejectedMarriage_record_date: { year: "", month: "", day: "" },
  rejectedChildbearingShowDeleteBtn: false,
  rejectedChildbearingList: [],
  rejectedChildbearingSortBy: "-createdDate",
  rejectedChildbearingTotalRows: "",
  rejectedChildbearingReload: false,
  rejectedChildbearing_record_date: { year: "", month: "", day: "" },
};

export const rejectedLoanSlice = createSlice({
  name: "rejectedLoan",
  initialState: { value: initialStateValue },
  reducers: {
    rejectedLoan: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetRejectedLoan: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { rejectedLoan, resetRejectedLoan } = rejectedLoanSlice.actions;
export const rejectedLoanState = (state) => state.rejectedLoan.value;
export default rejectedLoanSlice.reducer;
