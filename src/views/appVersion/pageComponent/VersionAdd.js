import React, { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import Dictionary from "helpers/Dictionary";
import AddIcon from "assets/images/icon/Add.svg";
import Close from "assets/images/icon/Close.svg";
import Delete from "assets/images/icon/Delete.svg";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import Variables from "assets/styles/_Variables.scss";
import { useDispatch, useSelector } from "react-redux";
import Classes from "../styles/AppVersions.module.scss";
import FormComponent from "components/form/FormComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import TextAreaComponent from "components/textArea/TextArea";
import InputComponent from "components/input/InputComponent";
import ButtonComponent from "components/button/ButtonComponent";
import SwitchComponent from "components/switch/SwitchComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import SelectComponent from "components/SelectComponent/SelectComponent";
import { addNewVersion, getLatestAppVersions } from "helpers/APIFunction";
import {
  versions,
  versionsState,
} from "store/reducers/versions/versionsReducer";

const VersionAdd = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const [newLinks, setNewLinks] = useState();
  const AppVersionsData = useSelector(versionsState);
  const {
    showAddNewVersionModal,
    addLink,
    links,
    forceUpdate,
    refresh,
    preLive,
    operating_system,
    app_version,
    description,
    record,
    checkSums,
    addCheckSum,
  } = AppVersionsData;

  useEffect(() => {
    form.resetFields();
  }, []);

  useEffect(() => {
    getLatestAppVersions()
      .then((res) => {
        dispatch(versions({ record: res?.data }));
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  }, []);

  useEffect(() => {
    const convert = {};
    links.forEach((item) => {
      convert[item?.app] = item.link;
    });
    if (addLink[0]?.app) {
      convert[addLink[0].app] = addLink[0].link;
    }
    setNewLinks(convert);
  }, [links, addLink]);

  const onFinish = () => {
    if (links.length > 0 || addLink.length > 0) {
      let convertCheckSums = [];
      if (
        operating_system === "BROWSER" ||
        addCheckSum.length > 0 ||
        checkSums.length > 0
      ) {
        if (
          operating_system !== "BROWSER" &&
          addCheckSum.length > 0 &&
          addCheckSum[0] !== ""
        ) {
          addCheckSum.forEach((item) => {
            convertCheckSums.push(item);
          });
        }
        addNewVersion({
          operating_system: operating_system,
          app_version: app_version,
          download_links: newLinks,
          description: description,
          checksums: convertCheckSums,
          pre_live: preLive ? preLive : false,
          force_update: forceUpdate ? forceUpdate : false,
        })
          .then(() => {
            dispatch(
              versions({
                showAddNewVersionModal: false,
                refresh: !refresh,
                links: [],
                addLink: [],
                showAddNewVersionModal: false,
                preLive: false,
                forceUpdate: false,
                description: "",
                app_version: "",
                operating_system: "",
                record: "",
                description: "",
                record: "",
                checkSums: [],
                addCheckSum: [],
              })
            );
            form.resetFields();
          })
          .catch(() => errorHandler(errorResponse));
      } else {
        dispatch(
          setNotificationData({
            message: "حداقل باید یک چکسام اضافه شود.",
            type: "error",
            time: 5000,
          })
        );
      }
    } else {
      dispatch(
        setNotificationData({
          message: "حداقل باید یک لینک دانلود اضافه شود.",
          type: "error",
          time: 5000,
        })
      );
    }
  };

  const handleAddLink = () => {
    if (addLink?.length === 0) {
      dispatch(versions({ addLink: [{ app: "", link: "" }] }));
    } else if (addLink?.length !== 0 && addLink[0]?.app !== "") {
      dispatch(
        versions({
          links: [addLink[0], ...links],
          addLink: [{ app: "", link: "" }],
        })
      );
    }
  };

  const handleAddCheckSum = () => {
    if (addCheckSum?.length === 0) {
      dispatch(versions({ addCheckSum: [""] }));
    } else if (addCheckSum?.length > 0) {
      dispatch(
        versions({
          checkSums: [addCheckSum[0], ...checkSums],
          addCheckSum: [""],
        })
      );
    }
  };

  const handleChangeLink = (e, key) => {
    const list = [...links];
    const find = list.indexOf(list.find((node) => node.app === key));
    list[find] = { app: key, link: e.target.value };
    dispatch(versions({ links: list }));
  };

  const handleChangeCheckSums = (e, key) => {
    const list = [...checkSums];
    const find = list.findIndex((node) => node === key);
    list[find] = e.target.value;
    dispatch(versions({ checkSums: list }));
  };

  const onClose = () => {
    form.resetFields();
    dispatch(
      versions({
        showAddNewVersionModal: false,
        links: [],
        addLink: [],
        showAddNewVersionModal: false,
        preLive: false,
        forceUpdate: false,
        description: "",
        app_version: "",
        operating_system: "",
        record: "",
        description: "",
        record: "",
        checkSums: [],
        addCheckSum: [],
      })
    );
  };

  const OSList = [
    { id: 1, value: "ANDROID", text: "ANDROID" },
    { id: 2, value: "IOS", text: "IOS" },
    { id: 3, value: "BROWSER", text: "BROWSER" },
  ];

  const onChangeOperationSystem = (e) => {
    if (record?.ANDROID && record?.BROWSER && record?.IOS) {
      let newLinks = [];
      let newChecksums = [];
      switch (e) {
        case "ANDROID":
          Object.keys(record?.ANDROID?.download_links).forEach(
            (item, index) => {
              newLinks.push({
                app: item,
                link: Object.values(record?.ANDROID?.download_links)[index],
              });
            }
          );
          // newChecksums = record?.ANDROID.checksums;
          break;
        case "BROWSER":
          Object.keys(record?.BROWSER?.download_links).forEach(
            (item, index) => {
              newLinks.push({
                app: item,
                link: Object.values(record?.BROWSER?.download_links)[index],
              });
            }
          );
          newChecksums = false;
          break;
        case "IOS":
          Object.keys(record?.IOS?.download_links).forEach((item, index) => {
            newLinks.push({
              app: item,
              link: Object.values(record?.IOS?.download_links)[index],
            });
          });
          // newChecksums = record?.IOS.checksums;
          break;
        default:
          break;
      }
      dispatch(
        versions({
          operating_system: e,
          links: newLinks,
          checkSums: newChecksums,
        })
      );
    } else {
      dispatch(versions({ operating_system: e }));
      dispatch(
        setNotificationData({
          message: "رکورد مورد نظر پیدا نشد.",
          type: "error",
          time: 3000,
        })
      );
    }
  };

  const handleDeleteLink = (item) => {
    const del = { ...record.download_links };
    delete del[item];
    dispatch(
      versions({
        record: { ...record, download_links: del },
        links: links.filter((node) => node.app !== item),
      })
    );
  };

  const handleDeleteCheckSums = (item) => {
    dispatch(
      versions({ checkSums: checkSums.filter((node) => node !== item) })
    );
  };

  return (
    <ModalComponent
      width={918}
      title={`${Dictionary.add} ${Dictionary.newVersion} `}
      open={showAddNewVersionModal}
      maskClosable={false}
      onCancel={onClose}
    >
      <FormComponent
        layout="vertical"
        className={Classes["formContainer"]}
        form={form}
        ref={formRef}
        onFinish={onFinish}
        requiredMark={false}
      >
        <div className={Classes["row"]}>
          <FormItemComponent
            shouldUpdate
            name="status"
            label={Dictionary.type + " " + Dictionary.system}
            className={Classes["details-info-form-select"]}
            rules={[{ required: true, message: Dictionary.require }]}
          >
            <SelectComponent
              name="status"
              showSearch={false}
              className={Classes["details-info-select"]}
              placeholder={Dictionary.selectOne}
              items={OSList}
              onChange={(e) => onChangeOperationSystem(e)}
            />
          </FormItemComponent>
          <FormItemComponent
            name="app_version"
            label={Dictionary.version}
            rules={[
              { required: true, message: Dictionary.require },
              {
                pattern: /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/,
                message: Dictionary.checkInput,
              },
            ]}
          >
            <InputComponent
              className={Classes["inputModal"]}
              onChange={(e) =>
                dispatch(versions({ app_version: e.target.value }))
              }
              width={343}
              placeholder={Dictionary.version}
              name="app_version"
            />
          </FormItemComponent>
        </div>
        <div className={Classes["row"]}>
          <FormItemComponent name="force_update">
            <div className={Classes["switch-container"]}>
              <span>Force Update</span>
              <SwitchComponent
                defaultChecked={forceUpdate}
                onChange={() =>
                  dispatch(versions({ forceUpdate: !forceUpdate }))
                }
              />
            </div>
          </FormItemComponent>
          <FormItemComponent name="pre_live">
            <div className={Classes["switch-container"]}>
              <span>Pre Live</span>
              <SwitchComponent
                defaultChecked={preLive}
                onChange={() => dispatch(versions({ preLive: !preLive }))}
              />
            </div>
          </FormItemComponent>
        </div>
        {operating_system && operating_system !== "BROWSER" && (
          <div className={Classes["add-link-container"]}>
            <div className={Classes["add-link-first-line"]}>
              <p>CheckSums</p>
              <div onClick={handleAddCheckSum}>
                <CustomIcon src={AddIcon} />
                <span>CheckSum</span>
              </div>
            </div>
            <div>
              {/* checksums */}
              {checkSums?.map((item, index) => (
                <div className={Classes["linkRow"]} key={index}>
                  <div></div>
                  <label>
                    <span>CheckSum</span>
                    <input
                      name="checksum"
                      type="text"
                      defaultValue={item}
                      onChange={(e) => handleChangeCheckSums(e, item)}
                      placeholder="CheckSum"
                    />
                  </label>
                  <CustomIcon
                    src={Delete}
                    size={24}
                    name={`delete-icon${index}`}
                    onClick={() =>
                      checkSums?.length > 1 ? handleDeleteCheckSums(item) : ""
                    }
                    color={
                      checkSums?.length > 1
                        ? Variables.NotifRed
                        : Variables.NotifPink
                    }
                    cursor={checkSums?.length > 1 ? "pointer" : "default"}
                  />
                </div>
              ))}
              {/* add checksum */}
              {addCheckSum?.map((item, index) => (
                <div className={Classes["linkRow"]} key={index}>
                  <div></div>
                  <label>
                    <span>CheckSum</span>
                    <input
                      type="text"
                      value={item}
                      placeholder="CheckSum"
                      onChange={(e) =>
                        dispatch(versions({ addCheckSum: [e.target.value] }))
                      }
                    />
                  </label>
                  <CustomIcon
                    src={Close}
                    name={`close-icon-${item}`}
                    color={Variables.NotifRed}
                    size={24}
                    onClick={() => dispatch(versions({ addCheckSum: [] }))}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={Classes["add-link-container"]}>
          <div className={Classes["add-link-first-line"]}>
            <p>{Dictionary.downloadLinks}</p>
            <div onClick={handleAddLink}>
              <CustomIcon src={AddIcon} />
              <span>{Dictionary.newLink}</span>
            </div>
          </div>
          <div>
            {/* links */}
            {links.map((item) => (
              <div className={Classes["linkRow"]} key={item.app}>
                <label>
                  <span>{Dictionary.appStore}</span>
                  <input
                    name="app"
                    type="text"
                    defaultValue={item.app}
                    disabled
                    placeholder={Dictionary.appStore}
                  />
                </label>
                <label>
                  <span>{Dictionary.link}</span>
                  <input
                    name="link"
                    type="text"
                    defaultValue={item.link}
                    onChange={(e) => handleChangeLink(e, item.app)}
                    placeholder={Dictionary.link}
                  />
                </label>
                <CustomIcon
                  src={Delete}
                  size={24}
                  name={`delete-icon${item.app}`}
                  onClick={() =>
                    links?.length > 1 ? handleDeleteLink(item.app) : ""
                  }
                  color={
                    links?.length > 1 ? Variables.NotifRed : Variables.NotifPink
                  }
                  cursor={links?.length > 1 ? "pointer" : "default"}
                />
              </div>
            ))}
            {/* add link */}
            {addLink?.map((item, index) => (
              <div className={Classes["linkRow"]} key={index}>
                <label>
                  <span>{Dictionary.appStore}</span>
                  <input
                    name="app"
                    type="text"
                    value={item.app}
                    placeholder={Dictionary.appStore}
                    onChange={(e) =>
                      dispatch(
                        versions({
                          addLink: [{ ...addLink[0], app: e.target.value }],
                        })
                      )
                    }
                  />
                </label>
                <label>
                  <span>{Dictionary.link}</span>
                  <input
                    type="text"
                    value={item.link}
                    placeholder={Dictionary.link}
                    onChange={(e) =>
                      dispatch(
                        versions({
                          addLink: [{ ...addLink[0], link: e.target.value }],
                        })
                      )
                    }
                  />
                </label>
                <CustomIcon
                  src={Close}
                  name={`close-icon${item.app}`}
                  color={Variables.NotifRed}
                  size={24}
                  onClick={() => dispatch(versions({ addLink: [] }))}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={Classes["textAreaContainer"]}>
          <p>{Dictionary.modifiedFeatures}</p>
          <FormItemComponent
            name="description"
            rules={[{ required: true, message: Dictionary.require }]}
          >
            <TextAreaComponent
              className={Classes["textArea"]}
              onChange={(e) =>
                dispatch(versions({ description: e.target.value.split("\n") }))
              }
              placeholder={Dictionary.modifiedFeatures}
              name="description"
              rows={8}
            />
          </FormItemComponent>
          <p className={Classes["attention"]}>
            هر مورد با اینتر جدا شود. متن فوق عینا به مشتری نمایش داده می‌شود،
            خواهشمند است موارد مختصر و مفید نوشته شود.
          </p>
        </div>
        <FormItemComponent className={Classes["versionEditButton"]}>
          <ButtonComponent
            classNameBtn={Classes["confirmBtn"]}
            type="primary"
            htmlType="submit"
          >
            {Dictionary.confirm}
          </ButtonComponent>
          <ButtonComponent
            classNameBtn={Classes["cancelBtn"]}
            type="default"
            onClick={onClose}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default VersionAdd;
