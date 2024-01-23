import React, { Component } from "react";
import styled from "styled-components";
import {
  useTable,
  useBlockLayout,
  useColumnOrder,
  useResizeColumns,
} from "react-table";
import { useSticky } from "react-table-sticky";
import columns from "../../../data/columns.json";
import customers_list from "../../../assets/JsonData/customers-list.json";
import "../table.css";
import ModalEditOrder from "./ModalEditOrder";

const Styles = styled.div`
  .table {
    border: 1px solid #ddd;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      padding: 5px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      background-color: #fff;
      overflow: hidden;

      :last-child {
        border-right: 0;
      }
    }

    &.sticky {
      overflow: scroll;
      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
      }

      .header {
        top: 0;
        box-shadow: 0px 3px 3px #ccc;
      }

      .footer {
        bottom: 0;
        box-shadow: 0px -3px 3px #ccc;
      }

      .body {
        position: relative;
        z-index: 0;
      }

      [data-sticky-td] {
        position: sticky;
      }

      [data-sticky-last-left-td] {
        box-shadow: 2px 0px 3px #ccc;
      }

      [data-sticky-first-right-td] {
        box-shadow: -2px 0px 3px #ccc;
      }
    }
        .resizer {
      display: inline-block;s
      background: blue;
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      transform: translateX(50%);
      z-index: 1;
      touch-action:none;

      &.isResizing {
        background: red;
      }
  }
`;

function TestSticky() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Sửa/Xóa",
        accessor: "Sửa/Xóa",
        sticky: "left",
      },
      {
        Header: "Id",
        accessor: "id",
        sticky: "left",
      },
      {
        Header: "Name",
        accessor: "name",
        sticky: "left",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Total spend",
        accessor: "total_spend",
      },
      {
        Header: "Total orders",
        accessor: "total_orders",
      },
    ],
    []
  );
  const data = React.useMemo(() => customers_list, []);
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setColumnOrder,
    state,
    allColumns,
    resetResizing,
    getToggleHideAllColumnsProps,
  } = useTable(
    {
      columns,
      data,
    },
    useBlockLayout,
    useResizeColumns,
    useSticky,
    useColumnOrder
  );
  const changeOrder = () => {
    setColumnOrder([
      "email",
      "location",
      "phone",
      "total_spend",
      "total_orders",
    ]);
  };

  const onChangeCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef();
      const resolvedRef = ref || defaultRef;

      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
      }, [resolvedRef, indeterminate]);

      return <input type="checkbox" ref={resolvedRef} {...rest} />;
    }
  );

  document.addEventListener("DOMContentLoaded", function () {
    document
      .getElementById("select-all")
      .addEventListener("click", function () {
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        for (var checkbox of checkboxes) {
          checkbox.checked = this.checked;
        }
      });
  });

  const firstPageRows = rows.slice(0, 20);

  return (
    <Styles>
      <div>
        <div>
          <onChangeCheckbox {...getToggleHideAllColumnsProps()} /> Toggle All
        </div>
        {allColumns.map((column) => (
          <div key={column.id}>
            <label>
              <input type="checkbox" {...column.getToggleHiddenProps()} />
              {column.id}
            </label>
          </div>
        ))}
        <br />
      </div>
      <div>
        <button onClick={changeOrder}>Random Column</button>
      </div>
      <div>
        <button onClick={resetResizing}>Reset Resizing</button>
      </div>
      <div
        {...getTableProps()}
        className="table sticky"
        style={{ width: 1000, height: 500 }}
      >
        <div className="header">
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              <div className="th">
                <input type="checkbox" id="select-all"></input>
              </div>
              {headerGroup.headers.map((column) => (
                <div {...column.getHeaderProps()} className="th">
                  {column.render("Header")}

                  <div
                    {...column.getResizerProps()}
                    className={`resizer ${
                      column.isResizing ? "isResizing" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className="body">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="tr">
                <div className="style-checkbox">
                  <input type="checkbox"></input>
                </div>
                <div>
                  <ModalEditOrder data={row}></ModalEditOrder>
                </div>
                {row.cells.map((cell) => (
                  <div {...cell.getCellProps()} className="td">
                    {cell.render("Cell")}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Styles>
  );
}

export default TestSticky;
