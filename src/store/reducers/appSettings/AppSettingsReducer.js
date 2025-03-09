import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  record: "",
  deleteAppSettingsModal: false,
  refresh: false,
  type: "",
};

export const appSettingsSlice = createSlice({
  name: "appSettings",
  initialState: { value: initialStateValue },
  reducers: {
    appSettings: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetAppSettings: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { appSettings, resetAppSettings } = appSettingsSlice.actions;
export const appSettingsState = (state) => state.appSettings.value;
export default appSettingsSlice.reducer;
