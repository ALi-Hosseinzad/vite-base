import { Form, Select } from "antd";
import FormItemComponent from "components/formItem/FormItemComponent";
import { getReactionSentences } from "helpers/APIFunction";
import Dictionary from "helpers/Dictionary";
import Classes from "views/blackList/styles/addDescriptionForBlacklist.module.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DropDown from "assets/images/icon/DropDown.svg";
import SearchIcon from "assets/images/icon/Search.svg";
import CustomIcon from "components/customIcon/CustomIcon";
import {
  blacklist,
  resetBlacklist,
} from "store/reducers/blacklist/blacklistReducer";
import ButtonComponent from "components/button/ButtonComponent";
import { addToBlackList } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import Refresh from "assets/images/icon/Refresh.svg";
import { registerForget } from "store/reducers/registerForget/registerForgetReducer";
import { openAccount } from "store/reducers/openAccount/openAccountReducer";
import SelectComponent from "components/SelectComponent/SelectComponent";

const AddDescriptionForBlacklist = () => {
  const dispatch = useDispatch();
  const blacklistData = useSelector((state) => state.blacklist.value);
  const registerForgetData = useSelector((state) => state.registerForget.value);
  const openAccountData = useSelector((state) => state.openAccount.value);
  const errorHandler = useErrorHandler();
  const [state, setState] = useState(false);

  const reactions = (event) => {
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
            value:
              event === "CREATE_ACCOUNT_OFFLINE"
                ? "CREATE_ACCOUNT_BLOCK"
                : event === "REGISTRATION" || event === "FORGET_PASSWORD"
                ? "REGISTRATION_BLOCK"
                : "",
            operation: "equals",
          },
        ],
      },
    })
      .then((res) =>
        res.data?.data?.forEach((element) => {
          sentences.push({
            value: element.expression,
            label: element.expression,
          });
        })
      )
      .then(() => {
        if (event === "CREATE_ACCOUNT_OFFLINE") {
          dispatch(
            blacklist({
              createAccountReactions: sentences,
              reactionsError: false,
              reactionsErrorLoading: false,
            })
          );
        } else if (event === "REGISTRATION" || event === "FORGET_PASSWORD") {
          dispatch(
            blacklist({
              registrationReactions: sentences,
              reactionsError: false,
              reactionsErrorLoading: false,
            })
          );
        }
      })
      .catch(() => {
        dispatch(blacklist({ reactionsError: true }));
        errorHandler(errorResponse);
      });
  };

  const handleRefresh = () => {
    dispatch(blacklist({ reactionsErrorLoading: true }));
    reactions(blacklistData.blacklistObject.event);
  };

  useEffect(() => {
    reactions(blacklistData.blacklistObject.event);
  }, []);

  const onFinish = (values) => {
    addToBlackList({
      ...blacklistData.blacklistObject,
      block_description: values.reason,
    })
      .then(() => dispatch(resetBlacklist()))
      .then(() => {
        dispatch(
          registerForget({
            update: !registerForgetData.update,
            record: "",
            video: "",
          })
        );
        dispatch(
          openAccount({
            update: !openAccountData.update,
            record: "",
            video: "",
          })
        );
      })
      .catch(() => errorHandler(errorResponse));
  };

  return (
    <Form
      requiredMark={false}
      onFinish={onFinish}
      className={Classes["form-class"]}
    >
      <p style={{ textAlign: "center", fontSize: "16px", marginBottom: "8px" }}>
        علت افزودن مشتری به لیست سیاه را انتخاب کنید.
      </p>
      {blacklistData.reactionsError ? (
        <>
          <p style={{ width: "466px", margin: "0px auto" }}>
            {Dictionary.reason}
          </p>
          <div className={Classes["black-list-refresh"]}>
            <span>یک مورد را انتخاب نمایید.</span>
            {blacklistData.reactionsErrorLoading ? (
              <div className={Classes["loading-button"]}>
                <div className={Classes["spinner"]} />
              </div>
            ) : (
              <CustomIcon
                src={Refresh}
                size={24}
                onClick={() => handleRefresh()}
              />
            )}
          </div>
        </>
      ) : (
        <FormItemComponent
          shouldUpdate
          rules={[
            {
              required: true,
              message: Dictionary.require,
            },
          ]}
          name="reason"
          label={Dictionary.reason}
          className={Classes["black-list-reason"]}
        >
          <Select
            name="reason"
            showSearch
            style={{ width: 466, height: 48 }}
            className={Classes["ready-reactions"]}
            placeholder="یک مورد را انتخاب نمایید."
            suffixIcon={
              <CustomIcon
                src={state ? SearchIcon : DropDown}
                size={20}
                name="drop-down-icon-branch-codes"
                color="#2B9570"
              />
            }
            onFocus={() => setState(true)}
            onBlur={() => setState(false)}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={
              blacklistData.blacklistObject?.event === "CREATE_ACCOUNT_OFFLINE"
                ? blacklistData.createAccountReactions
                : blacklistData.blacklistObject?.event === "REGISTRATION" ||
                  blacklistData.blacklistObject?.event === "FORGET_PASSWORD"
                ? blacklistData.registrationReactions
                : ""
            }
          />
        </FormItemComponent>
      )}
      <FormItemComponent
        button={true}
        className={Classes["black-list-reason-btn"]}
      >
        <ButtonComponent
          type="primary"
          htmlType="submit"
          classNameBtn={Classes["black-list-reason-confirm-btn"]}
          // onClick={onFinish}
          disabled={blacklistData.reactionsError}
        >
          {Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          type="default"
          onClick={() => {
            dispatch(blacklist({ blacklistModal: false }));
            dispatch(
              registerForget({
                update: !registerForgetData.update,
                record: "",
                video: "",
              })
            );
            dispatch(
              openAccount({
                update: !openAccountData.update,
                record: "",
                video: "",
              })
            );
          }}
          classNameBtn={Classes["black-list-reason-cancel-btn"]}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};

export default AddDescriptionForBlacklist;
