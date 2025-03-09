import React from "react";
import Classes from "../styles/users.module.scss";
import Dictionary from "helpers/Dictionary";
import ChipComponent from "components/chipComponent/ChipComponent";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "components/button/ButtonComponent";
import { users } from "store/reducers/users/UsersReducer";
const DetailModal = () => {
  const dispatch = useDispatch();
  const listUsersData = useSelector((state) => state.users.value);

  return (
    <div>
      <div className={Classes["body-detail"]}>
        <div>
          <p>{Dictionary.personalId}</p>
          <p>{listUsersData?.record.employment_code || "-"}</p>
        </div>
        <div>
          <p>{Dictionary.nationalId}</p>
          <p>{listUsersData?.record.identification_code || "-"}</p>
        </div>
        <div>
          <p>{`${Dictionary.name} ${Dictionary.and} ${Dictionary.lastName}`}</p>
          <p>
            {`${listUsersData?.record?.firstname} ${listUsersData?.record?.lastname}` ||
              "-"}
          </p>
        </div>
        <div>
          <p>{Dictionary.mobile}</p>
          <p>{listUsersData?.record.mobile_number || "-"}</p>
        </div>
        <div>
          <p>{`${Dictionary.branchCode} ${Dictionary.user}`}</p>
          <p>{listUsersData?.record.branch_code || "-"}</p>
        </div>
        <div className={Classes["role-row"]}>
          <p>{`${Dictionary.role}(${Dictionary.ha})`}</p>
          <div className={Classes["modal-roles"]}>
            {listUsersData?.record?.roles?.length === 0
              ? "-"
              : listUsersData?.record?.roles?.map((item) => (
                  <ChipComponent key={item.id}>
                    {item.role_description}
                  </ChipComponent>
                ))}
          </div>
        </div>
      </div>
      <ButtonComponent
        classNameBtn={Classes["modalBtn"]}
        onClick={() => dispatch(users({ detailModal: false, current: 0 }))}
        type="primary"
      >
        {Dictionary.close}
      </ButtonComponent>
    </div>
  );
};
export default DetailModal;
