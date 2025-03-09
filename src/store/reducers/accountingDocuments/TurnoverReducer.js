import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  from: {},
  to: {},
  documentNumber: "",
  list: [],
  totalRows: 0,
};

export const turnoverSlice = createSlice({
  name: "turnover",
  initialState: { value: initialStateValue },
  reducers: {
    turnover: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetTurnover: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { turnover, resetTurnover } = turnoverSlice.actions;
export const turnoverState = (state) => state.turnover.value;
export default turnoverSlice.reducer;
