import React, { useState } from "react";
import Classes from "components/uploadFile/uploadFile.module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
import UploadIcon from "assets/images/icon/Upload.svg";
import RemoveIcon from "assets/images/icon/Close.svg";
import Variables from "assets/styles/_Variables.scss";

const UploadFile = ({ title, file, setFile }) => {
  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className={Classes["uploader-input"]}>
      <p>{title}</p>
      <div onChange={handleChange} className={Classes["upload-field-container"]}>
        {file ? (
          <>
            <p className={Classes["file-name"]}>{file?.name}</p>
            <div className={Classes["preview-image"]}>
              <CustomIcon name="remove-file-png-add-modal" src={RemoveIcon} size={24} color={Variables.GreenDark1} onClick={() => setFile(null)} />
              <img className={Classes["uploaded-image"]} src={URL.createObjectURL(file)} />
            </div>
          </>
        ) : (
          <div className={Classes["upload-section"]}>
            <CustomIcon name="upload-file-png-add-modal" src={UploadIcon} size={24} />
            <input type="file" accept=".png" name="file" />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
