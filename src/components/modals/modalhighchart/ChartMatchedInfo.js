import React, { Component } from "react";
import Highcharts from "highcharts";
import "./ChartMatchedInfo.css";
import moment from "moment";

const getChart1 = () => {
  const labelStyle = {
    color: "white",
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 200,
    fontSize: "0.55rem",
  };
  const tooltipStyle = {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 200,
    // fontSize: '0.65rem'
  };
  let inday_chart = Highcharts.chart("chart-container-inday", {
    chart: {
      height: null,
      plotBorderWidth: 0.5,
      marginTop: 15,
      marginBottom: 30,
      marginRight: 10,
      spacing: [0, 5, 0, 5],
      //backgroundColor: 'rgba(58, 62, 70, 0.3)',
      alignTicks: false,
    },
    title: {
      text: "",
    },
    credits: false,
    legend: false,

    tooltip: {
      shared: true,
      snap: false,
      padding: 5,
      paddingBottom: 3,
      crosshairs: true,
      //   formatter: function () {
      //     let time = moment(this.x).format("HH:mm:ss");
      //     if (this.points.length === 2) {
      //       window.hoveringPoint = this;
      //       return `${time}
      // 					<br/>
      // 					<span>${LanguageUtils.getMessageByKey(
      //           "trade.symbol-detail-modal.amt",
      //           lang
      //         )}<span>
      // 					<span style="color:${this.points[0].color};">
      // 						${CommonUtils.formatAccounting(Math.abs(this.points[0].y), 2)}
      // 					</span>
      // 					<br/>
      // 					<span>${LanguageUtils.getMessageByKey(
      //           "trade.symbol-detail-modal.qtty",
      //           lang
      //         )}</span>
      // 					<span>
      // 						${CommonUtils.formatAccounting(Math.abs(this.points[1].y))}
      // 					</span>
      // 					`;
      //     }
      //   },
      style: tooltipStyle,
      backgroundColor: "#fff",
    },

    xAxis: {
      type: "datetime",
      labels: {
        formatter() {
          return moment(this.value).format("H") + "h";
        },
      },
      gridLineWidth: 0.15,
      tickLength: 0,
      min: moment().hours(8).minutes(59).seconds(59).valueOf(),
      max: moment().hours(15).minutes(0).seconds(0).valueOf(),
      tickInterval: 3.6e6, // 1 hour
      gridLineColor: "dark",
    },

    yAxis: [
      {
        title: {
          text: "",
        },
        gridLineColor: false,
        labels: {
          enabled: false,
        },
        plotLines: [
          {
            value: 7700,
            width: 0.6,
            dashStyle: "LongDash",
            color: "#ff851b",
          },
        ],
      },
      {
        title: {
          text: "",
        },
        type: "category",
        gridLineColor: "",
        labels: {
          enabled: false,
          format: "{value}",
          style: labelStyle,
        },
        //opposite: true,
        tickInterval: 400,
        min: 0,
      },
    ],

    plotOptions: {
      series: {
        animation: false,
        lineWidth: 1,
        color: "#3ed244",
        negativeColor: "#fa2d28",
        fillOpacity: 0.3,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
      },
    },
    series: [
      {
        type: "line",
        data: [],
        step: "left",
        zIndex: 2,
        threshold: 7700,
        marker: {
          radius: 3,
        },
      },
      {
        type: "column",
        data: [],
        yAxis: 1,
        color: "rgba(96, 160, 255, 0.75)",
        zIndex: 1,
        pointWidth: 0.1,
        borderWidth: 0,
        marker: {
          radius: 3,
        },
      },
      {
        data: [
          29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
          95.6, 54.4,
        ],
      },
    ],
    // tooltip: no,
  });
  return inday_chart;
};

const data_chart_match = {
  categories: [
    "30.4",
    "30.5",
    "30.6",
    "30.7",
    "30.8",
    "30.4",
    "30.5",
    "30.6",
    "30.7",
    "30.8",
    "30.4",
    "30.5",
    "30.6",
    "30.7",
    "30.8",
    "30.4",
    "30.5",
    "30.6",
    "30.7",
    "30.8",
  ],
  data: [
    500, 300, 400, 700, 200, 300, 300, 300, 400, 500, 500, 300, 400, 700, 200,
    300, 300, 300, 400, 500,
  ],
};

const getChart = () => {
  const labelStyle = {
    color: "white",
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 200,
    fontSize: "0.55rem",
  };
  let info_chart = Highcharts.chart("chart-container-info", {
    chart: {
      type: "bar",
      marginTop: 15,
      marginBottom: 30,
      marginRight: 10,
      spacing: [0, 5, 0, 5],
    },
    title: {
      text: "Biểu đổ tổng hợp lệnh theo giá",
    },
    xAxis: {
      categories: data_chart_match.categories,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Total fruit consumption",
      },
    },
    legend: {
      reversed: true,
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: false,
        },
      },
      series: {
        animation: false,
        // enableMouseTracking: false,
        lineWidth: 1,
        color: "red",
        negativeColor: "blue",
        fillOpacity: 0.3,
      },
    },
    series: [
      {
        name: "Giá",
        data: data_chart_match.data,
        zIndex: 2,
      },
    ],
    // tooltip: no,
  });
  return info_chart;
};

class ChartMatchedInfo extends Component {
  componentDidMount() {
    getChart();
  }
  render() {
    return (
      <div id="chart-container-info" className="chart-container-info"></div>
    );
  }
}

export default ChartMatchedInfo;
