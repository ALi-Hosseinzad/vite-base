import Dictionary from "helpers/Dictionary";
import React from "react";
import Classes from "../styles/Versions.module.scss";
import ButtonComponent from "components/button/ButtonComponent";

const VersionDetails = ({ type, onCancel, list }) => {
  return (
    <>
      <div className={Classes["eyeModalContainer"]}>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.systemType}</p>
          <p>{list.record.operating_system}</p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.minVersion}</p>
          <p>{list.record.min_version}</p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>{type ? Dictionary.versionNumber : Dictionary.currentVersion}</p>
          <p>{list.record.current_version}</p>
        </div>
        {type ? (
          <>
            <div className={Classes["eyeRow"]}>
              <p>{Dictionary.date}</p>
              <p>{list.record.date ? list.record.date?.split(" ")[0] : "--"}</p>
            </div>
            <div className={Classes["eyeRow"]}>
              <p>{Dictionary.hour}</p>
              <p>{list.record.date ? list.record.date?.split(" ")[1] : "--"}</p>
            </div>
          </>
        ) : (
          list?.record?.operating_system?.toLowerCase() !== "browser" && (
            <>
              <div className={Classes["eyeRow"]}>
                <p>CheckSum</p>
                <p>
                  {list.checkSums.find((item) => item.version === list.record.current_version)
                    ? list.checkSums.find((item) => item.version === list.record.current_version)?.checksum
                    : "--"}
                </p>
              </div>
              <div className={Classes["eyeRow"]}>
                <p>Force Update</p>
                <p>{list.checkSums.find((item) => item.version === list.record.current_version).forceVersion ? Dictionary.yes : Dictionary.no}</p>
              </div>
            </>
          )
        )}
        <div className={Classes["eyeRow-link"]}>
          <p>{Dictionary.downloadLinks}</p>
          <div className={Classes["links-container"]}>
            {list.links
              ? list.links?.map((item) => (
                  <div className={Classes["links-row"]}>
                    <div className={Classes["links-row-key"]}>
                      <p>{item?.app}</p>
                    </div>
                    <div className={Classes["links-row-value"]}>
                      <p className={Classes["eyeLink"]}>
                        <a target="_blank" href={item?.link}>
                          {item?.link}
                        </a>
                      </p>
                    </div>
                  </div>
                ))
              : "--"}
          </div>
        </div>
        <div className={Classes["featuresRow"]}>
          <p>{Dictionary.modifiedfeatures}</p>
          {list.record?.description?.map((item) => (
            <p style={{ margin: "4px 0px" }}>{item}</p>
          ))}
        </div>
      </div>
      <ButtonComponent classNameBtn={Classes["eyeModalBtn"]} onClick={() => onCancel()} type="primary" htmlType={Dictionary.close}>
        {Dictionary.close}
      </ButtonComponent>
    </>
  );
};

export default VersionDetails;
