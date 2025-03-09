import React, { useEffect, useRef } from "react";
import { Form } from "antd";
import SelectComponent from "components/SelectComponent/SelectComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import Dictionary from "helpers/Dictionary";
import Classes from "views/ticketing/styles/searchInTicketing.module.scss";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "components/button/ButtonComponent";
import { ticketing } from "store/reducers/ticketing/ticketingReducer";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import MultiColorChip from "components/multiColorChip/MultiColorChip";
import Variables from "assets/styles/_Variables.scss";

const SearchInTicketing = (props) => {
  const dispatch = useDispatch();
  const ticketingData = useSelector((state) => state.ticketing.value);
  const path = window.location.pathname;
  const { ticketingKey, totalRows } = ticketingData;
  const {
    pagination,
    setSearchParams,
    setPagination,
    searchParams,
    handleResetSearch,
  } = props;
  const [form] = Form.useForm();
  const formRef = useRef();

  const onFinish = (values) => {
    const filterValue = Object.values(values).filter(
      (p) => p !== null && p !== undefined
    );
    if (filterValue.length > 0) {
      Object.keys(values).forEach(
        (key) =>
          (values[key] === undefined ||
            values[key] === null ||
            values[key] === "") &&
          delete values[key]
      );
      const newQueryParam = {
        pageNumber: 1,
        recordsPerPage: pagination.recordsPerPage,
        ...values,
      };
      setSearchParams(newQueryParam);
      dispatch(ticketing({ showDeleteBtn: true, sortColumn: "" }));
      setPagination({ ...pagination, pageNumber: 1 });
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
  const resetSearch = () => {
    const newQueryParam = {
      pageNumber: 1,
      recordsPerPage: pagination.recordsPerPage,
    };
    setSearchParams(newQueryParam);
    dispatch(ticketing({ showDeleteBtn: false, sortColumn: "" }));
    form.resetFields();
  };
  useEffect(() => {
    form.setFieldsValue({
      fullName: searchParams.get("fullName"),
      identificationCode: searchParams.get("identificationCode"),
      phoneNumber: searchParams.get("phoneNumber"),
      status: searchParams.get("status"),
      traceId: searchParams.get("traceId"),
      pageNumber: searchParams.get("pageNumber") || 1,
      recordsPerPage: searchParams.get("recordsPerPage") || 10,
    });
    handleResetSearch();
  }, [path]);

  const items = [
    { id: 1, value: "ASKED", text: "پیام جدید" },
    { id: 2, value: "SEEN_BY_BACK_OFFICE", text: "پاسخ داده نشده" },
    { id: 3, value: "ANSWERED", text: "پاسخ ارسال شده" },
    { id: 4, value: "SEEN_BY_CUSTOMER", text: "پاسخ دیده شده" },
  ];

  return (
    <Form
      className={Classes["ticket-list-search-form"]}
      layout="inline"
      form={form}
      onFinish={onFinish}
      ref={formRef}
    >
      <FormItemComponent
        name="traceId"
        className={Classes["ticket-list-search-form-item"]}
      >
        <InputSearchComponent
          width={176}
          placeholder={Dictionary.ticketNumber}
          maxLength={32}
        />
      </FormItemComponent>
      <FormItemComponent
        name="fullName"
        className={Classes["ticket-list-search-form-item"]}
      >
        <InputSearchComponent
          width={176}
          placeholder={Dictionary.fullName}
          maxLength={32}
        />
      </FormItemComponent>
      <FormItemComponent
        name="identificationCode"
        className={Classes["ticket-list-search-form-item"]}
      >
        <InputSearchComponent
          width={176}
          placeholder={Dictionary.nationalId}
          maxLength={10}
        />
      </FormItemComponent>
      <FormItemComponent
        name="phoneNumber"
        className={Classes["ticket-list-search-form-item"]}
      >
        <InputSearchComponent
          width={176}
          placeholder={Dictionary.mobile}
          maxLength={11}
        />
      </FormItemComponent>
      {ticketingKey === "ticketList" && (
        <FormItemComponent
          name="status"
          className={Classes["ticket-list-search-form-item"]}
        >
          <SelectComponent
            name="status"
            width={176}
            placeholder={Dictionary.status}
            items={items}
            prefix
          />
        </FormItemComponent>
      )}
      <FormItemComponent className={Classes["ticket-list-search-form-item"]}>
        <MultiColorChip
          className={Classes["style-of-quantity"]}
          bgc={Variables.GreyLight2}
        >{`${Dictionary.quantity}: ${totalRows}`}</MultiColorChip>
      </FormItemComponent>
      <FormItemComponent className={Classes["ticket-list-search-btn"]}>
        {ticketingData.showDeleteBtn && (
          <ButtonComponent
            onClick={resetSearch}
            htmlType="button"
            type="text-danger"
          >
            {Dictionary.clean}
          </ButtonComponent>
        )}
        <ButtonComponent
          type="primary"
          htmlType={Dictionary.search}
          classNameBtn={Classes["ticket-list-search-btn-button"]}
        >
          {Dictionary.search}
        </ButtonComponent>
      </FormItemComponent>
    </Form>
  );
};

export default SearchInTicketing;
