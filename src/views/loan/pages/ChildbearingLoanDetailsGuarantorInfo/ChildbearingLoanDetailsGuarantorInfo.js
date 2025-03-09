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

const ChildbearingLoanDetailsGuarantorInfo = () => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorHandler = useErrorHandler();
  const [searchParams] = useSearchParams();
  const ChildbearingLoanData = useSelector(childbearingLoanState);
  const {
    guarantorDocumentInfo,
    guarantorInfo,
    guarantorOtherJobs,
    record,
    guarantorInfoChildbearingTryAgain,
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
    getChildbearingLoanDetailsInfo(body, "guarantor")
      .then((res) => {
        const convertList = [];
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
          convertList.push(convertObj);
        });
        dispatch(
          childbearingLoan({
            guarantorDocumentInfo: convertList,
            guarantorInfoChildbearingTryAgain: false,
            guarantorInfo: res.data?.initial_info_guarantor_dto,
            guarantorOtherJobs:
              res.data?.initial_info_guarantor_dto?.other_jobs,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
        dispatch(childbearingLoan({ guarantorInfoChildbearingTryAgain: true }));
      });
  };

  const getImage = (key) => {
    const arr = [...guarantorDocumentInfo];
    const index = arr.findIndex((item) => item.key === key);
    arr[index] = { ...arr[index], loading: true };
    dispatch(childbearingLoan({ guarantorDocumentInfo: arr }));
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
        dispatch(childbearingLoan({ guarantorDocumentInfo: newArray }));
      })
      .catch(() => {
        const newArray = [...arr];
        newArray[index] = {
          ...newArray[index],
          error: true,
          viewImage: true,
          loading: false,
        };
        dispatch(childbearingLoan({ guarantorDocumentInfo: newArray }));
        errorHandler(errorResponse);
      });
  };

  const onCancel = () => {
    dispatch(resetChildbearingLoanRecord());
    navigate("/loan/supportance-loan");
  };

  return (
    <>
      {guarantorInfoChildbearingTryAgain ? (
        <TryAgainCallRequest onFinish={getInfo} onCancel={onCancel} />
      ) : (
        <div className={Classes["loan-wrapper"]}>
          <div className={Classes["detail-info-wrapper"]}>
            <InfoBoxWithLabel
              label={Dictionary.name}
              value={guarantorInfo?.first_name}
              name="first_name"
            />
            <InfoBoxWithLabel
              label={Dictionary.lastName}
              name="last_name"
              value={guarantorInfo?.last_name}
            />
            <InfoBoxWithLabel
              label={Dictionary.nationalId}
              name="identification_code"
              type="number"
              value={guarantorInfo?.identification_code}
            />
            <InfoBoxWithLabel
              type="number"
              name="residence_postal_code"
              value={guarantorInfo?.residence_postal_code}
              label={Dictionary.postalCode + " " + Dictionary.homePlace}
            />
          </div>
          <div className={Classes["text-area-info-wrapper"]}>
            <InfoBoxWithLabel
              type="text-aria"
              name="residence_address"
              value={guarantorInfo?.residence_address}
              label={Dictionary.address + " " + Dictionary.homePlace}
            />
            {guarantorInfo?.residence_address_description && (
              <InfoBoxWithLabel
                type="text-aria"
                name="residence_address_description"
                value={guarantorInfo.residence_address_description}
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
          <div className={Classes["detail-info-wrapper"]}>
            <InfoBoxWithLabel
              name="job_category_description"
              value={guarantorInfo?.job_category_description}
              label={Dictionary.job + " " + Dictionary.guarantor}
            />
            <InfoBoxWithLabel
              label={Dictionary.exactJob}
              name="sub_job"
              value={guarantorInfo?.sub_job}
            />
            <InfoBoxWithLabel
              type="number"
              name="job_phone_number"
              value={guarantorInfo?.job_phone_number}
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
              value={guarantorInfo?.job_postal_code}
              label={Dictionary.postalCode + " " + Dictionary.jobPlace}
            />
          </div>
          <div className={Classes["text-area-info-wrapper"]}>
            <InfoBoxWithLabel
              type="text-aria"
              name="job_address"
              value={guarantorInfo?.job_address}
              label={Dictionary.address + " " + Dictionary.jobPlace}
            />
            {guarantorInfo?.job_address_description && (
              <InfoBoxWithLabel
                type="text-aria"
                name="job_address_description"
                value={guarantorInfo?.job_address_description}
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
          {guarantorOtherJobs?.length > 0 && (
            <Text className={Classes["details-info-title"]}>
              {Dictionary.otherJobs}
            </Text>
          )}
          {guarantorOtherJobs?.map((item, index) => (
            <div className={Classes["other-jobs-content"]} key={index}>
              <Text className={Classes["jobs-header"]}>
                {Dictionary.job}
                {index + 1}
              </Text>
              <div className={Classes["detail-info-wrapper"]}>
                <InfoBoxWithLabel
                  name="other_job_category_description"
                  value={item.other_job_category_description}
                  label={Dictionary.job + " " + Dictionary.guarantor}
                />
                <InfoBoxWithLabel
                  label={Dictionary.exactJob}
                  name="sub_job"
                  value={item?.other_job_sub_job}
                />
                <InfoBoxWithLabel
                  type="number"
                  name="other_job_phone_number"
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
                  name="other_job_postal_code"
                  value={item.other_job_postal_code}
                  label={Dictionary.postalCode + " " + Dictionary.jobPlace}
                />
              </div>
              <div className={Classes["text-area-info-wrapper"]}>
                <InfoBoxWithLabel
                  type="text-aria"
                  name="other_job_address"
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
          {guarantorDocumentInfo?.length > 0 && (
            <>
              <Text className={Classes["details-info-title"]}>
                {Dictionary.documents + " " + Dictionary.guarantor}
              </Text>
              <div className={Classes["image-part-container"]}>
                <Row
                  gutter={[24, 32]}
                  style={{ marginLeft: 0, marginRight: 0 }}
                >
                  {guarantorDocumentInfo?.map((item) => (
                    <Col span={4}>
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
                                  `${item.name}-${guarantorInfo?.first_name} ${guarantorInfo?.last_name}.${item?.type}`
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
export default ChildbearingLoanDetailsGuarantorInfo;
