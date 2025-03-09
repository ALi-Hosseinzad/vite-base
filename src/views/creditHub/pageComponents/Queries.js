import React from "react";
import { useEffect } from "react";
import Dictionary from "helpers/Dictionary";
import { useNavigate } from "react-router-dom";
import { errorResponse } from "helpers/APIService";
import Success from "assets/images/icon/Success.svg";
import useErrorHandler from "helpers/useErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import Classes from "../styles/AddCreditHub.module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
import Unsuccess from "assets/images/icon/FailReceipt.svg";
import ButtonComponent from "components/button/ButtonComponent";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import {
  creditHub,
  creditHubState,
} from "store/reducers/creditHub/creditHubReducer";
import {
  getInquirySama,
  getInquiryGrade,
  getInquirySamat,
  nonMandatoryInquiries,
  getInquiryMilitaryService,
  getInquiryJudicialAuthorities,
} from "helpers/APIFunction";

const Queries = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorHandler = useErrorHandler();
  const creditHubData = useSelector(creditHubState);

  const queriesType1 = [
    {
      title: "استعلام رتبه بندی اعتباری",
      request: () =>
        getInquiryGrade({ reference_number: creditHubData.traceId }).then(
          (res) => {
            if (res.data.grade === "WITHOUT_CREDIT") {
              dispatch(
                creditHub({
                  [`qu1ResponseText`]: `بدون رتبه`,
                  [`qu1Result`]: true,
                })
              );
            } else {
              dispatch(
                creditHub({
                  [`qu1ResponseText`]: `رتبه ${res.data.grade}`,
                  [`qu1Result`]: true,
                })
              );
            }
          }
        ),
      key: "qu1",
    },
    {
      title: "استعلام سما",
      request: () =>
        getInquirySama({ reference_number: creditHubData.traceId }).then(
          (res) => {
            dispatch(
              creditHub({
                [`qu5ResponseText`]: res.data.description,
                [`qu5Result`]: res.data.status,
              })
            );
          }
        ),
      key: "qu5",
    },
    {
      title: "استعلام سمات",
      request: () =>
        getInquirySamat({ reference_number: creditHubData.traceId }).then(
          (res) => {
            dispatch(
              creditHub({
                [`qu2ResponseText`]: res.data.description,
                [`qu2Result`]: res.data.status,
              })
            );
          }
        ),
      key: "qu2",
    },

    {
      title: "استعلام سازمان نظام وظیفه",
      request: () =>
        getInquiryMilitaryService({
          reference_number: creditHubData.traceId,
        }).then((res) => {
          dispatch(
            creditHub({
              [`qu4ResponseText`]: res.data.description,
              [`qu4Result`]: res.data.status,
            })
          );
        }),
      key: "qu4",
    },
  ];
  const queriesType2 = [
    { title: "استعلام ماده 186 را خودم گرفته ام", key: "article186" },
    { title: "استعلام تعهدات ارزی را خودم گرفته ام", key: "currency_query" },
    {
      title: "استعلام سامانه اصناف را خودم گرفته ام",
      key: "query_guild_system",
    },
    {
      title: "استعلام درگاه ملی اخذ مجوزها را خودم گرفته ام",
      key: "national_portal_for_obtaining_permits",
    },
    {
      title: " استعلام مراجع قضایی را خودم گرفته ام",
      key: "judicial_order_inquiry",
    },
  ];

  useEffect(() => {
    const executeQueriesSequentially = async () => {
      for (const query of queriesType1) {
        await getQu1(query);
      }
    };
    executeQueriesSequentially();
  }, []);

  const getQu1 = async (i) => {
    dispatch(
      creditHub({ [`${i.key}Loading`]: true, [`${i.key}Refresh`]: false })
    );
    await i
      .request()
      .then(() => {
        dispatch(creditHub({ [`${i.key}Loading`]: false }));
      })
      .catch(() => {
        errorHandler(errorResponse);
        dispatch(
          creditHub({
            [`${i.key}Loading`]: false,
            [`${i.key}Result`]: null,
            [`${i.key}Refresh`]: true,
          })
        );
      });
  };
  const onClose = () => {
    navigate(-1);
    dispatch(creditHub({ step: 0 }));
  };
  const submit = () => {
    if (
      queriesType1
        .concat(queriesType2)
        .every((i) => creditHubData[`${i.key}Result`] === true)
    ) {
      nonMandatoryInquiries({
        reference_number: creditHubData.traceId,
        article186: creditHubData[`article186Result`] || false,
        currency_query: creditHubData[`currency_queryResult`] || false,
        query_guild_system: creditHubData[`query_guild_systemResult`] || false,
        national_portal_for_obtaining_permits:
          creditHubData[`national_portal_for_obtaining_permitsResult`] || false,
        judicial_order_inquiry:
          creditHubData[`judicial_order_inquiry`] || false,
      })
        .then(() => {
          dispatch(creditHub({ step: 2 }));
        })
        .catch(() => errorHandler(errorResponse));
    } else {
      dispatch(
        setNotificationData({
          message: "استعلام ها مورد تایید نیست",
          type: "error",
          time: 500,
        })
      );
    }
  };
  return (
    <div>
      <p className={Classes["title-queries"]}>
        لطفا استعلام های{" "}
        <span>
          {creditHubData?.resultInfo?.gender_description}{" "}
          {creditHubData?.resultInfo?.fullname}
        </span>{" "}
        را اخذ کنید
      </p>
      {queriesType1.map((i) => (
        <div className={Classes["row-queries"]}>
          <p className={Classes["queries-title"]}>{i.title}</p>

          {creditHubData[`${i.key}Result`] === (null || undefined) ? (
            <ButtonComponent
              type="default"
              onClick={() => getQu1(i)}
              classNameBtn={Classes["queries-button"]}
              loading={creditHubData[`${i.key}Loading`]}
            >
              {!creditHubData[`${i.key}Refresh`]
                ? Dictionary.getInquiry
                : Dictionary.tryAgain}
            </ButtonComponent>
          ) : creditHubData[`${i.key}Result`] === true ? (
            <CustomIcon src={Success} size={32} name={`${i.key}-success`} />
          ) : creditHubData[`${i.key}Result`] === false ? (
            <CustomIcon src={Unsuccess} size={32} name={`${i.key}-unsuccess`} />
          ) : (
            ""
          )}
          <span> {creditHubData[`${i.key}ResponseText`]}</span>
        </div>
      ))}
      {queriesType2.map((i) => (
        <div className={Classes["row-queries"]}>
          <p className={Classes["queries-title"]}>{i.title}</p>

          {creditHubData[`${i.key}Result`] !== true ? (
            <ButtonComponent
              type="default"
              classNameBtn={Classes["queries-button"]}
              loading={creditHubData[`${i.key}Loading`]}
              onClick={() => dispatch(creditHub({ [`${i.key}Result`]: true }))}
            >
              {!creditHubData[`${i.key}Refresh`]
                ? Dictionary.confirm
                : Dictionary.tryAgain}
            </ButtonComponent>
          ) : (
            <CustomIcon src={Success} size={32} name={`${i.key}-success`} />
          )}
        </div>
      ))}
      <div className={Classes["delete-modal-buttons"]}>
        <ButtonComponent
          classNameBtn={Classes["confirmBtn"]}
          type="primary"
          onClick={submit}
        >
          {Dictionary.confirm}
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

export default Queries;
