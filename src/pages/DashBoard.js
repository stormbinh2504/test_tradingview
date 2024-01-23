import React, { Component } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { connect } from "react-redux";
import Chart from "react-apexcharts";
import latestOrders from "../data/latestOrders.json";
import chartOptions from "../data/chartOptions.json";
// import CustomTable from "../components/table/CustomTable";
import TableReact from "../components/table/TableReact";
import { Table, Tag, Space } from "antd";
import TableReactSort from "../components/table/TableReactSort";
import TableReactFilter from "../components/table/TableReactFilter";
import StickyTable from "../components/table/tablesticky/StickyTable";
import TestSticky from "../components/table/tablesticky/TestSticky";
import PlaceOrder from "../components/placeorder/PlaceOrder";
import PlaceOrderNew from "../components/placeorder/newplaceoder/PlaceOrderNew";
import CountDown from "../components/CountDown/CountDown";
import Timer from "../components/CountDown/Timer";

const { Column, ColumnGroup } = Table;

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_user: "",
      filter_user: [],
    };
  }

  renderOrderHead = (item, index) => <th key={index}>{item}</th>;

  renderOrderBody = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.user}</td>
      <td>{item.price}</td>
      <td>{item.phone}</td>
      <td>{item.date}</td>
      <td>
        {/* <Badge type={orderStatus[item.status]} content={item.status} /> */}
        abc
      </td>
    </tr>
  );

  onHandleChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;
    let listUser = latestOrders.body.filter((order) => {
      return order.user.toLowerCase().includes(value.toLowerCase());
    });
    this.setState({
      [name]: value,
      filter_user: listUser,
    });
  };

  componentDidMount() {
    this.setState({
      filter_user: latestOrders.body,
    });
  }

  // onHandelSearch = () => {
  //   var filter_user = latestOrders.body.filter((order) => {
  //     return order.user
  //       .toLowerCase()
  //       .includes(this.state.search_user.toLowerCase());
  //   });
  //   console.log("filter_user", filter_user);
  //   return filter_user;
  // };

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.state.search_user === nextState.search_user) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  //

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.search_user === this.state.search_user) {
  //     this.setState({ search_user: this.state.search_user });
  //   }
  // }
  // componentWillMount() {
  //   this.onHandelSearch();
  // }
  defaultColumn = {
    headerClassName: "text-center",
  };

  render() {
    const { ThemeReducer } = this.props;
    const { search_user, filter_user } = this.state;

    return (
      <div>
        <h2 className="page-header">Dashboard</h2>
        <Container
          orientation="horizontal"
          onDrop={this.onColumnDrop}
          // dragHandleSelector=".column-drag-handle"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "cards-drop-preview",
          }}
        >
          <div className="row">
            <div className="col-6">
              <div className="card full-height">
                <Chart
                  options={
                    ThemeReducer.mode === "theme-mode-dark"
                      ? {
                          ...chartOptions.options,
                          theme: { mode: "dark" },
                        }
                      : {
                          ...chartOptions.options,
                          theme: { mode: "light" },
                        }
                  }
                  series={chartOptions.series}
                  type="line"
                  height="100%"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="card full-height">
                <Chart
                  options={
                    ThemeReducer.mode === "theme-mode-dark"
                      ? {
                          ...chartOptions.options,
                          theme: { mode: "dark" },
                        }
                      : {
                          ...chartOptions.options,
                          theme: { mode: "light" },
                        }
                  }
                  series={chartOptions.series}
                  type="line"
                  height="100%"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="card">
                <div className="card__header">
                  <h3>latest orders</h3>
                </div>
                <div className="card__search">
                  <input
                    type="text"
                    placeholder="Search here..."
                    name="search_user"
                    value={search_user}
                    onChange={this.onHandleChange}
                  ></input>
                </div>
                <div className="card__body">
                  {/* <TableReact></TableReact> */}
                  {/* <TestSticky></TestSticky> */}
                  {/* <StickyTable></StickyTable> */}
                  {/* <TableReactSort></TableReactSort> */}
                  {/* <TableReactFilter></TableReactFilter> */}
                  {/* <CustomTable
                  onChange={this.onHandleChange}
                  columns={latestOrders.header}
                  data={filter_user}
                  defaultColumn={this.defaultColumn}
                ></CustomTable> */}
                  {/* <Table
                  limit="5"
                  headData={latestOrders.header}
                  renderHead={(item, index) =>
                    this.renderOrderHead(item, index)
                  }
                  // bodyData={latestOrders.body}
                  bodyData={filter_user}
                  renderBody={(item, index) =>
                    this.renderOrderBody(item, index)
                  }
                /> */}
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row">
                <div className="col-5">
                  {/* <PlaceOrder></PlaceOrder> */}
                  <PlaceOrderNew></PlaceOrderNew>
                </div>
                {/* <div className="col-7">
                  <StickyTable></StickyTable>
                </div> */}
              </div>
            </div>
            <div className="col-12">
              <CountDown></CountDown>
              <Timer></Timer>
            </div>
          </div>
        </Container>
      </div>
    );
  }
  onColumnDrop(dropResult) {
    // const scene = Object.assign({}, this.state.scene);
    // scene.children = applyDrag(scene.children, dropResult);
    // this.setState({
    //   scene,
    // });
  }
}

const mapStateToProps = (state) => {
  return {
    ThemeReducer: state.ThemeReducer,
  };
};

export default connect(mapStateToProps, null)(DashBoard);
