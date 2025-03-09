import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  step: 0,
  record: {},
  uploads: [],
  traceId: "",
  uploads: [],
  province: [],
  result1: null,
  suppliers: [],
  downloads: [],
  activeTab: "",
  information: "",
  qu1Loading: false,
  permissions: { edit: false, view: false, addAssurance: false },
};

export const creditHubSlice = createSlice({
  name: "creditHub",
  initialState: { value: initialStateValue },
  reducers: {
    creditHub: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetCreditHub: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { creditHub, resetCreditHub } = creditHubSlice.actions;
export const creditHubState = (state) => state.creditHub.value;
export default creditHubSlice.reducer;
