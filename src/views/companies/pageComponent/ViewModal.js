import React, { Children, useEffect, useState } from "react";
import ModalComponent from "components/modalComponent/ModalComponent";
import { useDispatch, useSelector } from "react-redux";
import { companies } from "store/reducers/companies/companiesReducer";
import Dictionary from "helpers/Dictionary";
import Classes from "views/companies/styles/companies.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import TableComponent from "components/table/TableComponent";
import ChipComponent from "components/chipComponent/ChipComponent";
import { render } from "less";

const ViewModal = () => {
  const dispatch = useDispatch();
  const companiesData = useSelector((state) => state.companies.value);
  const { viewModal, record, planList } = companiesData;
  const [expandedRowKeys, setExpandedRowKeys] = useState(null);

  const closeModal = () =>
    dispatch(companies({ viewModal: false, planList: [] }));

  const columns = [
    {
      title: Dictionary.name + " " + Dictionary.plan,
      key: "plan_name",
      dataIndex: "plan_name",
      width: "25%",
    },
    {
      title: Dictionary.key + " " + Dictionary.plan,
      key: "plan_code",
      dataIndex: "plan_code",
      width: "30%",
    },
    {
      title: `${Dictionary.planLimitBudget} (${Dictionary.rial})`,
      key: "plan_limit",
      dataIndex: "plan_limit",
      width: "25%",
      render: (record) => record?.toLocaleString("en"),
    },
    {
      title: Dictionary.status,
      key: "is_active",
      dataIndex: "is_active",
      width: "10%",
      render: (record) => (
        <ChipComponent
          className={
            record
              ? Classes["custom-chip-for-active-company"]
              : Classes["custom-chip-for-not-active-company"]
          }
          red={!record}
        >
          {record ? Dictionary.active : Dictionary.notActive}
        </ChipComponent>
      ),
    },
  ];

  const updateExpandedRowKeys = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys(record?.key);
    } else {
      setExpandedRowKeys(null);
    }
  };

  return (
    <ModalComponent
      width={918}
      title={Dictionary.companyPlanDetails}
      open={viewModal}
      onCancel={closeModal}
    >
      <div className={Classes["row"]}>
        <div className={Classes["companies-view-item"]}>
          <p>{`${Dictionary.name} ${Dictionary.company}`}</p>
          <p>{record.company_name}</p>
        </div>
        <div className={Classes["companies-view-item"]}>
          <p>{`${Dictionary.key} ${Dictionary.company}`}</p>
          <p>{record.company_code}</p>
        </div>
      </div>
      <div className={Classes["row"]}>
        <div className={Classes["companies-view-item"]}>
          <p>{Dictionary.companyLogo}</p>
          <img src={`data:image/png;base64,${record?.icon_base64}`} />
        </div>
        <div className={Classes["companies-view-item"]}>
          <p>{`${Dictionary.status}`}</p>
          <ChipComponent
            className={
              record.is_active
                ? Classes["custom-chip-for-active-company"]
                : Classes["custom-chip-for-not-active-company"]
            }
            red={!record.is_active}
          >
            {record.is_active ? Dictionary.active : Dictionary.notActive}
          </ChipComponent>
        </div>
      </div>
      {planList.length > 0 && (
        <TableComponent
          columns={columns}
          dataSource={planList}
          className={Classes["view-modal-tbl"]}
          rowKey={(record) => record.key}
          expandable={{
            expandedRowRender: (record) => (
              <div className={Classes["view-modal-details-plan"]}>
                <div className={Classes["eye-row"]}>
                  <p>{Dictionary.mainAccountNumber}: </p>
                  <p>{record.account_number1 || "--"}</p>
                </div>
                <div className={Classes["eye-row"]}>
                  <p>{Dictionary.loanAmountValues}: </p>
                  <div className={Classes["view-modal-chip"]}>
                    {record.loan_amount_values?.map((period) => (
                      <span
                        className={Classes["plan-count"]}
                      >{`${period.toLocaleString("en")} ${
                        Dictionary.rial
                      }`}</span>
                    ))}
                  </div>
                </div>
                <div className={Classes["eye-row"]}>
                  <p>{Dictionary.paybackPeriodValues}: </p>
                  <div className={Classes["view-modal-chip"]}>
                    {record.payback_period_values?.map((period) => (
                      <span
                        className={Classes["plan-count"]}
                      >{`${period} ${Dictionary.monthly}`}</span>
                    ))}
                  </div>
                </div>
                <div className={Classes["eye-row"]}>
                  <p>{Dictionary.reservedRemainedLimit}: </p>
                  <p>{`${record.reserved_remained_limit?.toLocaleString(
                    "en"
                  )}  ${Dictionary.rial}`}</p>
                </div>
                <div className={Classes["eye-row"]}>
                  <p>{Dictionary.realRemainedLimit}: </p>
                  <p>{`${record.real_remained_limit?.toLocaleString("en")}  ${
                    Dictionary.rial
                  }`}</p>
                </div>
                <div className={Classes["eye-row"]}>
                  <p>{Dictionary.branchCode} عامل: </p>
                  <p>{record.branch_code || "--"}</p>
                </div>
                {record.company_loan_plan_settlement_detail_list.map(
                  (item, index) => (
                    <>
                      <div className={Classes["eye-row"]}>
                        <div className={Classes["destination-info"]}>
                          <p>
                            {`${Dictionary.clearAccountNumber} ${index + 1}`}:{" "}
                          </p>
                          <p>{item.destination_account}</p>
                        </div>
                        <div className={Classes["destination-info"]}>
                          <p>{Dictionary.numberOfSettlementDays}: </p>
                          <p>{`${item.days} ${Dictionary.day}`}</p>
                        </div>
                        <div className={Classes["destination-info"]}>
                          <p>{Dictionary.percentage}: </p>
                          <p>{item.percent} ٪</p>
                        </div>
                      </div>
                    </>
                  )
                )}
              </div>
            ),
            onExpand: (expanded, record) =>
              updateExpandedRowKeys(expanded, record),
            expandRowByClick: true,
            expandedRowKeys: [expandedRowKeys],
          }}
        />
      )}
      <ButtonComponent
        classNameBtn={Classes["view-modal-btn"]}
        onClick={closeModal}
        type="primary"
        htmlType={Dictionary.close}
      >
        {Dictionary.close}
      </ButtonComponent>
    </ModalComponent>
  );
};

export default ViewModal;
