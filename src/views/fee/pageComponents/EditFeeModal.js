import { Collapse, Form, InputNumber } from "antd";
import Add from "assets/images/icon/Add.svg";
import Arrow from "assets/images/icon/ArrowDown.svg";
import Delete from "assets/images/icon/Delete.svg";
import cx from "classnames";
import ButtonComponent from "components/button/ButtonComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputComponent from "components/input/InputComponent";
import inputClass from "components/input/InputComponent.module.scss";
import ModalComponent from "components/modalComponent/ModalComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import SwitchComponent from "components/switch/SwitchComponent";
import { updateServicesFee } from "helpers/APIFunction";
import { errorResponse } from "helpers/APIService";
import Dictionary from "helpers/Dictionary";
import useErrorHandler from "helpers/useErrorHandler";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fee, feeState, resetFee } from "store/reducers/fee/FeeReducer";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import Classes from "views/fee/styles/Fee.Module.scss";
import {
  CalculationItems,
  EventTimeItems,
  HolderItems,
  InitialState,
} from "./SelectItems";

const { Panel } = Collapse;

const EditFeeModal = () => {
  const formRef = useRef();
  const divEndRef = useRef();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const mainInfoFormRef = useRef();
  const [mainInfoForm] = Form.useForm();
  const feeData = useSelector(feeState);
  const errorHandler = useErrorHandler();
  const {
    type,
    list,
    record,
    status,
    type_fee,
    totalRows,
    reloadList,
    permissions,
    editFeeModal,
    showCollapse,
    showDeleteBtn,
    expandedRowKeys,
    beneficiaryListAsRecord,
    holder,
  } = feeData;

  useEffect(() => {
    mainInfoForm.setFieldsValue({ ...record });
    if (record?.fee_sharing_response_dtos?.length > 0) {
      dispatch(
        fee({
          type: record.calculation_type,
          status: record.status,
          type_fee: record?.fee_sharing_response_dtos[0]?.calculation_type,
        })
      );
    } else {
      dispatch(fee({ type: record.calculation_type, status: record.status }));
    }
    const beneficiaryData = [];
    record.fee_sharing_response_dtos?.forEach((item, index) => {
      const convertObj = {
        ["id_" + index]: item.id,
        ["day_" + index]: item.day,
        ["title_" + index]: item.title,
        ["event_code_" + index]: item.event_code,
        ["holder_type_" + index]: item.holder_type,
        ["calculation_var_" + index]: item.calculation_var,
        ["calculation_type_" + index]: item.calculation_type,
        ["holder_type_desc_" + index]: item.holder_type_desc,
        ["holder_description_" + index]: item.holder_description,
        ["calculation_type_desc_" + index]: item.calculation_type_desc,
      };
      beneficiaryData.push(convertObj);
    });

    const objectData = beneficiaryData?.reduce((result, obj) => {
      return { ...result, ...obj };
    }, {});

    form.setFieldsValue({ ...objectData });
  }, [record]);

  const closeModal = () => {
    dispatch(
      resetFee({
        list: list,
        totalRows: totalRows,
        permissions: permissions,
        showDeleteBtn: showDeleteBtn,
        expandedRowKeys: expandedRowKeys,
        beneficiaryListAsRecord: beneficiaryListAsRecord,
      })
    );
  };

  const ConvertObjectToArray = (values) => {
    const result = Object.keys(values).reduce((acc, key) => {
      const planIndex = key?.match(/\d+/)[0];
      let propName = key?.replace(/\d+/g, "");
      propName = propName.slice(0, -1);
      if (planIndex !== null) {
        if (!acc[planIndex]) {
          acc[planIndex] = {};
        }
        acc[planIndex][propName] = values[key];
      }
      return acc;
    }, []);
    return result;
  };

  const ChangeID = (array) => {
    for (var i in array) {
      if (Number(array[i].id) < 1) {
        array[i].id = null;
        break;
      }
    }
    return array;
  };

  const onFinish = async () => {
    try {
      await mainInfoForm.validateFields();
      const mainInfoFormData = mainInfoForm.getFieldsValue();
      try {
        await form.validateFields();
        const formFeeData = form.getFieldsValue();
        const feeSharing = ConvertObjectToArray(formFeeData);
        const fee_sharing_request_dtos = ChangeID(feeSharing);
        // if (fee_sharing_request_dtos.length > 0) {
        const body = {
          calculation_type: mainInfoFormData.calculation_type,
          calculation_var: mainInfoFormData.calculation_var,
          event: mainInfoFormData.event,
          event_code: mainInfoFormData.event_code,
          event_time: mainInfoFormData.event_time,
          holder_description: mainInfoFormData.holder_description,
          holder_type: mainInfoFormData.holder_type,
          status: status,
          fee_sharing_request_dtos: fee_sharing_request_dtos,
        };
        updateServicesFee(body)
          .then(() => {
            dispatch(
              resetFee({ permissions: permissions, reloadList: !reloadList })
            );
          })
          .catch(() => {
            errorHandler(errorResponse);
          });
        // } else {
        //   dispatch(setNotificationData({ message: "حداقل یک ذینفع باید اضافه گردد.", type: "error", time: 5000 }));
        // }
      } catch (e) {
        dispatch(
          setNotificationData({
            message: "مشکلی در مقادیر فرم ذینفع موجود است!",
            type: "error",
            time: 5000,
          })
        );
      }
    } catch (e) {
      dispatch(
        setNotificationData({
          message: "مشکلی در مقادیر فرم رویداد موجود است!",
          type: "error",
          time: 5000,
        })
      );
    }
  };

  const handleAdd = async () => {
    if (record.fee_sharing_response_dtos.length < 10) {
      const mainInfoFormData = mainInfoForm.getFieldsValue();
      let newObj = {
        status: status,
        event: mainInfoFormData.event,
        event_code: mainInfoFormData.event_code,
        event_time: mainInfoFormData.event_time,
        holder_type: mainInfoFormData.holder_type,
        calculation_var: mainInfoFormData.calculation_var,
        calculation_type: mainInfoFormData.calculation_type,
        holder_description: mainInfoFormData.holder_description,
      };
      if (record.fee_sharing_response_dtos.length > 0) {
        const newList = [...record.fee_sharing_response_dtos];
        try {
          await form.validateFields();
          const ValidationID = newList.findIndex((item) => item.id === "0");
          const formFeeData = form.getFieldsValue();
          const feeSharing = ConvertObjectToArray(formFeeData);
          const fee_sharing_dtos = ChangeID(feeSharing);
          if (ValidationID !== -1) {
            const element = {
              id: "0." + newList.length,
              ...InitialState,
              event_code: record.event_code,
              calculation_type: values.calculation_type_0,
            };
            fee_sharing_dtos.push(element);
            dispatch(
              fee({
                record: {
                  ...newObj,
                  fee_sharing_response_dtos: fee_sharing_dtos,
                },
              })
            );
          } else {
            fee_sharing_dtos.push({
              id: "0",
              ...InitialState,
              event_code: record.event_code,
              calculation_type: fee_sharing_dtos[0]?.calculation_type,
            });
            dispatch(
              fee({
                record: {
                  ...newObj,
                  fee_sharing_response_dtos: fee_sharing_dtos,
                },
              })
            );
          }
        } catch (e) {
          dispatch(
            setNotificationData({
              message: "مشکلی در مقادیر فرم ذینفع‌ها موجود است!",
              type: "error",
              time: 5000,
            })
          );
        }
      } else {
        const newList = [
          { id: "0", ...InitialState, event_code: record.event_code },
        ];
        dispatch(
          fee({ record: { ...newObj, fee_sharing_response_dtos: newList } })
        );
      }
      divEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRemove = (fieldIndex) => {
    const formFeeData = form.getFieldsValue();
    const mainInfoFormData = mainInfoForm.getFieldsValue();
    let newObj = {
      status: status,
      event: mainInfoFormData.event,
      event_time: mainInfoFormData.event_time,
      event_code: mainInfoFormData.event_code,
      holder_type: mainInfoFormData.holder_type,
      calculation_var: mainInfoFormData.calculation_var,
      calculation_type: mainInfoFormData.calculation_type,
      holder_description: mainInfoFormData.holder_description,
    };
    const feeSharing = ConvertObjectToArray(formFeeData);
    const fee_sharing_dtos = ChangeID(feeSharing);
    const newFee = fee_sharing_dtos.filter((item) => item.id !== fieldIndex);
    dispatch(fee({ record: { ...newObj, fee_sharing_response_dtos: newFee } }));
  };

  const onChange = (e, key, name) => {
    if (key === "calculation_type_0") {
      const formFeeData = form.getFieldsValue();
      const mainInfoFormData = mainInfoForm.getFieldsValue();
      let newObj = {
        status: status,
        event: mainInfoFormData.event,
        event_time: mainInfoFormData.event_time,
        event_code: mainInfoFormData.event_code,
        holder_type: mainInfoFormData.holder_type,
        calculation_var: mainInfoFormData.calculation_var,
        calculation_type: mainInfoFormData.calculation_type,
        holder_description: mainInfoFormData.holder_description,
      };
      const feeSharing = ConvertObjectToArray(formFeeData);
      const fee_sharing_dtos = ChangeID(feeSharing);
      const value = fee_sharing_dtos[0]?.calculation_type;
      fee_sharing_dtos.forEach((item) => (item.calculation_type = value));
      fee_sharing_dtos.map((obj) =>
        obj.calculationType ? { ...obj, calculation_type: value } : obj
      );
      dispatch(
        fee({
          [name]: e,
          record: { ...newObj, fee_sharing_response_dtos: fee_sharing_dtos },
        })
      );
    } else {
      dispatch(fee({ [name]: e }));
    }
  };

  const onChangeCollapse = (e) => {
    if (e === "yes") {
      dispatch(fee({ showCollapse: e }));
      divEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      dispatch(fee({ showCollapse: e }));
    }
  };

  return (
    <ModalComponent
      className={Classes["add-plan-modal"]}
      width={918}
      title={Dictionary.edit + " " + Dictionary.fee + " " + record.event_code}
      open={editFeeModal}
      onCancel={closeModal}
    >
      <div className={Classes["fee-container"]}>
        <Collapse
          accordion
          bordered={false}
          onChange={onChangeCollapse}
          activeKey={showCollapse}
          className={cx(Classes["site-collapse-custom-collapse"])}
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <CustomIcon
              src={Arrow}
              name="edit-username-icon"
              color="#308A48"
              size={24}
              className={isActive ? Classes["edit-username-icon-rotate"] : ""}
            />
          )}
        >
          <Panel
            header={`${Dictionary.edit} ${Dictionary.happen}`}
            key={"yes-2"}
          >
            <FormComponent
              layout="vertical"
              form={mainInfoForm}
              ref={mainInfoFormRef}
              requiredMark={false}
              style={{ border: "none" }}
            >
              <div className={Classes["row"]}>
                <FormItemComponent
                  name={"event_code"}
                  label={Dictionary.code + " " + Dictionary.happen}
                >
                  <InputComponent
                    width={343}
                    disabled={true}
                    name={"event_code"}
                    placeholder={Dictionary.code + " " + Dictionary.happen}
                    className={Classes["add-input"]}
                  />
                </FormItemComponent>
                <FormItemComponent name={"status"}>
                  <div className={Classes["switch-container"]}>
                    <span>
                      {Dictionary.status} {Dictionary.happen}
                    </span>
                    <SwitchComponent
                      name={"status"}
                      checked={status}
                      onChange={() => dispatch(fee({ status: !status }))}
                    />
                  </div>
                </FormItemComponent>
              </div>
              <div className={Classes["row"]}>
                <FormItemComponent
                  name={"event"}
                  label={Dictionary.name + " " + Dictionary.happen}
                  rules={[
                    {
                      required: true,
                      message: Dictionary.require,
                    },
                    { min: 2, max: 50, message: Dictionary.checkInput },
                  ]}
                >
                  <InputComponent
                    width={343}
                    name={"event"}
                    placeholder={Dictionary.name + " " + Dictionary.happen}
                    className={Classes["add-input"]}
                  />
                </FormItemComponent>
                <FormItemComponent
                  name={"event_time"}
                  label={Dictionary.time + " " + Dictionary.happen}
                  rules={[
                    {
                      required: true,
                      message: Dictionary.require,
                    },
                  ]}
                >
                  <SelectComponent
                    width={343}
                    name="event_time"
                    placeholder={Dictionary.time + " " + Dictionary.happen}
                    items={EventTimeItems}
                    className={Classes["select-input"]}
                  />
                </FormItemComponent>
              </div>
              <div className={Classes["row"]}>
                <FormItemComponent
                  name="calculation_type"
                  label={Dictionary.calculationType}
                  rules={[
                    {
                      required: true,
                      message: Dictionary.require,
                    },
                  ]}
                >
                  <SelectComponent
                    width={343}
                    name="calculation_type"
                    placeholder={Dictionary.calculationType}
                    items={CalculationItems}
                    onChange={(e) => onChange(e, "calculation_var", "type")}
                    className={Classes["select-input"]}
                  />
                </FormItemComponent>
                <FormItemComponent
                  name="calculation_var"
                  label={Dictionary.value + " " + Dictionary.fee}
                  rules={[
                    {
                      required: true,
                      message: Dictionary.require,
                    },
                    {
                      pattern: /^[.0-9]+$/,
                      message: Dictionary.checkInput,
                    },
                  ]}
                >
                  <InputNumber
                    max={type !== "FIX" && 100}
                    controls={false}
                    formatter={(value) =>
                      value?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "343px" }}
                    name="calculation_var"
                    label={Dictionary.value + " " + Dictionary.fee}
                    className={`${inputClass["input-component"]} ${Classes["input-number"]}`}
                    prefix={type === "FIX" ? "﷼" : "%"}
                  />
                </FormItemComponent>
              </div>
              <div className={Classes["row"]}>
                <FormItemComponent
                  name="holder_type"
                  label={Dictionary.type + " " + Dictionary.source}
                  rules={[
                    {
                      required: true,
                      message: Dictionary.require,
                    },
                  ]}
                >
                  <SelectComponent
                    width={343}
                    name="holder_type"
                    placeholder={Dictionary.type + " " + Dictionary.source}
                    items={HolderItems}
                    className={Classes["select-input"]}
                    onChange={(e) =>
                      onChange(e, "holder_description", "holder")
                    }
                  />
                </FormItemComponent>
                <FormItemComponent
                  name="holder_description"
                  label={Dictionary.number + " " + Dictionary.source}
                  rules={[
                    {
                      required: true,
                      message: Dictionary.require,
                    },
                  ]}
                >
                  <InputComponent
                    width={343}
                    name="holder_description"
                    className={Classes["add-input"]}
                  />
                </FormItemComponent>
              </div>
            </FormComponent>
          </Panel>
          <Panel
            header={`${Dictionary.edit} ${Dictionary.beneficiary} ${Dictionary.ha}`}
            key={"yes"}
          >
            <FormComponent
              layout="vertical"
              form={form}
              ref={formRef}
              requiredMark={false}
              style={{ border: "none" }}
            >
              {record?.fee_sharing_response_dtos?.length > 0 && (
                <div>
                  {record?.fee_sharing_response_dtos?.map((item, index) => (
                    <div key={item.id} className={Classes["col"]}>
                      <div className={Classes["row"]}>
                        <FormItemComponent
                          name={"id_" + index}
                          label={Dictionary.code + " " + Dictionary.beneficiary}
                        >
                          <InputComponent
                            width={343}
                            disabled={true}
                            name={"id_" + index}
                            placeholder={
                              Dictionary.code + " " + Dictionary.beneficiary
                            }
                            className={Classes["add-input"]}
                          />
                        </FormItemComponent>
                        <div className={Classes["icon-part"]}>
                          <CustomIcon
                            src={Delete}
                            size={24}
                            name={`fee-${item.id}-delete-icon`}
                            onClick={() => handleRemove(item.id)}
                          />
                        </div>
                      </div>
                      <div className={Classes["row"]}>
                        <FormItemComponent
                          name={"title_" + index}
                          label={Dictionary.name + " " + Dictionary.beneficiary}
                          rules={[
                            {
                              required: true,
                              message: Dictionary.require,
                            },
                            { min: 2, max: 50, message: Dictionary.checkInput },
                          ]}
                        >
                          <InputComponent
                            width={343}
                            name={"title_" + index}
                            placeholder={
                              Dictionary.name + " " + Dictionary.beneficiary
                            }
                            className={Classes["add-input"]}
                            maxLength={50}
                          />
                        </FormItemComponent>
                        <FormItemComponent
                          name={"day_" + index}
                          label={Dictionary.numberOfSettlementDays}
                          rules={[
                            {
                              required: true,
                              message: Dictionary.require,
                            },
                            {
                              pattern: /^[0-9]+$/,
                              message: Dictionary.checkInput,
                            },
                          ]}
                        >
                          <InputNumber
                            controls={false}
                            style={{ width: "343px" }}
                            name={"day_" + index}
                            label={Dictionary.numberOfSettlementDays}
                            className={`${inputClass["input-component"]} ${Classes["input-number"]}`}
                            prefix={"روز"}
                            max={1000}
                            min={1}
                          />
                        </FormItemComponent>
                      </div>
                      <div className={Classes["row"]}>
                        <FormItemComponent
                          name={"calculation_type_" + index}
                          label={Dictionary.calculationType}
                          rules={[
                            {
                              required: true,
                              message: Dictionary.require,
                            },
                          ]}
                        >
                          <SelectComponent
                            width={343}
                            name={"calculation_type_" + index}
                            placeholder={Dictionary.calculationType}
                            disabled={index > 0}
                            items={CalculationItems}
                            onChange={(e) =>
                              onChange(
                                e,
                                `calculation_type_${index}`,
                                "type_fee"
                              )
                            }
                            className={Classes["select-input"]}
                          />
                        </FormItemComponent>
                        <FormItemComponent
                          name={"calculation_var_" + index}
                          label={Dictionary.value + " " + Dictionary.fee}
                          rules={[
                            {
                              required: true,
                              message: Dictionary.require,
                            },
                            {
                              pattern: /^[.0-9]+$/,
                              message: Dictionary.checkInput,
                            },
                          ]}
                        >
                          <InputNumber
                            controls={false}
                            max={type_fee !== "FIX" && 100}
                            formatter={(value) =>
                              value?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) =>
                              value?.replace(/\$\s?|(,*)/g, "")
                            }
                            style={{ width: "343px" }}
                            name={"calculation_var" + index}
                            label={Dictionary.value + " " + Dictionary.fee}
                            className={`${inputClass["input-component"]} ${Classes["input-number"]}`}
                            prefix={type_fee === "FIX" ? "﷼" : "%"}
                          />
                        </FormItemComponent>
                      </div>
                      <div className={Classes["row"]}>
                        <FormItemComponent
                          name={"holder_type_" + index}
                          label={Dictionary.type + " " + Dictionary.destination}
                          rules={[
                            {
                              required: true,
                              message: Dictionary.require,
                            },
                          ]}
                        >
                          <SelectComponent
                            width={343}
                            name={"holder_type_" + index}
                            placeholder={
                              Dictionary.type + " " + Dictionary.destination
                            }
                            items={HolderItems}
                            className={Classes["select-input"]}
                            onChange={(e) =>
                              onChange(
                                e,
                                "holder_description_" + index,
                                "holder_" + index
                              )
                            }
                          />
                        </FormItemComponent>
                        <FormItemComponent
                          name={"holder_description_" + index}
                          label={
                            Dictionary.number + " " + Dictionary.destination
                          }
                          rules={[
                            {
                              required: true,
                              message: Dictionary.require,
                            },
                          ]}
                        >
                          <InputComponent
                            width={343}
                            name={"holder_description_" + index}
                            label={
                              Dictionary.value + " " + Dictionary.destination
                            }
                            className={Classes["add-input"]}
                            maxLength={30}
                          />
                        </FormItemComponent>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div
                className={Classes["add-new-beneficiary"]}
                onClick={handleAdd}
              >
                <CustomIcon src={Add} />
                <p>
                  {Dictionary.add} {Dictionary.beneficiary} {Dictionary.new}
                </p>
              </div>
            </FormComponent>
          </Panel>
        </Collapse>
        <div ref={divEndRef} />
        <FormItemComponent
          shouldUpdate
          button
          className={Classes["edit-fee-buttons"]}
        >
          <ButtonComponent
            type="primary"
            htmlType="submit"
            classNameBtn={Classes["confirm-button"]}
            onClick={onFinish}
          >
            {Dictionary.confirm}
          </ButtonComponent>
          <ButtonComponent
            type="default"
            classNameBtn={Classes["cancel-button"]}
            onClick={closeModal}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </div>
    </ModalComponent>
  );
};

export default EditFeeModal;
