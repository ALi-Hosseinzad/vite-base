import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  permissions: {
    viewList: false,
    viewTurnover: false,
    create: false,
  },
  reload: false,
  modal: false,
  showDeleteBtn: false,
  list: [],
  totalRows: 0,
  current: {},
};

export const accountingDocumentsSlice = createSlice({
  name: "accountingDocuments",
  initialState: { value: initialStateValue },
  reducers: {
    accountingDocuments: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetAccountingDocuments: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { accountingDocuments, resetAccountingDocuments } = accountingDocumentsSlice.actions;
export const accountingDocumentsState = (state) => state.accountingDocuments.value;
export default accountingDocumentsSlice.reducer;
