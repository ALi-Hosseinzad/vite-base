import React, { useEffect, useRef, useState } from "react";
import {
  getSpecificationGroup,
  getSpecificationsList,
} from "helpers/APIFunction";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import useErrorHandler from "helpers/useErrorHandler";
import { useNavigate, useSearchParams } from "react-router-dom";
import { errorResponse } from "helpers/APIService";
import TableComponent from "components/table/TableComponent";
import Dictionary from "helpers/Dictionary";
import Edit from "assets/images/icon/Edit.svg";
import TooltipComponent from "components/tooltip/TooltipComponent";
import CustomIcon from "components/customIcon/CustomIcon";
import Classes from "views/specification/styles/Specification.module.scss";
import HeaderPage from "components/headerPage/HeaderPage";
import FormComponent from "components/form/FormComponent";
import FormItemComponent from "components/formItem/FormItemComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import ButtonComponent from "components/button/ButtonComponent";
import PaginationComponent from "components/pagination/PaginationComponent";
import Variables from "assets/styles/_Variables.scss";
import { setNotificationData } from "store/reducers/toast/toastReducer";
import {
  resetSpecification,
  specification,
  specificationState,
} from "store/reducers/specification/specificationReducer";
import { userInfoState } from "store/reducers/userInfo/UserInfoReducer";
import EmptyTablePlaceHolder from "assets/images/placeholder/EmptyTablePlaceHolder.svg";
import Visible from "assets/images/icon/VisibleGrey.svg";
import ShowDetailModal from "./pageComponent/ShowDetailModal";
import EditRecordModal from "./pageComponent/EditRecordModal";
import DeleteRedisCacheModal from "./pageComponent/DeleteRedisCacheModal";
import { MatchAuthority } from "helpers/MatchAuthority";

const Specification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const specificationData = useSelector(specificationState);
  const userInfoData = useSelector(userInfoState);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParamRecordsPerPage =
    searchParams.get("recordsPerPage") >= 50
      ? 50
      : Number(searchParams.get("recordsPerPage"));
  const [pagination, setPagination] = useState({
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    recordsPerPage: queryParamRecordsPerPage || 10,
  });

  useEffect(() => {
    dispatch(resetSpecification());
  }, []);

  // useEffect(() => {
  //   if (userInfoData.username) {
  //     if (userInfoData.username !== "admin") {
  //       dispatch(setNotificationData({ message: Dictionary.accessPage, type: "error", time: 5000 }));
  //       navigate("/home");
  //     }
  //   }
  // }, [userInfoData.username]);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        specification({
          permissions: {
            view:
              MatchAuthority(
                userInfoData.authorities,
                "Post:/api/bo/specification-item/search/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Get:/specification-group/all/v1"
              ),
            edit: MatchAuthority(
              userInfoData.authorities,
              "Put:/api/bo/specification-item/v1"
            ),
            deleteCache: MatchAuthority(
              userInfoData.authorities,
              "Delete:/api/bo/specification-item/delete-all-redis-data/v1"
            ),
          },
        })
      );
    } else {
      dispatch(
        specification({
          permissions: {
            view: true,
            edit: true,
            deleteCache: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  useEffect(() => {
    let newQueryParam = {
      pageNumber: pagination.pageNumber,
      recordsPerPage: pagination.recordsPerPage,
    };
    for (const [key, value] of searchParams.entries()) {
      if (key !== "pageNumber" && key !== "recordsPerPage") {
        newQueryParam[key] = value;
      }
    }
    setSearchParams(newQueryParam);
  }, [pagination.pageNumber, pagination.recordsPerPage]);

  useEffect(() => {
    if (
      searchParams.get("rfSpecificationGroup") ||
      searchParams.get("itemName") ||
      searchParams.get("itemValue")
    ) {
      createTable();
    }
  }, [searchParams, specificationData.reload]);

  const onPaginationHandler = (pageNumber, recordsPerPage) => {
    const newQueryParam = {
      pageNumber: pageNumber,
      recordsPerPage: recordsPerPage,
    };
    setPagination(newQueryParam);
  };

  const createSearchObject = (params) => {
    const criteria = [];
    for (const [key, value] of params.entries()) {
      if (key === "rfSpecificationGroup") {
        criteria.push({
          key: key,
          value: Number(value),
          operation: "equals",
        });
      } else if (key === "itemName" || key === "itemValue") {
        criteria.push({
          key: key,
          value: value,
          operation: "contains",
        });
      }
    }
    return {
      offset: `${
        (params.get("pageNumber") - 1) * params.get("recordsPerPage")
      }`,
      count: `${params.get("recordsPerPage")}`,
      criteria: {
        operation: "and",
        criteria: criteria,
      },
    };
  };

  const onFinish = async (values) => {
    Object.keys(values).forEach(
      (key) =>
        (values[key] === undefined ||
          values[key] === null ||
          values[key] === "") &&
        delete values[key]
    );
    if (Object.keys(values)?.length > 0) {
      const newQueryParam = {
        pageNumber: 1,
        recordsPerPage: pagination.recordsPerPage,
        ...values,
      };
      setSearchParams(newQueryParam);
      dispatch(
        specification({ showDeleteBtn: true, reload: false, ...values })
      );
      setPagination({ ...pagination, pageNumber: 1 });
    } else {
      dispatch(
        setNotificationData({
          message: "یک مورد انتخاب  کنید.",
          type: "error",
          time: 5000,
        })
      );
    }
  };

  const createTable = async () => {
    if (
      specificationData.rfSpecificationGroup ||
      specificationData.itemName ||
      specificationData.itemValue
    ) {
      getSpecificationsList(createSearchObject(searchParams))
        .then((res) => {
          dispatch(
            specification({
              list: res.data.data,
              totalRows: res.data.total_rows,
            })
          );
        })
        .catch(() => {
          errorHandler(errorResponse);
        });
    }
  };

  const resetSearch = () => {
    setSearchParams({ pageNumber: 1, recordsPerPage: 10 });
    dispatch(
      specification({
        showDeleteBtn: false,
        list: [],
        state: "",
        record: "",
        totalRows: 0,
      })
    );
    form.resetFields();
  };

  const handleOpenItems = async () => {
    if (specificationData.items.length > 0) {
      dispatch(specification({ open: !specificationData.open }));
    } else {
      dispatch(specification({ loading: true }));
      getSpecificationGroup()
        .then((res) => {
          const convert = res.data?.map((node) => {
            return {
              id: node.id,
              value: node.id,
              text: node.group_name,
            };
          });
          dispatch(specification({ loading: false, items: convert }));
        })
        .catch(() => {
          dispatch(specification({ loading: false }));
          errorHandler(errorResponse);
        });
    }
  };

  const columns = [
    {
      title: Dictionary.title + " " + Dictionary.part,
      key: "item_name",
      dataIndex: "item_name",
      width: "30%",
      className: Classes["value-item-first"],
      render: (record) => <p className={Classes["value-item"]}>{record}</p>,
    },
    {
      title: Dictionary.group + " " + Dictionary.part,
      key: "group_name",
      dataIndex: "group_name",
      width: "20%",
      render: (record) => <p className={Classes["value-item"]}>{record}</p>,
    },
    {
      title: Dictionary.value + " " + Dictionary.part,
      key: "item_value",
      dataIndex: "item_value",
      width: "40%",
      render: (record) => <p className={Classes["value-item"]}>{record}</p>,
    },
    {
      key: "edit",
      dataIndex: "edit",
      width: "10%",
      className: "table-th-status",
      render: (_field, record) => (
        <div className={Classes["expression-table-icon"]}>
          <TooltipComponent title={Dictionary.details}>
            <span
              onClick={() =>
                dispatch(
                  specification({ record: record, showDetailModal: true })
                )
              }
              className={Classes["show-record-icon"]}
            >
              <CustomIcon
                src={Visible}
                size={24}
                name={`expression-${record?.id}-trash`}
                color={Variables.LogoGreenDark}
              />
            </span>
          </TooltipComponent>
          <TooltipComponent title={Dictionary.edit}>
            <span
              onClick={() =>
                dispatch(specification({ record: record, showEditModal: true }))
              }
              className={Classes["cursor-permission"]}
            >
              <CustomIcon
                src={Edit}
                size={24}
                name={`expression-${record?.id}-edit`}
                color={Variables.LogoGreenDark}
              />
            </span>
          </TooltipComponent>
        </div>
      ),
    },
  ];

  return (
    <div>
      <HeaderPage
        title={Dictionary.specification}
        addIcon={false}
        onClick={() => dispatch(specification({ showDeleteModal: true }))}
        buttonText={Dictionary.delete + " Cache"}
      />
      <ShowDetailModal />
      <EditRecordModal />
      <DeleteRedisCacheModal />
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItemComponent name="itemName" style={{ marginLeft: "24px" }}>
          <InputSearchComponent
            width={"15vw"}
            placeholder={Dictionary.title + " " + Dictionary.part}
          />
        </FormItemComponent>

        <FormItemComponent name="rfSpecificationGroup">
          <SelectComponent
            showSearch
            prefix
            allowClear
            name="rfSpecificationGroup"
            loading={specificationData.loading}
            width={"15vw"}
            onClick={handleOpenItems}
            placeholder={Dictionary.group + " " + Dictionary.part}
            items={specificationData.items}
            className={Classes["select-object"]}
            onChange={(item) => dispatch(specification({ group: item }))}
          />
        </FormItemComponent>
        <FormItemComponent name="itemValue" style={{ marginLeft: "24px" }}>
          <InputSearchComponent
            width={"15vw"}
            placeholder={Dictionary.value + " " + Dictionary.part}
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["specification-search-bar-btn"]}>
          {specificationData.showDeleteBtn && (
            <ButtonComponent
              onClick={resetSearch}
              htmlType="button"
              type="text-danger"
            >
              {Dictionary.clean}
            </ButtonComponent>
          )}
          <ButtonComponent type="primary" htmlType="submit">
            {Dictionary.search}
          </ButtonComponent>
        </FormItemComponent>
      </FormComponent>
      {specificationData.totalRows > 0 ? (
        <TableComponent
          columns={columns}
          dataSource={specificationData.list}
          count={specificationData.totalRows}
        />
      ) : (
        <div className={Classes["empty-placeholder"]}>
          <img src={EmptyTablePlaceHolder} alt="no-items" />
          <p>{Dictionary.emptySpecification}</p>
        </div>
      )}
      {specificationData.totalRows > 10 && (
        <PaginationComponent
          onPaginationHandler={onPaginationHandler}
          responsive={true}
          pageSize={pagination.recordsPerPage}
          current={pagination.pageNumber}
          total={specificationData.totalRows}
        />
      )}
    </div>
  );
};

export default Specification;
