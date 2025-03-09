import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  record: "",
  item: "",
  editModal: false,
  idCode: "",
  printType: "",
  modal: false,
  showSubmit: false,
  showDeleteBtn: false,
  successEdit: false,
  endRow: 0,
  startRow: 0,
  totalRows: 0,
  update: false,
  responseAccount: [],
  addAccount: [],
  removeAccount: [],
  leader_identification_code: "",
  stamp_owner_identification_code: "",
  leader_name: "",
  stamp_owner_name: "",
  is_active_corporate_customer: false,
  is_corporate_customer: false,
  reload: false,
  permissions: {
    view: true,
    edit: true,
  },
};

export const accountSlice = createSlice({
  name: "account",
  initialState: { value: initialStateValue },
  reducers: {
    account: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetAccount: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { account, resetAccount } = accountSlice.actions;

export default accountSlice.reducer;
