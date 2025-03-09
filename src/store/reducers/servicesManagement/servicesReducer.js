import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  tableData: [],
  record: "",
  editModal: false,
  warningModal: false,
  reload: false,
  showDeleteBtn: false,
  serviceType: "",
  permissions: {
    view: true,
    edit: true,
  },
};

export const servicesSlice = createSlice({
  name: "services",
  initialState: { value: initialStateValue },
  reducers: {
    services: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetServices: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { services, resetServices } = servicesSlice.actions;

export default servicesSlice.reducer;
