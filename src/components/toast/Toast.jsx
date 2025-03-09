import React from "react";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuccessIcon from "assets/images/icon/Success.svg";
import WarningIcon from "assets/images/icon/Unknown.svg";
import CustomIcon from "components/customIcon/CustomIcon";
import Variables from "assets/styles/_Variables.scss";

const Toast = ({ message, type, time }) => {
  let toastNotification = null;

  if (type === "success") {
    toastNotification = toast.success;
  } else if (type === "error") {
    toastNotification = toast.error;
  } else if (type === "info") {
    toastNotification = toast.info;
  } else if (type === "warning") {
    toastNotification = toast.warning;
  }
  toastNotification &&
    toastNotification(message, {
      position: "top-center",
      autoClose: time,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      icon: () => (
        <CustomIcon
          src={type === "success" ? SuccessIcon : WarningIcon}
          name={`SetNotificationData-com-${type}`}
          size={20}
          color={
            type === "success"
              ? Variables.GreenDark1
              : type === "error"
              ? Variables.NotifRed
              : type === "warning"
              ? Variables.NarenjiLight4
              : Variables.GreyDark1
          }
        />
      ),
    });

  return (
    <ToastContainer autoClose={time} limit={1} position="top-center" hideProgressBar newestOnTop={false} closeOnClick rtl={true} transition={Flip} />
  );
};

export default Toast;
