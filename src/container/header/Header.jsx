import React, { useEffect } from "react";
import { Button, Skeleton, Dropdown, PageHeader } from "antd";
import CustomIcon from "components/customIcon/CustomIcon";
import Exit from "assets/images/icon/Exit.svg";
import ArrowDown from "assets/images/icon/ArrowDown.svg";
import Classes from "container/header/Header.module.scss";
import { useNavigate } from "react-router-dom";
import useErrorHandler from "helpers/useErrorHandler";
import Dictionary from "helpers/Dictionary";
import ChangePassword from "./pageComponent/ChangePassword";
import { useDispatch, useSelector } from "react-redux";
import LogoutModal from "components/logoutModal/LogoutModal";
import {
  userInfo,
  userInfoState,
} from "store/reducers/userInfo/UserInfoReducer";
import { getUserInfo } from "store/middleware/getUserInfo";
import { resetReducers } from "store/reducers/users/UsersReducer";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const userInfoData = useSelector(userInfoState);

  const items = [
    {
      label: (
        <div className={Classes["header-change"]}>
          {Dictionary.changePassword}
        </div>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: <div className={Classes["header-exit"]}>{Dictionary.exit}</div>,
      key: "1",
    },
  ];

  useEffect(() => {
    dispatch(getUserInfo(errorHandler));
  }, []);

  const handleClick = (e) => {
    if (e.key === "0") {
      dispatch(userInfo({ modal: true }));
    } else if (e.key === "1") {
      dispatch(userInfo({ logoutModal: true }));
    }
  };

  const handleLogOut = () => {
    navigate("/");
    dispatch(resetReducers());
  };

  return (
    <>
      <PageHeader
        className={Classes["site-page-header"]}
        title={
          userInfoData.fullname ? (
            <Dropdown
              dropdownRender={(menu) => (
                <div className={Classes["dropdown-content"]}>{menu}</div>
              )}
              menu={{
                items,
                onClick: (e) => handleClick(e),
              }}
              trigger={["click"]}
            >
              <Button
                className={Classes["header-title"]}
                type="text"
                icon={
                  <CustomIcon
                    className={Classes["header-title-icon"]}
                    src={ArrowDown}
                    size={16}
                    name="header-profile-more"
                    color="#2B9570"
                  />
                }
              >
                {userInfoData?.fullname}
              </Button>
            </Dropdown>
          ) : (
            <Skeleton.Button active />
          )
        }
        extra={[
          <span className={Classes["logout-icon"]}>
            <CustomIcon
              src={Exit}
              size={24}
              name="header-exit-icon"
              color="#2B9570"
              onClick={() => dispatch(userInfo({ logoutModal: true }))}
            />
          </span>,
        ]}
        avatar={
          userInfoData.avatar ? (
            { src: userInfoData.avatar }
          ) : (
            <Skeleton.Avatar active />
          )
        }
      />
      <ChangePassword />
      <LogoutModal
        clickCancel={() => dispatch(userInfo({ logoutModal: false }))}
        clickConfirm={handleLogOut}
        visible={userInfoData.logoutModal}
      />
    </>
  );
};

export default Header;
