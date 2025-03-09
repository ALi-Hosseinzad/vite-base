import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dictionary from "helpers/Dictionary";
import { Form, Space, Typography } from "antd";
import Classes from "views/listCards/styles/EditCard.module.scss";
import InputComponent from "components/input/InputComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import Warning from "assets/images/icon/Warning.svg";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import { listCards } from "store/reducers/listCards/listCardsReducer";
import SuccessfulEditCard from "./SuccessfulEditCard";
import { useEffect } from "react";
import { updateRawCard } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";

const EditCard = () => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const listCardsData = useSelector((state) => state.listCards.value);
  const errorHandler = useErrorHandler();

  const onFinish = (values) => {
    updateRawCard({
      old_pan: listCardsData.record.pan,
      new_pan: values.cardNumber,
    })
      .then((res) =>
        dispatch(
          listCards({
            successEdit: true,
            newPan: res.data.pan,
            update: !listCardsData.update,
          })
        )
      )
      .catch(() => errorHandler(errorResponse));
  };
  useEffect(() => {
    if (listCardsData.record) {
      form.setFieldsValue({ cardNumber: listCardsData.record.pan });
    }
  }, [listCardsData.editModal]);

  return (
    <Fragment>
      {!listCardsData.successEdit ? (
        <Form
          className={Classes["edit-card-form"]}
          layout="vertical"
          form={form}
          onFinish={onFinish}
          requiredMark={false}
        >
          <Space className={Classes["edit-card-space"]}>
            <CustomIcon src={Warning} size={24} name="edit-card-space-icon" />
            <Text className={Classes["edit-card-text"]}>
              {Dictionary.cardNumberWarning}
            </Text>
          </Space>
          <FormItemComponent
            name="cardNumber"
            className={Classes["edit-card-form-item"]}
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                min: 16,
                message: Dictionary.size,
              },
              {
                max: 16,
                message: Dictionary.size,
              },
              {
                pattern: /^[0-9]+$/,
                message: Dictionary.onlyNumber,
              },
            ]}
          >
            <InputComponent
              width={343}
              name="cardNumber"
              prefix={<Text>{Dictionary.previousCard}</Text>}
              maxLength={16}
              className={Classes["edit-card-form-input"]}
            />
          </FormItemComponent>
          <FormItemComponent button={true}>
            <ButtonComponent
              type="primary"
              htmlType="submit"
              // onClick={onFinish}
              // disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
            >
              {Dictionary.confirm}
            </ButtonComponent>
            <ButtonComponent
              type="default"
              onClick={() => dispatch(listCards({ editModal: false }))}
              classNameBtn={Classes["edit-card-form-btn"]}
            >
              {Dictionary.cancel}
            </ButtonComponent>
          </FormItemComponent>
        </Form>
      ) : (
        <SuccessfulEditCard />
      )}
    </Fragment>
  );
};
export default EditCard;
