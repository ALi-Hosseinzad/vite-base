import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  record: "",
  item: "",
  modal: false,
  showDeleteBtn: false,
  idCard: {},
  backIdCard: {},
  sign: {},
  avatar: {},
  video: "",
  videoURL: "",
  total: 1,
  update: false,
  videoError: false,
  avatarError: false,
  idCardError: false,
  backIdCardError: false,
  signError: false,
  sortType: {
    referenceNumber: "",
    fullname: "",
    identificationCode: "",
    createdDate: "",
    accountStatus: "",
  },
  sortColumn: "",
  sortBy: "-createdDate",
};

export const openAccountSlice = createSlice({
  name: "openAccount",
  initialState: { value: initialStateValue },
  reducers: {
    openAccount: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetOpenAccount: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { openAccount, resetOpenAccount } = openAccountSlice.actions;

export default openAccountSlice.reducer;
