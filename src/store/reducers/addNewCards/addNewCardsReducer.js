import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = { list: [], cols: [], rows: [], excel: false, cardNumber: false, errorMessage: null, showBtn: false };

export const addNewCardsSlice = createSlice({
  name: "addNewCards",
  initialState: { value: initialStateValue },
  reducers: {
    addNewCards: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetCards: (state) => {
      state.value = initialStateValue;
    },
  },
});

export const { addNewCards, resetCards } = addNewCardsSlice.actions;

export default addNewCardsSlice.reducer;
