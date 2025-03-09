import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: "",
  record: "",
  username: "",
  name: "",
  firstname: "",
  current: 0,
  item: "",
  nationalId: "",
  type: "",
  mobile: "",
  disabled: true,
  modal: false,
  cancelModal: false,
  showDeleteBtn: false,
  recoveryModal: false,
  editUsernameAndMobileModal: false,
  collapse: "",
  secondStep: 1,
  recoveryStep: 1,
  editState: "",
  reload: false,
  resetFields: false,
  traceId: "",
  birthDate: "",
  gender: "",
  password: "",
  birthDateError: false,
  sortType: {
    fullname: "",
    identificationCode: "",
    mobileNumber: "",
    isLocked: "",
  },
  sortColumn: "",
  sortBy: "-createdDate",
};

export const listCustomersSlice = createSlice({
  name: "listCustomers",
  initialState: { value: initialStateValue },
  reducers: {
    listCustomers: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetListCustomers: (state, action) => {
      state.value = { ...initialStateValue, list: action.payload };
    },
  },
});

export const { listCustomers, resetListCustomers } = listCustomersSlice.actions;

export default listCustomersSlice.reducer;
