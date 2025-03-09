import React, { useEffect } from "react";
import HomeIMG from "assets/images/content/HomeHibank.png";
import Classes from "views/home/styles/Home.module.scss";
import { useDispatch } from "react-redux";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { transferHamAfarinData } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";

const HamAfarin = () => {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();

  useEffect(() => {
    transferHamAfarinData()
      .then(() => {
        dispatch(
          setNotificationData({
            message: "به به ،عالی شد!",
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
      <p className={Classes["home-version"]}>hamafarin</p>
    </div>
  );
};
export default HamAfarin;
