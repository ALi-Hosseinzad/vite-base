import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { roles } from "store/reducers/roles/rolesReducer";
import Dictionary from "helpers/Dictionary";
import ButtonComponent from "components/button/ButtonComponent";
import Classes from "views/groupAuthority/styles/authorityDetails.module.scss";
import ChipComponent from "components/chipComponent/ChipComponent";
import Variables from "assets/styles/_Variables.scss";
import { SortFunction } from "helpers/SortFunction";

const RoleDetails = () => {
  const dispatch = useDispatch();
  const rolesData = useSelector((state) => state.roles.value);
  const menus = [...rolesData.record?.menus];

  return (
    <div>
      <div className={Classes["groups-authority-details-container"]}>
        <div className={Classes["groups-details-first-line"]}>
          <div>{`${Dictionary.title} ${Dictionary.group}`}</div>
          <div>{rolesData.record?.role_description}</div>
        </div>
        <div
          className={Classes["groups-details-content"]}
          style={{
            paddingBottom: "8px",
            borderBottom: `1px solid ${Variables.GreyLineBack}`,
          }}
        >
          <div>{`${Dictionary.groups}`}</div>
          <div className={Classes["groups-authority-descriptions"]}>
            {rolesData.record?.authority_groups?.map((group) => (
              <ChipComponent>{group?.group_description}</ChipComponent>
            ))}
          </div>
        </div>
        <div className={Classes["groups-details-content"]}>
          <div>{`${Dictionary.servicesMenu}`}</div>
          <div className={Classes["groups-authority-descriptions"]}>
            {menus
              .sort((a, b) =>
                SortFunction(a.menu_description, b.menu_description)
              )
              ?.map((menu) => (
                <ChipComponent>{menu?.menu_description}</ChipComponent>
              ))}
          </div>
        </div>
      </div>
      <ButtonComponent
        classNameBtn={Classes["groups-authority-button"]}
        onClick={() => dispatch(roles({ detailsModal: false }))}
        type="primary"
        htmlType={Dictionary.close}
      >
        {Dictionary.close}
      </ButtonComponent>
    </div>
  );
};

export default RoleDetails;
