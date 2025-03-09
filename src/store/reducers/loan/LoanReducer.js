import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  permissions: {
    viewMarriage: false,
    viewMarriageDetails: false,
    editMarriage: false,
    viewChildbearing: false,
    viewChildbearingDetails: false,
    editChildbearing: false,
    deleteDocumentMarriage: false,
    deleteDocumentChildBearing: false,
  },
};

export const loanSlice = createSlice({
  name: "loan",
  initialState: { value: initialStateValue },
  reducers: {
    loan: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetLoan: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { loan, resetLoan } = loanSlice.actions;
export const loanState = (state) => state.loan.value;
export default loanSlice.reducer;
