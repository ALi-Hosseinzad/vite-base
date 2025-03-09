import Dictionary from "helpers/Dictionary";
import React from "react";
import Classes from "../styles/AppVersions.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  versions,
  versionsState,
} from "store/reducers/versions/versionsReducer";
import ModalComponent from "components/modalComponent/ModalComponent";

const VersionDetails = () => {
  const dispatch = useDispatch();
  const AppVersionsData = useSelector(versionsState);
  const { record, showDetailsModal, links } = AppVersionsData;

  const onCancel = () => {
    dispatch(versions({ showDetailsModal: false, record: "", links: [] }));
  };

  return (
    <ModalComponent
      width={918}
      title={`${Dictionary.version} ${record?.app_version} ${Dictionary.system} ${record?.operating_system}`}
      open={showDetailsModal}
      maskClosable={false}
      onCancel={onCancel}
    >
      <div className={Classes["eyeModalContainer"]}>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.type + " " + Dictionary.system}</p>
          <p>{record?.operating_system}</p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.date}</p>
          <p>
            {record?.release_date ? record?.release_date?.split(" ")[0] : "--"}
          </p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.hour}</p>
          <p>
            {record?.release_date ? record?.release_date?.split(" ")[1] : "--"}
          </p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>Force Update</p>
          <p>{record?.force_update ? Dictionary.yes : Dictionary.no}</p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>Pre Live</p>
          <p>{record?.pre_live ? Dictionary.yes : Dictionary.no}</p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.installed}</p>
          <p>
            {record?.installation_count === null
              ? "--"
              : record?.installation_count}
          </p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>
            {Dictionary.installed} {Dictionary.active}
          </p>
          <p>
            {record?.active_installation_count === null
              ? "--"
              : record?.active_installation_count}
          </p>
        </div>
        <div className={Classes["eyeRow-link"]}>
          <p>CheckSums</p>
          <div className={Classes["links-container"]}>
            {record?.checksums?.length > 0
              ? record?.checksums?.map((item, index) => (
                  <div className={Classes["links-row"]} key={index}>
                    <div></div>
                    <div className={Classes["links-row-value"]}>
                      <p className={Classes["eyeLink"]}>{item}</p>
                    </div>
                  </div>
                ))
              : "--"}
          </div>
        </div>
        <div className={Classes["eyeRow-link"]}>
          <p>{Dictionary.downloadLinks}</p>
          <div className={Classes["links-container"]}>
            {links.length > 0
              ? links?.map((item) => (
                  <div className={Classes["links-row"]} key={item.app}>
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
          <p>{Dictionary.modifiedFeatures}</p>
          <ul>
            {record?.description?.map((item) => (
              <li style={{ margin: "4px 0px" }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <ButtonComponent
        classNameBtn={Classes["eyeModalBtn"]}
        onClick={onCancel}
        type="primary"
        htmlType={Dictionary.close}
      >
        {Dictionary.close}
      </ButtonComponent>
    </ModalComponent>
  );
};

export default VersionDetails;
