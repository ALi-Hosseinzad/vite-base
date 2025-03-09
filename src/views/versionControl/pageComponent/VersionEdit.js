import TextAreaComponent from "components/textArea/TextArea";
import Dictionary from "helpers/Dictionary";
import Classes from "../styles/Versions.module.scss";
import React, { useRef, useState } from "react";
import InputComponent from "components/input/InputComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import FormComponent from "components/form/FormComponent";
import { versions } from "store/reducers/versions/versionsReducer";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import { useEffect } from "react";
import CustomIcon from "components/customIcon/CustomIcon";
import AddIcon from "assets/images/icon/Add.svg";
import Delete from "assets/images/icon/Delete.svg";
import { updateVersions } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import Variables from "assets/styles/_Variables.scss";
import { VersionCompare } from "helpers/VersionCompare";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import Close from "assets/images/icon/Close.svg";

const VersionEdit = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const dispatch = useDispatch();
  const listVersions = useSelector((state) => state.versions.value);
  const descriptions = listVersions.record.description?.join("\n");
  const record = listVersions.record;
  const [newLinks, setNewLinks] = useState();
  const [newCheckSums, setNewCheckSums] = useState();
  const [checkedList, setCheckedList] = useState([]);
  const errorHandler = useErrorHandler();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      minVersion: record?.min_version,
      currentVersion: record?.current_version,
    });
  }, [listVersions.editModal]);

  useEffect(() => {
    const convert = {};
    if (listVersions.addLink[0]?.app) {
      listVersions.links.forEach((item) => {
        convert[item?.app] = item.link;
      });
      convert[listVersions.addLink[0].app] = listVersions.addLink[0].link;
    } else {
      listVersions.links.forEach((item) => {
        convert[item?.app] = item.link;
      });
    }
    setNewLinks(convert);
  }, [listVersions.links, listVersions.addLink]);

  useEffect(() => {
    const convert = {};
    if (listVersions.addCheckSum[0]?.version) {
      listVersions.checkSums.forEach((item) => {
        convert[item?.version] = item.checksum;
      });
      convert[listVersions.addCheckSum[0].version] =
        listVersions.addCheckSum[0].checksum;
    } else {
      listVersions.checkSums.forEach((item) => {
        convert[item?.version] = item.checksum;
      });
    }
    setNewCheckSums(convert);
  }, [listVersions.checkSums, listVersions.addCheckSum]);
  useEffect(() => {
    setCheckedList(listVersions.forceUpdate);
  }, []);
  const onFinish = (values) => {
    const convert = {};
    if (!VersionCompare(values.minVersion, values.currentVersion)) {
      dispatch(
        setNotificationData({
          message: "نسخه حداقلی نباید بیشتر از نسخه فعلی باشد.",
          type: "error",
          time: 5000,
        })
      );
    } else if (!VersionCompare(record.min_version, values.minVersion)) {
      dispatch(
        setNotificationData({
          message: "مقدار وارد شده نباید کمتر از نسخه حداقلی نسخه قبلی باشد.",
          type: "error",
          time: 5000,
        })
      );
    } else if (
      record.operating_system !== "BROWSER" &&
      !Object.keys(record.checksums).includes(values.minVersion) &&
      VersionCompare(values.currentVersion, values.minVersion) !== "equal"
    ) {
      dispatch(
        setNotificationData({
          message:
            "نسخه حداقلی باید از بین لیست نسخه‌های نمایش داده شده انتخاب شود یا با نسخه فعلی برابر باشد.",
          type: "error",
          time: 5000,
        })
      );
    } else if (
      record.operating_system !== "BROWSER" &&
      listVersions.addCheckSum.length > 0 &&
      VersionCompare(
        listVersions.addCheckSum[0]?.version,
        values.currentVersion
      ) !== "equal"
    ) {
      dispatch(
        setNotificationData({
          message: "ورژن فعلی باید با بالاترین ورژن یکی باشد.",
          type: "error",
          time: 5000,
        })
      );
    } else {
      if (listVersions.addCheckSum.length <= 0) {
        listVersions.checkSums.forEach((item) => {
          if (VersionCompare(item.version, values.currentVersion)) {
            convert[item?.version] = item.checksum;
          }
        });
      }
      updateVersions({
        id: record.id,
        version: record.version,
        operating_system: record.operating_system,
        current_version: values.currentVersion,
        download_links: newLinks,
        min_version: values.minVersion,
        description: listVersions.description,
        checksums:
          record.operating_system !== "BROWSER"
            ? Object.values(convert).length > 0
              ? convert
              : newCheckSums
            : null,
        exception_versions: checkedList,
      })
        .then(() =>
          dispatch(
            versions({
              editModal: false,
              refresh: !listVersions.refresh,
              links: [],
              checkSums: [],
              addCheckSum: [],
              addLink: [],
              editModal: false,
              forceUpdate: [],
            })
          )
        )
        .catch(() => errorHandler(errorResponse));
    }
  };
  const handleAddLink = (type) => {
    if (type === "link") {
      if (listVersions.addLink?.length === 0) {
        dispatch(versions({ addLink: [{ app: "", link: "" }] }));
      } else if (
        listVersions.addLink?.length !== 0 &&
        listVersions.addLink[0]?.app !== ""
      ) {
        dispatch(
          versions({
            links: [listVersions.addLink[0], ...listVersions.links],
            addLink: [{ app: "", link: "" }],
          })
        );
      }
    } else if (type === "checkSum") {
      if (listVersions.addCheckSum?.length === 0) {
        dispatch(versions({ addCheckSum: [{ version: "", checksum: "" }] }));
      } else if (
        listVersions.addCheckSum?.length !== 0 &&
        listVersions.addCheckSum[0]?.version !== "" &&
        listVersions.addCheckSum[0]?.checksum !== ""
      ) {
        dispatch(
          versions({
            checkSums: [...listVersions.checkSums, listVersions.addCheckSum[0]],
            addCheckSum: [{ version: "", checksum: "" }],
          })
        );
      }
    }
  };

  const handleChangeLink = (e, key) => {
    const list = [...listVersions.links];
    const find = list.indexOf(list.find((node) => node.app === key));
    list[find] = { app: key, link: e.target.value };
    dispatch(versions({ links: list }));
  };
  const handleChangeChecksum = (e, key) => {
    const list = [...listVersions.checkSums];
    const find = list.indexOf(list.find((node) => node.version === key));
    list[find] = { version: key, checksum: e.target.value };
    dispatch(versions({ checkSums: list }));
  };
  const handleDeleteLink = (item, type) => {
    if (type === "link") {
      const del = { ...listVersions.record.download_links };
      delete del[item];
      dispatch(
        versions({
          record: { ...listVersions.record, download_links: del },
          links: listVersions.links.filter((node) => node.app !== item),
        })
      );
    } else if (type === "checksum") {
      const del = { ...listVersions.record.checksums };
      delete del[item];
      dispatch(
        versions({
          record: { ...listVersions.record, checksums: del },
          checkSums: listVersions.checkSums.filter(
            (node) => node.version !== item
          ),
        })
      );
    }
  };
  const handleCheck = (item) => {
    const exists = checkedList?.includes(item);
    if (exists) {
      const val = checkedList.filter((c) => {
        return c !== item;
      });
      setCheckedList(val);
    } else {
      setCheckedList([...checkedList, item]);
    }
  };

  return (
    <div>
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
            name="minVersion"
            label={Dictionary.minVersion}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                pattern: /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/,
                message: Dictionary.checkInput,
              },
            ]}
          >
            <InputComponent
              className={Classes["inputModal"]}
              onChange={(e) => {
                dispatch(
                  versions({
                    record: { ...record, min_version: e.target.value },
                  })
                );
              }}
              width={343}
              placeholder={Dictionary.minVersion}
              name="min-version"
            />
          </FormItemComponent>
          <FormItemComponent
            name="currentVersion"
            label={Dictionary.currentVersion}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                pattern: /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/,
                message: Dictionary.checkInput,
              },
            ]}
          >
            <InputComponent
              onChange={(e) => {
                dispatch(
                  versions({
                    record: { ...record, current_version: e.target.value },
                  })
                );
              }}
              className={Classes["inputModal"]}
              width={343}
              placeholder={Dictionary.currentVersion}
              name="current-version"
            />
          </FormItemComponent>
        </div>
        {listVersions.record?.operating_system?.toLowerCase() !== "browser" && (
          <div className={Classes["add-link-container"]}>
            <div className={Classes["add-link-first-line"]}>
              <p>CheckSums</p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => {
                  listVersions.addCheckSum?.length > 0
                    ? ""
                    : handleAddLink("checkSum");
                }}
              >
                <CustomIcon
                  src={AddIcon}
                  color={
                    listVersions.addCheckSum?.length > 0
                      ? Variables.GreenLight7
                      : Variables.LogoGreenDark
                  }
                  name={"add-checksum-icon"}
                  size={20}
                />
                <span
                  style={{
                    fontSize: "16px",
                    lineHeight: "20px",
                    color:
                      listVersions.addCheckSum?.length > 0
                        ? Variables.GreenLight7
                        : Variables.LogoGreenDark,
                  }}
                >
                  CheckSum
                </span>
              </div>
            </div>
            {/* checkSums */}
            {listVersions.checkSums?.map((item, index) => (
              <div className={Classes["linkRow-checksum"]} key={item.version}>
                <label>
                  <span>{`CheckSum ${index + 1}`}</span>
                  <input
                    type="text"
                    defaultValue={item?.checksum}
                    onChange={(e) => handleChangeChecksum(e, item.version)}
                    placeholder={Dictionary.link}
                    disabled={
                      listVersions.addCheckSum.length === 0
                        ? item?.version !==
                            listVersions.record?.current_version && true
                        : true
                    }
                  />
                </label>
                <label>
                  <span>{Dictionary.version}</span>
                  <input
                    type="text"
                    defaultValue={item.version}
                    disabled={true}
                    placeholder={Dictionary.version}
                  />
                </label>
                <label className={Classes["force-update"]}>
                  <span>{index === 0 ? "Force Update" : ""}</span>
                  <input
                    type="checkbox"
                    style={
                      index === 0
                        ? { marginTop: "12px", marginBottom: "16px" }
                        : {}
                    }
                    className={Classes["checkbox-input"]}
                    defaultChecked={item.forceVersion}
                    onChange={() => handleCheck(item.version)}
                    disabled={
                      VersionCompare(
                        listVersions.record.current_version,
                        item.version
                      ) === true
                    }
                  />
                </label>
                <CustomIcon
                  src={Delete}
                  size={24}
                  onClick={() =>
                    VersionCompare(item.version, record.min_version) === true
                      ? handleDeleteLink(item.version, "checksum")
                      : ""
                  }
                  color={
                    VersionCompare(item.version, record.min_version) === true
                      ? Variables.NotifRed
                      : Variables.NotifPink
                  }
                  name={`checkSums${index}`}
                  cursor={
                    VersionCompare(item.version, record.min_version) === true
                      ? "pointer"
                      : "default"
                  }
                />
              </div>
            ))}
            {/* add checksum */}
            {listVersions.addCheckSum?.map((item, index) => (
              <div className={Classes["linkRow-checksum"]} key={item.app}>
                <label>
                  <span>{`CheckSum ${
                    listVersions.checkSums?.length + index + 1
                  }`}</span>
                  <input
                    type="text"
                    onChange={(e) =>
                      dispatch(
                        versions({
                          addCheckSum: [
                            {
                              ...listVersions.addCheckSum[0],
                              checksum: e.target.value,
                            },
                          ],
                        })
                      )
                    }
                    placeholder="checkSum"
                    value={item.checksum}
                  />
                </label>
                <label>
                  <span>{Dictionary.version}</span>
                  <input
                    type="text"
                    placeholder={Dictionary.version}
                    onChange={(e) => {
                      dispatch(
                        versions({
                          addCheckSum: [
                            {
                              ...listVersions.addCheckSum[0],
                              version: e.target.value,
                            },
                          ],
                        })
                      );
                    }}
                    value={item.version}
                  />
                </label>
                <label className={Classes["force-update"]}>
                  <span></span>
                  <input
                    type="checkbox"
                    className={Classes["checkbox-input"]}
                    defaultChecked={item.forceVersion}
                    onChange={() => handleCheck(item.version)}
                  />
                </label>
                <CustomIcon
                  src={Close}
                  size={24}
                  onClick={() => dispatch(versions({ addCheckSum: [] }))}
                  color={Variables.NotifRed}
                  name={`checkSums${listVersions.checkSums?.length + index}`}
                  cursor="pointer"
                />
              </div>
            ))}
          </div>
        )}
        <div className={Classes["add-link-container"]}>
          <div className={Classes["add-link-first-line"]}>
            <p>{Dictionary.downloadLinks}</p>
            <div onClick={() => handleAddLink("link")}>
              <CustomIcon src={AddIcon} />
              <span>{Dictionary.newLink}</span>
            </div>
          </div>
          <div>
            {/* links */}
            {listVersions.links.map((item) => (
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
                  src={Delete}
                  size={24}
                  onClick={() =>
                    listVersions.links?.length > 1
                      ? handleDeleteLink(item.app, "link")
                      : ""
                  }
                  color={
                    listVersions.links?.length > 1
                      ? Variables.NotifRed
                      : Variables.NotifPink
                  }
                  cursor={
                    listVersions.links?.length > 1 ? "pointer" : "default"
                  }
                />
              </div>
            ))}
            {/* add link */}
            {listVersions.addLink?.map((item) => (
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
                            addLink: [
                              {
                                ...listVersions.addLink[0],
                                app: e.target.value,
                              },
                            ],
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
                            addLink: [
                              {
                                ...listVersions.addLink[0],
                                link: e.target.value,
                              },
                            ],
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
              </>
            ))}
          </div>
        </div>
        <div className={Classes["textAreaContainer"]}>
          <p>{Dictionary.modifiedfeatures}</p>
          <FormItemComponent name="description">
            <TextAreaComponent
              className={Classes["textArea"]}
              onChange={(e) =>
                dispatch(versions({ description: e.target.value.split("\n") }))
              }
              placeholder={Dictionary.modifiedfeatures}
              name="description"
              rows={8}
              defaultValue={descriptions}
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
    </div>
  );
};

export default VersionEdit;
