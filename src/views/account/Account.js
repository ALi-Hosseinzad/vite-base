import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Row, Space, Typography } from "antd";
import TableComponent from "components/table/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import HeaderPage from "components/headerPage/HeaderPage";
import ButtonComponent from "components/button/ButtonComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import FormComponent from "components/form/FormComponent";
import Classes from "./styles/ListAccount.module.scss";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import TooltipComponent from "components/tooltip/TooltipComponent";
import CheckboxComponent from "components/checkbox/CheckboxComponent";
import {
  addAccountsNumberToAccount,
  getAccountsList,
} from "helpers/APIFunction";
import { account, resetAccount } from "store/reducers/account/accountReducer";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import { nationalCodeValidation } from "helpers/nationalIdValidation";
import InputComponent from "components/input/InputComponent";
import { MatchAuthority } from "helpers/MatchAuthority";

console.log(asdfsadf);

const Accounts = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [ownerForm] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParam] = useState(Object.fromEntries([...searchParams]));
  const [isLoading, setIsLoading] = useState(false);
  const accountData = useSelector((state) => state.account.value);
  const userInfoData = useSelector((state) => state.userInfo.value);
  const { Text } = Typography;

  useEffect(() => {
    dispatch(resetAccount());
  }, []);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        account({
          permissions: {
            edit:
              MatchAuthority(
                userInfoData.authorities,
                "Get:/api/bo/account/account-info/{identificationCode}/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/account/v1"
              ),
            view: MatchAuthority(
              userInfoData.authorities,
              "Get:/api/bo/account/account-info/{identificationCode}/v1"
            ),
          },
        })
      );
    } else {
      dispatch(
        account({
          permissions: {
            edit: true,
            view: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);
  useEffect(() => {
    if (queryParam.idCode) {
      form.setFieldsValue({ idCode: queryParam.idCode });
      dispatch(account({ showDeleteBtn: true }));
    } else {
      dispatch(account({ showDeleteBtn: false }));
    }
  }, [queryParam]);

  useEffect(() => {
    ownerForm.setFieldsValue({
      idLeader: accountData.leader_identification_code,
      idStampOwner: accountData.stamp_owner_identification_code,
    });
  }, [accountData]);

  const columns = [
    {
      key: "status",
      dataIndex: "status",
      width: 70,
      render: (_text, record) =>
        accountData.permissions?.edit ? (
          <div className={Classes["account-status"]}>
            <TooltipComponent title={Dictionary.add}>
              <CheckboxComponent
                defaultChecked={record?.enable !== null}
                onChange={() => handleCheck(record)}
              />
            </TooltipComponent>
          </div>
        ) : (
          ""
        ),
    },
    {
      key: "status",
      dataIndex: "status",
      width: 150,
      render: (_text, record) => (
        <div
          className={
            record?.enable === null
              ? Classes["deactive-status-badge"]
              : record?.enable === false
              ? Classes["wait-status-badge"]
              : record?.enable === true
              ? Classes["active-status-badge"]
              : ""
          }
        >
          {record?.enable === null
            ? Dictionary.waitForActivate
            : record?.enable === false
            ? Dictionary.waitForCustomerAception
            : record?.enable === true
            ? Dictionary.activeInPlatform
            : ""}
        </div>
      ),
    },
    {
      title: Dictionary.accNo,
      key: "accountNumber",
      dataIndex: "accountNumber",
      width: "12%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: Dictionary.type + " " + Dictionary.account,
      key: "accountType",
      dataIndex: "accountType",
      width: "20%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title:
        Dictionary.type + " " + Dictionary.ownership + " " + Dictionary.account,
      key: "ownership",
      dataIndex: "ownership",
      width: "15%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: `${Dictionary.owner} ${Dictionary.account}`,
      key: "owner",
      dataIndex: "owner",
      width: "8%",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
    {
      title: Dictionary.branch,
      key: "branch",
      dataIndex: "branch",
      render: (text) => {
        if (text === null) return Dictionary.notValid;
        else return text;
      },
    },
  ];
  const getAllAccounts = (values) => {
    setIsLoading(true);
    if (values) {
      dispatch(account({ idCode: values.idCode }));
      getAccountsList({
        identificationCode: values.idCode,
        customerType: values.idCode.length === 11 ? "CID" : "NID",
      })
        .then((res) => {
          const convert = res?.data?.client_account_dto_list?.map((node) => {
            return {
              accountNumber: node.account_no,
              owner: node.account_description,
              status: node.account_owner_ship_type,
              ownership: node.account_owner_ship_type_description,
              accountType: node.account_type_description,
              branch: node.branch_code_description,
              enable: node.activation_status,
            };
          });
          dispatch(
            account({
              list: convert,
              showDeleteBtn: true,
              ownershipType: values.idCode.length === 11 ? "CID" : "NID",
              leader_identification_code: res.data?.leader_identification_code,
              stamp_owner_identification_code:
                res.data?.stamp_owner_identification_code,
              leader_name: res.data?.leader_name,
              stamp_owner_name: res.data?.stamp_owner_name,
              responseAccount: res?.data?.client_account_dto_list
                ?.filter((item) => item.activation_status !== null)
                .map((node) => node.account_no),
              reload: !accountData.reload,
              is_active_corporate_customer:
                res.data?.is_active_corporate_customer,
              is_corporate_customer: res.data?.is_corporate_customer,
            })
          );
          setSearchParams(values);
        })
        .catch(() => {
          errorHandler(errorResponse);
        });
      setIsLoading(false);
    } else {
      setIsLoading(false);
      dispatch(
        setNotificationData({
          message: "یک مورد انتخاب  کنید",
          type: "error",
          time: 5000,
        })
      );
    }
  };

  const onFinish = (values) => {
    dispatch(resetAccount({ permissions: accountData.permissions }));
    getAllAccounts(values);
  };

  const resetSearch = () => {
    setSearchParams();
    dispatch(resetAccount({}));
    form.resetFields();
  };
  const handleCheck = (num) => {
    if (accountData.responseAccount.includes(num.accountNumber)) {
      if (accountData.removeAccount.includes(num.accountNumber)) {
        dispatch(
          account({
            removeAccount: accountData.removeAccount.filter(
              (item) => item !== num.accountNumber
            ),
            showSubmit: true,
          })
        );
      } else {
        dispatch(
          account({
            removeAccount: [...accountData.removeAccount, num.accountNumber],
            showSubmit: true,
          })
        );
      }
    } else {
      if (accountData.addAccount.includes(num.accountNumber)) {
        dispatch(
          account({
            addAccount: accountData.addAccount.filter(
              (item) => item !== num.accountNumber
            ),
            showSubmit: true,
          })
        );
      } else {
        dispatch(
          account({
            addAccount: [...accountData.addAccount, num.accountNumber],
            showSubmit: true,
          })
        );
      }
    }
  };
  const setIsLegal = (state) => {
    dispatch(
      account({ showSubmit: true, is_active_corporate_customer: state })
    );
  };
  const onClick = () => {
    if (accountData.showSubmit) {
      setIsLoading(true);
      if (accountData.idCode.length === 10) {
        addAccountsNumberToAccount({
          customer_type: "NID",
          identification_code: accountData.idCode,
          account_numbers: accountData.addAccount,
          delete_account_numbers: accountData.removeAccount,
        })
          .then(() => {
            dispatch(account({ removeAccount: [], addAccount: [] }));
            dispatch(
              setNotificationData({
                message: Dictionary.successfulChanges,
                type: "success",
                time: 3000,
              })
            );
            onFinish(accountData);
          })
          .catch(() => {
            errorHandler(errorResponse);
          });
      } else if (accountData.idCode.length === 11) {
        if (
          (accountData.leader_identification_code &&
            accountData.stamp_owner_identification_code) ||
          accountData.is_active_corporate_customer
        ) {
          addAccountsNumberToAccount({
            customer_type: "CID",
            identification_code: accountData.idCode,
            leader_identification_code: accountData.leader_identification_code,
            stamp_owner_identification_code:
              accountData.stamp_owner_identification_code,
            account_numbers: accountData.addAccount,
            delete_account_numbers: accountData.removeAccount,
            is_active_corporate_customer:
              accountData.is_active_corporate_customer,
          })
            .then(() => {
              dispatch(account({ removeAccount: [], addAccount: [] }));
              dispatch(
                setNotificationData({
                  message: Dictionary.successfulChanges,
                  type: "success",
                  time: 3000,
                })
              );
              onFinish(accountData);
            })
            .catch(() => {
              errorHandler(errorResponse);
            });
        } else {
          dispatch(
            setNotificationData({
              message: Dictionary.checkIdentificationsAndLegal,
              type: "error",
              time: 5000,
            })
          );
        }
      }
      setIsLoading(false);
    }
  };
  return (
    <div>
      <HeaderPage title={Dictionary.manageAndAddAccount} />
      <FormComponent
        layout="inline"
        onFinish={onFinish}
        form={form}
        ref={formRef}
        className={Classes["account-search-bar"]}
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
              max: 11,
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
            maxLength={11}
            className={Classes["account-search-bar-input"]}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["account-search-bar-btn"]}>
          {accountData.showDeleteBtn && (
            <ButtonComponent
              onClick={resetSearch}
              htmlType="button"
              type="text-danger"
            >
              {Dictionary.clean}
            </ButtonComponent>
          )}
          <ButtonComponent
            classNameBtn={Classes["account-search-btn"]}
            type="primary"
            htmlType={Dictionary.search}
            loading={isLoading}
          >
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
      {accountData.idCode.length === 11 && (
        <FormComponent
          layout="vertical"
          form={ownerForm}
          className={Classes["identification-admin-stamp"]}
          requiredMark={false}
        >
          <FormItemComponent
            label={Dictionary.adminIdentification}
            name="idLeader"
            rules={[
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
            <InputComponent
              maxLength={10}
              name="idLeader"
              placeholder={Dictionary.adminIdentification}
              onChange={(e) =>
                dispatch(
                  account({
                    leader_identification_code: e.target.value,
                    showSubmit: true,
                  })
                )
              }
              disabled={!accountData.permissions?.edit}
            />
          </FormItemComponent>
          <Text className={Classes["admin-identification"]}>
            {accountData.leader_name}
          </Text>
          <FormItemComponent
            label={Dictionary.stampOwnerIdentification}
            name="idStampOwner"
            rules={[
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
            <InputComponent
              maxLength={10}
              name="idStampOwner"
              placeholder={Dictionary.stampOwnerIdentification}
              onChange={(e) =>
                dispatch(
                  account({
                    stamp_owner_identification_code: e.target.value,
                    showSubmit: true,
                  })
                )
              }
              disabled={!accountData.permissions?.edit}
            />
          </FormItemComponent>
          <Text className={Classes["stamp-identification"]}>
            {accountData.stamp_owner_name}
          </Text>
          {accountData?.is_corporate_customer && (
            <FormItemComponent
              label={Dictionary.loginAsCorporateCustomer}
              className={Classes["login-as-corporate"]}
            >
              <CheckboxComponent
                defaultChecked={accountData?.is_active_corporate_customer}
                onChange={setIsLegal}
              />
            </FormItemComponent>
          )}
        </FormComponent>
      )}
      {accountData.list?.length > 0 && (
        <TableComponent
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          columns={columns}
          dataSource={accountData.list}
          loading={isLoading}
        />
      )}
      {accountData.list?.length > 0 &&
        accountData.showSubmit &&
        accountData.permissions?.edit && (
          <Row style={{ justifyContent: "end", marginTop: "16px" }}>
            <Col flex="176px">
              <Space
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <ButtonComponent
                  classNameBtn={Classes["account-search-btn"]}
                  type="primary"
                  htmlType={"confirm"}
                  loading={isLoading}
                  onClick={onClick}
                >
                  {Dictionary.confirm}
                </ButtonComponent>
                <ButtonComponent
                  classNameBtn={Classes["account-search-btn"]}
                  type="default"
                  htmlType={Dictionary.cancel}
                  loading={isLoading}
                  onClick={resetSearch}
                >
                  {Dictionary.cancel}
                </ButtonComponent>
              </Space>
            </Col>
          </Row>
        )}
    </div>
  );
};

export default Accounts;
