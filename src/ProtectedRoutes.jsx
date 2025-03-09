import Dictionary from "helpers/Dictionary";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { setNotificationData } from "store/reducers/toast/toastReducer";

const ProtectedRoutes = ({ roles, children }) => {
  const dispatch = useDispatch();
  const userInfoData = useSelector((state) => state.userInfo.value);
  if ((userInfoData.list_role_menu || userInfoData.username) && !roles) {
    useEffect(() => {
      dispatch(
        setNotificationData({
          message: Dictionary.accessPage,
          type: "error",
          time: 5000,
        })
      );
    }, [roles]);
    return <Navigate to="/home" replace />;
  }
  return children ? children : <Outlet />;
};
export default ProtectedRoutes;
