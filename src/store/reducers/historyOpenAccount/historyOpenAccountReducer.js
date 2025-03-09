import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  record: "",
  showDeleteBtn: false,
  total: 1,
  update: false,
};

export const historyOpenAccountSlice = createSlice({
  name: "historyOpenAccount",
  initialState: { value: initialStateValue },
  reducers: {
    historyOpenAccount: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetHistoryOpenAccount: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { historyOpenAccount, resetHistoryOpenAccount } = historyOpenAccountSlice.actions;

export default historyOpenAccountSlice.reducer;
