import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  personalId: "",
  identificationCode: "",
  nameInfo: "",
  phoneNumber: "",
  branchCode: "",
  lock: false,
  key: false,
  edit: false,
  record: "",
  item: "",
  roleList: [],
  current: 0,
  addModal: false,
  editModal: false,
  changePassword: false,
  showDeleteBtn: false,
  setRole: [],
  reload: false,
  activeBranches: [],
  sortType: {
    employmentCode: "",
    fullname: "",
    identificationCode: "",
    mobileNumber: "",
    "rfBranch.branchCode": "",
    isLocked: "",
  },
  sortColumn: "",
  sortBy: "-createdDate",
  detailModal: false,
};

export const usersSlice = createSlice({
  name: "users",
  initialState: { value: initialStateValue },
  reducers: {
    users: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetUsers: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
    resetReducers: () => {},
  },
});

export const { users, resetUsers, resetReducers } = usersSlice.actions;

export default usersSlice.reducer;
