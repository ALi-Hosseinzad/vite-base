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
  record: {},
  edit: true,
};

export const walletTypeSlice = createSlice({
  name: "walletType",
  initialState: { value: initialStateValue },
  reducers: {
    walletType: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetWalletType: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { walletType, resetWalletType } = walletTypeSlice.actions;
export const walletTypeState = (state) => state.walletType.value;
export default walletTypeSlice.reducer;
