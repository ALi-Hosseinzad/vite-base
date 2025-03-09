import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  list: [],
  type: "",
  record: {},
  totalRows: 0,
  type_fee: "",
  status: false,
  reloadList: false,
  editFeeModal: false,
  showDeleteBtn: false,
  showCollapse: "yes-2",
  expandedRowKeys: null,
  beneficiaryListAsRecord: [],
  permissions: { view: false, edit: false },
};

export const feeSlice = createSlice({
  name: "fee",
  initialState: { value: initialStateValue },
  reducers: {
    fee: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetFee: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { fee, resetFee } = feeSlice.actions;
export const feeState = (state) => state.fee.value;
export default feeSlice.reducer;
