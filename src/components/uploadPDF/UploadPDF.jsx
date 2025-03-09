import React, { useState } from "react";
import ButtonComponent from "components/button/ButtonComponent";
import Classes from "./UploadPDF.module.scss";
import DownloadIcon from "assets/images/icon/Download.svg";
import UploadIcon from "assets/images/icon/Upload.svg";
import Dictionary from "helpers/Dictionary";
import Refresh from "assets/images/icon/Refresh.svg";
import CustomIcon from "components/customIcon/CustomIcon";
import Delete from "assets/images/icon/Delete.svg";
import TooltipComponent from "components/tooltip/TooltipComponent";

const UploadPDF = (props) => {
  const [documentName, setDocumentName] = useState({ value: "", error: false });
  const { item, onClick, className, uploadFile, onDelete, defaultName = false } = props;

  const handleChange = (e) => {
    if (documentName.value.length > 0 || defaultName) {
      const file = e.target.files[0];
      if (file) {
        uploadFile(file, item.key, defaultName ? defaultName : documentName.value);
      }
    } else {
      setDocumentName({ ...documentName, error: Dictionary.require });
    }
  };

  return (
    <div className={`${Classes["authenticated-customer-docs-item"]} ${className}`} key={item?.id}>
      <label className={Classes["authenticated-customer-docs-label"]}>{item.name}</label>
      <div className={Classes["row"]}>
        {item.upload ? (
          item?.loading ? (
            <div className={Classes["loading-button"]}>
              <div className={Classes["spinner"]} />
            </div>
          ) : (
            <div className={Classes["upload-section"]}>
              <CustomIcon name="upload-file-png-add-modal" src={UploadIcon} size={24} />
              <input
                name="file"
                onClick={handleChange}
                onChange={handleChange}
                accept=".png , .jpg, .jpeg, .pdf"
                type={documentName.value || defaultName ? "file" : "submit"}
              />
              <span>{Dictionary.upload}</span>
            </div>
          )
        ) : (
          <>
            <div className={Classes["delete"]} onClick={onDelete}>
              <TooltipComponent title={Dictionary.delete}>
                <CustomIcon src={Delete} size={24} name="delete" />
              </TooltipComponent>
            </div>
            {item?.loading ? (
              <div className={Classes["loading-button"]}>
                <div className={Classes["spinner"]} />
              </div>
            ) : item?.error ? (
              <div className={Classes["loading-button"]} style={{ cursor: "pointer" }} onClick={onClick}>
                <CustomIcon src={Refresh} size={24} name="refresh" />
                <span>{Dictionary.tryAgain}</span>
              </div>
            ) : (
              <ButtonComponent type="secondary" onClick={onClick} srcRight={DownloadIcon} colorRight="#2B9570">
                {Dictionary.justDownload}
              </ButtonComponent>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UploadPDF;
