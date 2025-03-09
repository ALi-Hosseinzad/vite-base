import React, { useEffect, useState } from "react";
import Classes from "./dlImg.module.scss";
import { useDispatch } from "react-redux";
import Dictionary from "helpers/Dictionary";
import PDF from "assets/images/content/PDF.png";
import Refresh from "assets/images/icon/Refresh.svg";
import Frame from "assets/images/placeholder/Frame.png";
import CustomIcon from "components/customIcon/CustomIcon";
import DownloadIcon from "assets/images/icon/Download.svg";
import ButtonComponent from "components/button/ButtonComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import { setNotificationData } from "store/reducers/toast/toastReducer";

const DownloadableImg = ({
  item,
  onClick,
  className,
  label,
  loading,
  error,
  tryAgain,
  viewText,
  downloadText,
}) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState({ width: 350, height: 350 });
  const isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  const loadImage = (imageUrl) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      if (img.width <= 1400 || img.height <= 650) {
        setState({ height: img.height, width: img.width });
      } else if (img.width > 1400 || img.height > 650) {
        setState({ width: 1400, height: 650 });
      }
    };
    img.onerror = (err) => {
      console.error(err);
    };
  };

  useEffect(() => {
    if (item.file && item.type !== "pdf") {
      loadImage(item.file);
    }
  }, [item.file]);

  return (
    <div
      className={`${Classes["authenticated-customer-docs-item"]} ${className}`}
      key={item?.id}
    >
      {item?.file && (
        <ModalComponent
          open={showModal}
          width={item.type !== "pdf" ? state.width + 48 : 800}
          className={Classes["download-image-modal"]}
          style={
            item.type !== "pdf"
              ? { height: state.height + 76 }
              : { height: 650 }
          }
          onCancel={() => setShowModal(false)}
        >
          {item.type !== "pdf" && (
            <img
              alt={`big-size-image-${item.id}`}
              src={item?.file}
              width={state.width}
              height={state.height}
            />
          )}
          {item.type === "pdf" && (
            <iframe
              width="100%"
              height={590}
              src={item.file}
              allowfullscreen="true"
              allow="clipboard-write"
              style={{ border: "none", overflow: "hidden" }}
            />
          )}
        </ModalComponent>
      )}
      <label className={Classes["authenticated-customer-docs-label"]}>
        {label}
      </label>
      <div className={Classes["authenticated-customer-img"]}>
        {loading || item.viewImage ? (
          <img
            src={Frame}
            style={{ margin: "0 auto" }}
            width={74}
            height={80}
          />
        ) : item.type === "pdf" ? (
          <img
            src={PDF}
            width={148}
            height={196}
            onClick={
              isChrome
                ? () =>
                    dispatch(
                      setNotificationData({
                        message: Dictionary.notSupported,
                        type: "warning",
                        time: 5000,
                      })
                    )
                : () => setShowModal(true)
            }
            style={{ cursor: "pointer" }}
          />
        ) : (
          <img
            src={item?.file}
            width={148}
            height={196}
            onClick={() => setShowModal(true)}
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
      {error ? (
        <div
          className={Classes["loading-button"]}
          style={{ cursor: "pointer" }}
          onClick={tryAgain}
        >
          <CustomIcon src={Refresh} size={24} />
          <span>{Dictionary.tryAgain}</span>
        </div>
      ) : loading ? (
        <div className={Classes["loading-button"]}>
          <div className={Classes["spinner"]} />
        </div>
      ) : item.viewImage ? (
        <ButtonComponent
          type="secondary"
          htmlType={Dictionary.download}
          onClick={() => onClick()}
        >
          {viewText ? viewText : Dictionary.show + " " + Dictionary.image}
        </ButtonComponent>
      ) : (
        <ButtonComponent
          type="secondary"
          htmlType={Dictionary.download}
          onClick={() => onClick()}
          srcRight={DownloadIcon}
          colorRight="#2B9570"
        >
          {downloadText ? downloadText : Dictionary.download}
        </ButtonComponent>
      )}
    </div>
  );
};

export default DownloadableImg;
