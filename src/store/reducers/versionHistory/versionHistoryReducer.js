import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  endRow: 0,
  startRow: 0,
  totalRows: 0,
  record: "",
  link: "",
  links: [],
  addLink: [],
  checkSums: [],
  addCheckSum: [],
  modifiedFeatures: [],
  code: "",
  system: "",
  showDeleteBtn: false,
  historyModal: false,
  editModal: false,
  eyeModal: false,
  refresh: false,
};

export const versionHistorySlice = createSlice({
  name: "versionHistory",
  initialState: { value: initialStateValue },
  reducers: {
    versionHistory: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
  },
});

export const { versionHistory } = versionHistorySlice.actions;

export default versionHistorySlice.reducer;
