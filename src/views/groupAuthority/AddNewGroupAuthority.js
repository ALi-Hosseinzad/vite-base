import React, { useEffect, useRef } from "react";
import Dictionary from "helpers/Dictionary";
import { Form, Input } from "antd";
import Classes from "views/groupAuthority/styles/addNewGroupAuthority.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import SearchIcon from "assets/images/icon/Search.svg";
import Variables from "assets/styles/_Variables.scss";
import { addAuthorityGroup, updateAuthorityGroup } from "helpers/APIFunction";
import { groups } from "store/reducers/groups/groupsReducer";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { useDispatch, useSelector } from "react-redux";
import AddCircle from "assets/images/icon/AddCircle.svg";
import DeleteCircle from "assets/images/icon/DeleteCircle.svg";
import Change from "assets/images/icon/Change.svg";

const AddNewGroupAuthority = () => {
  const dispatch = useDispatch();
  const groupsData = useSelector((state) => state.groups.value);
  const errorHandler = useErrorHandler();
  const authorityRef = useRef();
  const choiceListRef = useRef();
  const addModalRef = useRef();

  // ##### handlers #####
  // ##### handlers #####
  // ##### handlers #####

  const selectAuthority = (item) => {
    dispatch(
      groups({
        choiceList: [item, ...groupsData.choiceList],
        choiceListKey: [...groupsData.choiceListKey, item.authority_key],
      })
    );
  };
  const deselectAuthority = (item) => {
    dispatch(
      groups({
        choiceList: groupsData.choiceList.filter(
          (node) => node.authority_key !== item.authority_key
        ),
        choiceListKey: groupsData.choiceListKey.filter(
          (node) => node !== item.authority_key
        ),
      })
    );
  };
  const searchAuthority = (item) => {
    dispatch(
      groups({
        searchList: groupsData.authorityList.filter(
          (a) => a.authority_description.indexOf(item) !== -1
        ),
      })
    );
  };
  const searchChoiceList = (item) => {
    dispatch(
      groups({
        searchChoices: groupsData.choiceList.filter(
          (a) => a.authority_description.indexOf(item) !== -1
        ),
      })
    );
  };
  const onFinish = () => {
    if (!groupsData.groupTitle.text) {
      dispatch(
        groups({ groupTitle: { ...groupsData.groupTitle, error: true } })
      );
    } else if (!groupsData.groupKey.text) {
      dispatch(groups({ groupKey: { ...groupsData.groupKey, error: true } }));
    } else if (groupsData.choiceList?.length < 1) {
      dispatch(
        setNotificationData({
          message: Dictionary.chooseOneAtLeast,
          type: "error",
          time: 5000,
        })
      );
    } else {
      if (groupsData.step !== "edit") {
        addAuthorityGroup({
          group_key: groupsData.groupKey.text,
          group_description: groupsData.groupTitle.text,
          authority_keys: groupsData.choiceListKey,
        })
          .then(() =>
            dispatch(groups({ addModal: false, reload: !groupsData.reload }))
          )
          .catch(() => {
            errorHandler(errorResponse);
          });
      } else {
        updateAuthorityGroup({
          group_key: groupsData.groupKey.text,
          group_description: groupsData.groupTitle.text,
          authority_keys: groupsData.choiceListKey,
        })
          .then(() =>
            dispatch(groups({ editModal: false, reload: !groupsData.reload }))
          )
          .catch(() => {
            errorHandler(errorResponse);
          });
      }
    }
  };

  // ###### useEffect #####
  // ###### useEffect #####
  // ###### useEffect #####

  useEffect(() => {
    searchAuthority(groupsData.authoritySearchValue);
  }, [groupsData.authoritySearchValue]);
  useEffect(() => {
    searchChoiceList(groupsData.choiceSearchValue);
  }, [groupsData.choiceSearchValue, groupsData.choiceList]);
  useEffect(() => {
    addModalRef.current.scroll(0, 0);
    authorityRef.current.scroll(0, 0);
    choiceListRef.current.scroll(0, 0);
  }, [groupsData.addModal, groupsData.editModal]);

  // ##### return #####
  // ##### return #####
  // ##### return #####

  return (
    <div className={Classes["authority-list"]} ref={addModalRef}>
      <div className={Classes["authority-group-info"]}>
        <div className={Classes["authority-group-title"]}>
          <span>{`${Dictionary.title} ${Dictionary.group}`}</span>
          <Input
            type="text"
            value={groupsData.groupTitle.text}
            placeholder={`${Dictionary.title} ${Dictionary.group}`}
            onChange={(e) =>
              dispatch(
                groups({
                  groupTitle: {
                    ...groupsData.groupTitle,
                    text: e.target.value,
                    error: false,
                  },
                })
              )
            }
          />
          {groupsData.groupTitle.error && (
            <span className={Classes["text-error"]}>{Dictionary.require}</span>
          )}
        </div>
        <div className={Classes["authority-group-key"]}>
          <span>Group Key</span>
          <Input
            type="text"
            value={groupsData.groupKey.text}
            placeholder="Group Key"
            onChange={(e) =>
              dispatch(
                groups({
                  groupKey: {
                    ...groupsData.groupKey,
                    text: e.target.value,
                    error: false,
                  },
                })
              )
            }
            disabled={groupsData?.step === "edit" && true}
          />
          {groupsData.groupKey.error && (
            <span className={Classes["text-error"]}>{Dictionary.require}</span>
          )}
        </div>
      </div>
      <p>{`${Dictionary.list} ${Dictionary.access}‌${Dictionary.ha}`}</p>
      <div className={Classes["authority-list-container"]}>
        <div className={Classes["authority-list-first-col"]}>
          <div>
            <CustomIcon
              src={SearchIcon}
              name="authority-serch"
              color={Variables.GreyDark3}
            />
            <input
              onChange={(e) =>
                dispatch(groups({ authoritySearchValue: e.target.value }))
              }
              value={groupsData.authoritySearchValue}
              className={Classes["authority-search-input"]}
              placeholder={Dictionary.search}
              type="search"
            />
          </div>
          <div ref={authorityRef}>
            {groupsData.searchList?.map((authority, index) => (
              <div
                onClick={() =>
                  groupsData.choiceList
                    .map((a) => a.authority_key)
                    .indexOf(authority.authority_key) !== -1
                    ? ""
                    : selectAuthority(authority)
                }
                className={
                  groupsData.choiceList
                    .map((a) => a.authority_key)
                    .indexOf(authority.authority_key) !== -1
                    ? Classes["disable"]
                    : ""
                }
              >
                <CustomIcon
                  src={AddCircle}
                  size={20}
                  name={`add-circle-${index}`}
                  color={
                    groupsData.choiceList
                      .map((a) => a.authority_key)
                      .indexOf(authority.authority_key) !== -1
                      ? Variables.GreyDark1
                      : Variables.GreenDark1
                  }
                />
                <p>{authority.authority_description}</p>
              </div>
            ))}
          </div>
          <div></div>
        </div>
        <div className={Classes["authority-change-icon"]}>
          <CustomIcon src={Change} size={16} name="authority-change-icon" />
        </div>
        <div className={Classes["authority-list-second-col"]}>
          <div>
            <CustomIcon
              src={SearchIcon}
              name="choice-list-search"
              color={Variables.GreyDark3}
            />
            <input
              onChange={(e) =>
                dispatch(groups({ choiceSearchValue: e.target.value }))
              }
              value={groupsData.choiceSearchValue}
              className={Classes["authority-search-input"]}
              placeholder={Dictionary.search}
              type="search"
            />
          </div>
          <div ref={choiceListRef}>
            {groupsData.searchChoices?.map((authority) => (
              <div
                onClick={() => deselectAuthority(authority)}
                className={Classes["authority-choice-list"]}
              >
                <CustomIcon
                  src={DeleteCircle}
                  size={20}
                  name={`add-circle-${authority.authority_key}`}
                />
                <p>{authority.authority_description}</p>
              </div>
            ))}
          </div>
          <div></div>
        </div>
      </div>
      <div className={Classes["add-authority-buttons"]}>
        <ButtonComponent
          type="primary"
          htmlType="submit"
          classNameBtn={Classes["add-authority-confirm-button"]}
          onClick={onFinish}
        >
          {Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          classNameBtn={Classes["add-authority-cancel-button"]}
          type="default"
          onClick={() =>
            groupsData.step !== "edit"
              ? dispatch(groups({ addModal: false }))
              : dispatch(groups({ editModal: false }))
          }
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </div>
    </div>
  );
};

export default AddNewGroupAuthority;
