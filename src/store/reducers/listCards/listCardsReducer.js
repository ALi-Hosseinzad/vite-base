import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  item: "",
  list: [],
  endRow: 0,
  record: "",
  colors: [],
  height: 550,
  startRow: 0,
  modal: false,
  cityCode: "",
  totalRows: 0,
  printType: "",
  update: false,
  loading: false,
  nationalId: "",
  sortColumn: "",
  editModal: false,
  showPrint: false,
  successEdit: false,
  selectedRowKeys: [],
  showDeleteBtn: false,
  sortBy: "-createdDate",
  showSelectModal: false,
  citiesAndProvinces: [],
  sortType: { cardColor: "", pan: "" },
  permissions: { edit: true, send: true },
};

export const listCardsSlice = createSlice({
  name: "listCards",
  initialState: { value: initialStateValue },
  reducers: {
    listCards: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetListCards: (state) => {
      state.value = { ...initialStateValue };
    },
  },
});

export const { listCards, resetListCards } = listCardsSlice.actions;
export const listCardsState = (state) => state.listCards.value;
export default listCardsSlice.reducer;
