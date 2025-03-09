import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  record: "",
  item: "",
  modal: false,
  showDeleteBtn: false,
  avatar: {},
  idCard: {},
  sign: "",
  video: "",
  videoURL: "",
  total: 1,
  text: "",
  update: false,
  videoError: false,
  avatarError: false,
  idCardError: false,
  readyReactions: null,
  sortType: {
    referenceNumber: "",
    fullname: "",
    identificationCode: "",
    createdDate: "",
    event: "",
  },
  sortColumn: "",
  sortBy: "-createdDate",
};

export const registerForgetSlice = createSlice({
  name: "registerForget",
  initialState: { value: initialStateValue },
  reducers: {
    registerForget: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetRegisterForget: (state) => {
      state.value = { ...initialStateValue };
    },
  },
});

export const { registerForget, resetRegisterForget } = registerForgetSlice.actions;

export default registerForgetSlice.reducer;
