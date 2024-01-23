import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./gridlayout.scss";
import PlaceOrderNew from "../placeorder/newplaceoder/PlaceOrderNew";
import StickyTable from "../table/tablesticky/StickyTable";
import Chart from "react-apexcharts";
import chartOptions from "../../data/chartOptions.json";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class ShowcaseLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBreakpoint: "lg",
      compactType: "horizontal",
      mounted: false,
      layouts: { lg: props.initialLayout },
    };

    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onCompactTypeChange = this.onCompactTypeChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onNewLayout = this.onNewLayout.bind(this);
  }

  componentDidMount() {
    this.setState({ mounted: true });
    console.log("hahahah", generateLayout());
  }

  generateDOM() {
    let arrItems = [];
    arrItems.push(<PlaceOrderNew></PlaceOrderNew>);
    arrItems.push(<StickyTable></StickyTable>);
    // arrItems.push(
    //   <Chart
    //     options={{
    //       ...chartOptions.options,
    //       theme: { mode: "light" },
    //     }}
    //     series={chartOptions.series}
    //     type="line"
    //     height="100%"
    //   />
    // );
    return _.map(arrItems, function (l, i) {
      return <div key={i}>{l}</div>;
    });
    // return (
    //   <div>
    //     <PlaceOrderNew></PlaceOrderNew>
    //     <StickyTable></StickyTable>
    //   </div>
    // );
  }

  onBreakpointChange(breakpoint) {
    this.setState({
      currentBreakpoint: breakpoint,
    });
  }

  onCompactTypeChange() {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
        ? null
        : "horizontal";
    this.setState({ compactType });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  onNewLayout() {
    this.setState({
      layouts: { lg: generateLayout() },
    });
  }

  ResizeHandle = () => {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      ></div>
    );
  };

  render() {
    return (
      <div>
        <div>
          Current Breakpoint: {this.state.currentBreakpoint} (
          {this.props.cols[this.state.currentBreakpoint]} columns)
        </div>
        <div>
          Compaction type:{" "}
          {_.capitalize(this.state.compactType) || "No Compaction"}
        </div>
        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <button onClick={this.onCompactTypeChange}>
          Change Compaction Type
        </button>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
          // draggableHandle={
          //   ".widget-header, .widget-header *, .widget-move-handle"
          // }
          draggableHandle={".widget-title ,.widget-header"}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

ShowcaseLayout.propTypes = {
  onLayoutChange: PropTypes.func.isRequired,
};

ShowcaseLayout.defaultProps = {
  className: "layout",
  rowHeight: 30,
  onLayoutChange: function () {},
  // cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  initialLayout: generateLayout(),
};

function generateLayout() {
  // return _.map(_.range(0, 2), function (item, i) {
  //   var y = Math.ceil(Math.random() * 4) + 1;
  //   var a = {
  //     x: (_.random(0, 5) * 2) % 12,
  //     y: Math.floor(i / 6) * y,
  //     w: 6,
  //     h: y,
  //     i: i.toString(),
  //     static: Math.random() < 0.05,
  //   };
  //   console.log("aqew", a);
  //   return a;
  // });

  let arrlayout = [];
  for (var i = 1; i <= 3; i++) {
    if (i === 1) {
      _.map(_.range(0, 1), function (item, i) {
        arrlayout.push({
          x: 0,
          y: 0,
          w: 3,
          h: 15,
          i: i.toString(),
        });
      });
    }
    if (i === 2) {
      _.map(_.range(0, 1), function (item, i) {
        arrlayout.push({
          x: 3,
          y: 0,
          w: 9,
          h: 9,
          i: (i + 1).toString(),
        });
      });
    }
    if (i === 3) {
      _.map(_.range(0, 1), function (item, i) {
        arrlayout.push({
          x: 0,
          y: 1,
          w: 12,
          h: 9,
          i: (i + 2).toString(),
        });
      });
    }
  }

  console.log("arrlayout", arrlayout);
  return arrlayout.map((item, index) => {
    console.log("itemmmm", index, item);
    return item;
  });
  // console.log("arrlayout", arrlayout);
  // return _.map(arrlayout, function (item, i) {
  //   console.log("item", item);
  //   return item;
  // });
}
