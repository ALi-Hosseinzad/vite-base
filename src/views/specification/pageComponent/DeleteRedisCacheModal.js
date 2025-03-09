import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import ButtonComponent from "components/button/ButtonComponent";
import Classes from "views/specification/styles/ShowDetailModal.module.scss";
import {
  specification,
  specificationState,
} from "store/reducers/specification/specificationReducer";
import ModalComponent from "components/modalComponent/ModalComponent";
import { Form } from "antd";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { deleteRedisCache } from "helpers/APIFunction";

const DeleteRedisCacheModal = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const specificationData = useSelector(specificationState);

  const onFinish = () => {
    deleteRedisCache()
      .then(() => {
        dispatch(specification({ showDeleteModal: false }));
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  return (
    <ModalComponent
      width={540}
      title={Dictionary.delete + " Cache"}
      open={specificationData.showDeleteModal}
      maskClosable={false}
      onCancel={() => dispatch(specification({ showDeleteModal: false }))}
    >
      <FormComponent
        layout="vertical"
        className={Classes["specification-delete-container"]}
        form={form}
        ref={formRef}
        onFinish={onFinish}
        requiredMark={false}
      >
        <div className={Classes["specification-delete-text"]}>
          <p>{Dictionary.wantToDeleteRedis}</p>
        </div>

        <FormItemComponent className={Classes["versionEditButton"]}>
          <ButtonComponent
            classNameBtn={Classes["confirmBtn"]}
            type="danger"
            htmlType="submit"
          >
            {Dictionary.clean}
          </ButtonComponent>
          <ButtonComponent
            classNameBtn={Classes["cancelBtn"]}
            type="default"
            onClick={() => dispatch(specification({ showDeleteModal: false }))}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default DeleteRedisCacheModal;
