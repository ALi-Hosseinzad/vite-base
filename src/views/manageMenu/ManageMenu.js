import React, { Fragment, useEffect, useRef, useState } from "react";
import { searchMenu } from "helpers/APIFunction";
import { useDispatch, useSelector } from "react-redux";
import {
  manageMenu,
  resetManageMenu,
} from "store/reducers/manageMenu/manageMenuReducer";
import Classes from "views/manageMenu/styles/manageMenu.module.scss";
import TableComponent from "components/table/TableComponent";
import ChipComponent from "components/chipComponent/ChipComponent";
import Dictionary from "helpers/Dictionary";
import CustomIcon from "components/customIcon/CustomIcon";
import Tick from "assets/images/icon/Tick.svg";
import Cross from "assets/images/icon/Cross.svg";
import Edit from "assets/images/icon/Edit.svg";
import MenuReorder from "assets/images/icon/MenuReorder.svg";
import LimitNoData from "assets/images/placeholder/LimitNoData.svg";
import TooltipComponent from "components/tooltip/TooltipComponent";
import HeaderPage from "components/headerPage/HeaderPage";
import { Form, Select } from "antd";
import FormItemComponent from "components/formItem/FormItemComponent";
import SelectComponent from "components/SelectComponent/SelectComponent";
import InputSearchComponent from "components/inputSearchComponent/InputSearchComponent";
import ButtonComponent from "components/button/ButtonComponent";
import FormComponent from "components/form/FormComponent";
import ModalComponent from "components/modalComponent/ModalComponent";
import EditMenu from "./pageComponent/EditMenu";
import useErrorHandler from "helpers/useErrorHandler";
import { errorResponse } from "helpers/APIService";
import SortSubMenu from "./pageComponent/SortSubMenu";
import { useSearchParams } from "react-router-dom";
import { createSearchObject } from "helpers/CreateSearchObject";
import Filter from "assets/images/icon/Filter.svg";
import DropDown from "assets/images/icon/DropDown.svg";
import SearchIcon from "assets/images/icon/Search.svg";
import Variables from "assets/styles/_Variables.scss";
import { MatchAuthority } from "helpers/MatchAuthority";

const ManageMenu = () => {
  const dispatch = useDispatch();
  const manageMenuData = useSelector((state) => state.manageMenu.value);
  const userInfoData = useSelector((state) => state.userInfo.value);
  const [form] = Form.useForm();
  const formRef = useRef();
  const errorHandler = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState(false);
  const path = window.location.pathname;
  const [openDefault, setOpenDefault] = useState(false);
  // ####### useEffect ######
  // ####### useEffect ######
  // ####### useEffect ######

  useEffect(() => {
    dispatch(resetManageMenu());
  }, []);

  useEffect(() => {
    if (path.includes("anonymous-menu")) {
      dispatch(manageMenu({ menuKey: "ANONYMOUS" }));
    } else if (path.includes("authenticated-menu")) {
      dispatch(manageMenu({ menuKey: "AUTHENTICATED" }));
    }
  }, [path]);

  useEffect(() => {
    let newQueryParam = {
      pageNumber: 1,
      recordsPerPage: 10,
      menuKey: manageMenuData.menuKey,
    };
    for (const [key, value] of searchParams.entries()) {
      if (key !== "pageNumber" && key !== "recordsPerPage") {
        newQueryParam[key] = value;
      }
    }
    setSearchParams(newQueryParam);
    if (Object.keys(newQueryParam).length > 3) {
      setOpenDefault(true);
    }
  }, [manageMenuData.menuKey]);

  useEffect(() => {
    if (userInfoData.username !== "admin") {
      dispatch(
        manageMenu({
          permissions: {
            view: MatchAuthority(
              userInfoData.authorities,
              "Post:/api/bo/menu/authenticated/search/v1"
            ),
            edit:
              MatchAuthority(
                userInfoData.authorities,
                "Put:/api/bo/menu/update/v1"
              ) &&
              MatchAuthority(
                userInfoData.authorities,
                "Put:/api/bo/menu/positions/v1"
              ),
          },
        })
      );
    } else {
      dispatch(
        manageMenu({
          permissions: {
            view: true,
            edit: true,
          },
        })
      );
    }
  }, [userInfoData.authorities]);

  const handleResetSearch = () => {
    if (
      searchParams.get("isEnabled") ||
      searchParams.get("menuCaption") ||
      searchParams.get("isVisible") ||
      (searchParams.get("menuKey") &&
        searchParams.get("menuKey") !== "AUTHENTICATED" &&
        searchParams.get("menuKey") !== "ANONYMOUS")
    ) {
      dispatch(manageMenu({ showDeleteBtn: true }));
    } else {
      dispatch(manageMenu({ showDeleteBtn: false }));
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      isEnabled: searchParams.get("isEnabled"),
      menuKey:
        searchParams.get("menuKey") === "AUTHENTICATED" ||
        searchParams.get("menuKey") === "ANONYMOUS"
          ? ""
          : searchParams.get("menuKey"),
      menuCaption: searchParams.get("menuCaption"),
      isVisible: searchParams.get("isVisible"),
    });
    handleResetSearch();
  }, []);

  useEffect(() => {
    if (searchParams.get("pageNumber")) {
      createTable();
      handleResetSearch;
    }
  }, [manageMenuData.reload, searchParams, manageMenuData.menuKey]);

  useEffect(() => {
    const branches = [];
    manageMenuData.list
      .filter((q) => q.parent_of_menu_id === null)
      .forEach((q) => {
        branches.push(createBranch(q));
      });
    dispatch(manageMenu({ tableData: branches }));
  }, [manageMenuData.list]);

  const onFinish = (values) => {
    if (values) {
      setOpenDefault(true);
      Object.keys(values).forEach(
        (key) =>
          (values[key] === undefined ||
            values[key] === null ||
            values[key] === "") &&
          delete values[key]
      );
      setSearchParams({
        pageNumber: 1,
        recordsPerPage: 10,
        menuKey: manageMenuData.menuKey,
        ...values,
      });
      dispatch(manageMenu({ showDeleteBtn: true }));
    }
  };

  const resetSearch = () => {
    setOpenDefault(false);
    const newQueryParam = {
      pageNumber: 1,
      recordsPerPage: 10,
      menuKey: manageMenuData.menuKey,
    };
    setSearchParams(newQueryParam);
    dispatch(manageMenu({ showDeleteBtn: false }));
    form.resetFields();
  };

  const createTable = () => {
    searchMenu(
      createSearchObject(searchParams, { sortBy: "customOrderPosition" })
    )
      .then((res) => {
        dispatch(manageMenu({ list: res?.data }));
      })
      .catch(() => {
        errorHandler(errorResponse);
      });
  };

  const createBranch = (root) => {
    const menu = { ...root };
    const children = manageMenuData.list?.filter(
      (q) => q.parent_of_menu_id === menu.id
    );
    if (children === null || children.length === 0) return menu;
    menu["children"] = [];
    children
      .sort((a, b) => a.custom_order_position - b.custom_order_position)
      .forEach((p) => menu["children"].push(createBranch(p)));
    return menu;
  };

  const handleEdit = (record) => {
    dispatch(manageMenu({ record: record, editModal: true }));
  };

  const handleSort = (record) => {
    const convertList = [];
    record.children.forEach((node, index) => {
      const convertObj = {
        entity_id: node.id,
        id: index + 1,
        custom_order_position: node.custom_order_position,
        menu_caption: node.menu_caption,
        menu_key: node.menu_key,
      };
      convertList.push(convertObj);
    });
    if (convertList) {
      dispatch(
        manageMenu({ submenus: convertList, sortModal: true, record: record })
      );
    }
  };

  const columns = [
    {
      title: (
        <span style={{ marginRight: "23px" }}> {Dictionary.menuTitle}</span>
      ),
      key: "menu_caption",
      dataIndex: "menu_caption",
      width: 300,
      fixed: "left",
    },
    {
      title: Dictionary.submenuQuantity,
      key: "children",
      dataIndex: "children",
      width: 140,
      render: (record) => (
        <span style={{ color: "#757575" }}>
          {" "}
          {record?.length > 0 ? `${record.length} زیر منو` : "--"}
        </span>
      ),
    },
    {
      title: "Key",
      key: "menu_key",
      dataIndex: "menu_key",
      width: 400,
      render: (record) => record,
    },
    {
      title: Dictionary.showSomeThing,
      key: "is_visible",
      dataIndex: "is_visible",
      width: 70,
      render: (record) =>
        record ? (
          <div>
            <CustomIcon src={Tick} size={28} cursor="default" />
          </div>
        ) : (
          <CustomIcon src={Cross} size={28} cursor="default" />
        ),
    },
    {
      title: Dictionary.status,
      key: "is_enabled",
      dataIndex: "is_enabled",
      width: 70,
      render: (record) =>
        record ? (
          <ChipComponent className={Classes["custom-chip-for-enable-manu"]}>
            {Dictionary.active}
          </ChipComponent>
        ) : (
          <ChipComponent
            className={Classes["custom-red-chip-for-enable-manu"]}
            red={true}
          >
            {Dictionary.deactive}
          </ChipComponent>
        ),
    },
    {
      title: "Android",
      key: "is_for_android",
      dataIndex: "is_for_android",
      width: 70,
      render: (_field, record) => (
        <ChipComponent
          className={
            _field
              ? _field
                ? Classes["custom-chip-for-enable-manu"]
                : Classes["custom-red-chip-for-enable-manu"]
              : Classes["custom-red-chip-for-enable-manu"]
          }
          red={!_field}
        >
          {record?.android_min_version}
        </ChipComponent>
      ),
    },
    {
      title: "iOS",
      key: "is_for_ios",
      dataIndex: "is_for_ios",
      width: 70,
      render: (_field, record) => (
        <ChipComponent
          className={
            _field
              ? Classes["custom-chip-for-enable-manu"]
              : Classes["custom-red-chip-for-enable-manu"]
          }
          red={!_field}
        >
          {record?.ios_min_version}
        </ChipComponent>
      ),
    },
    {
      title: "Web",
      key: "is_for_web",
      dataIndex: "is_for_web",
      width: 70,
      render: (_field, record) => (
        <ChipComponent
          className={
            _field
              ? Classes["custom-chip-for-enable-manu"]
              : Classes["custom-red-chip-for-enable-manu"]
          }
          red={!_field}
        >
          {record?.web_min_version}
        </ChipComponent>
      ),
    },
    {
      title: "PWA",
      key: "is_for_pwa",
      dataIndex: "is_for_pwa",
      width: 70,
      render: (_field, record) => (
        <ChipComponent
          className={
            _field
              ? Classes["custom-chip-for-enable-manu"]
              : Classes["custom-red-chip-for-enable-manu"]
          }
          red={!_field}
        >
          {record?.pwa_min_version}
        </ChipComponent>
      ),
    },
    {
      title: "Android⬆️",
      key: "android_max_version",
      dataIndex: "android_max_version",
      width: 100,
      render: (_field, record) => (
        <ChipComponent
          className={
            _field
              ? Classes["custom-chip-for-enable-manu"]
              : Classes["custom-red-chip-for-enable-manu"]
          }
          red={!_field}
        >
          {record?.android_max_version || "not set"}
        </ChipComponent>
      ),
    },
    {
      title: "iOS⬆️",
      key: "ios_max_version",
      dataIndex: "ios_max_version",
      width: 70,
      render: (_field, record) => (
        <ChipComponent
          className={
            _field
              ? Classes["custom-chip-for-enable-manu"]
              : Classes["custom-red-chip-for-enable-manu"]
          }
          red={!_field}
        >
          {record?.ios_max_version || "not set"}
        </ChipComponent>
      ),
    },
    {
      title: "Web⬆️",
      key: "web_max_version",
      dataIndex: "web_max_version",
      width: 70,
      render: (_field, record) => (
        <ChipComponent
          className={
            _field
              ? Classes["custom-chip-for-enable-manu"]
              : Classes["custom-red-chip-for-enable-manu"]
          }
          red={!_field}
        >
          {record?.web_max_version || "not set"}
        </ChipComponent>
      ),
    },
    {
      title: "PWA⬆️",
      key: "pwa_max_version",
      dataIndex: "pwa_max_version",
      width: 70,
      render: (_field, record) => (
        <ChipComponent
          className={
            _field
              ? Classes["custom-chip-for-enable-manu"]
              : Classes["custom-red-chip-for-enable-manu"]
          }
          red={!_field}
        >
          {record?.pwa_max_version || "not set"}
        </ChipComponent>
      ),
    },
    {
      key: "edit",
      dataIndex: "edit",
      fixed: "right",
      render: (_field, record) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginLeft: "8px",
            }}
          >
            {record.children?.length > 1 ? (
              <TooltipComponent title={Dictionary.sort}>
                <span
                  onClick={() =>
                    manageMenuData.permissions.edit && handleSort(record)
                  }
                  style={{ paddingLeft: "8px" }}
                >
                  <CustomIcon
                    src={MenuReorder}
                    size={24}
                    name={`manage-menu-${record.id}-sort`}
                    color={
                      manageMenuData.permissions.edit
                        ? Variables.LogoGreenDark
                        : Variables.GreenLight7
                    }
                    className={
                      !manageMenuData.permissions.edit &&
                      Classes["cursor-permission"]
                    }
                  />
                </span>
              </TooltipComponent>
            ) : (
              ""
            )}
            <TooltipComponent title={Dictionary.edit}>
              <span
                onClick={() =>
                  manageMenuData.permissions.edit && handleEdit(record)
                }
              >
                <CustomIcon
                  src={Edit}
                  size={24}
                  name={`manage-menu-${record.id}-edit`}
                  color={
                    manageMenuData.permissions.edit
                      ? Variables.LogoGreenDark
                      : Variables.GreenLight7
                  }
                  className={
                    !manageMenuData.permissions.edit &&
                    Classes["cursor-permission"]
                  }
                />
              </span>
            </TooltipComponent>
          </div>
        );
      },
    },
  ];

  const items = {
    isVisible: [
      { id: 1, value: true, text: "نمایش" },
      { id: 2, value: false, text: "عدم نمایش" },
    ],
    isEnabled: [
      { id: 1, value: true, text: "فعال" },
      { id: 2, value: false, text: "غیرفعال" },
    ],
  };
  return (
    <>
      <ModalComponent
        width={918}
        title={`${Dictionary.edit} ${Dictionary.menu} ${manageMenuData.record?.menu_caption}`}
        open={manageMenuData.editModal}
        maskClosable={false}
        onCancel={() => dispatch(manageMenu({ editModal: false }))}
      >
        <EditMenu />
      </ModalComponent>
      <ModalComponent
        width={918}
        title={`${Dictionary.sort} ${Dictionary.submenus}`}
        open={manageMenuData.sortModal}
        maskClosable={false}
        className={Classes["sort-menu-modal"]}
        onCancel={() =>
          dispatch(manageMenu({ sortModal: false, submenus: "", newSort: "" }))
        }
      >
        <SortSubMenu />
      </ModalComponent>
      <HeaderPage
        title={
          manageMenuData.menuKey === "ANONYMOUS"
            ? `${Dictionary.managing} ${Dictionary.anonymousMenu}`
            : `${Dictionary.managing} ${Dictionary.authenticatedMenu}`
        }
      />
      <FormComponent
        layout="inline"
        form={form}
        onFinish={onFinish}
        ref={formRef}
        className={Classes["manage-menu-search-form"]}
      >
        <FormItemComponent name="menuCaption">
          <InputSearchComponent
            width={176}
            placeholder={Dictionary.submenuTitle}
          />
        </FormItemComponent>
        <FormItemComponent
          name="menuKey"
          className={Classes["manage-menu-search-form-item"]}
        >
          <InputSearchComponent width={400} placeholder="key" />
        </FormItemComponent>
        <FormItemComponent
          name="isVisible"
          className={Classes["manage-menu-search-form-item"]}
        >
          <SelectComponent
            name="isVisible"
            width={176}
            placeholder={Dictionary.showSomeThing}
            items={items.isVisible}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent
          name="isEnabled"
          className={Classes["manage-menu-search-form-item"]}
        >
          <SelectComponent
            name="isEnabled"
            width={176}
            placeholder={Dictionary.status}
            items={items.isEnabled}
            prefix
          />
        </FormItemComponent>
        <FormItemComponent className={Classes["manage-menu-search-btn"]}>
          {manageMenuData.showDeleteBtn && (
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
      <div style={{ height: "5%" }}>
        {manageMenuData.tableData.length !== 0 && openDefault && (
          <TableComponent
            columns={columns}
            dataSource={manageMenuData.tableData}
            className={Classes["manage-menu-table"]}
            expandable={{ defaultExpandAllRows: true }}
            tableLayout="unset"
            scroll={{ x: 2000, y: 550 }}
          />
        )}
        {manageMenuData.tableData.length !== 0 && !openDefault && (
          <TableComponent
            columns={columns}
            dataSource={manageMenuData.tableData}
            className={Classes["manage-menu-table"]}
            expandable={{ defaultExpandAllRows: false }}
            tableLayout="unset"
            scroll={{ x: 2000, y: 550 }}
          />
        )}
        {manageMenuData.tableData.length === 0 && (
          <div className={Classes["table-placeholder"]}>
            <CustomIcon src={LimitNoData} size={230} />
          </div>
        )}
      </div>
    </>
  );
};

export default ManageMenu;
