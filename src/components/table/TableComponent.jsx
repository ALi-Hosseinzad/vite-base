import React from "react";
import { Table } from "antd";

const TableComponent = ({
  loading,
  tableLayout,
  overflow = true,
  className,
  columns,
  expandable,
  dataSource,
  rowSelection,
  count,
  scroll,
  ...otherProps
}) => {
  return (
    <>
      <Table
        loading={loading}
        pagination={false}
        rowClassName={(record, index) => (index % 2 === 0 ? "none-bordered-table t-TcTable-row-light" : "none-bordered-table t-TcTable-row-gray")}
        className={`table-th-status ${className} ${scroll ? "table-wrapper-with-scroll" : "table-wrapper"}`}
        columns={columns}
        size="small"
        tableLayout={tableLayout}
        dataSource={dataSource}
        expandable={expandable}
        rowSelection={rowSelection}
        scroll={scroll ? { x: scroll.x, y: scroll.y } : { y: 550 }}
        {...otherProps}
      />
    </>
  );
};

TableComponent.defaultProps = {
  rowKey: "id",
};

export default TableComponent;
