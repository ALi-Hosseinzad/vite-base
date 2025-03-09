import React, { useEffect, useRef } from "react";
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
import TextAreaComponent from "components/textArea/TextArea";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { editSpecificationItem } from "helpers/APIFunction";

const EditRecordModal = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const specificationData = useSelector(specificationState);

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({ description: specificationData.record.item_value });
  }, [specificationData.record]);

  const onFinish = () => {
    if (specificationData.record?.item_value === description) {
      dispatch(
        setNotificationData({
          message: Dictionary.chooseOneAtLeast,
          time: 5000,
          type: "error",
        })
      );
    } else {
      editSpecificationItem({
        item_name: specificationData.record.item_name,
        item_value: specificationData.description,
      })
        .then(() => {
          dispatch(
            specification({
              showEditModal: false,
              reload: !specificationData.reload,
              record: "",
              description: "",
            })
          );
        })
        .catch(() => {
          errorHandler(errorResponse);
        });
    }
  };

  return (
    <ModalComponent
      width={918}
      title={Dictionary.show}
      open={specificationData.showEditModal}
      maskClosable={false}
      onCancel={() => dispatch(specification({ showEditModal: false }))}
    >
      <FormComponent
        layout="vertical"
        className={Classes["specification-details-container"]}
        form={form}
        ref={formRef}
        onFinish={onFinish}
        requiredMark={false}
      >
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
          className={Classes["textAreaContainer"]}
          style={{ marginBottom: "32px" }}
        >
          <p>{`${Dictionary.value} ${Dictionary.part}`}</p>
          <FormItemComponent
            name="description"
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
            ]}
          >
            <TextAreaComponent
              rows={10}
              className={Classes["textArea"]}
              onChange={(e) =>
                dispatch(specification({ description: e.target.value }))
              }
              placeholder={`${Dictionary.value} ${Dictionary.part}`}
              name="description"
              defaultValue={specificationData.record?.item_value}
            />
          </FormItemComponent>
        </div>
        <FormItemComponent className={Classes["versionEditButton"]}>
          <ButtonComponent
            classNameBtn={Classes["confirmBtn"]}
            type="primary"
            htmlType="submit"
          >
            {Dictionary.confirm}
          </ButtonComponent>
          <ButtonComponent
            classNameBtn={Classes["cancelBtn"]}
            type="default"
            onClick={() => {
              form.resetFields();
              dispatch(
                specification({
                  record: "",
                  showEditModal: false,
                  description: "",
                })
              );
            }}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default EditRecordModal;
