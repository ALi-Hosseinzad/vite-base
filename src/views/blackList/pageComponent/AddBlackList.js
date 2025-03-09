import { Form, Select } from "antd";
import SelectComponent from "components/SelectComponent/SelectComponent";
import ButtonComponent from "components/button/ButtonComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputComponent from "components/input/InputComponent";
import { addToBlackList, getReactionSentences } from "helpers/APIFunction";
import Dictionary from "helpers/Dictionary";
import { nationalCodeValidation } from "helpers/nationalIdValidation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { blacklist } from "store/reducers/blacklist/blacklistReducer";
import DropDown from "assets/images/icon/DropDown.svg";
import SearchIcon from "assets/images/icon/Search.svg";
import Classes from "views/blackList/styles/blacklist.module.scss";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";

const AddBlackList = () => {
  const blacklistData = useSelector((state) => state.blacklist.value);
  const [state, setState] = useState(false);
  const [form] = Form.useForm();
  const formRef = useRef();
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const generator = {
    ACTIVATION: "ACTIVATION",
    LOGIN: "LOGIN",
    FORGET_PASSWORD: "REGISTRATION_BLOCK",
    CREATE_ACCOUNT_OFFLINE: "CREATE_ACCOUNT_BLOCK",
    REGISTRATION: "REGISTRATION_BLOCK",
  };

  useEffect(() => {
    dispatch(blacklist({ blockExpression: [] }));
    form.resetFields();
  }, [blacklistData.addModal]);

  const onFinish = (values) => {
    addToBlackList({
      event: values.event,
      fullname: "",
      reference_number: null,
      block_description: values.eventDescription,
      identification_code: values.identificationCode,
    })
      .then(() => dispatch(blacklist({ addModal: false })))
      .catch(() => errorHandler(errorResponse));
  };

  const handleChange = (event) => {
    dispatch(blacklist({ blockExpression: [] }));
    form.setFieldsValue({ eventDescription: null });
    const sentences = [];
    getReactionSentences({
      offset: "0",
      count: "100",
      sort_by: "-createdDate",
      criteria: {
        operation: "and",
        criteria: [
          {
            key: "event",
            value: generator[event],
            operation: "equals",
          },
        ],
      },
    })
      .then((res) =>
        res.data?.data?.forEach((element) => {
          sentences.push({
            value: element.expression,
            text: element.expression,
            id: element.id,
          });
        })
      )
      .then(() => dispatch(blacklist({ blockExpression: sentences })))
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  return (
    <div className={Classes["add-modal"]}>
      <div>
        <p className={Classes["note"]}>
          {Dictionary.fillFormBelowtoAddBlacklist}
        </p>
      </div>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        ref={formRef}
        requiredMark={false}
      >
        <div className={Classes["row"]}>
          <FormItemComponent
            name="identificationCode"
            label={Dictionary.nationalId}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                pattern: /^[0-9]+$/,
                message: Dictionary.checkInput,
              },
              () => ({
                validator(_, value) {
                  if (value !== "" && !nationalCodeValidation(value)) {
                    return Promise.reject(new Error(Dictionary.idNotValid));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputComponent
              width={343}
              placeholder={Dictionary.nationalId}
              maxLength={10}
              className={Classes["inputModal"]}
            />
          </FormItemComponent>
          <FormItemComponent
            name="event"
            label={Dictionary.services}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
            ]}
          >
            <SelectComponent
              name="event"
              width={343}
              placeholder={Dictionary.chooseOne}
              items={blacklistData.items}
              className={Classes["inputModal"]}
              onChange={(value) => handleChange(value)}
            />
          </FormItemComponent>
        </div>
        <FormItemComponent
          name="eventDescription"
          label={Dictionary.reason}
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
          ]}
        >
          <SelectComponent
            name="eventDescription"
            width={718}
            placeholder={Dictionary.chooseOne}
            items={blacklistData.blockExpression}
            className={Classes["inputModal"]}
            disabled={blacklistData.blockExpression.length < 1}
          />
        </FormItemComponent>
        <div className={Classes["blacklist-details-btn"]}>
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
            onClick={() => dispatch(blacklist({ addModal: false, record: "" }))}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </div>
      </Form>
    </div>
  );
};

export default AddBlackList;
