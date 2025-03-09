import React from "react";
import Dictionary from "helpers/Dictionary";
import { errorResponse } from "helpers/APIService";
import { downloadPhoto } from "helpers/downloadPhoto";
import { downloadHubFile } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import { b64toBlob } from "helpers/convertBase64ToBlob";
import Classes from "../styles/viewCreditHub.module.scss";
import { ConvertNumberToComma } from "helpers/ConvertNumberToComma";
import DownloadableImg from "components/downloadableImg/DownloadableImg";
import {
  creditHub,
  creditHubState,
} from "store/reducers/creditHub/creditHubReducer";

const Detail = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const creditHubData = useSelector(creditHubState);
  const { details, downloads } = creditHubData;

  const getImage = async (key) => {
    if (key) {
      let arr = [...downloads];
      const index = arr.findIndex((item) => item.key === key);
      arr[index] = { ...arr[index], loading: true };
      dispatch(creditHub({ downloads: arr }));
      let params;
      params = {
        reference_number: details.reference_number,
        identification_code: details.identification_code,
        document_type: key,
      };
      downloadHubFile(params)
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
          dispatch(creditHub({ downloads: newArray, loading: false }));
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
          dispatch(creditHub({ downloads: newArray2 }));
        });
    }
  };

  return (
    <div className={Classes["credit-hub-container"]}>
      <div className={Classes["view-box"]}>
        <div className={Classes["view-box-container"]}>
          <p className={Classes["form-name-2"]}>
            {Dictionary.informationOf} {Dictionary.applicant}
          </p>
          <div className={Classes["row"]}>
            <span>{Dictionary.amount} :</span>
            <span>
              {" "}
              {details?.amount ? ConvertNumberToComma(details.amount) : "--"}
            </span>
          </div>
          <div className={Classes["row"]}>
            <span>{Dictionary.birthDate} :</span>
            <span>{details?.birth_date || "--"}</span>
          </div>
          <div className={Classes["row"]}>
            <span>{Dictionary.fullName} :</span>
            <span>{details?.full_name || "--"}</span>
          </div>
          <div className={Classes["row"]}>
            <span>{Dictionary.nationalId} :</span>
            <span>{details?.identification_code || "--"}</span>
          </div>
          <div className={Classes["row"]}>
            <span>{Dictionary.branchCode} :</span>
            <span>{details?.branch_code || "--"}</span>
          </div>
          <div className={Classes["row"]}>
            <span>{Dictionary.mobile} :</span>
            <span>{details?.mobile_number || "--"}</span>
          </div>
          <div className={Classes["row"]}>
            <span>{Dictionary.quantity + " " + Dictionary.installments} :</span>
            <span>
              {details?.installment_number
                ? details.installment_number + " " + Dictionary.monthly
                : "--"}
            </span>
          </div>
          <div className={Classes["row"]}>
            <span>{Dictionary.supplier} :</span>
            <span>{details?.reagent_name_fa || "--"}</span>
          </div>
          <div className={Classes["row"]}>
            <span>{Dictionary.type + " " + Dictionary.loan} :</span>
            <span>{details?.sub_reagent_name_fa || "--"}</span>
          </div>
          <div className={Classes["row"]}>
            <span>{Dictionary.fee + " " + Dictionary.loan} :</span>
            <span>
              {details?.total_fee
                ? ConvertNumberToComma(details.total_fee)
                : "--"}
            </span>
          </div>
          <div className={Classes["row"]}>
            <span>{Dictionary.status + " " + Dictionary.loan} :</span>
            <span>{details?.backoffice_status_desc || "--"}</span>
          </div>
          <div className={Classes["row"]}>
            <span>{Dictionary.type + " " + Dictionary.guarantee} :</span>
            {details?.guarantee_type.map((item) => (
              <span key={item.key} style={{ marginRight: 8 }}>
                {item.value} ,
              </span>
            ))}
          </div>
        </div>
        <div className={Classes["full-row"]}>
          <span>{Dictionary.description} :</span>
          <span>{details?.description || "--"}</span>
        </div>

        {downloads.length > 0 && (
          <div>
            <p className={Classes["form-name"]}>
              {Dictionary.documents} {Dictionary.applicant}
            </p>
            <div className={Classes["row-upload"]}>
              {downloads?.map((item) => (
                <div key={item.key}>
                  <DownloadableImg
                    item={item}
                    label={item.name}
                    error={item.error}
                    loading={item.loading}
                    tryAgain={() => getImage(item.key)}
                    downloadText={Dictionary.downloadDoc}
                    className={Classes["image-download-part"]}
                    viewText={Dictionary.show + " " + Dictionary.documentary}
                    onClick={
                      item.file
                        ? () =>
                            downloadPhoto(
                              item?.file,
                              `${item.name}-${details?.full_name}.${item.type}`
                            )
                        : () => getImage(item.key)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
