import React, { useEffect } from "react";
import { Form } from "antd";
import Dictionary from "helpers/Dictionary";
import { errorResponse } from "helpers/APIService";
import useErrorHandler from "helpers/useErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import {
  getAllCitiesAndProvinces,
  updateRawCardCity,
} from "helpers/APIFunction";
import {
  listCards,
  listCardsState,
} from "store/reducers/listCards/listCardsReducer";
import Classes from "views/listCards/styles/SelectCityOrProvinceCardModal.module.scss";

const SelectCityOrProvinceModal = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const listCardsData = useSelector(listCardsState);
  const { record, showSelectModal, citiesAndProvinces, cityCode, loading } =
    listCardsData;

  useEffect(() => {
    if (citiesAndProvinces.length === 0) {
      getAllCitiesAndProvinces()
        .then((res) => {
          dispatch(listCards({ loading: true }));
          const convertList = [];
          res?.data?.forEach((node) => {
            const convertObj = {
              id: node.id,
              text: node.name,
              value: node.code,
            };
            convertList.push(convertObj);
          });
          dispatch(
            listCards({ citiesAndProvinces: convertList, loading: false })
          );
        })
        .catch(() => {
          errorHandler(errorResponse);
          dispatch(listCards({ loading: false }));
        });
    }
  }, []);

  const onFinish = () => {
    updateRawCardCity({
      city_code: cityCode,
      reference_number: record.referenceNumber,
      identification_code: record.identificationCode,
      from_account_creation: record.from_account_creation,
      city_name: citiesAndProvinces.find((elm) => elm.value === cityCode)?.text,
    })
      .then(() => {
        dispatch(
          listCards({
            showSelectModal: !showSelectModal,
            update: !listCardsData.update,
            record: "",
            cityCode: "",
          })
        );
        form.resetFields();
      })
      .catch(() => errorHandler(errorResponse));
  };

  const onClose = () => {
    form.resetFields();
    dispatch(listCards({ showSelectModal: false, record: "", cityCode: "" }));
  };

  return (
    <ModalComponent
      width={842}
      maskClosable={false}
      onCancel={onClose}
      open={showSelectModal}
      title={Dictionary.select + " " + Dictionary.cityOrProvince}
    >
      <div className={Classes["eyeModalContainer"]}>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.cardNumber}</p>
          <p>{record?.pan || "--"}</p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.fullName}</p>
          <p>{record?.fullName || "--"}</p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.nationalId}</p>
          <p>{record?.identificationCode || "--"}</p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.traceCode}</p>
          <p>{record?.referenceNumber || "--"}</p>
        </div>
        <div className={Classes["eyeRow"]}>
          <p>{Dictionary.postalCode}</p>
          <p>{record?.postalCode || "--"}</p>
        </div>
        {record?.address && (
          <div>
            <p className={Classes["address"]}>
              {Dictionary.address}: <span>{record?.address}</span>
            </p>
          </div>
        )}
        {record?.address_description && (
          <div>
            <p className={Classes["address"]}>
              {Dictionary.description} {Dictionary.address}:{" "}
              <span>{record?.address_description}</span>
            </p>
          </div>
        )}
      </div>
      <Form
        className={Classes["select-card-form"]}
        layout="vertical"
        form={form}
        onFinish={onFinish}
        requiredMark={false}
      >
        <div className={Classes["select-card-space"]}>
          <p className={Classes["select-card-text"]}>
            {Dictionary.pleaseSearch}
          </p>
        </div>
        <FormItemComponent
          name="cityCode"
          className={Classes["select-card-form-item"]}
          rules={[{ required: true, message: Dictionary.require }]}
        >
          <SelectComponent
            width={440}
            name="cityCode"
            loading={loading}
            showSearch={true}
            items={citiesAndProvinces}
            placeholder={Dictionary.chooseOne}
            className={Classes["select-card-form-select"]}
            onChange={(e) => dispatch(listCards({ cityCode: e }))}
            // dropdownAlign={citiesAndProvinces.length > 0 ? { offset: [0, -310] } : { offset: [0, -144] }}
          />
        </FormItemComponent>
        <FormItemComponent
          button={true}
          className={Classes["select-card-btn-part"]}
        >
          <ButtonComponent type="primary" htmlType="submit">
            {Dictionary.select} {Dictionary.cityOrProvince}
          </ButtonComponent>
          <ButtonComponent
            type="default"
            onClick={onClose}
            classNameBtn={Classes["select-card-form-btn"]}
          >
            {Dictionary.cancel}
          </ButtonComponent>
        </FormItemComponent>
      </Form>
    </ModalComponent>
  );
};
export default SelectCityOrProvinceModal;
