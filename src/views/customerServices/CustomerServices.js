import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  customerService,
  resetCustomerService,
} from "store/reducers/customerServices/customerServiceReducer";
import {
  enableBiometricService,
  enableLoginService,
  enableNotLoginService,
  getCustomerServices,
} from "helpers/APIFunction";
import { Form, Table } from "antd";
import Dictionary from "helpers/Dictionary";
import ChipComponent from "components/chipComponent/ChipComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import SwitchComponent from "components/switch/SwitchComponent";
import Classes from "views/customerServices/styles/customerServices.module.scss";
import ModalComponent from "components/modalComponent/ModalComponent";
import DisableServiceModal from "./pageComponent/DisableServiceModal";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import HeaderPage from "components/headerPage/HeaderPage";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import ButtonComponent from "components/button/ButtonComponent";
import { nationalCodeValidation } from "helpers/nationalIdValidation";
import { MatchAuthority } from "helpers/MatchAuthority";
import SearchIdCode from "assets/images/placeholder/SearchIdCode.svg";
import LimitNoData from "assets/images/placeholder/LimitNoData.svg";
import CustomIcon from "components/customIcon/CustomIcon";

const CustomerServices = () => {
  const dispatch = useDispatch();
  const customerServiceData = useSelector(
    (state) => state.customerService.value
  );
  const userInfoData = useSelector((state) => state.userInfo.value);
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const formRef = useRef();

  const getAllServices = (values) => {
    if (values) {
      dispatch(customerService({ idCode: values, showDeleteBtn: true }));
      getCustomerServices(values)
        .then((res) =>
          dispatch(
            customerService({
              list: res?.data,
            })
          )
        )
        .catch(() => {
          errorHandler(errorResponse);
        });
    }
  };
  const data = [
    {
      key: 1,
      name: customerServiceData.list?.full_name,
      idCode: customerServiceData.list?.identification_code,
      serviceName: Dictionary.servicesWithLogin,
      service: "login_facilities",
    },
    {
      key: 2,
      serviceName: Dictionary.servicesWithoutLogin,
      service: "not_login_facilities",
    },
    {
      key: 3,
      serviceName: Dictionary.biometricServicesWithLogin,
      service: "biometric_login_facilities",
    },
  ];

  useEffect(() => {
    dispatch(resetCustomerService());
  }, []);

  useEffect(() => {
    if (form.getFieldsValue().idCode) {
      getAllServices(customerServiceData.idCode);
    }
  }, [customerServiceData.reload]);
  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        customerService({
          permissions: {
            view: MatchAuthority(
              userInfoData.authorities,
              "Get:/api/bo/facility/get-all-facilities/v1"
            ),
            edit:
              MatchAuthority(
                userInfoData.authorities,
                "Get:/api/bo/facility/get-all-facilities/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/facility/biometric/disable/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/facility/disable-facility/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/facility/not-login/disable-facility/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/facility/biometric/remove-from-disabled-facilities/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/facility/remove-from-disabled-facilities/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/facility/not-login/remove-from-disabled-facilities/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/expression/search/v1"
              ),
          },
        })
      );
    } else {
      dispatch(
        customerService({
          permissions: {
            edit: true,
            view: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  const expandedRow = (row) => {
    const handleSwitch = (record, row) => {
      if (record?.disabled === false) {
        dispatch(
          customerService({ record: record, reasonModal: true, chooseRow: row })
        );
      } else {
        let body = {
          facility_key: record.facility_key,
          identification_code: customerServiceData.list.identification_code,
        };
        if (row.service === "not_login_facilities") {
          enableNotLoginService(body)
            .then(() =>
              dispatch(customerService({ reload: !customerServiceData.reload }))
            )
            .catch(() => errorHandler(errorResponse));
        } else if (row.service === "login_facilities") {
          enableLoginService(body)
            .then(() =>
              dispatch(customerService({ reload: !customerServiceData.reload }))
            )
            .catch(() => errorHandler(errorResponse));
        } else if (row.service === "biometric_login_facilities") {
          enableBiometricService(body)
            .then(() =>
              dispatch(customerService({ reload: !customerServiceData.reload }))
            )
            .catch(() => errorHandler(errorResponse));
        }
      }
    };
    const columns = [
      {
        title: Dictionary.serviceTitle,
        key: "facility_description",
        dataIndex: "facility_description",
        width: "20%",
      },
      {
        title: Dictionary.stateInPlatform,
        key: "state",
        dataIndex: "state",
        render: (_field, record) =>
          !record.is_for_web && !record.is_for_mobile && !record.is_for_pwa ? (
            <ChipComponent red={true}>{Dictionary.block}</ChipComponent>
          ) : (record.is_for_web ||
              record.is_for_mobile ||
              record.is_for_pwa) &&
            record.disabled ? (
            <ChipComponent red={true}>{Dictionary.notActive}</ChipComponent>
          ) : (record.is_for_web ||
              record.is_for_mobile ||
              record.is_for_pwa) &&
            !record.disabled ? (
            <ChipComponent>{Dictionary.active}</ChipComponent>
          ) : null,
        width: "15%",
      },
      {
        title: Dictionary.by,
        render: (record) =>
          record.disabled_by_name || record.last_modified_by || "--",
        width: "20%",
      },
      {
        title: Dictionary.sake,
        key: "disabled_desc",
        dataIndex: "disabled_desc",
        render: (record) => record || "--",
        width: "20%",
      },
      {
        title: Dictionary.lastModifiedDate,
        render: (record) =>
          record.disabled_by_date || record.last_modified_date || "--",
        width: "15%",
      },
      {
        key: "disabled",
        dataIndex: "disabled",
        render: (_field, record) => (
          <TooltipComponent
            title={_field ? Dictionary.enable : Dictionary.disable}
          >
            <SwitchComponent
              disabled={customerServiceData.permissions.edit ? false : true}
              checked={!_field}
              onChange={() =>
                customerServiceData.permissions.edit &&
                handleSwitch(record, row)
              }
            />
          </TooltipComponent>
        ),
        width: "5%",
      },
    ];

    let inTable =
      row.key == 1
        ? customerServiceData.list?.login_facilities
        : row.key == 2
        ? customerServiceData.list?.not_login_facilities
        : row.key == 3
        ? customerServiceData.list?.biometric_login_facilities
        : null;
    return (
      <Table
        scroll={{ y: 500 }}
        size="small"
        columns={columns}
        dataSource={inTable}
        pagination={false}
        rowClassName={Classes["customer-service-expand-table"]}
      />
    );
  };

  const onFinish = (values) => {
    dispatch(
      resetCustomerService({ permissions: customerServiceData.permissions })
    );
    getAllServices(values.idCode);
  };

  const resetSearch = () => {
    dispatch(resetCustomerService());
    form.resetFields();
  };

  const headerColumns = [
    {
      title: Dictionary.nationalId,
      dataIndex: "idCode",
      key: "idCode",
      width: "130px",
    },
    {
      title: Dictionary.fullName,
      dataIndex: "name",
      key: "name",
      width: "250px",
    },
    {
      title: Dictionary.servicesCategory,
      dataIndex: "serviceName",
      key: "serviceName",
      width: "30px",
    },
  ];
  return (
    <>
      <ModalComponent
        width={918}
        open={customerServiceData.reasonModal}
        title={`${Dictionary.disable} ${Dictionary.service}`}
        className={Classes["disable-customer-service-modal"]}
        maskClosable={false}
        onCancel={() =>
          dispatch(customerService({ reasonModal: false, record: "" }))
        }
      >
        <DisableServiceModal />
      </ModalComponent>
      <div>
        <HeaderPage title={Dictionary.customerServicesManagement} />
        <FormComponent
          layout="inline"
          onFinish={onFinish}
          form={form}
          ref={formRef}
          className={Classes["customer-service-search-bar"]}
        >
          <FormItemComponent
            name="idCode"
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                min: 10,
                message: Dictionary.checkInput,
              },
              {
                pattern: /^[0-9]+$/,
                message: Dictionary.checkInput,
              },
              () => ({
                validator(_, value) {
                  if ((value.length === 10) & !nationalCodeValidation(value)) {
                    return Promise.reject(new Error(Dictionary.idNotValid));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputSearchComponent
              name="idCode"
              placeholder={Dictionary.personalCode}
              maxLength={10}
              className={Classes["customer-service-search-bar-input"]}
            />
          </FormItemComponent>
          <FormItemComponent
            className={Classes["customer-service-search-bar-btn"]}
          >
            {customerServiceData.showDeleteBtn && (
              <ButtonComponent
                onClick={resetSearch}
                htmlType="button"
                type="text-danger"
              >
                {Dictionary.clean}
              </ButtonComponent>
            )}
            <ButtonComponent
              classNameBtn={Classes["customer-service-search-btn"]}
              type="primary"
              htmlType={Dictionary.search}
            >
              {Dictionary.search}
            </ButtonComponent>
          </FormItemComponent>
        </FormComponent>
        {customerServiceData.list?.full_name ? (
          <Table
            className={Classes["customer-services-main-table"]}
            columns={headerColumns}
            dataSource={data}
            expandedRowRender={expandedRow}
            size="small"
            scroll={{ y: 700 }}
            rowClassName={Classes["customer-service-expand-table"]}
          />
        ) : (
          <div className={Classes["table-placeholder"]}>
            {customerServiceData.showDeleteBtn ? (
              <CustomIcon src={LimitNoData} size={230} />
            ) : (
              <CustomIcon src={SearchIdCode} size={210} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerServices;
