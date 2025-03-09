import ModalComponent from "components/modalComponent/ModalComponent";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "components/button/ButtonComponent";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import Dictionary from "helpers/Dictionary";
import Classes from "views/limitation/styles/limitation.module.scss";
import Delete from "assets/images/icon/Delete.svg";
import Add from "assets/images/icon/Add.svg";
import { Form } from "antd";
import {
  limitation,
  resetLimitation,
} from "store/reducers/limitation/limitationReducer";
import TableComponent from "components/table/TableComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import LimitPlaceHolder from "assets/images/placeholder/LimitPlaceHolder.svg";
import LimitNoData from "assets/images/placeholder/LimitNoData.svg";
import DeleteVIPCustomer from "./DeleteVIPCustomer";
import { deleteVipCustomer, searchVipCustomer } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import AddVipCustomer from "./AddVipCustomer";
import { nationalCodeValidation } from "helpers/nationalIdValidation";
import Variables from "assets/styles/_Variables.scss";
import queryString from "query-string";
import { useSearchParams } from "react-router-dom";
import TooltipComponent from "components/tooltip/TooltipComponent";
import { setNotificationData } from "store/reducers/toast/toastReducer";

const VIPCustomers = () => {
  const dispatch = useDispatch();
  const listLimitData = useSelector((state) => state.limitation.value);
  const [form] = Form.useForm();
  const formRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const errorHandler = useErrorHandler();

  const columns = [
    {
      dataIndex: "index",
      key: "index",
      width: "5%",
      render: (_text, _record, index) => (
        <span style={{ color: "#888" }}>{index + 1}</span>
      ),
    },
    {
      title: `${Dictionary.nationalIdCode}`,
      key: "identification_code",
      dataIndex: "identification_code",
      width: "12%",

      render: (record) => record || "--",
    },
    {
      title: `${Dictionary.name} ${Dictionary.customer}`,
      key: "fullname",
      width: "20%",
      dataIndex: "fullname",
      render: (record) => record || "--",
    },
    {
      title: `${Dictionary.type} ${Dictionary.customer}`,
      key: "customer_type",
      dataIndex: "customer_type",
      width: "12%",
      render: (record) => listLimitData.generatCustomerType[record] || "--",
    },
    {
      key: "services",
      dataIndex: "services",
      width: "5%",
      render: (_field, record) => (
        <div className={Classes["customer-limitation-table-icons"]}>
          <TooltipComponent title={Dictionary.delete}>
            <CustomIcon
              src={Delete}
              size={24}
              name={`list-customers-${record.id}-delete`}
              onClick={() =>
                listLimitData.vipPermissions.delete && handleDelete(record)
              }
              color={
                listLimitData.vipPermissions.delete
                  ? Variables.NotifRed
                  : Variables.NotifPink
              }
              style={{
                cursor: !listLimitData.vipPermissions.delete && "default",
              }}
            />
          </TooltipComponent>
        </div>
      ),
    },
  ];

  useEffect(() => {
    form.setFieldsValue({
      identificationCode: searchParams.get("identificationCode"),
    });
    handleResetSearch();
  }, []);

  useEffect(() => {
    if (listLimitData.vipCTA) {
      createTable();
      handleResetSearch();
    }
  }, [listLimitData.vipCTA, listLimitData.vipIdentificationCode]);

  const createTable = () => {
    searchVipCustomer({
      offset: "0",
      count: "100",
      sort_by: "-createdDate",
      criteria: {
        key: "identificationCode",
        value: listLimitData?.vipIdentificationCode,
        operation: "equals",
      },
    })
      .then((res) => dispatch(limitation({ vipList: res?.data?.data })))
      .catch(() => errorHandler(errorResponse));
  };

  const resetSearch = () => {
    setSearchParams(queryString.stringify());
    dispatch(
      limitation({ vipShowDeleteBtn: false, vipCTA: false, vipList: [] })
    );
    form.resetFields();
  };

  const handleResetSearch = () => {
    if (searchParams.get("identificationCode")) {
      dispatch(limitation({ vipShowDeleteBtn: true }));
    } else {
      dispatch(limitation({ vipShowDeleteBtn: false }));
    }
  };

  const onFinish = (values) => {
    dispatch(limitation({ vipCTA: true }));
    if (values) {
      setSearchParams({ ...values });
      dispatch(
        limitation({
          vipIdentificationCode: values.identificationCode,
          vipShowDeleteBtn: true,
        })
      );
    } else {
      dispatch(
        setNotificationData({
          message: "یک مورد انتخاب  کنید",
          type: "error",
          time: 5000,
        })
      );
    }
  };

  const deleteFromVip = () => {
    deleteVipCustomer(listLimitData.vipRecord?.identification_code)
      .then(() => {
        dispatch(
          resetLimitation({
            permissions: listLimitData.permissions,
            vipPermissions: listLimitData.vipPermissions,
          })
        );
        dispatch(limitation({ vipCTA: false }));
        dispatch(
          setNotificationData({
            message: Dictionary.successfullyDone,
            type: "success",
            time: 5000,
          })
        );
        resetSearch();
      })
      .catch(() => errorHandler(errorResponse));
  };

  const handleDelete = (record) => {
    dispatch(limitation({ vipDeleteModal: true, vipRecord: record }));
  };

  return (
    <div>
      <ModalComponent
        width={918}
        title={Dictionary.addCustomerToVipList}
        open={listLimitData.vipAddModal}
        onCancel={() =>
          dispatch(
            limitation({
              vipAddModal: false,
              vipAddStep: 0,
              vipRecord: "",
              state: "",
            })
          )
        }
      >
        <AddVipCustomer />
      </ModalComponent>
      <ModalComponent
        width={720}
        title={`${Dictionary.warning} ${Dictionary.delete}`}
        open={listLimitData.vipDeleteModal}
        onCancel={() =>
          dispatch(limitation({ vipDeleteModal: false, vipRecord: "" }))
        }
      >
        <DeleteVIPCustomer deleteFunction={deleteFromVip} />
      </ModalComponent>
      {listLimitData.vipPermissions.create ? (
        <ButtonComponent
          name="vip"
          type="default"
          classNameBtn={Classes.addBtn}
          srcRight={Add}
          onClick={() =>
            dispatch(limitation({ vipAddModal: true, vipAddStep: 0 }))
          }
        >
          {`${Dictionary.customer} ${Dictionary.new}`}
        </ButtonComponent>
      ) : (
        ""
      )}
      <FormComponent
        layout="inline"
        form={form}
        ref={formRef}
        onFinish={onFinish}
      >
        <FormItemComponent
          className={Classes["limitation-search-input"]}
          name="identificationCode"
          rules={[
            {
              required: true,
              message: Dictionary.require,
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
            width={176}
            placeholder={Dictionary.nationalIdCode}
            maxLength={11}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["limit-search-btn"]}>
          {listLimitData.vipShowDeleteBtn && (
            <ButtonComponent
              onClick={resetSearch}
              htmlType="button"
              type="text-danger"
            >
              {Dictionary.clean}
            </ButtonComponent>
          )}
          <ButtonComponent type="primary" htmlType={Dictionary.search}>
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
      {listLimitData.vipList?.length > 0 ? (
        <TableComponent columns={columns} dataSource={listLimitData.vipList} />
      ) : (
        <div className={Classes["table-placeholder"]}>
          {listLimitData?.vipCTA ? (
            <CustomIcon src={LimitNoData} size={230} />
          ) : (
            <CustomIcon src={LimitPlaceHolder} size={250} />
          )}
        </div>
      )}
    </div>
  );
};

export default VIPCustomers;
