import React, { useEffect } from "react";
import HomeIMG from "assets/images/content/HomeHibank.png";
import Classes from "views/home/styles/Home.module.scss";
import { useDispatch } from "react-redux";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import { updateAccountsType } from "helpers/APIFunction";

const UpdateAccounts = () => {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();

  useEffect(() => {
    updateAccountsType()
      .then(() => {
        dispatch(
          setNotificationData({
            message: "اع اینکه امینٍ! پس پاسیبل کجا رفتش !؟ عجب!!!",
            type: "success",
            time: 5000,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  }, []);

  return (
    <div className={Classes["home"]}>
      <img src={HomeIMG} className={Classes["home-img"]} />
      <p className={Classes["home-version"]}>بروزرسانی حساب‌ها</p>
    </div>
  );
};
export default UpdateAccounts;
