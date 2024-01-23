import React, { Component } from "react";
import CustomTable from "../components/table/TableFs2/CustomTable";

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultColumn: {
        headerClassName: "text-center",
      },
      records: [],
      columnToDisplay: {
        headerClassName: "text-center sticky-column action-btn-col",
        id: "col1",
        accessor: "checked",
        disableSortBy: true,
        disableFilters: true,
        width: 40,
        cellClassName:
          "text-center custom-checkbox sticky-column action-btn-col",
        footerClassName: "text-right sticky-column action-btn-col",
      },
    };
  }

  render() {
    return (
      <div>
        <CustomTable
          columns={this.state.columnToDisplay}
          data={this.state.records}
          defaultColumn={this.state.defaultColumn}
        ></CustomTable>
      </div>
    );
  }
}

export default Analytics;
