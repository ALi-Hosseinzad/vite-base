import { createSlice } from "@reduxjs/toolkit";

export const timeOutSlice = createSlice({
  name: "time",
  initialState: { timeOut: false },
  reducers: {
    setTimeOute: (state, action) => {
      state.timeOut = action.payload;
    },
  },
});

export const { setTimeOute } = timeOutSlice.actions;

export default timeOutSlice.reducer;
