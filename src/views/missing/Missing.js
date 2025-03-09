import React from "react";
import Classes from "views/login/styles/Login.module.scss";
import Logo from "assets/images/content/404.png";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import Dictionary from "helpers/Dictionary";
import CustomIcon from "components/customIcon/CustomIcon";
import Warning from "assets/images/icon/Warning.svg";

const Missing = () => {
  const navigate = useNavigate();
  return (
    <div className={Classes["login-container"]}>
      <div className={Classes["login-backGround"]}>
        <div className={Classes["login-form-wrapper"]}>
          <img src={Logo} className={Classes["missing-logo"]} />
          <div className={Classes["page-404-wrapper"]}>
            <div className={Classes["page-404-text"]}>
              <CustomIcon src={Warning} name="missing-icon" size={24} />
              <span>صفحه مورد نظر پیدا نشد!</span>
            </div>
            <Button htmlType="button" className={Classes["login-submit"]} onClick={() => navigate("/home")}>
              {Dictionary.returnToHome}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Missing;
