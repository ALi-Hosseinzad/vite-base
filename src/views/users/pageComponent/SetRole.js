import React from "react";
import { Checkbox } from "antd";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import Dictionary from "helpers/Dictionary";
import { useDispatch, useSelector } from "react-redux";
import { users } from "store/reducers/users/UsersReducer";
import Classes from "views/users/styles/users.module.scss";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { useEffect } from "react";
import { addNewUser, getAllRoles, updateUser } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";

const SetRole = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const ListUsersData = useSelector((state) => state.users.value);
  const userInfoData = useSelector((state) => state.userInfo.value);

  useEffect(() => {
    getAllRoles()
      .then((res) => {
        dispatch(users({ roleList: res?.data }));
      })
      .catch(() => errorHandler(errorResponse));
  }, []);

  const handleChange = (item) => {
    if (ListUsersData.setRole.includes(item)) {
      dispatch(
        users({
          setRole: ListUsersData.setRole?.filter((node) => node !== item),
        })
      );
    } else {
      dispatch(users({ setRole: [...ListUsersData.setRole, item] }));
    }
  };

  const onFinish = () => {
    if (ListUsersData.setRole.length > 0) {
      if (ListUsersData.edit) {
        updateUser({
          identification_code: ListUsersData.record?.identification_code,
          employment_code: ListUsersData.record?.employment_code,
          username: ListUsersData.record?.username,
          firstname: ListUsersData.record?.firstname,
          lastname: ListUsersData.record?.lastname,
          is_enabled: true,
          branch_code: ListUsersData.record?.branch_code,
          role_keys: ListUsersData.setRole,
          mobile_number: ListUsersData.record?.mobile_number,
          gender: ListUsersData.record?.gender,
        })
          .then(() => dispatch(users({ current: 3 })))
          .catch(() => errorHandler(errorResponse));
      } else {
        addNewUser({
          identification_code: ListUsersData.record?.identification_code,
          employment_code: ListUsersData.record?.employment_code,
          username: ListUsersData.record?.username,
          firstname: ListUsersData.record?.firstname,
          lastname: ListUsersData.record?.lastname,
          is_enabled: true,
          branch_code: ListUsersData.record?.branch_code,
          role_keys: ListUsersData.setRole,
          mobile_number: ListUsersData.record?.mobile_number,
          gender: ListUsersData.record?.gender,
        })
          .then(() => dispatch(users({ current: 3 })))
          .catch(() => errorHandler(errorResponse));
      }
    } else {
      dispatch(
        setNotificationData({
          message: Dictionary.chooseOneItem,
          type: "error",
          time: 5000,
        })
      );
    }
  };

  return (
    <>
      <div className={Classes["role-container"]}>
        <p>{Dictionary.multiSelectRole}</p>
        <div className={Classes["role-template"]}>
          {userInfoData.username === "admin" && (
            <>
              <div>
                <Checkbox
                  defaultChecked={ListUsersData.record.roles
                    ?.map((r) => r.role_key)
                    ?.includes("SUPER_ADMIN_ASSISTANT")}
                  onChange={() => handleChange("SUPER_ADMIN_ASSISTANT")}
                >
                  {Dictionary.superAdminAssistant}
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  defaultChecked={ListUsersData.record.roles
                    ?.map((r) => r.role_key)
                    ?.includes("CUSTOMER_AUTHENTICATION_MANAGER")}
                  onChange={() =>
                    handleChange("CUSTOMER_AUTHENTICATION_MANAGER")
                  }
                >
                  {Dictionary.authenticationManager}
                </Checkbox>
              </div>
            </>
          )}
          {ListUsersData.roleList.length > 0 &&
            ListUsersData.roleList?.map(
              (node) =>
                node?.role_key !== "SUPER_ADMIN_ASSISTANT" &&
                node?.role_key !== "CUSTOMER_AUTHENTICATION_MANAGER" && (
                  <div>
                    <Checkbox
                      defaultChecked={ListUsersData.record.roles
                        ?.map((r) => r.role_key)
                        ?.includes(node.role_key)}
                      onChange={() => handleChange(node?.role_key)}
                    >
                      {node?.role_description}
                    </Checkbox>
                  </div>
                )
            )}
        </div>
      </div>
      <FormItemComponent
        shouldUpdate
        button
        className={Classes["roles-buttons"]}
      >
        <ButtonComponent
          type="primary"
          htmlType="submit"
          onClick={onFinish}
          classNameBtn={Classes["confirm-button"]}
        >
          {Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          type="default"
          classNameBtn={Classes["cancel-button"]}
          onClick={() => dispatch(users({ addModal: false, current: 0 }))}
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </>
  );
};

export default SetRole;
