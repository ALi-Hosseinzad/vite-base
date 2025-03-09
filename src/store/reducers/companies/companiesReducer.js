import { createSlice } from "@reduxjs/toolkit";
const initialStateValue = {
  list: [],
  record: "",
  reload: false,
  addModal: false,
  addPlanModal: false,
  editModal: false,
  viewModal: false,
  editStep: "main",
  logoFile: null,
  initialPlanList: [
    {
      is_active: true,
      planCode: "",
      planName: "",
      loan_amount_values: [],
      payback_period_values: [],
      planLimitBudget: 0,
      mainAccountNumber: "",
      loanType: "",
      branch_code: "",
      company_loan_plan_settlement_detail_list: [{ days: null, destination_account: null, percent: null }],
    },
  ],
  planList: [],
  permissions: {
    read: true,
    create: true,
    update: true,
  },
  activeBranches: [],
  reloadDestinationList: false,
};

export const companiesSlice = createSlice({
  name: "companies",
  initialState: { value: initialStateValue },
  reducers: {
    companies: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetCompanies: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { companies, resetCompanies } = companiesSlice.actions;

export default companiesSlice.reducer;
