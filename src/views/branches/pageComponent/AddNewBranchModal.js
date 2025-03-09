import React, { useEffect, useRef, useState } from "react";
import { Col, Divider, Form, Radio, Row, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { listBranches } from "store/reducers/listBranches/listBranchesReducer";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputComponent from "components/input/InputComponent";
import ButtonComponent from "components/button/ButtonComponent";
import Dictionary from "helpers/Dictionary";
import Classes from "../styles/Branches.module.scss";
import ChipComponent from "components/chipComponent/ChipComponent";
import { addBranch, getAllProvince, updateBranch } from "helpers/APIFunction";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { Input } from "antd";
import CustomIcon from "components/customIcon/CustomIcon";
import DropDown from "assets/images/icon/DropDown.svg";
import SearchIcon from "assets/images/icon/Search.svg";
const AddNewBranchModal = () => {
  const dispatch = useDispatch();
  const [focus, setFocus] = useState(false);
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const formRef = useRef();
  const listBranchesData = useSelector((state) => state.listBranches.value);
  const [value, setValue] = useState(1);
  const [services, setServices] = useState(new Set());
  const errorHandler = useErrorHandler();
  const onChange = (e) => {
    setValue(e.target.value);
    if (e.target.value === 2) {
      form.setFieldValue("ipAllowed", "");
    } else {
      form.setFieldValue("ipFrom", "");
      form.setFieldValue("ipTo", "");
    }
  };
  const submit = (values) => {
    if (listBranchesData.edit) {
      updateBranch({
        branch_code: values.branchCode,
        branch_name: values.branchName,
        address: values.address,
        postal_code: values.postalCode,
        province_code: values.province,
        region: values.region,
        atm_count: values.atmCount,
        fax: values.fax,
        phone: values.tel.split("-"),
        latitude: values.latitude,
        longitude: values.longitude,
        is_enabled: listBranchesData.record.isEnabled,
        branch_ministration_keys: Array.from(services),
        start_ip: values.ipFrom,
        end_ip: values.ipTo,
        list_ip: values.ipAllowed.split("-"),
      })
        .then(() =>
          dispatch(
            listBranches({
              addModal: false,
              reload: !listBranchesData.reload,
              edit: false,
            })
          )
        )
        .catch(() => errorHandler(errorResponse));
    } else {
      addBranch({
        branch_code: values.branchCode,
        branch_name: values.branchName,
        address: values.address,
        postal_code: values.postalCode,
        province_code: values.province,
        region: values.region,
        atm_count: values.atmCount,
        fax: values.fax,
        phone: values.tel.split("-"),
        latitude: values.latitude,
        longitude: values.longitude,
        is_enabled: true,
        branch_ministration_keys: Array.from(services),
        start_ip: values.ipFrom,
        end_ip: values.ipTo,
        list_ip: values.ipAllowed.split("-"),
      })
        .then(() =>
          dispatch(
            listBranches({ addModal: false, reload: !listBranchesData.reload })
          )
        )
        .catch(() => errorHandler(errorResponse));
    }
  };
  useEffect(() => {
    setServices(new Set());
    if (listBranchesData.edit) {
      form.setFieldsValue({
        branchName: listBranchesData.record?.branchName,
        branchCode: listBranchesData.record?.branchCode,
        region: listBranchesData.record?.region,
        province: listBranchesData.record?.province_code,
        address: listBranchesData.record?.address,
        postalCode: listBranchesData.record?.postal_code,
        tel: listBranchesData.record?.phone.join("-"),
        fax: listBranchesData.record?.fax,
        longitude: listBranchesData.record?.longitude,
        latitude: listBranchesData.record?.latitude,
        ipAllowed: listBranchesData.record?.list_ip?.join("-"),
        ipFrom: listBranchesData.record?.start_ip,
        ipTo: listBranchesData.record?.end_ip,
        atmCount: listBranchesData.record?.atmCount,
      });
      const copy = new Set(services);
      listBranchesData.record.services.map((s) =>
        copy.add(s.branch_ministration_key)
      );
      setServices(copy);
      if (listBranchesData.record?.list_ip.length !== 0) {
        setValue(1);
      } else {
        setValue(2);
      }
    } else {
      form.resetFields();
    }
  }, [listBranchesData.addModal]);
  useEffect(() => {
    if (listBranchesData.province?.length === 0) {
      getAllProvince({
        offset: "0",
        count: "1000",
        sortBy: "faName",
        criteria: {},
      })
        .then((res) => {
          const convert = res.data.data.map((i) => {
            return { id: i.id, value: i.province_code, label: i.fa_name };
          });
          dispatch(listBranches({ province: convert }));
        })
        .catch(() => errorHandler(errorResponse));
    }
  }, []);
  return (
    <FormComponent
      className={Classes["modalForm"]}
      layout="vertical"
      form={form}
      onFinish={submit}
      ref={formRef}
    >
      <Row>
        <Col span={10} offset={1}>
          <FormItemComponent
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                pattern: /^[\u0600-\u06FF\s]+$/,
                message: Dictionary.checkInput,
              },
            ]}
            name="branchName"
            label={`${Dictionary.name} ${Dictionary.branch}`}
          >
            <InputComponent
              className={Classes["inputModal"]}
              width={343}
              placeholder={`${Dictionary.name} ${Dictionary.branch}`}
              name="branch-name"
            />
          </FormItemComponent>
        </Col>
        <Col span={10} offset={2}>
          <FormItemComponent
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
            name="branchCode"
            label={Dictionary.branchCode}
          >
            <InputComponent
              className={Classes["inputModal"]}
              width={343}
              placeholder={Dictionary.branchCode}
              name="branch-code"
            />
          </FormItemComponent>
        </Col>
      </Row>
      <Row>
        <Col span={10} offset={1}>
          <FormItemComponent
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
            name="region"
            label={`${Dictionary.region}`}
          >
            <InputComponent
              className={Classes["inputModal"]}
              width={343}
              placeholder={`${Dictionary.region}`}
              name="card-from"
            />
          </FormItemComponent>
        </Col>
        <Col span={10} offset={2}>
          <FormItemComponent
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
            ]}
            name="province"
            label={`${Dictionary.province}`}
          >
            <Select
              name="province"
              showSearch
              style={{ width: 343, height: 48 }}
              className={Classes["province-select"]}
              placeholder={Dictionary.selectProvince}
              suffixIcon={
                <CustomIcon
                  src={focus ? SearchIcon : DropDown}
                  size={20}
                  name="drop-down-icon-branch-province"
                  color="#2B9570"
                />
              }
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={listBranchesData.province}
            />
          </FormItemComponent>
        </Col>
      </Row>
      <Row>
        <Col span={10} offset={1}>
          <FormItemComponent
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                pattern: /[^a-zA-Z]+$/,
                message: Dictionary.checkInput,
              },
            ]}
            name="address"
            label={`${Dictionary.address}`}
          >
            <TextArea
              className={Classes["textArea"]}
              placeholder={`${Dictionary.address} ${Dictionary.branch}`}
            />
          </FormItemComponent>
        </Col>
        <Col span={10} offset={2}>
          <FormItemComponent
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                pattern: /^[0-9]+$/,
                message: Dictionary.checkInput,
              },
              {
                max: 10,
                message: Dictionary.checkInput,
              },
              {
                min: 10,
                message: Dictionary.checkInput,
              },
            ]}
            name="postalCode"
            label={`${Dictionary.postalCode}`}
          >
            <TextArea
              className={`${Classes["textArea"]} ${Classes["textAreaNumber"]}`}
              placeholder={`${Dictionary.postalCode} ${Dictionary.branch}`}
            />
          </FormItemComponent>
        </Col>
      </Row>
      <Row>
        <Col span={10} offset={1}>
          <FormItemComponent
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                pattern: /^[0-9-]+$/,
                message: Dictionary.checkInput,
              },
            ]}
            name="tel"
            label={Dictionary.phone}
          >
            <InputComponent
              className={`${Classes["inputModal"]} ${Classes["inputNumber"]}`}
              width={343}
              placeholder={`02112345678-02112345679`}
              name="tel"
            />
          </FormItemComponent>
        </Col>
        <Col span={10} offset={2}>
          <FormItemComponent
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                max: 11,
                message: Dictionary.checkInput,
              },
              {
                pattern: /^[0-9]+$/,
                message: Dictionary.checkInput,
              },
            ]}
            name="fax"
            label={`${Dictionary.fax}`}
          >
            <InputComponent
              className={`${Classes["inputModal"]} ${Classes["inputNumber"]}`}
              width={343}
              placeholder={`02112345678`}
              name="fax"
            />
          </FormItemComponent>
        </Col>
      </Row>
      <Row>
        <Col span={10} offset={1}>
          <FormItemComponent
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                pattern: /^[0-9]{1,2}\.[0-9]{1,7}?$/,
                message: Dictionary.checkInput,
              },
            ]}
            name="longitude"
            label={`${Dictionary.longitude}`}
          >
            <InputComponent
              className={Classes["inputModal"]}
              width={343}
              placeholder={`${Dictionary.longitude}`}
              name="longitude"
            />
          </FormItemComponent>
        </Col>
        <Col span={10} offset={2}>
          <FormItemComponent
            rules={[
              {
                required: true,
                message: Dictionary.require,
              },
              {
                pattern: /^[0-9]{1,2}\.[0-9]{1,7}?$/,
                message: Dictionary.checkInput,
              },
            ]}
            name="latitude"
            label={`${Dictionary.latitude}`}
          >
            <InputComponent
              className={Classes["inputModal"]}
              width={343}
              placeholder={`${Dictionary.latitude}`}
              name="latitude"
            />
          </FormItemComponent>
        </Col>
      </Row>

      <Divider />

      <Radio.Group onChange={onChange} value={value} style={{ width: "100%" }}>
        <Row>
          <Col offset={1}>
            <Radio value={1}>
              <FormItemComponent
                name="ipAllowed"
                label={`IP ${Dictionary.allowed}`}
                rules={[
                  {
                    pattern: /^[0-9-.]+$/,
                    message: Dictionary.checkInput,
                  },
                ]}
              >
                <InputComponent
                  className={`${Classes["inputModal"]} ${Classes["inputNumber"]}`}
                  width={311}
                  placeholder={`10.154.6.10-1.123.5.62`}
                  name="ipAllowed"
                  disabled={value === 1 ? false : true}
                />
              </FormItemComponent>
            </Radio>
          </Col>
          <Col offset={2}>
            <Radio value={2}>
              <Row>
                <Col>
                  <FormItemComponent
                    name="ipFrom"
                    label={`IP ${Dictionary.allowed} ${Dictionary.from}`}
                    rules={[
                      {
                        pattern:
                          /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/,
                        message: Dictionary.checkInput,
                      },
                    ]}
                  >
                    <InputComponent
                      className={`${Classes["inputModal"]} ${Classes["inputNumber"]}`}
                      width={147}
                      placeholder={`1.123.5.62`}
                      name="ipFrom"
                      disabled={value === 2 ? false : true}
                    />
                  </FormItemComponent>
                </Col>
                <Col>
                  <FormItemComponent
                    className={`${Classes["inputModal-mr2"]}`}
                    name="ipTo"
                    label={`${Dictionary.to}`}
                    rules={[
                      {
                        pattern:
                          /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/,
                        message: Dictionary.checkInput,
                      },
                    ]}
                  >
                    <InputComponent
                      className={`${Classes["inputModal"]} ${Classes["inputNumber"]}`}
                      width={147}
                      placeholder={`1.123.5.62`}
                      name="ipTo"
                      disabled={value === 2 ? false : true}
                    />
                  </FormItemComponent>
                </Col>
              </Row>
            </Radio>
          </Col>
        </Row>
      </Radio.Group>

      <Divider />

      <div className={Classes["servicesTag"]}>
        <p className={Classes["service-title"]}>{Dictionary.services}</p>
        {listBranchesData.services.map((s) => (
          <div
            onClick={() => {
              const copy = new Set(services);
              if (services.has(s.key)) {
                copy.delete(s.key);
                setServices(copy);
              } else {
                copy.add(s.key);
                setServices(copy);
              }
            }}
          >
            <ChipComponent toggle active={services.has(s.key)}>
              {s.text}
            </ChipComponent>
          </div>
        ))}
      </div>
      <Row>
        <Col span={10} offset={1}>
          {services.has("ATM") && (
            <FormItemComponent
              rules={[
                {
                  required: true,
                  message: Dictionary.require,
                },
                { pattern: /^[0-9]+$/, message: Dictionary.checkInput },
              ]}
              name="atmCount"
              label={`${Dictionary.atmCount}`}
            >
              <InputComponent
                className={Classes["inputModal"]}
                width={343}
                placeholder={`${Dictionary.atmCount}`}
                name="atmCount"
              />
            </FormItemComponent>
          )}
        </Col>
      </Row>
      <FormItemComponent className={Classes["branchModalButton"]}>
        <ButtonComponent
          classNameBtn={Classes["confirmBtn"]}
          type="primary"
          htmlType="submit"
        >
          {Dictionary.confirm}
        </ButtonComponent>
        <ButtonComponent
          classNameBtn={Classes["cancelBtn"]}
          type="default"
          onClick={() =>
            dispatch(listBranches({ addModal: false, edit: false }))
          }
        >
          {Dictionary.cancel}
        </ButtonComponent>
      </FormItemComponent>
    </FormComponent>
  );
};

export default AddNewBranchModal;
