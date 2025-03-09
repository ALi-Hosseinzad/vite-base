import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  record: {},
  modal: false,
  edit: false,
  showDeleteBtn: false,
  sortType: {
    bankName: "",
  },
  sortColumn: "",
  sortBy: "-createdDate",
};

export const listBanksSlice = createSlice({
  name: "listBanks",
  initialState: { value: initialStateValue },
  reducers: {
    listBanks: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetBanks: (state) => {
      state.value = { ...initialStateValue };
    },
  },
});

export const { listBanks, resetBanks } = listBanksSlice.actions;

export default listBanksSlice.reducer;
