import { getCurrentUser } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import { produce } from "immer";
import { userInfo } from "store/reducers/userInfo/UserInfoReducer";

export const getUserInfo = (errorHandler) => {
  return async (dispatch) => {
    getCurrentUser()
      .then((res) => {
        const roleMenus = new Set();
        const usersRoleMenus = produce(roleMenus, (draft) => {
          res?.data?.role_menus.forEach((node) => draft.add(node.menu_key));
        });
        const authorities = res?.data?.authorities?.map(
          (item) => item?.authority_key
        );
        dispatch(
          userInfo({
            branch_code: res?.data?.branch_code,
            branch_name: res?.data?.branch_name,
            code: res?.data?.code,
            employment_code: res?.data?.employment_code,
            firstname: res?.data?.firstname,
            lastname: res?.data?.lastname,
            gender: res?.data?.gender,
            identification_code: res?.data?.identification_code,
            mobile_number: res?.data?.mobile_number,
            role_menus: res?.data?.role_menus,
            list_role_menu: usersRoleMenus,
            roles: res?.data?.roles,
            username: res?.data?.username,
            authorities: authorities,
            fullname: res.data.firstname + " " + res.data.lastname,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };
};
