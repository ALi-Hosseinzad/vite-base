import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  record: "",
  showDeleteBtn: false,
  reload: false,
  permissions: {
    view: false,
    edit: false,
    create: false,
    editSetting: false,
    viewSetting: false,
  },
  CTA: false,
};

export const searchBasedOnAccountNumberSlice = createSlice({
  name: " searchBasedOnAccountNumber",
  initialState: { value: initialStateValue },
  reducers: {
    searchBasedOnAccountNumber: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetSearchBasedOnAccountNumber: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { searchBasedOnAccountNumber, resetSearchBasedOnAccountNumber } = searchBasedOnAccountNumberSlice.actions;
export const searchBasedOnAccountNumberState = (state) => state.searchBasedOnAccountNumber.value;
export default searchBasedOnAccountNumberSlice.reducer;
