import { Form, Select } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputComponent from "components/input/InputComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import Dictionary from "helpers/Dictionary";
import React, { Fragment, useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { users } from "store/reducers/users/UsersReducer";
import Classes from "views/users/styles/users.module.scss";
import { nationalCodeValidation } from "helpers/nationalIdValidation";
import { getAllActiveBranches } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import CustomIcon from "components/customIcon/CustomIcon";
import DropDown from "assets/images/icon/DropDown.svg";
import SearchIcon from "assets/images/icon/Search.svg";

const UserRegisterInfo = () => {
  const [state1, setState1] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const listUsersData = useSelector((state) => state.users.value);
  const errorHandler = useErrorHandler();
  useEffect(() => {
    if (listUsersData.activeBranches.length === 0) {
      const activeBranches = [];
      getAllActiveBranches()
        .then((res) =>
          res.data.forEach((element) => {
            activeBranches.push({
              value: element.branch_code,
              label: `${element.branch_code} ${element.branch_name}`,
            });
          })
        )
        .then(() => dispatch(users({ activeBranches: activeBranches })))
        .catch(() => errorHandler(errorResponse));
    }
  }, []);
  useEffect(() => {
    if (listUsersData.edit) {
      form.setFieldsValue({
        firstname: listUsersData.record?.firstname,
        lastname: listUsersData.record?.lastname,
        mobile_number: listUsersData.record?.mobile_number,
        employment_code: listUsersData.record?.employment_code,
        identification_code: listUsersData.record?.identification_code,
        branch_code: listUsersData.record?.branch_code,
        gender: listUsersData.record?.gender,
      });
    } else {
      form.resetFields();
    }
  }, [listUsersData.addModal]);

  const onFinish = (values) => {
    dispatch(
      users({
        submit: true,
        current: 1,
        record: { ...listUsersData.record, ...values },
      })
    );
  };
  const items = [
    { id: 0, text: Dictionary.male, value: "MALE" },
    { id: 1, text: Dictionary.female, value: "FEMALE" },
  ];
  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      ref={formRef}
      requiredMark={false}
    >
      <FormItemComponent
        name="firstname"
        label={Dictionary.name}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          { min: 2, max: 50, message: Dictionary.checkInput },
          {
            pattern: /^[\u0600-\u06FF\s]+$/,
            message: Dictionary.onlyFarsi,
          },
        ]}
      >
        <InputComponent
          width={343}
          name="firstname"
          placeholder={Dictionary.name}
          className={Classes["register-input"]}
        />
      </FormItemComponent>
      <FormItemComponent
        name="lastname"
        label={Dictionary.lastName}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          { min: 2, max: 50, message: Dictionary.checkInput },
          {
            pattern: /^[\u0600-\u06FF\s]+$/,
            message: Dictionary.onlyFarsi,
          },
        ]}
      >
        <InputComponent
          width={343}
          name="lastname"
          placeholder={Dictionary.lastName}
          className={Classes["register-input"]}
        />
      </FormItemComponent>
      <FormItemComponent
        name="mobile_number"
        label={Dictionary.mobile}
        // help={Dictionary.warningMobile}
        rules={[
          {
            required: true,
            message: Dictionary.require,
          },
          {
            max: 11,
            min: 11,
            message: Dictionary.checkInput,
          },
          {
            pattern: /^(0)?9\d{9}$/,
            message: Dictionary.checkInput,
          },
        ]}
      >
        <InputComponent
          width={343}
          placeholder="09121234567"
          maxLength={11}
          className={Classes["register-number-input"]}
          whiteList={/[^0-9]/g}
        />
      </FormItemComponent>
      <div className={Classes["bottom-inputs"]}>
        <FormItemComponent
          name="identification_code"
          label={Dictionary.nationalId}
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
            {
              max: 10,
              min: 10,
              message: Dictionary.checkInput,
            },
            {
              pattern: /^[0-9]+$/,
              message: Dictionary.checkInput,
            },
            () => ({
              validator(_, value) {
                if ((value.length === 10) & !nationalCodeValidation(value)) {
                  return Promise.reject(new Error(Dictionary.idNotValid));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputComponent
            width={163}
            name="identificationCode"
            placeholder={Dictionary.nationalId}
            maxLength={10}
            className={Classes["register-input"]}
            disabled={listUsersData.edit}
          />
        </FormItemComponent>
        <FormItemComponent
          name="gender"
          label={Dictionary.gender}
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
          ]}
        >
          <SelectComponent
            items={items}
            width={163}
            name="gender"
            value={users.identificationCode}
            placeholder={Dictionary.choose}
            maxLength={10}
            className={Classes["register-select"]}
          />
        </FormItemComponent>
      </div>
      <div className={Classes["bottom-inputs"]}>
        <FormItemComponent
          name="employment_code"
          label={Dictionary.personalId}
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
          ]}
        >
          <InputComponent
            width={163}
            placeholder={`${Dictionary.personalId} ${Dictionary.user}`}
            maxLength={11}
            className={Classes["register-input"]}
            whiteList={/[^0-9]/g}
          />
        </FormItemComponent>
        <FormItemComponent
          name="branch_code"
          label={Dictionary.branchCode}
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
          ]}
        >
          <Select
            name="branch_code"
            showSearch
            style={{ width: 163, height: 48 }}
            className={Classes["register-input"]}
            placeholder={Dictionary.branchCode}
            suffixIcon={
              <CustomIcon
                src={state1 ? SearchIcon : DropDown}
                size={20}
                name="drop-down-icon-branch-codes"
                color="#2B9570"
              />
            }
            optionFilterProp="children"
            onFocus={() => setState1(true)}
            onBlur={() => setState1(false)}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={listUsersData.activeBranches}
          />
        </FormItemComponent>
      </div>
      <FormItemComponent
        shouldUpdate
        button
        className={Classes["register-button"]}
      >
        <ButtonComponent
          type="primary"
          htmlType="submit"
          classNameBtn={Classes["confirm-button"]}
        >
          {Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          type="default"
          classNameBtn={Classes["cancel-button"]}
          onClick={() =>
            dispatch(users({ addModal: false, current: 0, edit: false }))
          }
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};

export default UserRegisterInfo;
