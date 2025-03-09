import { createSlice } from "@reduxjs/toolkit";
import Dictionary from "helpers/Dictionary";

const initialStateValue = {
  list: [],
  vipList: [],
  record: {
    account_number: null,
  },
  vipRecord: "",
  item: "",
  identificationCode: "",
  addIdentificationCode: "",
  customerName: "",
  totalTransfer: "",
  internal: "",
  paya: "",
  satna: "",
  showDeleteBtn: false,
  vipShowDeleteBtn: false,
  editModal: false,
  addModal: false,
  deleteModal: false,
  vipAddModal: false,
  vipDeleteModal: false,
  CTA: false,
  vipCTA: false,
  generatCustomerType: { INDIVIDUAL: Dictionary.individual, CORPORATE: Dictionary.corporate },
  addStep: 0,
  vipAddStep: 0,
  state: "",
  permissions: {
    view: true,
    create: true,
    edit: true,
    delete: true,
  },
  vipPermissions: {
    view: true,
    create: true,
    delete: true,
  },
  currentTotalDaily: "",
};

export const limitationSlice = createSlice({
  name: "limitation",
  initialState: { value: initialStateValue },
  reducers: {
    limitation: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetLimitation: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
    resetReducers: () => {},
  },
});

export const { limitation, resetLimitation, resetReducers } = limitationSlice.actions;

export default limitationSlice.reducer;
