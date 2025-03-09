import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import Classes from "views/representative/styles/Representative.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { dismissalRepresentative2 } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import {
  representative,
  representativeState,
} from "store/reducers/representative/representativeReducer";
import ModalComponent from "components/modalComponent/ModalComponent";

const RemoveRepresentative = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const representativeData = useSelector(representativeState);
  const { record, deleteRepresentativeModal, reload } = representativeData;

  const onFinish = () => {
    dismissalRepresentative2({
      account_number: record?.account_number,
      signer_identification_code: record?.identification_code_signer,
      agent_identification_code: record?.identification_code_agent,
      agent_action: record?.agent_account_enm,
    })
      .then(() => {
        dispatch(
          representative({
            deleteRepresentativeModal: false,
            record: "",
            expandedRowKeys: null,
            agentsListAsRecord: [],
            showSuccessModal: true,
            title: Dictionary.dismissal + " " + Dictionary.representative,
          })
        );
      })
      .catch(() => errorHandler(errorResponse));
  };

  const closeModal = () => {
    dispatch(
      representative({
        deleteRepresentativeModal: false,
        record: "",
        title: "",
        reload: !reload,
      })
    );
  };

  return (
    <ModalComponent
      maskClosable={false}
      title={Dictionary.dismissal + " " + Dictionary.representative}
      open={deleteRepresentativeModal}
      width={540}
      onCancel={closeModal}
    >
      <p className={Classes["warning-dismissal2"]}>
        {Dictionary.warningDismissal}
      </p>
      <div className={Classes["acc-number2"]}>
        <span>{Dictionary.signer}</span>
        <p>{record?.full_name_signer || "--"}</p>
      </div>
      <div className={Classes["acc-number2"]}>
        <span>{Dictionary.nationalId + " " + Dictionary.representative}</span>
        <p>{record?.identification_code_agent || "--"}</p>
      </div>
      <div className={Classes["acc-number2"]}>
        <span>{Dictionary.name + " " + Dictionary.representative}</span>
        <p>{record?.full_name_agent || "--"}</p>
      </div>
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
          onClick={closeModal}
          classNameBtn={Classes["edit-card-form-btn"]}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </ModalComponent>
  );
};
export default RemoveRepresentative;
