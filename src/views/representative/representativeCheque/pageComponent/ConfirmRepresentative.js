import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import Classes from "views/representative/styles/Representative.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { addRepresentative } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import {
  representative,
  representativeState,
} from "store/reducers/representative/representativeReducer";

const ConfirmRepresentative = () => {
  const dispatch = useDispatch();
  const representativeData = useSelector(representativeState);
  const errorHandler = useErrorHandler();

  const confirmRepresentative = () => {
    addRepresentative({
      account_number: representativeData.list[0]?.account_number,
      identification_code: representativeData.resultCheck?.identification_code,
    })
      .then(() => {
        dispatch(representative({ showSuccess: true }));
      })
      .catch(() => errorHandler(errorResponse));
  };

  return (
    <Fragment>
      <div className={Classes["acc-number"]}>
        <p>{Dictionary.accNo}</p>
        <p>{representativeData.list[0]?.account_number}</p>
      </div>
      <div className={Classes["acc-number"]}>
        <p>{Dictionary.nationalId + " " + Dictionary.representative}</p>
        <p>{representativeData.resultCheck?.identification_code}</p>
      </div>
      <div className={Classes["acc-number"]}>
        <p>{Dictionary.fullName}</p>
        <p>
          {representativeData.resultCheck?.firstname +
            " " +
            representativeData.resultCheck?.lastname}
        </p>
      </div>
      <FormItemComponent button={true}>
        <ButtonComponent
          type="primary"
          onClick={confirmRepresentative}
          classNameBtn={Classes["confirm-card-form-btn"]}
        >
          {Dictionary.confirm + " " + Dictionary.representative}
        </ButtonComponent>
        <ButtonComponent
          type="default"
          onClick={() =>
            dispatch(
              representative({
                addModal: false,
                resultCheck: null,
                showSuccess: false,
                dismissalModal: false,
              })
            )
          }
          classNameBtn={Classes["edit-card-form-btn"]}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Fragment>
  );
};
export default ConfirmRepresentative;
