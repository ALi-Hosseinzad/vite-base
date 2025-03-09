import React, { useEffect } from "react";
import { Form } from "antd";
import Dictionary from "helpers/Dictionary";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import { addNoteForTicket } from "helpers/APIFunction";
import TextAreaComponent from "components/textArea/TextArea";
import ButtonComponent from "components/button/ButtonComponent";
import Classes from "views/ticketing/styles/addNote.module.scss";
import { ticketing } from "store/reducers/ticketing/ticketingReducer";
import FormItemComponent from "components/formItem/FormItemComponent";
import ModalComponent from "components/modalComponent/ModalComponent";

const AddNote = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const ticketingData = useSelector((state) => state.ticketing.value);
  const { record, reload, noteModal } = ticketingData;

  useEffect(() => {
    form.setFieldsValue({ userNote: record.back_office_user_note });
  }, [noteModal]);

  const onFinish = (values) => {
    addNoteForTicket({ note: values?.userNote, trace_id: record?.trace_id })
      .then(() =>
        dispatch(ticketing({ noteModal: false, reload: !reload, record: "" }))
      )
      .catch(() => errorHandler(errorResponse));
  };

  return (
    <ModalComponent
      width={728}
      title={`${Dictionary.add} ${Dictionary.supportsNote}`}
      open={noteModal}
      onCancel={() => dispatch(ticketing({ noteModal: false, record: "" }))}
    >
      <Form
        className={Classes["add-note-modal"]}
        layout="vertical"
        form={form}
        onFinish={onFinish}
        requiredMark={false}
      >
        <FormItemComponent shouldUpdate name="userNote">
          <TextAreaComponent
            placeholder={Dictionary.supportsNote}
            showCount
            name="userNote"
            direction="rtl"
            rows={8}
            maxLength={120}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["add-note-btn"]}>
          <ButtonComponent
            classNameBtn={Classes["add-note-confirm-button"]}
            type="primary"
            htmlType="submit"
          >
            {Dictionary.record}
          </ButtonComponent>
          <ButtonComponent
            type="default"
            classNameBtn={Classes["add-note-cancel-button"]}
            onClick={() =>
              dispatch(ticketing({ noteModal: false, record: "" }))
            }
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </Form>
    </ModalComponent>
  );
};

export default AddNote;
