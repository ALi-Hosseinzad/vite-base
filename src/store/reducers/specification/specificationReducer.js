import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  items: [],
  totalRows: 0,
  record: "",
  editModal: false,
  warningModal: false,
  showDetailModal: false,
  reload: false,
  showDeleteBtn: false,
  state: "",
  open: false,
  showDeleteModal: false,
  rfSpecificationGroup: "",
  temName: "",
  permissions: { view: true, edit: true, deleteCache: true },
};

export const specificationSlice = createSlice({
  name: "specification",
  initialState: { value: initialStateValue },
  reducers: {
    specification: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetSpecification: (state) => {
      state.value = { ...initialStateValue };
    },
  },
});

export const { specification, resetSpecification } = specificationSlice.actions;
export const specificationState = (state) => state.specification.value;
export default specificationSlice.reducer;
