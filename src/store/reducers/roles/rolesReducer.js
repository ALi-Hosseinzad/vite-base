import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  record: "",
  item: "",
  addModal: false,
  detailsModal: false,
  editModal: false,
  step: "",
  showDeleteBtn: false,
  total: 1,
  update: false,
  groupsList: [],
  choiceList: [],
  choiceListKey: [],
  searchList: [],
  groupSearchValue: "",
  groupChoiceSearchValue: "",
  menuChoiceSearchValue: "",
  searchChoiceCroupList: [],
  searchChoiceMenuList: [],
  menuList: [],
  menuChoiceList: [],
  menuChoiceListKey: [],
  searchMenuList: [],
  menuSearchValue: "",
  roleTitle: {
    text: "",
    error: false,
  },
  roleKey: {
    text: "",
    error: false,
  },
  reload: false,
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState: { value: initialStateValue },
  reducers: {
    roles: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetRoles: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { roles, resetRoles } = rolesSlice.actions;

export default rolesSlice.reducer;
