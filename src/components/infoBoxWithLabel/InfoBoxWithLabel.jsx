import React from "react";
import { Card, Space, Typography } from "antd";
import Classes from "components/infoBoxWithLabel/InfoBoxWithLabel.module.scss";
import cx from "classnames";

const InfoBoxWithLabel = (props) => {
  const { Text } = Typography;
  const { ref, key, label, name, className, children, value, type, gap } = props;

  return (
    <Space direction="vertical" ref={ref} key={key} size={gap || [4, 4]}>
      {label && <Text className={Classes["info-box-label"]}>{label}</Text>}
      <Card
        name={name}
        className={cx(className, Classes["info-box"], {
          [Classes["info-box-number"]]: type === "number" || type === "amount",
          [Classes["info-box-text-aria"]]: type === "text-aria",
        })}>
        {children ? (
          children
        ) : (
          <Text className={Classes["info-box-value"]}>{type === "amount" ? value?.toLocaleString("en") || "--" : value || "--"}</Text>
        )}
      </Card>
    </Space>
  );
};
export default InfoBoxWithLabel;
