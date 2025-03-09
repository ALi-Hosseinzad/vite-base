import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  record: "",
  current: 1,
  modal: false,
  showDeleteBtn: false,
  reload: false,
  CTA: false,
  sortType: {
    fullname: "",
    mobileNumber: "",
    createdDate: "",
    branch: "",
    branchCode: "",
  },
  sortColumn: "",
  sortBy: "-createdDate",
};

export const branchCustomerSlice = createSlice({
  name: "branchCustomers",
  initialState: { value: initialStateValue },
  reducers: {
    branchCustomers: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetBranchCustomers: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { branchCustomers, resetBranchCustomers } = branchCustomerSlice.actions;

export default branchCustomerSlice.reducer;
