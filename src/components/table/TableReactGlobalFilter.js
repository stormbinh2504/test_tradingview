import React from "react";

const TableReactGlobalFilter = ({ filter, setFilter }) => {
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

export default TableReactGlobalFilter;
