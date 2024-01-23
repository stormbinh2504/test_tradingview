import React, { Component } from "react";
import "./table.css";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataShow: this.initDataShow,
      currPage: 0,
    };
  }
  initDataShow =
    this.props.limit && this.props.bodyData
      ? this.props.bodyData.slice(0, Number(this.props.limit))
      : this.props.bodyData;

  pages = 1;

  range = [];

  render() {
    console.log("aaaaaaaaaaaaaaaa");
    if (this.props.limit !== undefined) {
      let page = Math.floor(
        this.props.bodyData.length / Number(this.props.limit)
      );
      this.pages =
        this.props.bodyData.length % Number(this.props.limit) === 0
          ? page
          : page + 1;
      this.range = [...Array(this.pages).keys()];
    }

    const selectPage = (page) => {
      const start = Number(this.props.limit) * page;
      const end = start + Number(this.props.limit);

      this.setState({ dataShow: this.props.bodyData.slice(start, end) });

      this.setState({ currPage: page });
    };

    return (
      <div>
        <div className="table-wrapper">
          <table>
            {this.props.headData && this.props.renderHead ? (
              <thead>
                <tr>
                  {this.props.headData.map((item, index) =>
                    this.props.renderHead(item, index)
                  )}
                </tr>
              </thead>
            ) : null}
            {this.props.bodyData && this.props.renderBody ? (
              <tbody>
                {this.state.dataShow.map((item, index) =>
                  this.props.renderBody(item, index)
                )}
              </tbody>
            ) : null}
          </table>
        </div>
        {this.pages > 1 ? (
          <div className="table__pagination">
            {this.range.map((item, index) => (
              <div
                key={index}
                className={`table__pagination-item ${
                  this.currPage === index ? "focus" : ""
                }`}
                onClick={() => selectPage(index)}
              >
                {item + 1}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

export default Table;
