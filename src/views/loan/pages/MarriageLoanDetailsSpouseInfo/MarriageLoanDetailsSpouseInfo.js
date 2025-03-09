import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Col, Row, Typography } from "antd";
import Classes from "views/loan/styles/LoanDetails.module.scss";
import {
  getMarriageLoanDetailsImages,
  getMarriageLoanDetailsInfo,
} from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { downloadPhoto } from "helpers/downloadPhoto";
import DownloadableImg from "components/downloadableImg/DownloadableImg";
import {
  marriageLoan,
  marriageLoanState,
  resetMarriageLoanRecord,
} from "store/reducers/loan/MarriageLoanReducer";
import { useNavigate, useSearchParams } from "react-router-dom";
import InfoBoxWithLabel from "components/infoBoxWithLabel/InfoBoxWithLabel";
import { b64toBlob } from "helpers/convertBase64ToBlob";
import TryAgainCallRequest from "components/tryAgainCallRequest/TryAgainCallRequest";

const MarriageLoanDetailsSpouseInfo = () => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorHandler = useErrorHandler();
  const MarriageLoanData = useSelector(marriageLoanState);
  const [searchParams] = useSearchParams();
  const {
    spouseDocumentInfo,
    spouseInfo,
    spouseOtherJobs,
    record,
    spouseInfoMarriageTryAgain,
  } = MarriageLoanData;

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
    getMarriageLoanDetailsInfo(body, "spouse")
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
          marriageLoan({
            spouseDocumentInfo: convertList,
            spouseInfoMarriageTryAgain: false,
            spouseInfo: res.data?.initial_info_spouse_customer,
            spouseOtherJobs:
              res.data?.initial_info_spouse_customer?.other_jobs || [],
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
        dispatch(marriageLoan({ spouseInfoMarriageTryAgain: true }));
      });
  };

  const getImage = (key) => {
    const arr = [...spouseDocumentInfo];
    const index = arr.findIndex((item) => item.key === key);
    arr[index] = { ...arr[index], loading: true };
    dispatch(marriageLoan({ spouseDocumentInfo: arr }));
    let params;
    if (record) {
      params = {
        reference_number: record.reference_number,
        identification_code: record.identification_code,
        document_type: key,
      };
    } else {
      params = {
        reference_number: searchParams.get("reference_number"),
        identification_code: searchParams.get("identification_code"),
        document_type: key,
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
          marriageLoan({ spouseDocumentInfo: newArray, loading: false })
        );
      })
      .catch(() => {
        const newArray = [...arr];
        newArray[index] = {
          ...newArray[index],
          error: true,
          viewImage: true,
          loading: false,
        };
        dispatch(marriageLoan({ spouseDocumentInfo: newArray }));
        errorHandler(errorResponse);
      });
  };

  const onCancel = () => {
    dispatch(resetMarriageLoanRecord());
    navigate("/loan/supportance-loan");
  };

  return (
    <>
      {spouseInfoMarriageTryAgain ? (
        <TryAgainCallRequest onFinish={getInfo} onCancel={onCancel} />
      ) : (
        <div className={Classes["loan-wrapper"]}>
          <div className={Classes["detail-info-wrapper"]}>
            <InfoBoxWithLabel
              label={Dictionary.name}
              value={spouseInfo?.first_name}
              name="first_name"
            />
            <InfoBoxWithLabel
              label={Dictionary.lastName}
              name="last_name"
              value={spouseInfo?.last_name}
            />
            <InfoBoxWithLabel
              label={Dictionary.nationalId}
              name="identification_code"
              type="number"
              value={spouseInfo?.identification_code}
            />
            <InfoBoxWithLabel
              type="number"
              name="residence_postal_code"
              value={spouseInfo?.residence_postal_code}
              label={Dictionary.postalCode + " " + Dictionary.homePlace}
            />
          </div>
          <div className={Classes["text-area-info-wrapper"]}>
            <InfoBoxWithLabel
              type="text-aria"
              name="residence_address"
              value={spouseInfo?.residence_address}
              label={Dictionary.address + " " + Dictionary.homePlace}
            />
            {spouseInfo?.residence_address_description && (
              <InfoBoxWithLabel
                type="text-aria"
                name="residence_address_description"
                value={spouseInfo.residence_address_description}
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
              value={spouseInfo?.job_category_description}
              label={Dictionary.job + " " + Dictionary.spouse}
            />
            <InfoBoxWithLabel
              label={Dictionary.exactJob}
              name="sub_job"
              value={spouseInfo?.sub_job}
            />
            <InfoBoxWithLabel
              type="number"
              name="job_phone_number"
              value={spouseInfo?.job_phone_number}
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
              value={spouseInfo?.job_postal_code}
              label={Dictionary.postalCode + " " + Dictionary.jobPlace}
            />
          </div>
          <div className={Classes["text-area-info-wrapper"]}>
            <InfoBoxWithLabel
              type="text-aria"
              name="job_address"
              value={spouseInfo?.job_address}
              label={Dictionary.address + " " + Dictionary.jobPlace}
            />
            {spouseInfo?.job_address_description && (
              <InfoBoxWithLabel
                type="text-aria"
                name="job_address_description"
                value={spouseInfo?.job_address_description}
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
          {spouseOtherJobs?.length > 0 && (
            <Text className={Classes["details-info-title"]}>
              {Dictionary.otherJobs}
            </Text>
          )}
          {spouseOtherJobs?.map((item, index) => (
            <div className={Classes["other-jobs-content"]} key={index}>
              <Text className={Classes["jobs-header"]}>
                {Dictionary.job}
                {index + 1}
              </Text>
              <div className={Classes["detail-info-wrapper"]}>
                <InfoBoxWithLabel
                  name="job_category_description"
                  value={item.other_job_category_description}
                  label={Dictionary.job + " " + Dictionary.spouse}
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
          {spouseDocumentInfo.length > 0 && (
            <>
              <Text className={Classes["details-info-title"]}>
                {Dictionary.documents + " " + Dictionary.spouse}
              </Text>
              <div className={Classes["image-part-container"]}>
                <Row
                  gutter={[24, 32]}
                  style={{ marginLeft: 0, marginRight: 0 }}
                >
                  {spouseDocumentInfo.map((item) => (
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
                                  `${item.name}-${spouseInfo.first_name} ${spouseInfo.last_name}.${item?.type}`
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
export default MarriageLoanDetailsSpouseInfo;
