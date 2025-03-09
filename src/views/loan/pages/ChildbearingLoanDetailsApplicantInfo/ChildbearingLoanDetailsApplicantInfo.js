import React, { useEffect } from "react";
import Dictionary from "helpers/Dictionary";
import { Col, Row, Typography } from "antd";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import { downloadPhoto } from "helpers/downloadPhoto";
import { useDispatch, useSelector } from "react-redux";
import { b64toBlob } from "helpers/convertBase64ToBlob";
import Classes from "views/loan/styles/LoanDetails.module.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import DownloadableImg from "components/downloadableImg/DownloadableImg";
import InfoBoxWithLabel from "components/infoBoxWithLabel/InfoBoxWithLabel";
import TryAgainCallRequest from "components/tryAgainCallRequest/TryAgainCallRequest";
import {
  getChildbearingLoanDetailsImages,
  getChildbearingLoanDetailsInfo,
} from "helpers/APIFunction";
import {
  childbearingLoan,
  childbearingLoanState,
  resetChildbearingLoanRecord,
} from "store/reducers/loan/ChildbearingLoanReducer";

const ChildbearingLoanDetailsApplicantInfo = () => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorHandler = useErrorHandler();
  const [searchParams] = useSearchParams();
  const ChildbearingLoanData = useSelector(childbearingLoanState);
  const {
    applicantDocumentInfo,
    applicantInfo,
    applicantOtherJobs,
    record,
    applicantDocumentInfoChild,
    applicantChildbearingTryAgain,
  } = ChildbearingLoanData;

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = () => {
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
    getChildbearingLoanDetailsInfo(body, "customer")
      .then((res) => {
        const convertList = [];
        const convertListChild = [];
        res?.data?.document_info?.forEach((node, index) => {
          const convertObj = {
            file: "",
            type: "",
            id: index,
            error: false,
            key: node.key,
            loading: false,
            name: node.name,
            viewImage: true,
          };
          if (node.key === "CUSTOMER_CHILD_BIRTH_CERTIFICATE_P_1") {
            convertListChild.push(convertObj);
          } else {
            convertList.push(convertObj);
          }
        });

        dispatch(
          childbearingLoan({
            applicantDocumentInfo: convertList,
            applicantChildbearingTryAgain: false,
            applicantDocumentInfoChild: convertListChild,
            applicantInfo: res.data?.initial_info_customer,
            applicantOtherJobs:
              res.data?.initial_info_customer?.other_jobs || [],
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
        dispatch(childbearingLoan({ applicantChildbearingTryAgain: true }));
      });
  };

  const getImage = async (key) => {
    if (key) {
      let arr = [...applicantDocumentInfo];
      const index = arr.findIndex((item) => item.key === key);
      arr[index] = { ...arr[index], loading: true };
      dispatch(childbearingLoan({ applicantDocumentInfo: arr }));
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
      getChildbearingLoanDetailsImages(params)
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
          let newArray = [...arr];
          newArray[index] = {
            ...newArray[index],
            file: urlObject,
            error: false,
            viewImage: false,
            type: type,
            loading: false,
          };
          dispatch(
            childbearingLoan({
              applicantDocumentInfo: newArray,
              loading: false,
            })
          );
        })
        .catch(() => {
          errorHandler(errorResponse);
          const newArray2 = [...arr];
          newArray2[index] = {
            ...newArray2[index],
            error: true,
            viewImage: true,
            loading: false,
          };
          dispatch(childbearingLoan({ applicantDocumentInfo: newArray2 }));
        });
    }
  };

  const getImageChild = async (key) => {
    if (key) {
      let arr = [...applicantDocumentInfoChild];
      const index = arr.findIndex((item) => item.key === key);
      arr[index] = { ...arr[index], loading: true };
      dispatch(childbearingLoan({ applicantDocumentInfoChild: arr }));
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
      getChildbearingLoanDetailsImages(params)
        .then((res) => {
          let urlObject, blob;
          const type = res?.headers["content-disposition"].substring(
            res?.headers["content-disposition"].lastIndexOf(".") + 1
          );
          if (type === "pdf") {
            blob = b64toBlob(res?.data?.file, `application/pdf`);
            urlObject =
              window.URL.createObjectURL(new Blob([blob])) +
              "#toolbar=0&navpanes=0";
          } else {
            blob = b64toBlob(res?.data?.file, `img/${type}`);
            urlObject = window.URL.createObjectURL(new Blob([blob]));
          }
          let newArray = [...arr];
          newArray[index] = {
            ...newArray[index],
            file: urlObject,
            error: false,
            viewImage: false,
            type: type,
            loading: false,
          };
          dispatch(
            childbearingLoan({
              applicantDocumentInfoChild: newArray,
              loading: false,
            })
          );
        })
        .catch(() => {
          errorHandler(errorResponse);
          const newArray2 = [...arr];
          newArray2[index] = {
            ...newArray2[index],
            error: true,
            viewImage: true,
            loading: false,
          };
          dispatch(childbearingLoan({ applicantDocumentInfoChild: newArray2 }));
        });
    }
  };

  const onCancel = () => {
    dispatch(resetChildbearingLoanRecord());
    navigate("/loan/supportance-loan");
  };

  return (
    <>
      {applicantChildbearingTryAgain ? (
        <TryAgainCallRequest onFinish={getInfo} onCancel={onCancel} />
      ) : (
        <div className={Classes["loan-wrapper"]}>
          <div className={Classes["detail-info-wrapper"]}>
            <InfoBoxWithLabel
              label={Dictionary.fullName + " " + Dictionary.child}
              value={applicantInfo?.child_full_name}
              name="child_full_name"
            />
            <InfoBoxWithLabel
              type="number"
              name="child_identification_code"
              value={applicantInfo?.child_identification_code}
              label={Dictionary.nationalId + " " + Dictionary.child}
            />
            <InfoBoxWithLabel
              label={Dictionary.which + " " + Dictionary.child}
              name="birth_order"
              value={applicantInfo?.birth_order}
            />
            <InfoBoxWithLabel
              label={Dictionary.birthDate}
              name="child_birth_date"
              type="number"
              value={applicantInfo?.child_birth_date}
            />
            <InfoBoxWithLabel
              label={Dictionary.name + " " + Dictionary.applicant}
              value={applicantInfo?.first_name}
              name="first_name"
            />
            <InfoBoxWithLabel
              label={Dictionary.lastName + " " + Dictionary.applicant}
              name="last_name"
              value={applicantInfo?.last_name}
            />
          </div>
          <div className={Classes["detail-info-wrapper"]}>
            <InfoBoxWithLabel
              label={Dictionary.job + " " + Dictionary.applicant}
              name="job_category_description"
              value={applicantInfo.job_category_description}
            />
            <InfoBoxWithLabel
              label={Dictionary.exactJob}
              name="sub_job"
              value={applicantInfo.sub_job}
            />
            <InfoBoxWithLabel
              type="number"
              name="job_phone_number"
              value={applicantInfo.job_phone_number}
              label={
                Dictionary.number +
                " " +
                Dictionary.phone +
                " " +
                Dictionary.jobPlace
              }
            />
            <InfoBoxWithLabel
              type="number"
              name="job_postal_code"
              value={applicantInfo.job_postal_code}
              label={Dictionary.postalCode + " " + Dictionary.jobPlace}
            />
          </div>
          <div className={Classes["text-area-info-wrapper"]}>
            <InfoBoxWithLabel
              type="text-aria"
              name="job_address"
              value={applicantInfo.job_address}
              label={Dictionary.address + " " + Dictionary.jobPlace}
            />
            {applicantInfo.address_description && (
              <InfoBoxWithLabel
                type="text-aria"
                name="address_description"
                value={applicantInfo.address_description}
                label={
                  Dictionary.description +
                  " " +
                  Dictionary.address +
                  "(" +
                  Dictionary.optional +
                  ")"
                }
              />
            )}
          </div>

          {applicantOtherJobs.length > 0 && (
            <Text className={Classes["details-info-title"]}>
              {Dictionary.otherJobs}
            </Text>
          )}
          {applicantOtherJobs.length > 0 &&
            applicantOtherJobs.map((item, index) => (
              <div className={Classes["other-jobs-content"]} key={index}>
                <Text className={Classes["jobs-header"]}>
                  {Dictionary.job}
                  {index + 1}
                </Text>
                <div className={Classes["detail-info-wrapper"]}>
                  <InfoBoxWithLabel
                    name="job_category_description"
                    value={item.other_job_category_description}
                    label={Dictionary.job + " " + Dictionary.applicant}
                  />
                  <InfoBoxWithLabel
                    label={Dictionary.exactJob}
                    name="sub_job"
                    value={item.other_job_sub_job}
                  />
                  <InfoBoxWithLabel
                    type="number"
                    name="job_phone"
                    value={item.other_job_phone_number}
                    label={
                      Dictionary.number +
                      " " +
                      Dictionary.phone +
                      " " +
                      Dictionary.jobPlace
                    }
                  />
                  <InfoBoxWithLabel
                    type="number"
                    name="job_postal_code"
                    value={item.other_job_postal_code}
                    label={Dictionary.postalCode + " " + Dictionary.jobPlace}
                  />
                </div>
                <div className={Classes["text-area-info-wrapper"]}>
                  <InfoBoxWithLabel
                    type="text-aria"
                    name="job_address"
                    value={item.other_job_address}
                    label={Dictionary.address + " " + Dictionary.jobPlace}
                  />
                  {item.other_job_address_description && (
                    <InfoBoxWithLabel
                      type="text-aria"
                      name="other_job_address_description"
                      value={item.other_job_address_description}
                      label={
                        Dictionary.description +
                        " " +
                        Dictionary.address +
                        "(" +
                        Dictionary.optional +
                        ")"
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          {applicantDocumentInfoChild.length > 0 && (
            <>
              <Text className={Classes["details-info-title"]}>
                {Dictionary.documents + " " + Dictionary.child}
              </Text>
              <div className={Classes["image-part-container"]}>
                <Row
                  gutter={[24, 32]}
                  style={{ marginLeft: 0, marginRight: 0 }}
                >
                  {applicantDocumentInfoChild.map((item) => (
                    <Col span={4} key={item.id}>
                      <DownloadableImg
                        item={item}
                        label={item.name}
                        error={item.error}
                        loading={item.loading}
                        tryAgain={() => getImage(item.key)}
                        downloadText={Dictionary.downloadDoc}
                        className={Classes["image-download-part"]}
                        viewText={
                          Dictionary.show + " " + Dictionary.documentary
                        }
                        onClick={
                          item.file
                            ? () =>
                                downloadPhoto(
                                  item?.file,
                                  `${item.name}-${applicantInfo.first_name} ${applicantInfo.last_name}.${item?.type}`
                                )
                            : () => getImageChild(item.key)
                        }
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            </>
          )}
          {applicantDocumentInfo.length > 0 && (
            <>
              {applicantDocumentInfoChild.length > 0 && (
                <div style={{ marginTop: 40 }} />
              )}
              <Text className={Classes["details-info-title"]}>
                {Dictionary.documents + " " + Dictionary.applicant}
              </Text>
              <div className={Classes["image-part-container"]}>
                <Row
                  gutter={[24, 32]}
                  style={{ marginLeft: 0, marginRight: 0 }}
                >
                  {applicantDocumentInfo.map((item) => (
                    <Col span={4} key={item.id}>
                      <DownloadableImg
                        item={item}
                        label={item.name}
                        error={item.error}
                        loading={item.loading}
                        tryAgain={() => getImage(item.key)}
                        downloadText={Dictionary.downloadDoc}
                        className={Classes["image-download-part"]}
                        viewText={
                          Dictionary.show + " " + Dictionary.documentary
                        }
                        onClick={
                          item.file
                            ? () =>
                                downloadPhoto(
                                  item?.file,
                                  `${item.name}-${applicantInfo.first_name} ${applicantInfo.last_name}.${item?.type}`
                                )
                            : () => getImage(item.key)
                        }
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
export default ChildbearingLoanDetailsApplicantInfo;
