import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  showDeleteBtn: false,
  addModal: false,
  resultCheck: null,
  showSuccess: false,
  dismissalModal: false,
  reload: false,
  accNo: "",
  permissions: {
    view: false,
    edit: false,
    create: false,
    viewSetting: false,
    delete: false,
  },
  showDeleteBtnChoose: false,
  signersList: [],
  signerRepresentatives: [],
  agentsList: [],
  expandedRowKeys: false,
  addNewRepresentativeModal: false,
  record: "",
  nationalIdChecked: false,
  resultCheckId: "",
  checkedValue: "",
  reload: false,
  expandedRowKeys: null,
  agentsListAsRecord: [],
  reloadChoose: false,
  showSuccessModal: false,
  nationalId: "",
};

export const representativeSlice = createSlice({
  name: "representative",
  initialState: { value: initialStateValue },
  reducers: {
    representative: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetRepresentative: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { representative, resetRepresentative } = representativeSlice.actions;
export const representativeState = (state) => state.representative.value;
export default representativeSlice.reducer;
