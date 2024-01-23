import React, { Component } from "react";
import moment from "moment";
import Highcharts from "highcharts";

var data1 = [
  ["2018-08-24T00:00:00.000Z", 3],
  ["2018-08-24T00:01:00.000Z", 4],
  ["2018-08-24T00:02:00.000Z", 3],
  ["2018-08-24T00:03:00.000Z", 4],
  ["2018-08-24T00:04:00.000Z", 5],
  ["2018-08-24T00:05:00.000Z", 4],
  ["2018-08-24T00:06:00.000Z", 5],
  ["2018-08-24T00:07:00.000Z", 6],
  ["2018-08-24T00:08:00.000Z", 5],
  ["2018-08-24T00:09:00.000Z", 5],
  ["2018-08-24T00:10:00.000Z", 5],
  ["2018-08-24T00:11:00.000Z", 6],
  ["2018-08-24T00:12:00.000Z", 3],
  ["2018-08-24T00:13:00.000Z", 5],
  ["2018-08-24T00:14:00.000Z", 5],
  ["2018-08-24T00:15:00.000Z", 6],
  ["2018-08-24T00:16:00.000Z", 5],
  ["2018-08-24T00:17:00.000Z", 4],
  ["2018-08-24T00:18:00.000Z", 5],
  ["2018-08-24T00:19:00.000Z", 4],
  ["2018-08-24T00:20:00.000Z", 6],
  ["2018-08-24T00:21:00.000Z", 6],
  ["2018-08-24T00:22:00.000Z", 5],
  ["2018-08-24T00:23:00.000Z", 5],
  ["2018-08-24T00:24:00.000Z", 4],
  ["2018-08-24T00:25:00.000Z", 5],
  ["2018-08-24T00:26:00.000Z", 4],
  ["2018-08-24T00:27:00.000Z", 6],
  ["2018-08-24T00:28:00.000Z", 3],
  ["2018-08-24T00:29:00.000Z", 7],
  ["2018-08-24T00:30:00.000Z", 6],
  ["2018-08-24T00:31:00.000Z", 4],
  ["2018-08-24T00:32:00.000Z", 4],
  ["2018-08-24T00:33:00.000Z", 8],
  ["2018-08-24T00:34:00.000Z", 4],
  ["2018-08-24T00:35:00.000Z", 6],
  ["2018-08-24T00:36:00.000Z", 6],
  ["2018-08-24T00:37:00.000Z", 4],
  ["2018-08-24T00:38:00.000Z", 8],
  ["2018-08-24T00:39:00.000Z", 5],
  ["2018-08-24T00:40:00.000Z", 5],
  ["2018-08-24T00:41:00.000Z", 4],
  ["2018-08-24T00:42:00.000Z", 7],
  ["2018-08-24T00:43:00.000Z", 6],
  ["2018-08-24T00:44:00.000Z", 6],
  ["2018-08-24T00:45:00.000Z", 7],
  ["2018-08-24T00:46:00.000Z", 4],
  ["2018-08-24T00:47:00.000Z", 6],
  ["2018-08-24T00:48:00.000Z", 7],
  ["2018-08-24T00:49:00.000Z", 5],
  ["2018-08-24T00:50:00.000Z", 6],
  ["2018-08-24T00:51:00.000Z", 6],
  ["2018-08-24T00:52:00.000Z", 6],
  ["2018-08-24T00:53:00.000Z", 5],
];

data1.map((elem) => {
  elem[0] = new Date(elem[0]).getTime();
  return elem;
});

const getChart = () => {
  const chartContainer = document.getElementById("chart-container-inday");
  const labelStyle = {
    color: "#0c7f87",
    fontWeight: 200,
    fontSize: "0.55rem",
  };
  const tooltipStyle = {
    fontWeight: 200,
  };
  let inday_chart = Highcharts.chart({
    chart: {
      height: null,
      plotBorderWidth: 0.5,
      marginTop: 15,
      marginBottom: 30,
      marginRight: 10,
      spacing: [0, 5, 0, 5],
      renderTo: chartContainer,
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
      formatter: function () {
        let time = moment(this.x).format("HH:mm:ss");
        console.log("this.points", this.points);
        console.log("this.x", this.x);
        console.log("this.y", this.y);

        if (this.points.length === 2) {
          window.hoveringPoint = this;
          // return `${time}`;
          // return `<span">
          // 		binh
          // 	</span>`;
          return (
            "</b><br/>" +
            Highcharts.dateFormat("%I %p", this.x) +
            " date, " +
            this.y +
            " Kg."
          );
        }
      },
      style: tooltipStyle,
      backgroundColor: "#red",
    },

    xAxis: {
      type: "datetime",
      min: 1535068800000,
      max: 1535130316000,
      labels: {
        format: "{value:%H:%M}",
      },
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
            value: 16800,
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
        data: data1,
        // data: [1629861921000, 1629863302000, 1629865764000],
        // data: [],
        step: "left",
        zIndex: 2,
        threshold: 16800,
        marker: {
          radius: 3,
        },
      },
      {
        type: "column",
        // data: [1629861921000, 1629863302000, 1629865764000],
        // data: [1, 2, 3],
        // data: [],
        data: data1,
        yAxis: 1,
        color: "rgba(96, 160, 255, 0.75)",
        zIndex: 1,
        pointWidth: 0.1,
        borderWidth: 0,
        marker: {
          radius: 3,
        },
      },
    ],
    // tooltip: no,
  });
  return inday_chart;
};

class ChartMatchedInDay extends Component {
  componentDidMount() {
    getChart();
  }
  render() {
    return (
      <div className="chart-container-inday" id="chart-container-inday"></div>
    );
  }
}

export default ChartMatchedInDay;
