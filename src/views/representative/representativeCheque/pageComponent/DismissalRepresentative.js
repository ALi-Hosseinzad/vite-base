import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Form } from "antd";
import Classes from "views/representative/styles/Representative.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { useEffect } from "react";
import { dismissalRepresentative } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import {
  representative,
  representativeState,
} from "store/reducers/representative/representativeReducer";

const DismissalRepresentative = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const representativeData = useSelector(representativeState);
  const errorHandler = useErrorHandler();

  const onFinish = () => {
    dismissalRepresentative({
      account_number: representativeData.list[0]?.account_number,
      identification_code:
        representativeData.list[0]?.super_agent_dto.identification_code,
    })
      .then(() => {
        dispatch(representative({ dismissalModal: false, reload: true }));
      })
      .catch(() => errorHandler(errorResponse));
  };

  useEffect(() => {
    if (representativeData.record) {
      form.setFieldsValue({ cardNumber: representativeData.record.pan });
    }
  }, [representativeData.editModal]);

  return (
    <Fragment>
      <div className={Classes["row"]}>
        <p>{Dictionary.accNo}</p>
        <p>{representativeData.list[0]?.account_number}</p>
      </div>
      <div className={Classes["row"]}>
        <p>{Dictionary.fullName + " " + Dictionary.representative}</p>
        <p>
          {representativeData.list[0]?.super_agent_dto?.name +
            " " +
            representativeData.list[0]?.super_agent_dto?.family}
        </p>
      </div>
      <p className={Classes["warning-dismissal"]}>
        {Dictionary.warningDismissal}
      </p>
      <FormItemComponent button={true}>
        <ButtonComponent
          type="danger"
          onClick={onFinish}
          classNameBtn={Classes["confirm-card-form-btn"]}
        >
          {Dictionary.dismissal + " " + Dictionary.representative}
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
export default DismissalRepresentative;
