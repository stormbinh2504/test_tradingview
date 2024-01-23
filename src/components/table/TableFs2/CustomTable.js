import React from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  useBlockLayout,
  useAsyncDebounce,
} from "react-table";
import { FixedSizeList } from "react-window";
import AutoSizer from "./AutoSizer";
// import "./CustomTable.scss";
// import CustomScrollbars from './CustomScrollbars';

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  // Header bị scroll khi focus vào filter nằm ngoài màn hình mobile hoặc tab trên desktop => scroll body
  const onHeaderScroll = () => {
    for (
      let i = 0;
      i < document.getElementsByClassName("header-div").length;
      i++
    ) {
      if (document.getElementsByClassName("header-div")[i]) {
        let horizontalScroll =
          document.getElementsByClassName("header-div")[i].scrollLeft;
        if (document.getElementsByClassName("body-div")[i]) {
          document.getElementsByClassName("body-div")[i].scrollLeft =
            horizontalScroll;
        }
        if (document.getElementsByClassName("footer-div")[i]) {
          document.getElementsByClassName("footer-div")[i].scrollLeft =
            horizontalScroll;
        }
      }
    }
  };

  return (
    <input
      value={filterValue || ""}
      style={{
        "font-size": "13px",
        height: "20px",
      }}
      className="custom-form-control"
      onFocus={onHeaderScroll}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
    />
  );
}

function CustomTable({ columns, data, defaultColumn }) {
  const headerHeight = 53;
  const footerHeight = 45;
  const onScroll = () => {
    for (
      let i = 0;
      i < document.getElementsByClassName("body-div").length;
      i++
    ) {
      if (document.getElementsByClassName("body-div")[i]) {
        let horizontalScroll =
          document.getElementsByClassName("body-div")[i].scrollLeft;
        if (document.getElementsByClassName("header-div")[i]) {
          document.getElementsByClassName("header-div")[i].scrollLeft =
            horizontalScroll;
        }
        if (document.getElementsByClassName("footer-div")[i]) {
          document.getElementsByClassName("footer-div")[i].scrollLeft =
            horizontalScroll;
        }
      }
    }
  };

  const customScroll = React.useRef();
  const fixedList = React.useRef();
  const variable = "giang";
  const _defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    totalColumnsWidth,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { ..._defaultColumn, ...defaultColumn },
      autoResetSortBy: false,
      autoResetFilters: false,
    },
    useFilters,
    useSortBy,
    useBlockLayout
  );
//   console.log("binh", rows);
//   console.log("binh", columns);
  // giang.ngo: assign rows displayed to outside
  const RenderRow = React.useCallback(
    ({ index, style, props }) => {
      const row = rows[index];
      prepareRow(row);
      style.width = totalColumnsWidth;
      return (
        <tr
          {...row.getRowProps({ style })}
          {...props}
          className={index % 2 ? "even" : "odd"}
        >
          {row.cells.map((cell) => {
            return (
              <td
                {...cell.getCellProps()}
                className={
                  cell.column.cellClassName ? cell.column.cellClassName : ""
                }
              >
                {cell.render("Cell")}
              </td>
            );
          })}
        </tr>
      );
    },
    [prepareRow, rows]
  );
  return (
    <div className="react-table table-container">
      <AutoSizer>
        {({ height, width }) => {
          const bodyHeight = height - headerHeight - footerHeight;
          return (
            <table {...getTableProps()}>
              <thead>
                <div
                  className="header-div"
                  style={{ overflow: "hidden", width, height: headerHeight }}
                >
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => {
                        return (
                          <th
                            {...column.getHeaderProps()}
                            className={
                              column.headerClassName
                                ? column.headerClassName
                                : ""
                            }
                          >
                            {/* Add a sort direction indicator */}
                            <span {...column.getSortByToggleProps()}>
                              {column.render("Header")}
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <i className="fa fa-caret-down caret-sort" />
                                ) : (
                                  <i className="fa fa-caret-up caret-sort" />
                                )
                              ) : (
                                ""
                              )}
                            </span>
                            <div>
                              {column.canFilter
                                ? column.render("Filter")
                                : null}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </div>
              </thead>
              <tbody {...getTableBodyProps()} onScroll={onScroll}>
                <FixedSizeList
                  ref={fixedList}
                  className="body-div"
                  height={bodyHeight}
                  itemCount={rows.length}
                  itemSize={34}
                  width={width}
                  // outerElementType={({ props, children }) => {
                  //     return (
                  //         <CustomScrollbars
                  //             ref={customScroll}
                  //             {...props}
                  //             onScroll={onScroll} style={{ height: bodyHeight }} id="customscroll">
                  //             {children}
                  //         </CustomScrollbars>)
                  // }}
                >
                  {RenderRow}
                </FixedSizeList>
              </tbody>
              <tfoot>
                <div
                  className="footer-div"
                  style={{ overflow: "hidden", width, height: footerHeight }}
                >
                  {footerGroups.map((group) => (
                    <tr {...group.getFooterGroupProps()}>
                      {group.headers.map((column) => (
                        <th
                          {...column.getFooterProps()}
                          className={
                            column.footerClassName ? column.footerClassName : ""
                          }
                        >
                          {column.render("Footer")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </div>
              </tfoot>
            </table>
          );
        }}
      </AutoSizer>
    </div>
  );
}
export default CustomTable;
