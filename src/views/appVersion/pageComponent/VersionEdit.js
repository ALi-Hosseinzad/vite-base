import React, { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import Dictionary from "helpers/Dictionary";
import AddIcon from "assets/images/icon/Add.svg";
import Close from "assets/images/icon/Close.svg";
import Delete from "assets/images/icon/Delete.svg";
import { editVersions } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import Variables from "assets/styles/_Variables.scss";
import { useDispatch, useSelector } from "react-redux";
import Classes from "../styles/AppVersions.module.scss";
import FormComponent from "components/form/FormComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import InputComponent from "components/input/InputComponent";
import TextAreaComponent from "components/textArea/TextArea";
import SwitchComponent from "components/switch/SwitchComponent";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import {
  versions,
  versionsState,
} from "store/reducers/versions/versionsReducer";

const VersionEdit = () => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const [newLinks, setNewLinks] = useState();
  const AppVersionsData = useSelector(versionsState);
  const {
    editModal,
    record,
    addLink,
    links,
    forceUpdate,
    refresh,
    preLive,
    checkSums,
    addCheckSum,
    description,
  } = AppVersionsData;
  const descriptions = record?.description?.join("\n");

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      app_version: record?.app_version,
      operating_system: record?.operating_system,
    });
    dispatch(
      versions({ forceUpdate: record?.force_update, preLive: record?.pre_live })
    );
  }, [editModal, record]);

  useEffect(() => {
    const convert = {};
    if (addLink[0]?.app) {
      links.forEach((item) => {
        convert[item?.app] = item.link;
      });
      convert[addLink[0].app] = addLink[0].link;
    } else {
      links.forEach((item) => {
        convert[item?.app] = item.link;
      });
    }
    setNewLinks(convert);
  }, [links, addLink]);

  const onFinish = () => {
    if (record?.operating_system) {
      if (links?.length > 0 || addLink?.length > 0) {
        if (record?.operating_system === "BROWSER") {
          editVersions({
            id: record?.id,
            download_links: newLinks,
            app_version: record?.app_version,
            pre_live: preLive ? true : false,
            force_update: forceUpdate ? true : false,
            operating_system: record?.operating_system,
            description: description || record?.description,
          })
            .then(() => {
              dispatch(
                versions({
                  links: [],
                  record: "",
                  addLink: [],
                  preLive: "",
                  checkSums: [],
                  preLive: false,
                  addCheckSum: [],
                  description: "",
                  editModal: false,
                  refresh: !refresh,
                  forceUpdate: false,
                })
              );
            })
            .catch(() => errorHandler(errorResponse));
        } else {
          if (checkSums?.length > 0 || addCheckSum?.length > 0) {
            let convertCheckSums = [];
            convertCheckSums = [...checkSums];
            if (addCheckSum?.length > 0 && addCheckSum[0] !== "") {
              addCheckSum?.forEach((item) => {
                convertCheckSums.push(item);
              });
            }
            editVersions({
              id: record?.id,
              download_links: newLinks,
              checksums: convertCheckSums,
              app_version: record?.app_version,
              pre_live: preLive ? true : false,
              force_update: forceUpdate ? true : false,
              operating_system: record?.operating_system,
              description: description || record?.description,
            })
              .then(() =>
                dispatch(
                  versions({
                    links: [],
                    record: "",
                    addLink: [],
                    preLive: "",
                    checkSums: [],
                    preLive: false,
                    addCheckSum: [],
                    description: "",
                    editModal: false,
                    refresh: !refresh,
                    forceUpdate: false,
                  })
                )
              )
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
        }
      } else {
        dispatch(
          setNotificationData({
            message: "حداقل باید یک لینک اضافه شود.",
            type: "error",
            time: 3000,
          })
        );
      }
    } else {
      dispatch(
        setNotificationData({
          message: "رکورد یافت نشد.",
          type: "error",
          time: 3000,
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

  const handleChangeLink = (e, key) => {
    const list = [...links];
    const find = list.indexOf(list.find((node) => node.app === key));
    list[find] = { app: key, link: e.target.value };
    dispatch(versions({ links: list }));
  };

  const handleDeleteLink = (item) => {
    const del = { ...record?.download_links };
    delete del[item];
    dispatch(
      versions({
        record: { ...record, download_links: del },
        links: links.filter((node) => node.app !== item),
      })
    );
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

  const handleChangeCheckSums = (e, key) => {
    const list = [...checkSums];
    const find = list.findIndex((node) => node === key);
    list[find] = e.target.value;
    dispatch(versions({ checkSums: list }));
  };

  const handleDeleteCheckSums = (item) => {
    dispatch(
      versions({ checkSums: checkSums.filter((node) => node !== item) })
    );
  };

  return (
    <ModalComponent
      width={918}
      open={editModal}
      maskClosable={false}
      title={`${Dictionary.edit} ${Dictionary.version} ${record?.app_version} ${Dictionary.system} ${record?.operating_system}`}
      onCancel={() =>
        dispatch(
          versions({
            links: [],
            checkSums: [],
            addCheckSum: [],
            addLink: [],
            editModal: false,
            forceUpdate: false,
            record: "",
          })
        )
      }
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
            name="operating_system"
            label={`${Dictionary.type} ${Dictionary.system}`}
          >
            <InputComponent
              className={Classes["inputModal"]}
              width={343}
              placeholder={`${Dictionary.name} ${Dictionary.system}`}
              name="operating_system"
              disabled
            />
          </FormItemComponent>
          <FormItemComponent name="app_version" label={Dictionary.version}>
            <InputComponent
              className={Classes["inputModal"]}
              width={343}
              placeholder={Dictionary.version}
              name="app_version"
              disabled
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
        {record?.operating_system !== "BROWSER" && (
          <div className={Classes["add-link-container"]}>
            <div className={Classes["add-link-first-line"]}>
              <p>CheckSums</p>
              <div onClick={handleAddCheckSum}>
                <CustomIcon src={AddIcon} />
                <span>CheckSum</span>
              </div>
            </div>
            <div>
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
                    size={24}
                    src={Delete}
                    name={`delete-icon-${index}`}
                    cursor={checkSums?.length > 1 ? "pointer" : "default"}
                    color={
                      checkSums?.length > 1
                        ? Variables.NotifRed
                        : Variables.NotifPink
                    }
                    onClick={() =>
                      checkSums?.length > 1 ? handleDeleteCheckSums(item) : ""
                    }
                  />
                </div>
              ))}
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
                    size={24}
                    src={Close}
                    color={Variables.NotifRed}
                    name={`close-icon-${item}`}
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
                    type="text"
                    defaultValue={item.link}
                    onChange={(e) => handleChangeLink(e, item.app)}
                    placeholder={Dictionary.link}
                  />
                </label>
                <CustomIcon
                  size={24}
                  src={Delete}
                  name={`delete-icon${item.app}`}
                  cursor={links?.length > 1 ? "pointer" : "default"}
                  color={
                    links?.length > 1 ? Variables.NotifRed : Variables.NotifPink
                  }
                  onClick={() =>
                    links?.length > 1 ? handleDeleteLink(item.app) : ""
                  }
                />
              </div>
            ))}
            {addLink?.map((item) => (
              <>
                <div className={Classes["linkRow"]}>
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
                    size={24}
                    src={Close}
                    color={Variables.NotifRed}
                    name={`close-icon${item.app}`}
                    onClick={() => dispatch(versions({ addLink: [] }))}
                  />
                </div>
              </>
            ))}
          </div>
        </div>
        <div className={Classes["textAreaContainer"]}>
          <p>{Dictionary.modifiedFeatures}</p>
          <FormItemComponent name="description">
            <TextAreaComponent
              rows={8}
              name="description"
              defaultValue={descriptions}
              className={Classes["textArea"]}
              placeholder={Dictionary.modifiedFeatures}
              onChange={(e) =>
                dispatch(versions({ description: e.target.value.split("\n") }))
              }
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
            onClick={() =>
              dispatch(
                versions({
                  links: [],
                  checkSums: [],
                  addCheckSum: [],
                  addLink: [],
                  editModal: false,
                  record: "",
                  forceUpdate: [],
                })
              )
            }
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default VersionEdit;
