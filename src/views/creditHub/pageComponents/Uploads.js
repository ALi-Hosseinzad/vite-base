import React, { useEffect } from "react";
import Compressor from "compressorjs";
import Dictionary from "helpers/Dictionary";
import { useNavigate } from "react-router-dom";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import { downloadPhoto } from "helpers/downloadPhoto";
import { useDispatch, useSelector } from "react-redux";
import UploadPDF from "components/uploadPDF/UploadPDF";
import Classes from "../styles/AddCreditHub.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import {
  creditHub,
  creditHubState,
} from "store/reducers/creditHub/creditHubReducer";
import {
  confirmHub,
  deletePhotoCredit,
  downloadHubFile,
  uploadHubFile,
} from "helpers/APIFunction";

const Uploads = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileData = new FormData();
  const errorHandler = useErrorHandler();
  const AppSettingsData = useSelector(creditHubState);
  const { information, traceId, uploads } = AppSettingsData;

  const list = [
    {
      id: 1,
      key: `BUSINESS_LICENSE`,
      name: "جواز کسب",
      error: false,
      loading: false,
      upload: true,
    },
    {
      id: 2,
      key: `INVOICE_CONTRACT_PROFORMA`,
      name: "تصویر فاکتور/قرارداد/پروفرما",
      error: false,
      loading: false,
      upload: true,
    },
    {
      id: 3,
      key: `OWNERSHIP_DOCUMENT_LEASE`,
      name: "تصویر سند مالکیت/اجاره نامه",
      error: false,
      loading: false,
      upload: true,
    },
    {
      id: 4,
      key: `END_SERVICE_CARD`,
      name: "کارت پایان خدمت",
      error: false,
      loading: false,
      upload: true,
    },
    {
      id: 5,
      key: `BIRTH_CERTIFICATE`,
      name: "شناسنامه",
      error: false,
      loading: false,
      upload: true,
    },
    {
      id: 6,
      key: `ID_CARD`,
      name: "کارت ملی",
      error: false,
      loading: false,
      upload: true,
    },
  ];

  const onClose = () => {
    navigate(-1);
    dispatch(creditHub({ step: 0 }));
  };

  const submit = () => {
    confirmHub({ reference_number: traceId, status: "SENT_TO_BRANCH" })
      .then(() => navigate("/loan/credit-hub"))
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const uploadFile = async (file, key, name) => {
    if (file && key && name) {
      const arr = [...uploads];
      const index = arr?.findIndex((item) => item.key === key);
      const type = file?.type?.split("/")["1"];
      const blob = URL.createObjectURL(file);
      arr[index] = {
        ...arr[index],
        loading: true,
        file: blob,
        type: type,
        error: false,
      };
      dispatch(creditHub({ uploads: arr }));
      if (type === "pdf") {
        fileData.append("file", file, `${name}.pdf`);
        uploadHubFile(fileData, { referenceNumber: traceId, key: key })
          .then(() => {
            let arr2 = [...arr];
            arr2[index] = {
              ...arr2[index],
              upload: false,
              error: false,
              loading: false,
            };
            dispatch(creditHub({ uploads: arr2 }));
          })
          .catch(() => {
            errorHandler(errorResponse);
            let arr3 = [...arr];
            arr3[index] = { ...arr3[index], loading: false, error: true };
            dispatch(creditHub({ uploads: arr3 }));
          });
      } else {
        new Compressor(file, {
          convertSize: 3000000,
          quality: 0.6,
          async success(result) {
            if (result) {
              if (result.size < 5000000) {
                fileData.append("file", result, `${name}.${type}`);
                uploadHubFile(fileData, { referenceNumber: traceId, key: key })
                  .then(() => {
                    let arr2 = [...arr];
                    arr2[index] = {
                      ...arr2[index],
                      upload: false,
                      error: false,
                      loading: false,
                    };
                    dispatch(creditHub({ uploads: arr2 }));
                  })
                  .catch(() => {
                    errorHandler(errorResponse);
                    let arr3 = [...arr];
                    arr3[index] = {
                      ...arr3[index],
                      loading: false,
                      error: true,
                    };
                    dispatch(creditHub({ uploads: arr3 }));
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

  const getImage = (key, name) => {
    let arr = [...uploads];
    const index = arr?.findIndex((item) => item.key === key);
    arr[index] = { ...arr[index], loading: true, error: false };
    dispatch(creditHub({ uploads: arr }));

    downloadHubFile({
      document_type: key,
      reference_number: traceId,
      identification_code: information.identification_code,
    })
      .then((res) => {
        const type = res?.headers["content-disposition"].substring(
          res?.headers["content-disposition"].lastIndexOf(".") + 1
        );
        let result;
        if (type === "pdf") {
          result = `data:application/pdf;base64,${res.data.file}`;
        } else {
          result = `data:image;base64,${res.data.file}`;
        }
        downloadPhoto(
          result,
          `${name}-${information.identification_code}.${type}`
        );
        let arr2 = [...arr];
        arr2[index] = { ...arr2[index], loading: false, error: false };
        dispatch(creditHub({ uploads: arr2 }));
      })
      .catch(() => {
        errorHandler(errorResponse);
        let arr3 = [...arr];
        const index = arr3?.findIndex((item) => item.key === key);
        arr3[index] = { ...arr3[index], loading: false, error: true };
        dispatch(creditHub({ uploads: arr3 }));
      });
  };

  const handleDelete = (key) => {
    deletePhotoCredit(`key=${key}&referenceNumber=${traceId}`)
      .then(() => {
        let arr = [...uploads];
        const index = arr?.findIndex((item) => item.key === key);
        arr[index] = { ...arr[index], upload: true, error: false };
        dispatch(creditHub({ uploads: arr }));
      })
      .catch(() => errorHandler(errorResponse));
  };

  useEffect(() => {
    dispatch(creditHub({ uploads: list }));
  }, []);

  return (
    <div>
      <div className={Classes["upload-container"]}>
        <p> مدارک فقط با فرمت‌های ( PNG , JPG , JPEG , PDF ) قابل قبول است.</p>
        {uploads?.map((item) => (
          <UploadPDF
            item={item}
            defaultName={item.name}
            uploadFile={uploadFile}
            onDelete={() => handleDelete(item.key)}
            onClick={() => getImage(item.key, item.name)}
          />
        ))}
      </div>
      <div className={Classes["delete-modal-buttons"]}>
        <ButtonComponent
          classNameBtn={Classes["confirmBtn"]}
          type="primary"
          onClick={submit}
        >
          {Dictionary.confirm + " " + Dictionary.final}
        </ButtonComponent>
        <ButtonComponent
          classNameBtn={Classes["cancelBtn"]}
          type="default"
          onClick={onClose}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </div>
    </div>
  );
};

export default Uploads;
