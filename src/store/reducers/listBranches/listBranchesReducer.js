import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  record: "",
  item: "",
  branchCode: "",
  branchName: "",
  addModal: false,
  province: "",
  showDeleteBtn: false,
  edit: false,
  services: [],
  province: [],
  sortType: {
    "rfProvince.faName": "",
    branchCode: "",
  },
  sortColumn: "",
  sortBy: "-createdDate",
};

export const listBranchesSlice = createSlice({
  name: "listBranches",
  initialState: { value: initialStateValue },
  reducers: {
    listBranches: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetBranches: (state) => {
      state.value = { ...initialStateValue };
    },
  },
});

export const { listBranches, resetBranches } = listBranchesSlice.actions;

export default listBranchesSlice.reducer;
