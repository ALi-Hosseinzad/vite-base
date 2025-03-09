import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  record: "",
  item: "",
  objectModal: false,
  sortType: {
    traceId: "",
    fullName: "",
    identificationCode: "",
    phoneNumber: "",
    traceId: "",
    lastModifiedDate: "",
    questionCaption: "",
    status: "",
  },
  sortColumn: "",
  sortBy: "-lastModifiedDate",
  endRow: "",
  startRow: "",
  totalRows: "",
  messagesList: [],
  reload: false,
  captionDescription: "",
  showDeleteBtn: false,
  captions: [],
  permissions: {
    view: true,
    viewMessages: true,
    ask: true,
    addNote: true,
  },
  ticketingKey: "",
  filterObject: null,
  noteModal: false,
};

export const ticketingSlice = createSlice({
  name: "ticketing",
  initialState: { value: initialStateValue },
  reducers: {
    ticketing: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetTicketing: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { ticketing, resetTicketing } = ticketingSlice.actions;

export default ticketingSlice.reducer;
