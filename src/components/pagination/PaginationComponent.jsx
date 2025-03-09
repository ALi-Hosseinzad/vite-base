import React from "react";
import { Pagination } from "antd";

const PaginationComponent = (props) => {
  const { className, responsive, total, current, onPaginationHandler, pageSize } = props;
  const onChangeHandler = (page, pageSize) => {
    onPaginationHandler(page, pageSize);
  };
  return (
    <Pagination
      showLessItems={true}
      pageSizeOptions={[10, 20, 30, 50]}
      pageSize={pageSize}
      className={`ant-pagination ${className}`}
      responsive={responsive}
      defaultCurrent={1}
      current={current}
      showSizeChanger
      onChange={onChangeHandler}
      total={total}
      locale={{ items_per_page: "" }}
    />
  );
};

export default PaginationComponent;
