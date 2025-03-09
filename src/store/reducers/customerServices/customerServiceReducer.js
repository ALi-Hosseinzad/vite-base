import { createSlice } from "@reduxjs/toolkit";
import { ListCards } from "constants/Cards";

const initialStateValue = {
  list: {},
  record: "",
  data: [],
  reasonModal: false,
  disableReasons: [],
  reload: false,
  chooseRow: "",
  disabledDesc: "",
  showDeleteBtn: false,
  idCode: "",
  permissions: { view: true, edit: true },
};

export const customerServiceSlice = createSlice({
  name: "customerService",
  initialState: { value: initialStateValue },
  reducers: {
    customerService: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetCustomerService: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { customerService, resetCustomerService } = customerServiceSlice.actions;

export default customerServiceSlice.reducer;
