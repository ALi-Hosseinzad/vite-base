import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  permissions: {
    view: false,
  },
  reload: false,
  modal: false,
  showDeleteBtn: false,
  list: [],
  totalRows: 0,
  current: {},
};

export const manageWalletSlice = createSlice({
  name: "manageWallet",
  initialState: { value: initialStateValue },
  reducers: {
    manageWallet: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetManageWallet: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { manageWallet, resetManageWallet } = manageWalletSlice.actions;
export const manageWalletState = (state) => state.manageWallet.value;
export default manageWalletSlice.reducer;
