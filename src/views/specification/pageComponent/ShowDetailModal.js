import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import ButtonComponent from "components/button/ButtonComponent";
import Classes from "views/specification/styles/ShowDetailModal.module.scss";
import {
  specification,
  specificationState,
} from "store/reducers/specification/specificationReducer";
import ModalComponent from "components/modalComponent/ModalComponent";

const ShowDetailModal = () => {
  const dispatch = useDispatch();
  const specificationData = useSelector(specificationState);

  return (
    <ModalComponent
      width={918}
      title={Dictionary.show}
      open={specificationData.showDetailModal}
      maskClosable={false}
      onCancel={() => dispatch(specification({ showDetailModal: false }))}
    >
      <div className={Classes["specification-details-container"]}>
        <div className={Classes["specification-line"]}>
          <div
            className={Classes["specification-title"]}
          >{`${Dictionary.title} ${Dictionary.part}`}</div>
          <div className={Classes["specification-descriptions"]}>
            {specificationData.record?.item_name}
          </div>
        </div>
        <div className={Classes["specification-line"]}>
          <div
            className={Classes["specification-title"]}
          >{`${Dictionary.group} ${Dictionary.part}`}</div>
          <div className={Classes["specification-descriptions"]}>
            {specificationData.record?.group_name}
          </div>
        </div>
        <div
          className={Classes["specification-line"]}
          style={{ marginBottom: "32px" }}
        >
          <div
            className={Classes["specification-title"]}
          >{`${Dictionary.value} ${Dictionary.part}`}</div>
          <div className={Classes["specification-descriptions"]}>
            {specificationData.record?.item_value}
          </div>
        </div>
      </div>
      <ButtonComponent
        classNameBtn={Classes["specification-button"]}
        onClick={() => dispatch(specification({ showDetailModal: false }))}
        type="primary"
        htmlType="button"
      >
        {Dictionary.close}
      </ButtonComponent>
    </ModalComponent>
  );
};

export default ShowDetailModal;
