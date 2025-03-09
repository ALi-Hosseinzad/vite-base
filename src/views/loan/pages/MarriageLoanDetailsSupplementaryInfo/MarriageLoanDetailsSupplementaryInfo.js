import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import moment from "jalali-moment";
import Compressor from "compressorjs";
import Dictionary from "helpers/Dictionary";
import Add from "assets/images/icon/Add.svg";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import { downloadPhoto } from "helpers/downloadPhoto";
import { useDispatch, useSelector } from "react-redux";
import DropDown from "assets/images/icon/DropDown.svg";
import SearchIcon from "assets/images/icon/Search.svg";
import { b64toBlob } from "helpers/convertBase64ToBlob";
import { Col, Form, Row, Select, Typography } from "antd";
import CustomIcon from "components/customIcon/CustomIcon";
import TimePicker from "components/timePicker/TimePicker";
import { loanState } from "store/reducers/loan/LoanReducer";
import TextAreaComponent from "components/textArea/TextArea";
import UploadImage from "components/uploadImage/UploadImage";
import Classes from "views/loan/styles/LoanDetails.module.scss";
import StatusComponent from "components/status/StatusComponent";
import ButtonComponent from "components/button/ButtonComponent";
import NewDatePicker from "components/newDatePicker/NewDatePicker";
import FormItemComponent from "components/formItem/FormItemComponent";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import SelectComponent from "components/SelectComponent/SelectComponent";
import { getStatusListOfLoan } from "store/middleware/getStatusLoanList";
import InfoBoxWithLabel from "components/infoBoxWithLabel/InfoBoxWithLabel";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import TryAgainCallRequest from "components/tryAgainCallRequest/TryAgainCallRequest";
import {
  marriageLoan,
  marriageLoanState,
  resetMarriageLoanRecord,
} from "store/reducers/loan/MarriageLoanReducer";
import {
  changeMarriageLoanStatus,
  deleteMarriageLoanFile,
  getMarriageLoanDetailsImages,
  getMarriageLoanDetailsInfo,
  getReactionSentences,
  uploadMarriageLoanFile,
} from "helpers/APIFunction";

const MarriageLoanDetailsSupplementaryInfo = () => {
  const divRef = useRef();
  const docRef = useRef();
  const { Text } = Typography;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileData = new FormData();
  const errorHandler = useErrorHandler();
  const loanData = useSelector(loanState);
  const [searchParams] = useSearchParams();
  const [icon, setIcon] = useState(DropDown);
  const [loading, setLoading] = useState(false);
  const MarriageLoanData = useSelector(marriageLoanState);
  const thisDay = moment(Date.now()).locale("fa").format("DD");
  const thisMonth = moment(Date.now()).locale("fa").format("MM");
  const thisYear = moment(Date.now()).locale("fa").format("YYYY");
  const { permissions } = loanData;

  const {
    file,
    status,
    record,
    statusList,
    uploadedFiles,
    statusLoading,
    readyReactions,
    supplementaryInfo,
    branch_acceptance_time,
    branch_acceptance_date,
    supplementaryDocumentInfo,
    branch_acceptance_time_error,
    branch_acceptance_date_error,
    supplementaryInfoMarriageTryAgain,
  } = MarriageLoanData;

  useEffect(() => {
    if (statusList.length === 0) {
      dispatch(getStatusListOfLoan(errorHandler));
    }
  }, []);

  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    if (status) {
      scrollToBottom();
    }
  }, [status]);

  const getInfo = (key, blob, type) => {
    let body;
    if (record) {
      body = {
        reference_number: record.reference_number,
        fix_trace_id: record.fix_trace_id,
      };
    } else {
      body = {
        reference_number: searchParams.get("reference_number"),
        fix_trace_id: searchParams.get("fix_trace_id"),
      };
    }
    getMarriageLoanDetailsInfo(body, "supplementary")
      .then((res) => {
        const convertList = [];
        res?.data?.document_info?.forEach((node, index) => {
          const convertObj = {
            type: "",
            file: "",
            id: index,
            error: false,
            upload: false,
            key: node.key,
            loading: false,
            name: node.name,
            viewImage: true,
            loadingUpload: false,
            canDelete: permissions.deleteDocumentMarriage,
          };
          convertList.push(convertObj);
        });
        if (key && blob && type) {
          dispatch(
            marriageLoan({
              supplementaryInfo: res.data,
              supplementaryDocumentInfo: convertList,
              supplementaryInfoMarriageTryAgain: false,
              uploadedFiles: [
                ...uploadedFiles,
                { key: key, file: blob, type: type },
              ],
            })
          );
        } else {
          dispatch(
            marriageLoan({
              supplementaryInfo: res.data,
              supplementaryInfoMarriageTryAgain: false,
              supplementaryDocumentInfo: convertList,
            })
          );
        }
      })
      .catch(() => {
        errorHandler(errorResponse);
        dispatch(marriageLoan({ supplementaryInfoMarriageTryAgain: true }));
      });
  };

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const newArray = [...supplementaryDocumentInfo];
      newArray.forEach((node, index) => {
        uploadedFiles?.forEach((item) => {
          if (item.key === node.key) {
            newArray[index] = {
              ...newArray[index],
              file: item.file,
              type: item.type,
              viewImage: false,
            };
          }
        });
      });
      dispatch(marriageLoan({ supplementaryDocumentInfo: newArray }));
    }
  }, [uploadedFiles]);

  const onFinish = (values) => {
    if (
      values.status === "ACCEPTED" &&
      (!branch_acceptance_date || !branch_acceptance_time)
    ) {
      dispatch(
        marriageLoan({
          branch_acceptance_date_error: !branch_acceptance_date ? true : false,
          branch_acceptance_time_error: !branch_acceptance_time ? true : false,
        })
      );
    } else {
      let body;
      if (values.status === "ACCEPTED") {
        body = {
          status: "ACCEPTED",
          accept_description: values.accept_description,
          fix_trace_id: searchParams.get("fix_trace_id"),
          reference_number: searchParams.get("reference_number"),
          branch_acceptance_time:
            branch_acceptance_time.hour + ":" + branch_acceptance_time.minute,
          branch_acceptance_date:
            branch_acceptance_date.year +
            "/" +
            branch_acceptance_date.month +
            "/" +
            branch_acceptance_date.day,
        };
      } else if (values.status === "REJECTED") {
        body = {
          status: "REJECTED",
          reject_reason: values.reject_reason,
          fix_trace_id: searchParams.get("fix_trace_id"),
          reference_number: searchParams.get("reference_number"),
        };
      } else if (values.status === "CUSTOMER_MODIFY") {
        body = {
          status: "CUSTOMER_MODIFY",
          description: values.description,
          fix_trace_id: searchParams.get("fix_trace_id"),
          reference_number: searchParams.get("reference_number"),
        };
      }
      if (body?.reference_number) {
        changeMarriageLoanStatus(body)
          .then(() => {
            dispatch(
              setNotificationData({
                message: Dictionary.successfulChanges,
                type: "success",
                time: 3000,
              })
            );
            onCancel();
          })
          .catch(() => {
            errorHandler(errorResponse);
          });
      }
    }
  };

  const setStatus = () => {
    if (!readyReactions.length) {
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
              value: "MARRIAGE_LOAN_REJECT_REASON",
              operation: "equals",
            },
          ],
        },
      })
        .then((res) => {
          res.data?.data?.forEach((element) => {
            sentences.push({
              id: element.id,
              value: element.expression,
              label: element.expression,
            });
          });
          dispatch(marriageLoan({ readyReactions: sentences }));
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

  const findStatus = (value) => {
    let result;
    if (value) {
      switch (value) {
        case "REJECTED":
          result = "rejected";
          break;
        case "ACCEPTED":
          result = "success";
          break;
        case "CUSTOMER_MODIFY":
          result = "pending";
          break;
        case "DECLINE":
          result = "rejected";
          break;
        default:
          result = "pending";
          break;
      }
    }
    return result;
  };

  const onChangeSelect = (e) => {
    dispatch(
      marriageLoan({
        status: e,
        accept_description: "",
        branch_acceptance_date: "",
        branch_acceptance_time: "",
        branch_acceptance_date_error: false,
        branch_acceptance_time_error: false,
      })
    );
    form.setFieldsValue({
      description: "",
      reject_reason: "",
      accept_description: "",
      branch_acceptance_date: "",
      branch_acceptance_time: "",
    });
  };

  const onCancel = () => {
    dispatch(resetMarriageLoanRecord());
    navigate({
      pathname: "/loan/supportance-loan",
      search: createSearchParams({ activeKey: "marriage" }).toString(),
    });
  };

  const scrollToBottom = () => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getImage = (key) => {
    const arr = [...supplementaryDocumentInfo];
    const index = arr.findIndex((item) => item.key === key);
    arr[index] = { ...arr[index], loading: true };
    dispatch(marriageLoan({ supplementaryDocumentInfo: arr }));
    let params;
    if (record) {
      params = {
        reference_number: record.reference_number,
        identification_code: record.identification_code,
        document_type: key,
      };
    } else {
      params = {
        document_type: key,
        reference_number: searchParams.get("reference_number"),
        identification_code: searchParams.get("identification_code"),
      };
    }
    getMarriageLoanDetailsImages(params)
      .then((res) => {
        const type = res?.headers["content-disposition"].substring(
          res?.headers["content-disposition"].lastIndexOf(".") + 1
        );
        let urlObject, blob;
        if (type === "pdf") {
          blob = b64toBlob(res?.data?.file, `application/pdf`);
          urlObject =
            window.URL.createObjectURL(new Blob([blob])) +
            "#toolbar=0&navpanes=0";
        } else {
          blob = b64toBlob(res?.data?.file, `img/${type}`);
          urlObject = window.URL.createObjectURL(new Blob([blob]));
        }
        const newArray = [...arr];
        newArray[index] = {
          ...newArray[index],
          type: type,
          error: false,
          upload: false,
          loading: false,
          file: urlObject,
          viewImage: false,
          loadingUpload: false,
        };
        dispatch(marriageLoan({ supplementaryDocumentInfo: newArray }));
      })
      .catch(() => {
        const newArray2 = [...arr];
        newArray2[index] = {
          ...newArray2[index],
          error: true,
          viewImage: true,
          loading: false,
        };
        dispatch(marriageLoan({ supplementaryDocumentInfo: newArray2 }));
        errorHandler(errorResponse);
      });
  };

  const onClick = () => {
    if (supplementaryDocumentInfo.length < 10) {
      if (supplementaryDocumentInfo.length > 0) {
        const arr = [...supplementaryDocumentInfo];
        if (!arr[arr.length - 1]?.upload) {
          arr.push({
            name: "",
            file: "",
            type: "",
            error: false,
            upload: true,
            loading: false,
            viewImage: false,
            id: arr.length + 1,
            loadingUpload: false,
            key: `test-file-${arr.length + 1}`,
          });
          dispatch(marriageLoan({ supplementaryDocumentInfo: arr }));
          if (arr.length > 6) {
            docRef.current?.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          dispatch(
            setNotificationData({
              message: Dictionary.uploadFileError,
              type: "error",
              time: 3000,
            })
          );
        }
      } else {
        dispatch(
          marriageLoan({
            supplementaryDocumentInfo: [
              {
                id: 0,
                name: "",
                file: "",
                type: "",
                error: false,
                upload: true,
                loading: false,
                viewImage: false,
                key: "test-file-1",
                loadingUpload: false,
              },
            ],
          })
        );
      }
    }
  };

  const uploadFile = async (file, key, name) => {
    const arr = [...supplementaryDocumentInfo];
    const index = arr?.findIndex((item) => item.key === key);
    const type = file?.type?.split("/")["1"];
    const blob = URL.createObjectURL(file);
    arr[index] = {
      ...arr[index],
      name: name,
      loadingUpload: true,
      file: blob,
      type: type,
      error: false,
    };
    let value;
    const newArr = arr.filter((item) => item.key !== key);
    for (let index = 0; index < newArr.length; index++) {
      if (name === newArr[index]?.name) {
        value = index + 1;
      }
    }
    if (value) {
      dispatch(
        setNotificationData({
          message: Dictionary.uploadFileRepetitiveError,
          type: "error",
          time: 3000,
        })
      );
    } else {
      dispatch(
        marriageLoan({ supplementaryDocumentInfo: arr, file: file, key: key })
      );
      if (type === "pdf") {
        fileData.append("file", file, `${name}.${type}`);
        uploadMarriageLoanFile(fileData, {
          description: name,
          referenceNumber: searchParams.get("reference_number"),
          identificationCode: searchParams.get("identification_code"),
        })
          .then((res) => {
            getInfo(res?.data?.key, file, type);
          })
          .catch(() => {
            errorHandler(errorResponse);
            const newArray2 = [...arr];
            newArray2[index] = {
              ...newArray2[index],
              error: true,
              viewImage: false,
              loadingUpload: false,
            };
            dispatch(marriageLoan({ supplementaryDocumentInfo: newArray2 }));
          });
      } else {
        new Compressor(file, {
          convertSize: 3000000,
          quality: 0.6,
          async success(result) {
            if (result) {
              if (result.size < 5000000) {
                fileData.append("file", result, `${name}.${type}`);
                uploadMarriageLoanFile(fileData, {
                  description: name,
                  referenceNumber: searchParams.get("reference_number"),
                  identificationCode: searchParams.get("identification_code"),
                })
                  .then((res) => {
                    getInfo(res?.data?.key, blob, type);
                  })
                  .catch(() => {
                    errorHandler(errorResponse);
                    const newArray2 = [...arr];
                    newArray2[index] = {
                      ...newArray2[index],
                      error: true,
                      viewImage: false,
                      loadingUpload: false,
                    };
                    dispatch(
                      marriageLoan({ supplementaryDocumentInfo: newArray2 })
                    );
                  });
              } else {
                dispatch(
                  setNotificationData({
                    message: Dictionary.errorSize,
                    type: "error",
                    time: 5000,
                  })
                );
              }
            }
          },
          error() {
            dispatch(
              setNotificationData({
                message: "خطا در فشرده سازی",
                type: "error",
                time: 5000,
              })
            );
          },
        });
      }
    }
  };

  const handleDelete = (key) => {
    deleteMarriageLoanFile({
      key: key,
      referenceNumber: searchParams.get("reference_number"),
      identificationCode: searchParams.get("identification_code"),
    })
      .then(() => {
        getInfo();
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  return (
    <>
      {supplementaryInfoMarriageTryAgain ? (
        <TryAgainCallRequest onFinish={getInfo} onCancel={onCancel} />
      ) : (
        <div className={Classes["loan-wrapper"]}>
          <div className={Classes["detail-info-wrapper"]}>
            <InfoBoxWithLabel
              type="number"
              name="central_bank_trace_id"
              value={supplementaryInfo?.central_bank_trace_id}
              label={Dictionary.traceCode + " " + Dictionary.centralBank}
            />
            <InfoBoxWithLabel
              type="number"
              name="fix_trace_id"
              value={supplementaryInfo?.fix_trace_id}
              label={Dictionary.code + " " + Dictionary.trace}
            />
            <InfoBoxWithLabel
              label={Dictionary.nationalId}
              name="identification_code"
              type="number"
              value={supplementaryInfo?.identification_code}
            />
            <InfoBoxWithLabel
              type="number"
              name="submit_date_central_bank"
              value={supplementaryInfo?.submit_date_central_bank}
              label={`${Dictionary.date} ${Dictionary.record} ${Dictionary.centralBank}`}
            />
            <InfoBoxWithLabel
              type="number"
              name="submit_date_hi_bank"
              value={supplementaryInfo?.submit_date_hi_bank}
              label={`${Dictionary.date} ${Dictionary.record} Hibank`}
            />
          </div>
          <Text className={Classes["details-info-title"]}>
            {Dictionary.documents + " " + Dictionary.supplementary}
          </Text>
          <div className={Classes["details-info-card"]}>
            <div className={Classes["upload-doc-container"]}>
              <div>
                <p className={Classes["attention-2"]}>
                  توجه: حجم تصاویر حداکثر 5MB باشد.
                </p>
                <p className={Classes["attention-2"]}>
                  توجه: نام مدارک ارسالی نمی تواند تکراری باشد.
                </p>
                <p className={Classes["attention-2"]}>
                  توجه: بیشترین تعداد مدارک ارسالی ۱۰ عدد می‌باشد.
                </p>
                <p className={Classes["attention-2"]}>
                  توجه: فقط مدارک با فرمت‌های (png,jpg,jpeg,pdf) قابل قبول است.
                </p>
                <p className={Classes["attention-2"]}>
                  توجه: نام مدارک ارسالی فقط می‌تواند شامل حروف فارسی و اعداد
                  باشد.
                </p>
              </div>
              {supplementaryDocumentInfo.length < 10 && (
                <ButtonComponent
                  type="default"
                  htmlType="submit"
                  onClick={onClick}
                  srcRight={Add}
                  classNameBtn={Classes["btn-part"]}
                >
                  {Dictionary.upload} {Dictionary.documentary} {Dictionary.new}
                </ButtonComponent>
              )}
            </div>
            {supplementaryDocumentInfo.length > 0 && (
              <div className={Classes["image-part-container"]}>
                <Row
                  gutter={[24, 32]}
                  style={{ marginLeft: 0, marginRight: 0 }}
                >
                  {supplementaryDocumentInfo?.map((item) => (
                    <Col span={4} key={item.key}>
                      <UploadImage
                        item={item}
                        uploadFile={uploadFile}
                        onDelete={() => handleDelete(item.key)}
                        className={Classes["image-download-part"]}
                        tryAgain={
                          item.upload
                            ? () => uploadFile(file, item.key, item.name)
                            : () => getImage(item.key)
                        }
                        onClick={
                          item.file
                            ? () =>
                                downloadPhoto(
                                  item?.file,
                                  `${item.name}-${searchParams.get(
                                    "identification_code"
                                  )}.${item?.type}`
                                )
                            : () => getImage(item.key)
                        }
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </div>
          <div ref={docRef} />

          <Text className={Classes["details-info-title"]}>
            {Dictionary.amountInfo}
          </Text>
          <div className={Classes["detail-info-wrapper"]}>
            <InfoBoxWithLabel
              label={Dictionary.amountLoan}
              name="amount"
              type="amount"
              value={supplementaryInfo?.amount}
            />
            <InfoBoxWithLabel
              name="duration"
              label={Dictionary.durationLoan}
              value={`${supplementaryInfo?.duration || "--"} ${
                Dictionary.monthly
              }`}
            />
          </div>
          <Text className={Classes["details-info-title"]}>
            {Dictionary.statusInfo}
          </Text>
          {supplementaryInfo?.status === "IN_PROGRESS" ||
          supplementaryInfo?.status === "RECHECK_BRANCH" ? (
            <Form
              className={Classes["details-info-form"]}
              layout="vertical"
              form={form}
              onFinish={onFinish}
              requiredMark={false}
            >
              {statusList.length > 0 && (
                <div style={{ width: "100%" }}>
                  <FormItemComponent
                    shouldUpdate
                    name="status"
                    label={Dictionary.status}
                    className={Classes["details-info-form-select"]}
                    rules={[{ required: true, message: Dictionary.require }]}
                  >
                    <SelectComponent
                      name="status"
                      showSearch={false}
                      items={statusList}
                      loading={statusLoading}
                      placeholder={Dictionary.selectOne}
                      onChange={(e) => onChangeSelect(e)}
                      className={Classes["details-info-select"]}
                    />
                  </FormItemComponent>
                </div>
              )}
              {status === "REJECTED" && (
                <FormItemComponent
                  shouldUpdate
                  name="reject_reason"
                  label={Dictionary.reasonReject}
                  className={Classes["authenticated-customer-item"]}
                  rules={[{ required: true, message: Dictionary.require }]}
                >
                  <Select
                    showSearch
                    onFocus={setStatus}
                    name="reject_reason"
                    notFoundContent={""}
                    options={readyReactions}
                    optionFilterProp="children"
                    className={Classes["reject-info-select"]}
                    placeholder={Dictionary.selectRejectReason}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onBlur={() => {
                      setLoading(false);
                      setIcon(DropDown);
                    }}
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
                  />
                </FormItemComponent>
              )}
              {status === "ACCEPTED" && (
                <>
                  <div style={{ display: "flex", width: "100%" }}>
                    <FormItemComponent
                      shouldUpdate
                      name="branch_acceptance_date"
                      label={Dictionary.serviceDate}
                      className={Classes["details-info-form-item"]}
                      rules={[
                        {
                          required: true,
                          message: Dictionary.require,
                        },
                        () => ({
                          validator(_, value) {
                            if (
                              Number(value.month) <= Number(thisMonth) &&
                              Number(value.day) < Number(thisDay)
                            ) {
                              dispatch(
                                marriageLoan({
                                  branch_acceptance_date_error: true,
                                })
                              );
                              return Promise.reject(
                                new Error("تاریخ مراجعه نباید تاریخ گذشته باشد")
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <NewDatePicker
                        scroll={0}
                        end={thisYear}
                        start={thisYear}
                        startMonth={thisMonth}
                        id="branch_acceptance_date"
                        placeholder={Dictionary.serviceDate}
                        classNamePad={Classes["date-picker-pad"]}
                        className={cx(Classes["date-picker"], {
                          [Classes["date-picker-error"]]:
                            branch_acceptance_date_error,
                        })}
                        onChange={(value) =>
                          dispatch(
                            marriageLoan({
                              branch_acceptance_date: value,
                              branch_acceptance_date_error: false,
                            })
                          )
                        }
                      />
                    </FormItemComponent>
                    <FormItemComponent
                      shouldUpdate
                      name="branch_acceptance_time"
                      className={Classes["details-info-form-item"]}
                      label={
                        Dictionary.serviceTime + "(" + Dictionary.optional + ")"
                      }
                    >
                      <TimePicker
                        end={14}
                        start={7}
                        scroll={0}
                        id="branch_acceptance_time"
                        placeholder={Dictionary.serviceTime}
                        classNamePad={Classes["date-picker-pad"]}
                        className={cx(Classes["date-picker"], {
                          [Classes["date-picker-error"]]:
                            branch_acceptance_time_error,
                        })}
                        onChange={(value) =>
                          dispatch(
                            marriageLoan({
                              branch_acceptance_time: value,
                              branch_acceptance_time_error: false,
                            })
                          )
                        }
                      />
                    </FormItemComponent>
                  </div>
                  <FormItemComponent
                    shouldUpdate
                    label={Dictionary.desc}
                    name="accept_description"
                    className={Classes["details-text-area"]}
                    rules={[
                      {
                        max: 100,
                        message: Dictionary.checkInput,
                      },
                      {
                        pattern: /^[\u0600-\u06FF-0-9-.,!?\s]+$/,
                        message: Dictionary.checkInput,
                      },
                    ]}
                  >
                    <TextAreaComponent
                      rows={4}
                      direction="rtl"
                      maxLength={100}
                      name="accept_description"
                      placeholder={Dictionary.desc}
                      className={Classes["details-info-text-area"]}
                    />
                  </FormItemComponent>
                  <p className={Classes["attention"]}>
                    توجه: متن فوق عیناً به مشتری نمایش داده می‌شود، خواهشمند است
                    مختصر و مفید نوشته شود.
                  </p>
                </>
              )}
              {status === "CUSTOMER_MODIFY" && (
                <>
                  <FormItemComponent
                    shouldUpdate
                    name="description"
                    label={Dictionary.expertIdea}
                    className={Classes["details-text-area"]}
                    rules={[
                      {
                        required: true,
                        message: Dictionary.require,
                      },
                      {
                        max: 80,
                        message: Dictionary.checkInput,
                      },
                      {
                        pattern: /^[\u0600-\u06FF-0-9-.,!?\s]+$/,
                        message: Dictionary.checkInput,
                      },
                    ]}
                  >
                    <TextAreaComponent
                      rows={4}
                      maxLength={80}
                      direction="rtl"
                      name="description"
                      placeholder={Dictionary.expertIdea}
                      className={Classes["details-info-text-area"]}
                    />
                  </FormItemComponent>
                  <p className={Classes["attention"]}>
                    توجه: متن فوق عیناً به مشتری نمایش داده می‌شود، خواهشمند است
                    مختصر و مفید نوشته شود.
                  </p>
                </>
              )}
              <FormItemComponent
                button={true}
                className={Classes["details-info-btn"]}
              >
                <ButtonComponent
                  type="primary"
                  htmlType="submit"
                  classNameBtn={Classes["details-confirm-btn"]}
                  onClick={onFinish}
                >
                  {Dictionary.confirm}
                </ButtonComponent>
                <ButtonComponent
                  type="default"
                  onClick={onCancel}
                  classNameBtn={Classes["details-cancel-btn"]}
                >
                  {Dictionary.cancel}
                </ButtonComponent>
              </FormItemComponent>
            </Form>
          ) : (
            <div>
              <div className={Classes["authenticated-customer-status"]}>
                <div className={Classes["details-info-label"]}>
                  {Dictionary.status}
                </div>
                <StatusComponent
                  className={Classes["details-status"]}
                  title={supplementaryInfo?.status_desc}
                  type={findStatus(supplementaryInfo?.status)}
                />
                {supplementaryInfo?.status === "REJECTED" && (
                  <div className={Classes["text-area-info-wrapper2"]}>
                    <InfoBoxWithLabel
                      type="text-aria"
                      name="reject_reason"
                      label={Dictionary.reasonReject}
                      value={supplementaryInfo?.reject_reason}
                    />
                  </div>
                )}
                {supplementaryInfo?.status === "CUSTOMER_MODIFY" && (
                  <div className={Classes["text-area-info-wrapper2"]}>
                    <InfoBoxWithLabel
                      label={Dictionary.expertIdea}
                      type="text-aria"
                      name="description"
                      value={supplementaryInfo?.description}
                    />
                  </div>
                )}
                {supplementaryInfo?.status === "ACCEPTED" && (
                  <>
                    <div className={Classes["detail-info-wrapper2"]}>
                      <InfoBoxWithLabel
                        type="number"
                        name="branch_acceptance_date"
                        label={Dictionary.serviceDate}
                        value={supplementaryInfo?.branch_acceptance_date}
                      />
                      <InfoBoxWithLabel
                        type="number"
                        name="branch_acceptance_time"
                        label={Dictionary.serviceDate}
                        value={supplementaryInfo?.branch_acceptance_time}
                      />
                    </div>
                    <div className={Classes["text-area-info-wrapper"]}>
                      <InfoBoxWithLabel
                        type="text-aria"
                        label={Dictionary.desc}
                        name="accept_description"
                        value={supplementaryInfo?.accept_description}
                      />
                    </div>
                  </>
                )}
              </div>
              <ButtonComponent
                type="primary"
                htmlType="close"
                onClick={onCancel}
                classNameBtn={Classes["details-info-btn"]}
              >
                {Dictionary.close}
              </ButtonComponent>
            </div>
          )}
          <div ref={divRef} />
        </div>
      )}
    </>
  );
};
export default MarriageLoanDetailsSupplementaryInfo;
