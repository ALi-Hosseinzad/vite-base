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
  authorityList: [],
  choiceList: [],
  choiceListKey: [],
  searchList: [],
  authoritySearchValue: "",
  choiceSearchValue: "",
  searchChoices: [],
  groupTitle: {
    text: "",
    error: false,
  },
  groupKey: {
    text: "",
    error: false,
  },
  reload: false,
};

export const groupsSlice = createSlice({
  name: "groups",
  initialState: { value: initialStateValue },
  reducers: {
    groups: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetGroups: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { groups, resetGroups } = groupsSlice.actions;

export default groupsSlice.reducer;
