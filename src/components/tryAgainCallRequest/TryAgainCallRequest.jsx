import React from "react";
import EmptyTablePlaceHolder from "assets/images/placeholder/EmptyTablePlaceHolder.svg";
import { Typography } from "antd";
import Dictionary from "helpers/Dictionary";
import ButtonComponent from "components/button/ButtonComponent";
import Classes from "components/tryAgainCallRequest/TryAgainCallRequest.module.scss";
import cx from "classnames";

const TryAgainCallRequest = (props) => {
  const { onFinish, text, confirmButtonText, cancelButtonText, onCancel, className } = props;
  const { Text } = Typography;

  return (
    <div className={cx(Classes["try-again-wrapper"], className)}>
      <img src={EmptyTablePlaceHolder} alt="placeholder" />
      <Text className={Classes["try-again-text"]}>{text || Dictionary.errorGetFile}</Text>
      <div className={Classes["try-again-btn"]}>
        <ButtonComponent type="primary" htmlType="submit" classNameBtn={Classes["try-again-confirm-btn"]} onClick={onFinish}>
          {confirmButtonText || Dictionary.tryAgain}
        </ButtonComponent>
        <ButtonComponent type="default" onClick={onCancel} classNameBtn={Classes["try-again-cancel-btn"]}>
          {cancelButtonText || Dictionary.returnToPrev}
        </ButtonComponent>
      </div>
    </div>
  );
};
export default TryAgainCallRequest;
