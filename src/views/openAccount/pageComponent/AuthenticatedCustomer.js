import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Form, Select, Typography } from "antd";
import Classes from "views/openAccount/styles/AuthenticatedCustomer.module.scss";
import InputComponent from "components/input/InputComponent";
import DownloadIcon from "assets/images/icon/Download.svg";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { openAccount } from "store/reducers/openAccount/openAccountReducer";
import SelectComponent from "components/SelectComponent/SelectComponent";
import StatusComponent from "components/status/StatusComponent";
import {
  confirmOpeningAccount,
  getReactionSentences,
} from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { findStatus } from "helpers/FindStatus";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { downloadPhoto } from "helpers/downloadPhoto";
import DownloadableImg from "components/downloadableImg/DownloadableImg";
import CustomIcon from "components/customIcon/CustomIcon";
import Frame from "assets/images/placeholder/Frame.png";
import Refresh from "assets/images/icon/Refresh.svg";
import DropDown from "assets/images/icon/DropDown.svg";
import SearchIcon from "assets/images/icon/Search.svg";
import CheckboxComponent from "components/checkbox/CheckboxComponent";
import { blacklist } from "store/reducers/blacklist/blacklistReducer";

const AuthenticatedCustomer = ({ getFile }) => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const openAccountData = useSelector((state) => state.openAccount.value);
  const [icon, setIcon] = useState(DropDown);
  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    confirmOpeningAccount({
      ...values,
      reference_number: openAccountData.record.referenceNumber,
    })
      .then(() => {
        if (values.isBlocked) {
          dispatch(openAccount({ modal: false }));
          dispatch(
            blacklist({
              blacklistModal: true,
              blacklistObject: {
                event: "CREATE_ACCOUNT_OFFLINE",
                fullname: `${openAccountData.record?.firstName} ${openAccountData.record?.lastName}`,
                reference_number: openAccountData.record?.referenceNumber,
                block_description: "",
                identification_code: openAccountData.record?.nationalId,
              },
            })
          );
        } else {
          dispatch(
            openAccount({
              modal: false,
              update: !openAccountData.update,
              record: "",
              video: "",
            })
          );
        }
      })
      .catch(() => errorHandler(errorResponse));
  };
  const setStatus = () => {
    if (!openAccountData?.readyReactions) {
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
              value: "CREATE_ACCOUNT_REJECT_AUTHENTICATION",
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
          dispatch(openAccount({ readyReactions: sentences }));
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
  const handleCancel = () => {
    dispatch(openAccount({ modal: false }));
    form.resetFields();
  };
  useEffect(() => {
    if (openAccountData.modal === true) {
      form.resetFields();
    }
  }, [openAccountData.modal]);
  const items = [
    { id: 1, value: "VERIFY", text: "تایید شده" },
    { id: 2, value: "REJECT", text: "رد شده" },
  ];

  return (
    <div className={Classes["authenticated-customer-wrapper"]}>
      <div className={Classes["authenticated-customer-container"]}>
        <div className={Classes["authenticated-customer-photo"]}>
          <label className={Classes["authenticated-customer-label"]}>
            {Dictionary.customerPhoto}
          </label>
          <div className={Classes["authenticated-customer-img"]}>
            {Object.keys(openAccountData.avatar).length === 0 ? (
              <img
                src={Frame}
                style={{ margin: "0 auto" }}
                width={74}
                height={80}
              />
            ) : (
              <img src={openAccountData.avatar.file} width={148} height={140} />
            )}
          </div>
          {openAccountData.avatarError ? (
            <div
              className={Classes["loading-button"]}
              style={{ cursor: "pointer" }}
              onClick={() => {
                dispatch(openAccount({ avatarError: false }));
                getFile(openAccountData.record, "ID_CARD_PHOTO");
              }}
            >
              <CustomIcon src={Refresh} size={24} />
              <span>{Dictionary.tryAgain}</span>
            </div>
          ) : Object.keys(openAccountData.avatar).length === 0 ? (
            <div className={Classes["loading-button"]}>
              <div className={Classes["spinner"]} />
            </div>
          ) : (
            <ButtonComponent
              type="secondary"
              htmlType={Dictionary.download}
              onClick={() =>
                downloadPhoto(
                  openAccountData.avatar.file,
                  `${Dictionary.customerPhoto} ${openAccountData.record.fullName}.${openAccountData.avatar.type}`
                )
              }
              srcRight={DownloadIcon}
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
            value={openAccountData.record?.firstName}
            prefix={<Text>{Dictionary.name}</Text>}
            className={Classes["authenticated-customer-input"]}
          />
          <InputComponent
            width={257}
            name="lastName"
            value={openAccountData.record?.lastName}
            prefix={<Text>{Dictionary.lastName}</Text>}
            className={Classes["authenticated-customer-input"]}
          />
          <InputComponent
            width={257}
            name="nationalId"
            value={openAccountData.record?.nationalId}
            prefix={<Text>{Dictionary.nationalId}</Text>}
            className={Classes["authenticated-customer-input"]}
          />
          <InputComponent
            width={257}
            name="mobile"
            value={openAccountData.record?.mobile}
            prefix={<Text>{Dictionary.mobile}</Text>}
            className={Classes["authenticated-customer-input"]}
          />
        </div>
      </div>
      <div className={Classes["video-line-container"]}>
        <DownloadableImg
          tryAgain={() => {
            dispatch(openAccount({ idCardError: false }));
            getFile(openAccountData.record, "ID_CARD");
          }}
          error={openAccountData.idCardError}
          label={Dictionary.nationalIdImg}
          loading={Object.keys(openAccountData.idCard).length === 0}
          item={openAccountData.idCard}
          onClick={() =>
            downloadPhoto(
              openAccountData.idCard?.file,
              `${openAccountData.idCard?.label} ${openAccountData.record?.fullName}.${openAccountData.idCard?.type}`
            )
          }
        />
        <div className={Classes["authenticated-customer-video"]}>
          <label className={Classes["authenticated-customer-label"]}>
            {Dictionary.authenticatedVideo}
          </label>
          <div className={Classes["authenticated-customer-video-items"]}>
            <div className={Classes["video-file"]}>
              {openAccountData.videoError ? (
                <div className={Classes["video-loading"]}>
                  <div
                    className={Classes["refresh-video"]}
                    onClick={() => {
                      dispatch(openAccount({ videoError: false }));
                      getFile(openAccountData.record, "VIDEO");
                    }}
                  >
                    <CustomIcon src={Refresh} size={36} />
                  </div>
                </div>
              ) : openAccountData.video === "" ? (
                <div className={Classes["video-loading"]}>
                  <div className={Classes["loading-video"]}>
                    <div className={Classes["video-spinner"]} />
                  </div>
                </div>
              ) : (
                <>
                  <video
                    src={openAccountData.video?.src}
                    type={`video/${openAccountData.video?.type}`}
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
                        openAccountData.video?.src,
                        `${Dictionary.authenticatedVideo} ${openAccountData.record.fullName}.${openAccountData.video?.type}`
                      )
                    }
                    srcRight={DownloadIcon}
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
              <Text>{openAccountData.record?.text}</Text>
            </div>
          </div>
        </div>
      </div>
      <div className={Classes["authenticated-customer-docs"]}>
        <div className={Classes["authenticated-customer-docs-items"]}>
          <DownloadableImg
            tryAgain={() => {
              dispatch(openAccount({ backIdCardError: false }));
              getFile(openAccountData.record, "ID_CARD_BACK");
            }}
            error={openAccountData.backIdCardError}
            label={Dictionary.nationalIdImg2}
            loading={Object.keys(openAccountData.backIdCard).length === 0}
            item={openAccountData.backIdCard}
            onClick={() =>
              downloadPhoto(
                openAccountData.backIdCard.file,
                `${openAccountData.backIdCard.label} ${openAccountData.record.fullName}.${openAccountData.backIdCard.type}`
              )
            }
          />
          <DownloadableImg
            tryAgain={() => {
              dispatch(openAccount({ signError: false }));
              getFile(openAccountData.record, "SIGN");
            }}
            error={openAccountData.signError}
            label={Dictionary.signatureImg}
            loading={Object.keys(openAccountData.sign).length === 0}
            item={openAccountData.sign}
            onClick={() =>
              downloadPhoto(
                openAccountData.sign.file,
                `${openAccountData.sign.label} ${openAccountData.record.fullName}.${openAccountData.sign.type}`
              )
            }
          />
        </div>
      </div>

      <div className={Classes["authenticated-customer-line"]} />

      <div className={Classes["authenticated-customer-status"]}>
        <label className={Classes["authenticated-customer-label"]}>
          {Dictionary.customerStatus}
        </label>
        {findStatus(openAccountData.record?.status) === "pending" ? (
          <Form
            className={Classes["authenticated-customer-form"]}
            layout="vertical"
            form={form}
            onFinish={onFinish}
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
                  showSearch={false}
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
                      name="status_desc"
                      label={Dictionary.expertIdea}
                      className={Classes["authenticated-customer-item"]}
                    >
                      <Select
                        name="status_desc"
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
                        options={openAccountData.readyReactions}
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
                onClick={handleCancel}
                classNameBtn={Classes["authenticated-customer-cancel-btn"]}
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
                type={findStatus(openAccountData.record?.status)}
                title={openAccountData.record?.statusDescription}
              />
              {openAccountData.record?.status === "REJECT" && (
                <div className={Classes["authenticated-customer-idea-part"]}>
                  <label
                    className={Classes["authenticated-customer-label-idea"]}
                  >
                    {Dictionary.expertIdea}
                  </label>
                  <div className={Classes["authenticated-customer-idea"]}>
                    <Text>{openAccountData.record?.errorExpression}</Text>
                  </div>
                </div>
              )}
            </div>
            <ButtonComponent
              type="primary"
              htmlType="close"
              onClick={() =>
                dispatch(
                  openAccount({
                    idCard: {},
                    backIdCard: {},
                    docs2: {},
                    docs3: {},
                    docs: [],
                    sign: {},
                    avatar: {},
                    video: "",
                    modal: false,
                  })
                )
              }
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
export default AuthenticatedCustomer;
