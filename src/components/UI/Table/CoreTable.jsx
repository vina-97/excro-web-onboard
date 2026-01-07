import React from "react";
import { Table } from "antd";
import PropTypes from "prop-types";

const DEFAULT_SCROLL_X = 1500;
const SCROLL_Y_THRESHOLD = 10;
const DEFAULT_SCROLL_Y = 700;

const CoreTable = ({ columns, data, rowKey, scroll, width, className }) => {
  const number = 2;
  return (
    <Table
      dataSource={data}
      pagination={false}
      scroll={{
        x: width ? width : scroll ? DEFAULT_SCROLL_X : null,
        y: data.length > SCROLL_Y_THRESHOLD ? DEFAULT_SCROLL_Y : null,
      }}
      size="small"
      rowKey={(record) => record[rowKey]}
      className={`custom-core-table ${className || ""}`}
      rowClassName={(record, index) =>
        index % number === 0 ? "table-row-light" : "table-row-dark"
      }
    >
      {columns?.map((col) => {
        const { key, dataIndex, ...rest } = col;
        return (
          <Table.Column
            key={key || dataIndex} // ensure key is explicit
            ellipsis={{ showTitle: false }}
            {...rest}
          />
        );
      })}
    </Table>
  );
};

CoreTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  rowKey: PropTypes.any,
  scroll: PropTypes.bool.isRequired,
  width: PropTypes.number,
};

export default CoreTable;
