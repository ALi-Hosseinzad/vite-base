import { createSlice } from "@reduxjs/toolkit";
import Dictionary from "helpers/Dictionary";

const initialStateValue = {
  list: [],
  record: "",
  item: "",
  modal: false,
  detailsModal: false,
  addModal: false,
  showDeleteBtn: false,
  totalRows: 1,
  update: false,
  readyReactions: [],
  blacklistModal: false,
  blacklistObject: {
    event: "",
    fullname: "",
    reference_number: null,
    block_description: "",
    identification_code: "",
  },
  createAccountReactions: null,
  registrationReactions: null,
  reactionsError: false,
  reactionsErrorLoading: false,
  CTA: false,
  items: [
    { id: 1, value: "CREATE_ACCOUNT_OFFLINE", text: Dictionary.createNewAccount },
    { id: 2, value: "REGISTRATION", text: Dictionary.register },
    { id: 3, value: "FORGET_PASSWORD", text: Dictionary.forget },
    { id: 4, value: "ACTIVATION", text: Dictionary.enable },
    { id: 5, value: "LOGIN", text: Dictionary.login },
  ],
  permissions: {
    view: true,
    create: true,
    delete: true,
  },
  reload: false,
  blockExpression: [],
};

export const blacklistSlice = createSlice({
  name: "blacklist",
  initialState: { value: initialStateValue },
  reducers: {
    blacklist: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetBlacklist: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { blacklist, resetBlacklist } = blacklistSlice.actions;

export default blacklistSlice.reducer;
