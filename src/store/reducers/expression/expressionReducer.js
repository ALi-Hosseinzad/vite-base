import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  record: "",
  showDeleteBtn: false,
  reload: false,
  endRow: null,
  startRow: null,
  totalRows: null,
  addModal: false,
  deleteModal: false,
  state: "",
  searchItems: [],
  permissions: {
    create: true,
    edit: true,
    delete: true,
    view: true,
  },
  sortType: {
    expression: "",
  },
  sortColumn: "",
  sortBy: "-createdDate",
};

export const expressionSlice = createSlice({
  name: "expression",
  initialState: { value: initialStateValue },
  reducers: {
    expression: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetExpression: (state, action) => {
      state.value = { ...initialStateValue, list: action.payload };
    },
  },
});

export const { expression, resetExpression } = expressionSlice.actions;

export default expressionSlice.reducer;
