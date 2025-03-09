import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  dailyList: [],
  reasonList: [],
  record: "",
  item: "",
  addModal: false,
  detailsModal: false,
  editModal: false,
  step: "",
  showDeleteBtn: false,
  total: 1,
  is_enabled: true,
  showAddReason: false,
  type: "",
  showEditSettingModal: false,
  is_control: false,
  sortBy: "-createdDate",
  reloadDaily: false,
  reload: false,
  permissions: {
    view: false,
    edit: false,
    create: false,
    editSetting: false,
    viewSetting: false,
  },
};

export const payaSatnaPolSlice = createSlice({
  name: "payaSatnaPol",
  initialState: { value: initialStateValue },
  reducers: {
    payaSatnaPol: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetPayaSatnaPol: (state) => {
      state.value = { ...initialStateValue };
    },
  },
});

export const { payaSatnaPol, resetPayaSatnaPol } = payaSatnaPolSlice.actions;
export const payaSatnaPolState = (state) => state.payaSatnaPol.value;
export default payaSatnaPolSlice.reducer;
