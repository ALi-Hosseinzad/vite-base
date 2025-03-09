import React, { useEffect, useRef } from "react";
import Dictionary from "helpers/Dictionary";
import { Input } from "antd";
import Classes from "views/groupAuthority/styles/addNewGroupAuthority.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import SearchIcon from "assets/images/icon/Search.svg";
import Variables from "assets/styles/_Variables.scss";
import { addNewBoRole, updateBoRole } from "helpers/APIFunction";
import { roles } from "store/reducers/roles/rolesReducer";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { useDispatch, useSelector } from "react-redux";
import AddCircle from "assets/images/icon/AddCircle.svg";
import DeleteCircle from "assets/images/icon/DeleteCircle.svg";
import Change from "assets/images/icon/Change.svg";

const AddNewRole = () => {
  const dispatch = useDispatch();
  const rolesData = useSelector((state) => state.roles.value);
  const errorHandler = useErrorHandler();
  const addModalRef = useRef();
  const groupRef = useRef();
  const choiceGroupRef = useRef();
  const menuRef = useRef();
  const choiceMenuRef = useRef();

  const select = (item, type) => {
    if (type === "group") {
      dispatch(
        roles({
          choiceList: [item, ...rolesData.choiceList],
          choiceListKey: [...rolesData.choiceListKey, item.group_key],
        })
      );
    } else if (type === "menu") {
      dispatch(
        roles({
          menuChoiceList: [item, ...rolesData.menuChoiceList],
          menuChoiceListKey: [...rolesData.menuChoiceListKey, item.menu_key],
        })
      );
    }
  };
  const deselect = (item, type) => {
    if (type === "group") {
      dispatch(
        roles({
          choiceList: rolesData.choiceList.filter(
            (node) => node.group_key !== item.group_key
          ),
          choiceListKey: rolesData.choiceListKey.filter(
            (node) => node !== item.group_key
          ),
        })
      );
    } else if (type === "menu") {
      dispatch(
        roles({
          menuChoiceList: rolesData.menuChoiceList.filter(
            (node) => node.menu_key !== item.menu_key
          ),
          menuChoiceListKey: rolesData.menuChoiceListKey.filter(
            (node) => node !== item.menu_key
          ),
        })
      );
    }
  };

  const searchGroup = (item) => {
    dispatch(
      roles({
        searchList: rolesData.groupsList.filter(
          (a) => a.group_description?.indexOf(item) !== -1
        ),
      })
    );
  };
  const searchChoiceGroup = (item) => {
    dispatch(
      roles({
        searchChoiceCroupList: rolesData.choiceList.filter(
          (a) => a.group_description?.indexOf(item) !== -1
        ),
      })
    );
  };
  const searchMenu = (item) => {
    dispatch(
      roles({
        searchMenuList: rolesData.menuList.filter(
          (a) => a.menu_description?.indexOf(item) !== -1
        ),
      })
    );
  };
  const searchChoiceMenu = (item) => {
    dispatch(
      roles({
        searchChoiceMenuList: rolesData.menuChoiceList.filter(
          (a) => a.menu_description?.indexOf(item) !== -1
        ),
      })
    );
  };

  useEffect(() => {
    searchGroup(rolesData.groupSearchValue);
  }, [rolesData.groupSearchValue]);
  useEffect(() => {
    searchChoiceGroup(rolesData.groupChoiceSearchValue);
  }, [rolesData.groupChoiceSearchValue, rolesData.choiceList]);
  useEffect(() => {
    searchMenu(rolesData.menuSearchValue);
  }, [rolesData.menuSearchValue]);
  useEffect(() => {
    searchChoiceMenu(rolesData.menuChoiceSearchValue);
  }, [rolesData.menuChoiceSearchValue, rolesData.menuChoiceList]);

  useEffect(() => {
    addModalRef.current.scroll(0, 0);
    groupRef.current.scroll(0, 0);
    choiceGroupRef.current.scroll(0, 0);
    menuRef.current.scroll(0, 0);
    choiceMenuRef.current.scroll(0, 0);
  }, [rolesData.addModal, rolesData.editModal]);

  const onFinish = () => {
    if (!rolesData.roleTitle.text || !rolesData.roleKey.text) {
      dispatch(
        roles({
          roleTitle: {
            ...rolesData.roleTitle,
            error: !rolesData.roleTitle.text && true,
          },
          roleKey: {
            ...rolesData.roleKey,
            error: !rolesData.roleKey.text && true,
          },
        })
      );
    } else if (
      rolesData.choiceList?.length < 1 ||
      rolesData.menuChoiceList?.length < 1
    ) {
      dispatch(
        setNotificationData({
          message: Dictionary.chooseOneAtLeast,
          type: "error",
          time: 5000,
        })
      );
    } else {
      if (rolesData.step !== "edit") {
        addNewBoRole({
          role_key: rolesData.roleKey.text,
          role_description: rolesData.roleTitle.text,
          authority_group_keys: rolesData.choiceListKey,
          menu_keys: rolesData.menuChoiceListKey,
        })
          .then(() =>
            dispatch(roles({ addModal: false, reload: !rolesData.reload }))
          )
          .catch(() => {
            errorHandler(errorResponse);
          });
      } else {
        updateBoRole({
          role_key: rolesData.roleKey.text,
          role_description: rolesData.roleTitle.text,
          authority_group_keys: rolesData.choiceListKey,
          menu_keys: rolesData.menuChoiceListKey,
        })
          .then(() =>
            dispatch(roles({ editModal: false, reload: !rolesData.reload }))
          )
          .catch(() => {
            errorHandler(errorResponse);
          });
      }
    }
  };

  return (
    <div className={Classes["authority-list"]} ref={addModalRef}>
      <div className={Classes["authority-group-info"]}>
        <div className={Classes["authority-group-title"]}>
          <span>{`${Dictionary.title} ${Dictionary.role}`}</span>
          <Input
            type="text"
            value={rolesData.roleTitle.text}
            placeholder={`${Dictionary.title} ${Dictionary.role}`}
            onChange={(e) =>
              dispatch(
                roles({
                  roleTitle: {
                    ...rolesData.roleTitle,
                    text: e.target.value,
                    error: false,
                  },
                })
              )
            }
          />
          {rolesData.roleTitle.error && (
            <span className={Classes["text-error"]}>{Dictionary.require}</span>
          )}
        </div>
        <div className={Classes["authority-group-key"]}>
          <span>Role Key</span>
          <Input
            type="text"
            value={rolesData.roleKey.text}
            placeholder="Role Key"
            onChange={(e) =>
              dispatch(
                roles({
                  roleKey: {
                    ...rolesData.roleKey,
                    text: e.target.value,
                    error: false,
                  },
                })
              )
            }
            disabled={rolesData?.step === "edit" && true}
          />
          {rolesData.roleKey.error && (
            <span className={Classes["text-error"]}>{Dictionary.require}</span>
          )}
        </div>
      </div>
      <p>{`${Dictionary.groups}`}</p>
      <div className={Classes["authority-list-container"]}>
        <div className={Classes["authority-list-first-col"]}>
          <div>
            <CustomIcon
              src={SearchIcon}
              name="authority-search"
              color={Variables.GreyDark3}
            />
            <input
              onChange={(e) =>
                dispatch(roles({ groupSearchValue: e.target.value }))
              }
              value={rolesData.groupSearchValue}
              className={Classes["authority-search-input"]}
              placeholder={Dictionary.search}
              type="search"
            />
          </div>
          <div ref={groupRef}>
            {rolesData.searchList?.map((group, index) => (
              <div
                onClick={() =>
                  rolesData.choiceList
                    .map((a) => a.group_key)
                    .indexOf(group.group_key) !== -1
                    ? ""
                    : select(group, "group")
                }
                className={
                  rolesData.choiceList
                    .map((a) => a.group_key)
                    .indexOf(group.group_key) !== -1
                    ? Classes["disable"]
                    : ""
                }
              >
                <CustomIcon
                  src={AddCircle}
                  size={20}
                  name={`add-circle-${index}`}
                  color={
                    rolesData.choiceList
                      .map((a) => a.group_key)
                      .indexOf(group.group_key) !== -1
                      ? Variables.GreyDark1
                      : Variables.GreenDark1
                  }
                />
                <p>{group.group_description}</p>
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
              name="choice-search"
              color={Variables.GreyDark3}
            />
            <input
              onChange={(e) =>
                dispatch(roles({ groupChoiceSearchValue: e.target.value }))
              }
              value={rolesData.groupChoiceSearchValue}
              className={Classes["authority-search-input"]}
              placeholder={Dictionary.search}
              type="search"
            />
          </div>
          <div ref={choiceGroupRef}>
            {rolesData.searchChoiceCroupList?.map((group) => (
              <div
                onClick={() => deselect(group, "group")}
                className={Classes["authority-choice-list"]}
              >
                <CustomIcon
                  src={DeleteCircle}
                  size={20}
                  name={`add-circle-${group.group_key}`}
                />
                <p>{group.group_description}</p>
              </div>
            ))}
          </div>
          <div></div>
        </div>
      </div>
      {/* panel services */}
      <p>{`${Dictionary.servicesMenu}`}</p>
      <div className={Classes["authority-list-container"]}>
        <div className={Classes["authority-list-first-col"]}>
          <div>
            <CustomIcon
              src={SearchIcon}
              name="authority-menu-search"
              color={Variables.GreyDark3}
            />
            <input
              onChange={(e) =>
                dispatch(roles({ menuSearchValue: e.target.value }))
              }
              value={rolesData.menuSearchValue}
              className={Classes["authority-search-input"]}
              placeholder={Dictionary.search}
              type="search"
            />
          </div>
          <div ref={menuRef}>
            {rolesData.searchMenuList?.map((menu, index) => (
              <div
                onClick={() =>
                  rolesData.menuChoiceList
                    .map((a) => a.menu_key)
                    .indexOf(menu.menu_key) !== -1
                    ? ""
                    : select(menu, "menu")
                }
                className={
                  rolesData.menuChoiceList
                    .map((a) => a.menu_key)
                    .indexOf(menu.menu_key) !== -1
                    ? Classes["disable"]
                    : ""
                }
              >
                <CustomIcon
                  src={AddCircle}
                  size={20}
                  name={`add-circle-menu-${index}`}
                  color={
                    rolesData.menuChoiceList
                      .map((a) => a.menu_key)
                      .indexOf(menu.menu_key) !== -1
                      ? Variables.GreyDark1
                      : Variables.GreenDark1
                  }
                />
                <p>{menu.menu_description}</p>
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
              name="choice-menu-search"
              color={Variables.GreyDark3}
            />
            <input
              onChange={(e) =>
                dispatch(roles({ menuChoiceSearchValue: e.target.value }))
              }
              value={rolesData.menuChoiceSearchValue}
              className={Classes["authority-search-input"]}
              placeholder={Dictionary.search}
              type="search"
            />
          </div>
          <div ref={choiceMenuRef}>
            {rolesData.searchChoiceMenuList?.map((menu) => (
              <div
                onClick={() => deselect(menu, "menu")}
                className={Classes["authority-choice-list"]}
              >
                <CustomIcon
                  src={DeleteCircle}
                  size={20}
                  name={`add-circle-${menu.menu_key}`}
                />
                <p>{menu.menu_description}</p>
              </div>
            ))}
          </div>
          <div></div>
        </div>
      </div>
      {/* end panel services */}

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
            rolesData.step !== "edit"
              ? dispatch(roles({ addModal: false }))
              : dispatch(roles({ editModal: false }))
          }
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </div>
    </div>
  );
};

export default AddNewRole;
