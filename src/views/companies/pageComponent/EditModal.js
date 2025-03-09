import React from "react";
import ButtonComponent from "components/button/ButtonComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import Dictionary from "helpers/Dictionary";
import Classes from "views/companies/styles/companies.module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
import Edit from "assets/images/icon/Edit.svg";
import { useDispatch, useSelector } from "react-redux";
import useErrorHandler from "helpers/useErrorHandler";
import { companies } from "store/reducers/companies/companiesReducer";
import FormComponent from "components/form/FormComponent";
import AddCompanyModal from "./AddCompanyModal";
import { getCompanyPlans } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";

const EditModal = () => {
  const dispatch = useDispatch();
  const companiesData = useSelector((state) => state.companies.value);
  const { editModal, record, editStep } = companiesData;
  const errorHandler = useErrorHandler();

  const closeModal = () => {
    dispatch(companies({ editModal: false }));
  };

  const getPlans = () => {
    getCompanyPlans(record.company_code)
      .then((res) =>
        dispatch(
          companies({
            planList: res.data,
            editModal: false,
            editStep: "plan",
            addPlanModal: true,
          })
        )
      )
      .catch((err) => {
        if (err?.error_code === "DP-191039") {
          dispatch(
            companies({ planList: [], editModal: false, addPlanModal: true })
          );
        } else {
          errorHandler(errorResponse);
        }
      });
  };

  return (
    <ModalComponent
      width={718}
      title={Dictionary.editCompanyAndPlan + " " + record?.company_name}
      open={editModal}
      onCancel={closeModal}
    >
      {editStep === "main" && (
        <>
          <p style={{ textAlign: "center", fontSize: "16px" }}>
            لطفا یک مورد را انتخاب نمایید
          </p>
          <div className={Classes["edit-modal-button-container"]}>
            <ButtonComponent
              type="default"
              onClick={() =>
                dispatch(
                  companies({
                    addModal: true,
                    editStep: "company",
                    editModal: false,
                  })
                )
              }
            >
              <CustomIcon src={Edit} />
              {Dictionary.edit} {Dictionary.company}
            </ButtonComponent>
            <ButtonComponent type="default" onClick={getPlans}>
              <CustomIcon src={Edit} />
              {Dictionary.edit} {Dictionary.plan}
            </ButtonComponent>
          </div>
        </>
      )}
    </ModalComponent>
  );
};

export default EditModal;
