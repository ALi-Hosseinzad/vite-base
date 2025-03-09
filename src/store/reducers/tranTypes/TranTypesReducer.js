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

export const tranTypesSlice = createSlice({
  name: "tranTypes",
  initialState: { value: initialStateValue },
  reducers: {
    tranTypes: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetTranTypes: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { tranTypes, resetTranTypes } = tranTypesSlice.actions;
export const tranTypesState = (state) => state.tranTypes.value;
export default tranTypesSlice.reducer;
