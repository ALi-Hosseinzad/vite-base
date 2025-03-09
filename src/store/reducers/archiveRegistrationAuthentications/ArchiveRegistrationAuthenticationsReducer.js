import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  record: "",
  showDeleteBtn: false,
  total: 1,
  update: false,
};

export const archiveRegistrationAuthenticationsSlice = createSlice({
  name: "archiveRegistrationAuthentications",
  initialState: { value: initialStateValue },
  reducers: {
    archiveRegistrationAuthentications: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetArchiveRegistrationAuthentications: (state) => {
      state.value = { ...initialStateValue };
    },
  },
});

export const { archiveRegistrationAuthentications, resetArchiveRegistrationAuthentications } = archiveRegistrationAuthenticationsSlice.actions;
export const archiveRegistrationAuthenticationsState = (state) => state.archiveRegistrationAuthentications.value;
export default archiveRegistrationAuthenticationsSlice.reducer;
