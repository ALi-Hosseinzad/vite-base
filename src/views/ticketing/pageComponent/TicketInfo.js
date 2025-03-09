import React, { useEffect, useRef } from "react";
import Dictionary from "helpers/Dictionary";
import { useDispatch, useSelector } from "react-redux";
import Classes from "views/ticketing/styles/ticketInfo.module.scss";
import { Form } from "antd";
import FormItemComponent from "components/formItem/FormItemComponent";
import { ticketing } from "store/reducers/ticketing/ticketingReducer";
import SelectComponent from "components/SelectComponent/SelectComponent";
import ButtonComponent from "components/button/ButtonComponent";
import { messageList } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";

const TicketInfo = () => {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  const ticketingData = useSelector((state) => state.ticketing.value);
  const { objectModal, record, captions, permissions, captionDescription } =
    ticketingData;
  const [form] = Form.useForm();
  const formRef = useRef();

  useEffect(() => {
    form.resetFields();
  }, [objectModal]);

  const onFinish = () => {
    messageList({
      trace_id: record?.trace_id,
      caption: captionDescription,
    })
      .then((res) =>
        dispatch(ticketing({ messageHistory: true, messagesList: res?.data }))
      )
      .catch(() => errorHandler(errorResponse));
  };

  const handleChange = (value) => {
    dispatch(ticketing({ captionDescription: value }));
  };

  return (
    <div>
      <div>
        <div className={Classes["row-bg-gray"]}>
          <p>{Dictionary.fullName}</p>
          <p>{record.full_name || "--"}</p>
        </div>

        <div className={Classes["row-bg-gray"]}>
          <p>{Dictionary.deviceInfo}</p>
          <p>
            <span className={Classes["channel"]}>{`${
              record?.application_channel || ""
            } - `}</span>
            <span className={Classes["version"]}>{`${
              record?.app_version || ""
            } - `}</span>
            <span className={Classes["info"]}>{`${
              record?.device_model || ""
            } - ${record?.gateway_version || ""}`}</span>
          </p>
        </div>

        <div className={Classes["tow-columns"]}>
          <div className={Classes["row-bg-gray"]}>
            <p>{Dictionary.nationalId}</p>
            <p>{record.identification_code || "--"}</p>
          </div>
          <div className={Classes["row-bg-gray"]}>
            <p>{Dictionary.mobile}</p>
            <p>{record.phone_number || "--"}</p>
          </div>
        </div>
        <div className={`${Classes["row-bg-gray"]} ${Classes["big-box"]}`}>
          <p>{Dictionary.customerText}</p>
          <p>{record.question || "--"}</p>
        </div>
      </div>
      {permissions.ask ? (
        <Form
          className={Classes["ticket-info-form"]}
          layout="vertical"
          form={form}
          onFinish={onFinish}
          ref={formRef}
          requiredMark={false}
        >
          <FormItemComponent
            name="event"
            label={Dictionary.messageObject}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
            ]}
          >
            <SelectComponent
              name="event"
              showSearch
              width={343}
              placeholder={Dictionary.chooseOne}
              items={captions}
              className={Classes["select-object"]}
              onChange={(value) => handleChange(value)}
            />
          </FormItemComponent>
          <div className={Classes["ticket-info-details-btn"]}>
            <ButtonComponent
              classNameBtn={Classes["confirm-btn"]}
              type="primary"
              htmlType="submit"
            >
              {Dictionary.confirm}
            </ButtonComponent>
            <ButtonComponent
              classNameBtn={Classes["cancel-btn"]}
              type="default"
              onClick={() => dispatch(ticketing({ objectModal: false }))}
            >
              {Dictionary.cancel}
            </ButtonComponent>
          </div>
        </Form>
      ) : (
        <ButtonComponent
          classNameBtn={Classes["ticket-info-one-button"]}
          onClick={() =>
            dispatch(ticketing({ objectModal: false, captionDescription: "" }))
          }
          type="primary"
          htmlType={Dictionary.close}
        >
          {Dictionary.close}
        </ButtonComponent>
      )}
    </div>
  );
};

export default TicketInfo;
