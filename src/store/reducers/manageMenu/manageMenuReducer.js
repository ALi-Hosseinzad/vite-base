import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  record: "",
  submenus: "",
  newSort: "",
  sortModal: false,
  showDeleteBtn: false,
  tableData: [],
  editModal: false,
  reload: false,
  items: [
    { id: 1, text: "نمایش", value: true },
    { id: 2, text: "عدم نمایش", value: false },
  ],
  menuKey: "",
  permissions: {
    edit: true,
    view: true,
  },
};

export const manageMenuSlice = createSlice({
  name: "manageMenu",
  initialState: { value: initialStateValue },
  reducers: {
    manageMenu: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetManageMenu: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { manageMenu, resetManageMenu } = manageMenuSlice.actions;

export default manageMenuSlice.reducer;
