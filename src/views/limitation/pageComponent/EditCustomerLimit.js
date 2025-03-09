import React, { useRef } from "react";
import {
  limitation,
  resetLimitation,
} from "store/reducers/limitation/limitationReducer";
import Dictionary from "helpers/Dictionary";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "components/table/TableComponent";
import { useSearchParams } from "react-router-dom";
import queryString from "query-string";
import { useEffect } from "react";
import TooltipComponent from "components/tooltip/TooltipComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import Edit from "assets/images/icon/Edit.svg";
import Delete from "assets/images/icon/Delete.svg";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import ButtonComponent from "components/button/ButtonComponent";
import { Form } from "antd";
import ModalComponent from "components/modalComponent/ModalComponent";
import Classes from "views/limitation/styles/limitation.module.scss";
import { editCustomerLimit, searchCustomerLimit } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import { ConvertNumberToComma } from "helpers/ConvertNumberToComma";
import LimitPlaceHolder from "assets/images/placeholder/LimitPlaceHolder.svg";
import LimitNoData from "assets/images/placeholder/LimitNoData.svg";
import AddCustomerLimit from "views/limitation/pageComponent/AddCustomerLimit";
import { errorResponse } from "helpers/APIService";
import DeleteCustomerLimit from "views/limitation/pageComponent/DeleteCustomerLimit";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { nationalCodeValidation } from "helpers/nationalIdValidation";
import Add from "assets/images/icon/Add.svg";
import Variables from "assets/styles/_Variables.scss";

const EditCutomerLimit = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const listLimitData = useSelector((state) => state.limitation.value);
  const errorHandler = useErrorHandler();

  useEffect(() => {
    form.setFieldsValue({
      ffIdentificationCode: searchParams.get("ffIdentificationCode"),
    });
    handleResetSearch();
  }, []);

  useEffect(() => {
    if (listLimitData.CTA) {
      createTable();
      handleResetSearch();
    }
  }, [listLimitData.CTA]);

  const createTable = () => {
    searchCustomerLimit({
      offset: "0",
      count: "100",
      sort_by: "-createdDate",
      criteria: {
        operation: "and",
        criteria: [
          {
            key: "ffIdentificationCode",
            value: listLimitData.identificationCode,
            operation: "equals",
          },
        ],
      },
    })
      .then((res) => {
        const convert = res.data?.data?.map((node) => {
          return {
            customer_type: node?.customer_type,
            fullname: node?.fullname,
            identification_code: node?.identification_code,
            internal_daily: node?.internal_daily,
            paya_daily: node?.paya_daily,
            satna_daily: node?.satna_daily,
            total_daily: node?.total_daily,
            batch_daily: node?.batch_daily,
            total_paya_satna_daily: node?.total_paya_satna_daily,
            pol_daily: node?.pol_daily,
          };
        });
        dispatch(
          limitation({
            list: convert,
            endRow: res.data.end_row,
            startRow: res.data.start_row,
            totalRows: res.data.total_rows,
            CTA: false,
          })
        );
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const resetSearch = () => {
    setSearchParams(queryString.stringify());
    dispatch(
      limitation({ showDeleteBtn: false, CTA: false, list: [], click: false })
    );
    form.resetFields();
  };

  const handleResetSearch = () => {
    if (searchParams.get("ffIdentificationCode")) {
      dispatch(limitation({ showDeleteBtn: true }));
    } else {
      dispatch(limitation({ showDeleteBtn: false }));
    }
  };

  const onFinish = (values) => {
    dispatch(limitation({ CTA: true, click: true }));
    if (values) {
      setSearchParams({ ...values });
      dispatch(
        limitation({
          identificationCode: values.ffIdentificationCode,
          showDeleteBtn: true,
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

  const deleteCustomerLimit = () => {
    editCustomerLimit(listLimitData.record)
      .then(() => {
        dispatch(
          resetLimitation({
            permissions: listLimitData.permissions,
            vipPermissions: listLimitData.vipPermissions,
          })
        );
        dispatch(limitation({ CTA: false }));
        resetSearch();
        dispatch(
          setNotificationData({
            message: Dictionary.successfullyDone,
            type: "success",
            time: 5000,
          })
        );
      })
      .catch(() => errorHandler(errorResponse));
  };

  const handleDelete = (record) => {
    dispatch(
      limitation({
        record: {
          identification_code: record.identification_code,
          account_number: null,
          customer_type: record.customer_type,
          internal_daily: null,
          satna_daily: null,
          paya_daily: null,
          batch_daily: null,
          total_paya_satna_daily: null,
          total_daily: null,
        },
        deleteModal: true,
      })
    );
  };

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
      render: (record) => record || "--",
    },
    {
      title: `${Dictionary.name} ${Dictionary.customer}`,
      key: "fullname",
      dataIndex: "fullname",
      render: (record) => record || "--",
    },
    {
      title: `${Dictionary.type} ${Dictionary.customer}`,
      key: "customer_type",
      dataIndex: "customer_type",
      render: (record) => listLimitData.generatCustomerType[record] || "--",
    },
    {
      title: Dictionary.maxDaily,
      key: "total_daily",
      dataIndex: "total_daily",
      render: (record) => ConvertNumberToComma(record) || "--",
    },
    {
      title: `${Dictionary.move} ${Dictionary.internal}`,
      key: "internal_daily",
      dataIndex: "internal_daily",
      render: (record) => ConvertNumberToComma(record),
    },
    {
      title: `${Dictionary.move} ${Dictionary.pol}`,
      key: "pol_daily",
      dataIndex: "pol_daily",
      render: (record) => ConvertNumberToComma(record),
    },
    {
      title: `${Dictionary.move} ${Dictionary.paya}`,
      key: "paya_daily",
      dataIndex: "paya_daily",
      render: (record) => ConvertNumberToComma(record),
    },
    {
      title: `${Dictionary.move} ${Dictionary.satna}`,
      key: "satna_daily",
      dataIndex: "satna_daily",
      render: (record) => ConvertNumberToComma(record),
    },
    {
      title: `${Dictionary.move} ${Dictionary.batch}`,
      key: "batch_daily",
      dataIndex: "batch_daily",
      render: (record) => ConvertNumberToComma(record),
    },
    {
      key: "services",
      dataIndex: "services",
      width: "5%",
      render: (_field, record) => (
        <div className={Classes["customer-limitation-table-icons"]}>
          <TooltipComponent title={Dictionary.edit}>
            <CustomIcon
              src={Edit}
              size={24}
              name={`list-customers-${record.id}-edit`}
              onClick={() => {
                listLimitData.permissions.edit &&
                  dispatch(
                    limitation({
                      editModal: true,
                      record: record,
                      currentTotalDaily: record?.total_daily,
                      addStep: 1,
                      state: "edit",
                    })
                  );
              }}
              color={
                listLimitData.permissions.edit
                  ? Variables.LogoGreenDark
                  : Variables.GreenLight7
              }
              style={{ cursor: !listLimitData.permissions.edit && "default" }}
            />
          </TooltipComponent>
          <TooltipComponent title={Dictionary.delete}>
            <CustomIcon
              src={Delete}
              size={24}
              name={`list-customers-${record.id}-delete`}
              onClick={() =>
                listLimitData.permissions.delete && handleDelete(record)
              }
              color={
                listLimitData.permissions.delete
                  ? Variables.NotifRed
                  : Variables.NotifPink
              }
              style={{ cursor: !listLimitData.permissions.delete && "default" }}
            />
          </TooltipComponent>
        </div>
      ),
    },
  ];

  return (
    <div>
      <ModalComponent
        width={918}
        title={Dictionary.addCustomerToLimitation}
        open={listLimitData.addModal}
        onCancel={() =>
          dispatch(
            limitation({ addModal: false, addStep: 0, record: "", state: "" })
          )
        }
      >
        <AddCustomerLimit />
      </ModalComponent>
      <ModalComponent
        width={918}
        title={Dictionary.addCustomerToLimitation}
        open={listLimitData.editModal}
        onCancel={() =>
          dispatch(
            limitation({
              editModal: false,
              addStep: 0,
              record: "",
              state: "",
              currentTotalDaily: "",
            })
          )
        }
      >
        <AddCustomerLimit resetSearch={resetSearch} />
      </ModalComponent>
      <ModalComponent
        width={720}
        title={`${Dictionary.warning} ${Dictionary.delete}`}
        open={listLimitData.deleteModal}
        onCancel={() =>
          dispatch(limitation({ deleteModal: false, record: "" }))
        }
      >
        <DeleteCustomerLimit deleteFunction={deleteCustomerLimit} />
      </ModalComponent>
      {listLimitData.permissions.create ? (
        <ButtonComponent
          type="default"
          classNameBtn={Classes.addBtn}
          srcRight={Add}
          onClick={() =>
            dispatch(limitation({ addModal: true, state: "add", addStep: 0 }))
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
          name="ffIdentificationCode"
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
          {listLimitData.showDeleteBtn && (
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
      {listLimitData.list?.length > 0 ? (
        <TableComponent
          columns={columns}
          dataSource={listLimitData.list}
          count={listLimitData.totalRows}
        />
      ) : (
        <div className={Classes["table-placeholder"]}>
          {listLimitData?.click ? (
            <CustomIcon src={LimitNoData} size={230} />
          ) : (
            <CustomIcon src={LimitPlaceHolder} size={250} />
          )}
        </div>
      )}
    </div>
  );
};

export default EditCutomerLimit;
