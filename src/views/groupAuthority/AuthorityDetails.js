import React from "react";
import useErrorHandler from "helpers/useErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import { groups } from "store/reducers/groups/groupsReducer";
import Dictionary from "helpers/Dictionary";
import ButtonComponent from "components/button/ButtonComponent";
import Classes from "views/groupAuthority/styles/authorityDetails.module.scss";
import ChipComponent from "components/chipComponent/ChipComponent";
import { SortFunction } from "helpers/SortFunction";

const AuthorityDetails = () => {
  const dispatch = useDispatch();
  const groupsData = useSelector((state) => state.groups.value);
  const authorities = [...groupsData.record.authorities];

  return (
    <div>
      <div className={Classes["groups-authority-details-container"]}>
        <div className={Classes["groups-details-first-line"]}>
          <div>{`${Dictionary.title} ${Dictionary.group}`}</div>
          <div>{groupsData.record?.group_description}</div>
        </div>
        <div className={Classes["groups-details-content"]}>
          <div>{`${Dictionary.groups}`}</div>
          <div className={Classes["groups-authority-descriptions"]}>
            {authorities
              ?.sort((a, b) =>
                SortFunction(a.authority_description, b.authority_description)
              )
              ?.map((authority) => (
                <ChipComponent>
                  {authority?.authority_description}
                </ChipComponent>
              ))}
          </div>
        </div>
      </div>
      <ButtonComponent
        classNameBtn={Classes["groups-authority-button"]}
        onClick={() => dispatch(groups({ detailsModal: false }))}
        type="primary"
        htmlType={Dictionary.close}
      >
        {Dictionary.close}
      </ButtonComponent>
    </div>
  );
};

export default AuthorityDetails;
