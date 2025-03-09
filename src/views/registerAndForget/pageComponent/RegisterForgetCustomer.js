import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Form, Select, Typography } from "antd";
import Classes from "views/openAccount/styles/AuthenticatedCustomer.module.scss";
import InputComponent from "components/input/InputComponent";
import UploadIcon from "assets/images/icon/Download.svg";
import Refresh from "assets/images/icon/Refresh.svg";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import StatusComponent from "components/status/StatusComponent";
import { registerForget } from "store/reducers/registerForget/registerForgetReducer";
import {
  confirmRegisterForget,
  getReactionSentences,
  getUploadedFilesRegisterForget,
} from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { downloadPhoto } from "helpers/downloadPhoto";
import { findStatus } from "helpers/FindStatus";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import Frame from "assets/images/placeholder/Frame.png";
import CustomIcon from "components/customIcon/CustomIcon";
import DropDown from "assets/images/icon/DropDown.svg";
import SearchIcon from "assets/images/icon/Search.svg";
import CheckboxComponent from "components/checkbox/CheckboxComponent";
import { blacklist } from "store/reducers/blacklist/blacklistReducer";

const RegisterForgetCustomer = ({ getFile }) => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const formRef = useRef();
  const registerForgetData = useSelector((state) => state.registerForget.value);
  const [icon, setIcon] = useState(DropDown);
  const [loading, setLoading] = useState(false);

  const items = [
    { id: 1, value: "ACCEPT", text: "تایید شده" },
    { id: 2, value: "REJECT", text: "رد شده" },
  ];
  const onFinish = (values) => {
    confirmRegisterForget({
      ...values,
      reference_number: registerForgetData.record.referenceNumber,
      identification_code: registerForgetData.record?.nationalId,
    })
      .then(() => {
        if (values.isBlocked) {
          dispatch(registerForget({ modal: false }));
          dispatch(
            blacklist({
              blacklistModal: true,
              blacklistObject: {
                event: registerForgetData.record.action,
                fullname: `${registerForgetData.record?.firstName} ${registerForgetData.record?.lastName}`,
                reference_number: registerForgetData.record?.referenceNumber,
                block_description: "",
                identification_code: registerForgetData.record?.nationalId,
              },
            })
          );
        } else {
          dispatch(
            registerForget({
              modal: false,
              update: !registerForgetData.update,
              record: "",
              video: "",
            })
          );
        }
      })
      .catch(() => errorHandler(errorResponse));
  };

  const setStatus = () => {
    if (!registerForgetData.readyReactions) {
      setLoading(true);
      const sentences = [];
      getReactionSentences({
        offset: "0",
        count: "100",
        sort_by: "-createdDate",
        criteria: {
          operation: "and",
          criteria: [
            {
              key: "event",
              value: "REGISTRATION_REJECT_AUTHENTICATION",
              operation: "equals",
            },
          ],
        },
      })
        .then((res) =>
          res.data?.data?.forEach((element) => {
            sentences.push({
              value: element.expression,
              label: element.expression,
            });
          })
        )
        .then(() => {
          dispatch(registerForget({ readyReactions: sentences }));
          setIcon(SearchIcon);
        })
        .catch(() => {
          errorHandler(errorResponse);
          setIcon(DropDown);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setIcon(SearchIcon);
    }
  };
  useEffect(() => {
    if (registerForgetData.modal === true) {
      form.resetFields();
    }
  }, [registerForgetData.modal]);
  return (
    <div className={Classes["authenticated-customer-wrapper"]}>
      <div className={Classes["authenticated-customer-container"]}>
        <div className={Classes["authenticated-customer-photo"]}>
          <label className={Classes["authenticated-customer-label"]}>
            {Dictionary.customerPhoto}
          </label>
          <div className={Classes["authenticated-customer-img"]}>
            {Object.keys(registerForgetData.avatar).length === 0 ? (
              <img
                src={Frame}
                style={{ margin: "0 auto" }}
                width={74}
                height={80}
              />
            ) : (
              <img
                src={`data:image;base64,${registerForgetData.avatar.file}`}
                width={148}
                height={140}
              />
            )}
          </div>
          {registerForgetData.avatarError ? (
            <div
              className={Classes["loading-button"]}
              style={{ cursor: "pointer" }}
              onClick={() => {
                dispatch(registerForget({ avatarError: false }));
                getFile(registerForgetData.record, "ID_CARD_PHOTO");
              }}
            >
              <CustomIcon src={Refresh} size={24} />
              <span>{Dictionary.tryAgain}</span>
            </div>
          ) : Object.keys(registerForgetData.avatar).length === 0 ? (
            <div className={Classes["loading-button"]}>
              <div className={Classes["spinner"]} />
            </div>
          ) : (
            <ButtonComponent
              type="secondary"
              htmlType={Dictionary.download}
              onClick={() =>
                downloadPhoto(
                  `data:image;base64,${registerForgetData.avatar.file}`,
                  `${Dictionary.customerPhoto} - ${registerForgetData.record.fullName}.${registerForgetData.avatar.type}`
                )
              }
              srcRight={UploadIcon}
              colorRight="#2B9570"
            >
              {Dictionary.download}
            </ButtonComponent>
          )}
        </div>
        <div className={Classes["authenticated-customer-input-wrapper"]}>
          <InputComponent
            width={257}
            name="firstName"
            value={registerForgetData.record?.firstName}
            prefix={<Text>{Dictionary.name}</Text>}
            className={Classes["authenticated-customer-input"]}
          />
          <InputComponent
            width={257}
            name="lastName"
            value={registerForgetData.record?.lastName}
            prefix={<Text>{Dictionary.lastName}</Text>}
            className={Classes["authenticated-customer-input"]}
          />
          <InputComponent
            width={257}
            name="nationalId"
            value={registerForgetData.record?.nationalId}
            prefix={<Text>{Dictionary.nationalId}</Text>}
            className={Classes["authenticated-customer-input"]}
          />
          <InputComponent
            width={257}
            name="mobile"
            value={registerForgetData.record?.mobile}
            prefix={<Text>{Dictionary.mobile}</Text>}
            className={Classes["authenticated-customer-input"]}
          />
        </div>
      </div>
      <div
        className={Classes["authenticated-customer-docs"]}
        style={{ marginTop: "40px" }}
      >
        <div className={Classes["authenticated-customer-docs-items"]}>
          <div className={Classes["authenticated-customer-docs-item"]}>
            <label className={Classes["authenticated-customer-docs-label"]}>
              {Dictionary.nationalIdImg}
            </label>
            <div
              className={Classes["authenticated-customer-img"]}
              style={{ height: "196px" }}
            >
              {Object.keys(registerForgetData.idCard).length === 0 ? (
                <img
                  src={Frame}
                  style={{ margin: "0 auto" }}
                  width={74}
                  height={80}
                />
              ) : (
                <img
                  src={`data:image;base64,${registerForgetData.idCard.file}`}
                  width={148}
                  height={196}
                />
              )}
            </div>
            {registerForgetData.idCardError ? (
              <div
                className={Classes["loading-button"]}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(registerForget({ idCardError: false }));
                  getFile(registerForgetData.record, "ID_CARD");
                }}
              >
                <CustomIcon src={Refresh} size={24} />
                <span>{Dictionary.tryAgain}</span>
              </div>
            ) : Object.keys(registerForgetData.idCard).length === 0 ? (
              <div className={Classes["loading-button"]}>
                <div className={Classes["spinner"]} />
              </div>
            ) : (
              <ButtonComponent
                type="secondary"
                htmlType={Dictionary.download}
                onClick={() =>
                  downloadPhoto(
                    `data:image;base64,${registerForgetData.idCard.file}`,
                    `${Dictionary.nationalIdImg} - ${registerForgetData.record.fullName}.${registerForgetData.idCard.type}`
                  )
                }
                srcRight={UploadIcon}
                colorRight="#2B9570"
              >
                {Dictionary.download}
              </ButtonComponent>
            )}
          </div>
          <div
            className={Classes["authenticated-customer-video"]}
            style={{ margin: "0 24px" }}
          >
            <label className={Classes["authenticated-customer-label"]}>
              {Dictionary.authenticatedVideo}
            </label>
            <div className={Classes["authenticated-customer-video-items"]}>
              <div className={Classes["video-file"]}>
                {registerForgetData.videoError ? (
                  <div className={Classes["video-loading"]}>
                    <div
                      className={Classes["refresh-video"]}
                      onClick={() => {
                        dispatch(registerForget({ videoError: false }));
                        getFile(registerForgetData.record, "VIDEO");
                      }}
                    >
                      <CustomIcon src={Refresh} size={36} />
                    </div>
                  </div>
                ) : registerForgetData.videoURL === "" ? (
                  <div className={Classes["video-loading"]}>
                    <div className={Classes["loading-video"]}>
                      <div className={Classes["video-spinner"]} />
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      src={registerForgetData.videoURL}
                      type={`video/${registerForgetData.type}`}
                      controls
                      controlsList="nodownload"
                      width={261}
                      height={196}
                      className={Classes["authenticated-customer-video-file"]}
                    />
                    <ButtonComponent
                      type="secondary"
                      onClick={() =>
                        downloadPhoto(
                          registerForgetData.videoURL,
                          `${Dictionary.authenticatedVideo}-${registerForgetData.record.fullName}.${registerForgetData.type}`
                        )
                      }
                      srcRight={UploadIcon}
                      colorRight="#2B9570"
                      classNameBtn={Classes["download-video"]}
                    >
                      {Dictionary.downloadVideo}
                    </ButtonComponent>
                  </>
                )}
              </div>
              <div className={Classes["authenticated-customer-text"]}>
                <Text className={Classes["authenticated-customer-text-title"]}>
                  {Dictionary.textVideo}
                </Text>
                <Text>{registerForgetData.text}</Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={Classes["authenticated-customer-line"]} />
      <div className={Classes["authenticated-customer-status"]}>
        <label className={Classes["authenticated-customer-label"]}>
          {Dictionary.customerStatus}
        </label>
        {findStatus(registerForgetData.record.status) === "pending" ? (
          <Form
            className={Classes["authenticated-customer-form"]}
            layout="vertical"
            form={form}
            onFinish={onFinish}
            ref={formRef}
            requiredMark={false}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <FormItemComponent
                name="status"
                label={Dictionary.status}
                rules={[
                  {
                    required: true,
                    message: Dictionary.require,
                  },
                ]}
              >
                <SelectComponent
                  name="status"
                  width={220}
                  placeholder={Dictionary.customerStatus}
                  items={items}
                  className={Classes["authenticated-customer-select"]}
                />
              </FormItemComponent>

              <FormItemComponent shouldUpdate>
                {(form) =>
                  form.getFieldValue("status") === "REJECT" && (
                    <FormItemComponent
                      shouldUpdate
                      rules={[
                        {
                          required: true,
                          message: Dictionary.require,
                        },
                      ]}
                      name="comment"
                      label={Dictionary.expertIdea}
                      className={Classes["authenticated-customer-item"]}
                    >
                      <Select
                        name="comment"
                        showSearch
                        style={{ width: 466, height: 48 }}
                        className={Classes["ready-reactions"]}
                        placeholder="دلیل قبول نکردن مدارک را انتخاب نمایید"
                        suffixIcon={
                          loading ? (
                            <div className={Classes["spinner"]} />
                          ) : (
                            <CustomIcon
                              src={icon}
                              size={20}
                              name="drop-down-icon-branch-codes"
                              color="#2B9570"
                            />
                          )
                        }
                        onFocus={setStatus}
                        onBlur={() => {
                          setLoading(false);
                          setIcon(DropDown);
                        }}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={registerForgetData.readyReactions}
                        notFoundContent={""}
                      />
                    </FormItemComponent>
                  )
                }
              </FormItemComponent>
            </div>
            <FormItemComponent shouldUpdate>
              {(form) =>
                form.getFieldValue("status") === "REJECT" && (
                  <FormItemComponent
                    name="isBlocked"
                    className={Classes["add-to-blacklist"]}
                  >
                    <CheckboxComponent
                      defaultChecked={false}
                      name={Dictionary.addToBlackList}
                    />
                  </FormItemComponent>
                )
              }
            </FormItemComponent>
            {/* <FormItemComponent name="comment" label={Dictionary.expertIdea} className={Classes["authenticated-customer-item"]}>
              <TextAreaComponent
                placeholder={Dictionary.expertDescription}
                autoSize={{ minRows: 3, maxRows: 5 }}
                className={Classes["authenticated-customer-textarea"]}
              />
            </FormItemComponent> */}
            <FormItemComponent
              button={true}
              className={Classes["authenticated-customer-btn"]}
            >
              <ButtonComponent
                type="primary"
                htmlType="submit"
                classNameBtn={Classes["authenticated-customer-confirm-btn"]}
                // onClick={onFinish}
                // disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
              >
                {Dictionary.confirm}
              </ButtonComponent>

              <ButtonComponent
                type="default"
                classNameBtn={Classes["authenticated-customer-cancel-btn"]}
                onClick={() => dispatch(registerForget({ modal: false }))}
              >
                {Dictionary.cancel}
              </ButtonComponent>
            </FormItemComponent>
          </Form>
        ) : (
          <div>
            <div className={Classes["authenticated-customer-status"]}>
              <label className={Classes["authenticated-customer-label"]}>
                {Dictionary.status}
              </label>
              <StatusComponent
                type={findStatus(registerForgetData.record?.status)}
                title={registerForgetData.record?.statusDescription}
              />
              {registerForgetData.record?.status === "REJECT" && (
                <div className={Classes["authenticated-customer-idea-part"]}>
                  <label
                    className={Classes["authenticated-customer-label-idea"]}
                  >
                    {Dictionary.expertIdea}
                  </label>
                  <div className={Classes["authenticated-customer-idea"]}>
                    <Text>{registerForgetData.record?.errorDesc}</Text>
                  </div>
                </div>
              )}
            </div>
            <ButtonComponent
              type="primary"
              htmlType="close"
              onClick={() => dispatch(registerForget({ modal: false }))}
              classNameBtn={Classes["authenticated-customer-btn"]}
            >
              {Dictionary.close}
            </ButtonComponent>
          </div>
        )}
      </div>
    </div>
  );
};
export default RegisterForgetCustomer;
