import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  branch_code: "",
  branch_name: "",
  code: "",
  employment_code: "",
  firstname: "",
  lastname: "",
  gender: "",
  identification_code: "",
  mobile_number: "",
  role_menus: [],
  roles: [],
  username: "",
  authorities: [],
  avatar: "https://avatars1.githubusercontent.com/u/8186664?s=460&v=4",
  fullname: "",
  modal: false,
  logoutModal: false,
  theme: "dark",
  openDropDown: false,
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: { value: initialStateValue },
  reducers: {
    userInfo: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetUserInfo: (state, action) => {
      state.value = { ...initialStateValue, ...action.payload };
    },
  },
});

export const { userInfo, resetUserInfo } = userInfoSlice.actions;
export const userInfoState = (state) => state.userInfo.value;
export default userInfoSlice.reducer;
