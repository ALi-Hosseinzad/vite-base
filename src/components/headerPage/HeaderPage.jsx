import React from "react";
import { Link } from "react-router-dom";
import Classes from "components/headerPage/HeaderPage.module.scss";
import ButtonComponent from "components/button/ButtonComponent";
import Add from "assets/images/icon/Add.svg";
import CustomIcon from "components/customIcon/CustomIcon";
import ArrowDown from "assets/images/icon/ArrowDown.svg";

const HeaderPage = (props) => {
  const {
    title,
    buttonText,
    to,
    onClick,
    addIcon = true,
    colorRight,
    srcRight,
    back,
    onClickBack,
    inputUpload,
    onChange,
    id,
    acceptFile,
    loading,
  } = props;
  return (
    <div className={Classes["header-page-container"]}>
      <p className={Classes["header-page-title"]}>{title}</p>
      <div>
        {to && (
          <Link to={to}>
            <ButtonComponent
              type="default"
              classNameBtn={Classes["btn"]}
              srcRight={addIcon ? Add : ""}
              colorRight={colorRight ? colorRight : "#2B9570"}>
              {buttonText}
            </ButtonComponent>
          </Link>
        )}
        {onClick && (
          <ButtonComponent
            type="default"
            classNameBtn={Classes["btn"]}
            onClick={onClick}
            srcRight={srcRight ? srcRight : addIcon ? Add : ""}
            colorRight={colorRight ? colorRight : "#2B9570"}>
            {buttonText}
          </ButtonComponent>
        )}
        {inputUpload && (
          <div className={Classes["note"]}>
            {loading ? (
              <div className={Classes["spinner"]} />
            ) : (
              <>
                {(srcRight || addIcon) && (
                  <CustomIcon
                    src={srcRight ? srcRight : addIcon ? Add : ""}
                    name={`auth-upload-icon-${id}`}
                    size={20}
                    color={colorRight ? colorRight : "#2B9570"}
                  />
                )}
                <p>{buttonText}</p>
                <input onChange={onChange} accept={acceptFile} type="file" name={id} id={id} />
              </>
            )}
          </div>
        )}
        {back && (
          <Link to={back}>
            <CustomIcon className={Classes["back-btn"]} src={ArrowDown} size={28} />
          </Link>
        )}
        {onClickBack && (
          <div onClick={onClickBack}>
            <CustomIcon className={Classes["back-btn"]} src={ArrowDown} size={28} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderPage;
