import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  record: {},
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

export const versionsSlice = createSlice({
  name: "versions",
  initialState: { value: initialStateValue },
  reducers: {
    versions: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetVersions: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { versions, resetVersions } = versionsSlice.actions;
export const versionsState = (state) => state.versions.value;
export default versionsSlice.reducer;
