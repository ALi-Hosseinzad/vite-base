import { createSlice } from "@reduxjs/toolkit";
import { listCharity } from "constants/Charity";
const initialStateValue = {
  list: [],
  modal: false,
  record: {},
  edit: false,
  reload: false,
  totalRows: 0,
};

export const Charity = createSlice({
  name: "charities",
  initialState: { value: initialStateValue },
  reducers: {
    charities: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
  },
});

export const { charities } = Charity.actions;

export default Charity.reducer;
