import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Dictionary from "helpers/Dictionary";
import PDF from "assets/images/content/PDF.png";
import Delete from "assets/images/icon/Delete.svg";
import Refresh from "assets/images/icon/Refresh.svg";
import UploadIcon from "assets/images/icon/Upload.svg";
import Frame from "assets/images/placeholder/Frame.png";
import CustomIcon from "components/customIcon/CustomIcon";
import DownloadIcon from "assets/images/icon/Download.svg";
import InputComponent from "components/input/InputComponent";
import ButtonComponent from "components/button/ButtonComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import Classes from "components/uploadImage/UploadImage.module.scss";
import ModalComponent from "components/modalComponent/ModalComponent";
import { setNotificationData } from "store/reducers/toast/toastReducer";

const UploadImage = (props) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState({ width: 350, height: 350 });
  const [documentName, setDocumentName] = useState({ value: "", error: false });
  const {
    item,
    onClick,
    className,
    tryAgain,
    uploadFile,
    onDelete,
    defaultName = false,
  } = props;
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
      console.log("img error");
      console.error(err);
    };
  };
  useEffect(() => {
    if (item.file && item.type !== "pdf") {
      loadImage(item.file);
    }
  }, [item.file]);

  const handleChange = (e) => {
    if (documentName.value.length > 0 || defaultName) {
      console.log(":SDG", e);
      const file = e.target.files[0];
      if (file) {
        uploadFile(file, item.key, documentName.value);
      }
    } else {
      setDocumentName({ ...documentName, error: Dictionary.require });
    }
  };

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
              src={item.file}
              style={{
                height: "590px",
                width: "100%",
                border: "none",
                overflow: "hidden",
              }}
            ></iframe>
          )}
        </ModalComponent>
      )}
      {item?.upload && !defaultName ? (
        <>
          <InputComponent
            maxLength={35}
            name="name"
            autoFocus={true}
            value={documentName.value}
            className={Classes["name-input"]}
            status={documentName.error ? "error" : ""}
            whiteList={/[^\u0600-\u06FF-\u00200-9]/g}
            onChange={(e) =>
              setDocumentName({ value: e.target.value, error: false })
            }
            placeholder={`${Dictionary.name} ${Dictionary.documentary}`}
          />
          <span className={Classes["text-error"]}>{documentName.error}</span>
        </>
      ) : (
        <label className={Classes["authenticated-customer-docs-label"]}>
          {item.name}
        </label>
      )}
      <div className={Classes["authenticated-customer-img"]}>
        {item?.file && item?.type === "pdf" ? (
          <img
            src={PDF}
            width="148"
            height="196"
            typemustmatch={false}
            style={
              item.loadingUpload ? { opacity: 0.5 } : { cursor: "pointer" }
            }
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
          />
        ) : item?.file && item.type !== "pdf" ? (
          <img
            src={item?.file}
            width={148}
            height={196}
            onClick={() => setShowModal(true)}
            style={
              item.loadingUpload ? { opacity: 0.5 } : { cursor: "pointer" }
            }
          />
        ) : (
          <img
            src={Frame}
            style={{ margin: "0 auto" }}
            width={74}
            height={80}
          />
        )}
        {item?.loadingUpload && (
          <div className={Classes["loading"]}>
            <div className={Classes["spinner-2"]} />
          </div>
        )}
        {item?.file && item?.canDelete && (
          <div className={Classes["delete"]} onClick={onDelete}>
            <TooltipComponent title={Dictionary.delete}>
              <CustomIcon src={Delete} size={24} name="delete" />
            </TooltipComponent>
          </div>
        )}
      </div>
      {item?.error && (
        <div
          className={Classes["loading-button"]}
          style={{ cursor: "pointer" }}
          onClick={tryAgain}
        >
          <CustomIcon src={Refresh} size={24} name="refresh" />
          <span>{Dictionary.tryAgain}</span>
        </div>
      )}
      {(item?.loading || item?.loadingUpload) && (
        <div className={Classes["loading-button"]}>
          <div className={Classes["spinner"]} />
        </div>
      )}
      {!item.error &&
        !item?.loading &&
        !item?.loadingUpload &&
        item?.upload && (
          <div className={Classes["upload-section"]}>
            <CustomIcon
              name="upload-file-png-add-modal"
              src={UploadIcon}
              size={24}
            />
            <input
              type={documentName.value || defaultName ? "file" : "submit"}
              accept=".png , .jpg, .jpeg, .pdf"
              name="file"
              onChange={handleChange}
              onClick={handleChange}
            />
            <span>{Dictionary.upload}</span>
          </div>
        )}
      {!item?.loading &&
        !item?.loadingUpload &&
        !item?.upload &&
        !item?.error &&
        item?.viewImage && (
          <ButtonComponent
            type="secondary"
            htmlType="button"
            onClick={() => onClick()}
          >
            {Dictionary.show} {Dictionary.documentary}
          </ButtonComponent>
        )}
      {!item?.loading &&
        !item?.loadingUpload &&
        !item?.viewImage &&
        !item?.upload &&
        !item?.error && (
          <ButtonComponent
            type="secondary"
            htmlType="button"
            onClick={() => onClick()}
            srcRight={DownloadIcon}
            colorRight="#2B9570"
          >
            {Dictionary.downloadDoc}
          </ButtonComponent>
        )}
    </div>
  );
};

export default UploadImage;
