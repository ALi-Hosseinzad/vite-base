import React, { useEffect, useState } from "react";
import { Menu, Skeleton } from "antd";
import Logo from "assets/images/content/LogoSidebar.svg";
import Classes from "container/sidebar/Sidebar.module.scss";
import Dictionary from "helpers/Dictionary";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = ({ theme }) => {
  const location = useLocation();
  const [current, setCurrent] = useState(
    location.pathname.split("/").length <= 2
      ? `/${location.pathname.split("/")[1]}`
      : `/${location.pathname.split("/")[1]}/${location.pathname.split("/")[2]}`
  );
  const [openKeys, setOpenKeys] = useState([`/${location.pathname.split("/")[1]}`]);
  const navigate = useNavigate();
  const rootSubmenuKeys = [
    "/home",
    "/basic-data",
    "/users-manager",
    "/customer",
    "/account",
    "/card",
    "/menu-manager",
    "/limitation",
    "/authentication",
    "/access",
    "/services-manager",
    "/ticket-list",
    "/loan",
    "/wallet",
  ];
  const userInfoData = useSelector((state) => state.userInfo.value);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  function getItem(label, key, children) {
    if (
      userInfoData.list_role_menu?.has(key) ||
      userInfoData.role_menus?.filter((r) => r.menu_key.startsWith(key)).length ||
      userInfoData.username.toLowerCase() === "admin"
    ) {
      return {
        key,
        children,
        label,
      };
    } else {
      return;
    }
  }

  const [items, setItems] = useState([]);
  useEffect(() => {
    if (userInfoData.list_role_menu?.size || userInfoData.username) {
      setItems([
        getItem(Dictionary.home, "/home"),
        getItem(Dictionary.basicData, "/basic-data", [
          getItem(Dictionary.versionsControl, "/basic-data/app-versions"),
          getItem(`${Dictionary.settings} ${Dictionary.version} ${Dictionary.ha}`, "/basic-data/app-releases"),
          getItem(Dictionary.expressions, "/basic-data/expressions"),
          getItem(Dictionary.bank, "/basic-data/banks"),
          getItem(Dictionary.branches, "/basic-data/branches"),
          getItem(`${Dictionary.satna} ${Dictionary.and} ${Dictionary.paya} ${Dictionary.and} ${Dictionary.pol}`, "/basic-data/satna-paya"),
          getItem(Dictionary.charity, "/basic-data/charity"),
          getItem(Dictionary.specification, "/basic-data/specification"),
          getItem(`${Dictionary.fee} ${Dictionary.services}`, "/basic-data/services-fee"),
          getItem(`${Dictionary.settings} ${Dictionary.system} ${Dictionary.ha}`, "/basic-data/app-settings"),
        ]),
        getItem(Dictionary.menusManager, "/menu-manager", [
          getItem(Dictionary.authenticatedMenu, "/menu-manager/authenticated-menu"),
          getItem(Dictionary.anonymousMenu, "/menu-manager/anonymous-menu"),
        ]),
        getItem(Dictionary.servicesManagement, "/services-manager", [
          getItem(Dictionary.systemServicesManagement, "/services-manager/authenticated-services"),
          getItem(Dictionary.anonymousServicesManagement, "/services-manager/anonymous-services"),
        ]),
        getItem(`${Dictionary.access}‌${Dictionary.ha}`, "/access", [
          getItem(Dictionary.groups, "/access/groups"),
          getItem(`${Dictionary.role}${Dictionary.ha}`, "/access/roles"),
        ]),
        getItem(Dictionary.manageUsers, "/users-manager"),
        getItem(Dictionary.customer, "/customer", [
          getItem(Dictionary.mangeCustomer, "/customer/customer-manager"),
          getItem(Dictionary.referralBranchCode, "/customer/referral-branch-code"),
          getItem(Dictionary.customerServicesManagement, "/customer/customer-services"),
        ]),
        getItem(Dictionary.account, "/account", [
          getItem(Dictionary.mangeAccount, "/account/account-manager"),
          getItem(Dictionary.searchBasedOnAccountNumber, "/account/search-based-on-account-number"),
          getItem(Dictionary.representativeAccount, "/account/representative"),
          // getItem(`${Dictionary.access} ${Dictionary.account}`, "/account/account-accesses"),
        ]),
        getItem(Dictionary.loan, "/loan", [
          getItem(`${Dictionary.loan} ${Dictionary.supportance}`, "/loan/supportance-loan"),
          getItem(`${Dictionary.uploadedFile} ${Dictionary.supportance}`, "/loan/file-upload-loan"),
          getItem(Dictionary.creditHub, "/loan/credit-hub"),
          getItem(`${Dictionary.plansAndCompanies} B2B2C`, "/loan/companies"),
        ]),
        getItem(Dictionary.maxTransLimit, "/limitation", [
          getItem(`${Dictionary.maxTransLimit} ${Dictionary.daily} ${Dictionary.customer}`, "/limitation/customer-limit"),
          // getItem(`${Dictionary.maxTransLimit} ${Dictionary.daily} ${Dictionary.account}`, "/limitation/account-limit"),
          // getItem(`${Dictionary.maxTransLimit} ${Dictionary.daily} ${Dictionary.system}`, "/limitation/system-limit"),
        ]),
        getItem(Dictionary.card, "/card", [
          getItem(Dictionary.listCards, "/card/list-cards"),
          // getItem(Dictionary.assignCard, "/card/assign-card-to-customer"),
        ]),
        getItem(Dictionary.authentication, "/authentication", [
          getItem(Dictionary.openAccount, "/authentication/open-account"),
          getItem(Dictionary.registerForget, "/authentication/register-forget"),
          getItem(Dictionary.blackList, "/authentication/blacklist"),
        ]),
        getItem(Dictionary.wallet, "/wallet", [
          getItem(Dictionary.show + " " + Dictionary.details + " " + Dictionary.wallet, "/wallet/manage"),
          getItem(Dictionary.managing + " " + Dictionary.type + " " + Dictionary.transaction, "/wallet/tran-type"),
          getItem(Dictionary.managing + " " + Dictionary.type + " " + Dictionary.wallet, "/wallet/wallet-type"),
        ]),
        getItem(Dictionary.accountingDocuments, "/manage-gl"),
        getItem(Dictionary.supporting, "/ticket-list"),
        getItem(Dictionary.dotinServices, "/service-call"),
      ]);
    }
  }, [userInfoData]);

  const onClick = (e) => {
    setCurrent(e.key);
    navigate(e.key);
    if (e.key.split("/").length === 1) {
      setOpenKeys([""]);
    }
  };
  return (
    <div className={Classes["sidebar"]}>
      {Logo ? <img src={Logo} alt="logo" className={Classes["sidebar-logo"]} onClick={() => navigate("/home")} /> : <Skeleton.Image active />}
      <div className={Classes["sidebar-all-menu"]}>
        {items ? (
          <Menu
            onClick={onClick}
            openKeys={openKeys}
            className={Classes["sidebar-menu"]}
            onOpenChange={onOpenChange}
            selectedKeys={[current]}
            mode="inline"
            items={items}
          />
        ) : (
          <>
            {[...Array(5)].map((elementInArray, index) => (
              <Skeleton.Button active block key={index} style={{ marginBottom: "1rem" }} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
