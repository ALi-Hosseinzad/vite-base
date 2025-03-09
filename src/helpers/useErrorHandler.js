import { useDispatch } from "react-redux";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { useNavigate } from "react-router-dom";
import { setTimeOute } from "store/reducers/timeOut/timeOutReducer";
const useErrorHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (error) => {
    if (error?.networkError?.message === "Network Error") {
      dispatch(
        setNotificationData({
          message: "اینترنت قطع می‌باشد. دوباره تلاش کنید",
          type: "error",
          time: 5000,
        })
      );
    } else if (error?.networkError?.code === "ECONNABORTED") {
      dispatch(
        setNotificationData({
          message: "پاسخی از سمت سرور دریافت نشد.",
          type: "error",
          time: 5000,
        })
      );
    } else if (error?.error?.status === 500) {
      dispatch(
        setNotificationData({
          message:
            error.error?.data?.error_message || "پاسخی از سمت سرور دریافت نشد.",
          type: "error",
          time: 5000,
        })
      );
    } else if (error?.error?.status === 504) {
      dispatch(
        setNotificationData({
          message:
            error.error?.data?.error_message || "پاسخی از سمت سرور دریافت نشد.",
          type: "error",
          time: 5000,
        })
      );
    } else if (error?.error?.status === 404) {
      dispatch(
        setNotificationData({
          message: error.error?.data?.error_message || "پاسخی یافت نشد",
          type: "error",
          time: 5000,
        })
      );
    } else if (error?.error?.status === 401) {
      dispatch(setTimeOute(true));
    } else if (error?.error) {
      dispatch(
        setNotificationData({
          message: error?.error?.data?.error_message,
          type: "error",
          time: 5000,
        })
      );
    }
  };
};
export default useErrorHandler;
