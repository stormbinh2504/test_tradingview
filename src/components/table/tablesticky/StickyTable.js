import React, { Component } from "react";
import styled from "styled-components";
import { Styles } from "./StyleTable";
import {
  useTable,
  useBlockLayout,
  useColumnOrder,
  useResizeColumns,
  useFilters,
} from "react-table";
import { useSticky } from "react-table-sticky";
import columns from "../../../data/columns.json";
import customers_list from "../../../assets/JsonData/customers-list.json";
import "../table.css";
import ModalEditOrder from "./ModalEditOrder";
import "./stickytable.scss";
import TabelW3 from "../tablew3/TabelW3";

const ColumnFilter = ({ column }) => {
  const { filter, setFilter } = column;
  return (
    <span>
      <input
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search here...."
      ></input>
    </span>
  );
};

function TestSticky() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        Filter: ColumnFilter,
        sticky: "left",
      },
      {
        Header: "Name",
        accessor: "name",
        Filter: ColumnFilter,
        sticky: "left",
      },
      {
        Header: "Email",
        accessor: "email",
        Filter: ColumnFilter,
      },
      {
        Header: "Location",
        accessor: "location",
        Filter: ColumnFilter,
      },
      {
        Header: "Phone",
        accessor: "phone",
        Filter: ColumnFilter,
      },
      {
        Header: "Total spend",
        accessor: "total_spend",
        Filter: ColumnFilter,
      },
      {
        Header: "Total orders",
        accessor: "total_orders",
        Filter: ColumnFilter,
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
    useColumnOrder,
    useFilters
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

  const activeTabItemSticky = () => {
    let table_sticky = document.getElementById("table-sticky");
    let table_w3 = document.getElementById("table-w3");
    let order_day = document.getElementById("order-day");
    let menu_invest = document.getElementById("menu-invest");
    order_day.classList.add("active");
    menu_invest.classList.remove("active");
    table_w3.style.display = "none";
    table_sticky.style.display = "block";
  };

  const activeTabW3 = (e) => {
    let table_sticky = document.getElementById("table-sticky");
    let table_w3 = document.getElementById("table-w3");
    table_sticky.style.display = "none";
    table_w3.style.display = "block";
    let order_day = document.getElementById("order-day");
    let menu_invest = document.getElementById("menu-invest");
    order_day.classList.remove("active");
    menu_invest.classList.add("active");
  };

  const firstPageRows = rows.slice(0, 100);

  return (
    <div>
      {/* <div className="title-widget">Bình</div> */}
      <div className="widget-header">
        <div className="row">
          <div className="col-12">
            <div className="menu-wrapper">
              <div className="tabnav-item">
                <button
                  className="widget-title active"
                  id="order-day"
                  onClick={activeTabItemSticky}
                  style={{ borderRadius: "15px 0 0 0" }}
                >
                  Lệnh trong ngày
                </button>
              </div>
              <div className="tabnav-item ">
                <button
                  className="widget-title"
                  id="menu-invest"
                  onClick={activeTabW3}
                >
                  Danh mục đầu tư
                </button>
              </div>
              <div className="tabnav-item style-center ">
                <button className="widget-btn-expand">
                  <i class="bx bx-expand-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="widget-body">
        <div id="table-sticky" style={{ display: "block" }}>
          <Styles>
            {/* <div>
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
      </div> */}
            <div
              {...getTableProps()}
              className="table sticky"
              // style={{ width: 800, height: 500 }}
              style={{ height: 500 }}
            >
              <div className="header">
                {headerGroups.map((headerGroup) => (
                  <div {...headerGroup.getHeaderGroupProps()} className="tr ">
                    <div className="th style-center">
                      <input type="checkbox" id="select-all"></input>
                    </div>
                    <div className="th style-center">
                      <label>Action</label>
                    </div>
                    {headerGroup.headers.map((column) => (
                      <div
                        {...column.getHeaderProps()}
                        className="th style-center"
                      >
                        {column.render("Header")}

                        {/* <div>{column.canFilter ? column.render("Filter") : null}</div> */}
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
                {firstPageRows.map((row) => {
                  prepareRow(row);
                  return (
                    <div {...row.getRowProps()} className="tr">
                      <div className="style-center td">
                        <input type="checkbox"></input>
                      </div>
                      <div className="td style-center">
                        <ModalEditOrder data={row}></ModalEditOrder>
                      </div>

                      {row.cells.map((cell) => (
                        <div
                          {...cell.getCellProps()}
                          className="td style-center"
                        >
                          {cell.render("Cell")}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </Styles>
        </div>
        <TabelW3></TabelW3>
      </div>
    </div>
  );
}

export default TestSticky;
