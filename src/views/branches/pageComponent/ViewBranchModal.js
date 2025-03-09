import React from "react";
import { listBranches } from "store/reducers/listBranches/listBranchesReducer";
import ButtonComponent from "components/button/ButtonComponent";
import Dictionary from "helpers/Dictionary";
import Classes from "../styles/Branches.module.scss";
import ChipComponent from "components/chipComponent/ChipComponent";
import { useDispatch, useSelector } from "react-redux";

const ViewBranchModal = () => {
  const listBranchesData = useSelector((state) => state.listBranches.value);
  const dispatch = useDispatch();
  const details = listBranchesData.record;

  return (
    <div>
      <div className={Classes["modalDetails"]}>
        <div>
          <p>{`${Dictionary.name} ${Dictionary.branch}`}</p>
          <p>{details.branchName || "-"}</p>
        </div>
        <div>
          <p>{Dictionary.branchCode}</p>
          <p>{details.branchCode || "-"}</p>
        </div>
        <div>
          <p>{Dictionary.region}</p>
          <p>{details.region || "-"}</p>
        </div>
        <div>
          <p>{Dictionary.province}</p>
          <p>{details.province || "-"}</p>
        </div>
        <div>
          <p>{Dictionary.address}</p>
          <p>{details.address || "-"}</p>
        </div>
        <div>
          <p>{Dictionary.longitude}</p>
          <p>{details.longitude || "-"}</p>
        </div>
        <div>
          <p>{Dictionary.latitude}</p>
          <p>{details.latitude || "-"}</p>
        </div>
        <div>
          <p>{Dictionary.phone}</p>
          <p>{details.phone.join("-") || "-"}</p>
        </div>
        <div>
          <p>{Dictionary.fax}</p>
          <p>{details.fax || "-"}</p>
        </div>
        <div>
          <p>{Dictionary.postalCode}</p>
          <p>{details.postal_code || "-"}</p>
        </div>
        <div>
          <p>{`IP ${Dictionary.allowed}`}</p>
          <p>{details.ip || "-"}</p>
        </div>
        <div>
          <p>{Dictionary.services}</p>
          <div className={Classes["modalServices"]}>
            {details?.services.length === 0
              ? "-"
              : details?.services?.map((item) => (
                  <ChipComponent key={item.id}>
                    {item.fa_ministration_name}
                  </ChipComponent>
                ))}
          </div>
        </div>
        {details.atmCount ? (
          <div>
            <p>{Dictionary.atmCount}</p>
            <p>{details.atmCount}</p>
          </div>
        ) : (
          ""
        )}
      </div>
      <ButtonComponent
        classNameBtn={Classes["modalBtn"]}
        onClick={() => dispatch(listBranches({ modal: false }))}
        type="primary"
        htmlType={Dictionary.close}
      >
        {Dictionary.close}
      </ButtonComponent>
    </div>
  );
};

export default ViewBranchModal;
