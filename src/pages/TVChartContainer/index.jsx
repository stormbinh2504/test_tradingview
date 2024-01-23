import * as React from "react";
import "./index.css";
// import { widget } from "../../charting_library";
import { widget } from "../../charting_library/charting_library.min";
import config from "../../configdata/combineConfig";
import Datafeed from "./datafeed.js";
// import "../../charting_library/index_custom.css";
import $ from "jquery";
import _ from "lodash";

const text_trans = {
  vi: {
    "text-buy": "MUA",
    "text-sell": "BÁN",
    "text-order": "Create Order",
    "text-by-price": "@",
    "text-LMT": "LMT",
  },
  en: {
    "text-buy": "BUY",
    "text-sell": "SELL",
    "text-order": "Create Order",
    "text-by-price": "@",
    "text-LMT": "LMT",
  },
};
function getTrans(name, language) {
  return text_trans[language][name];
}

export class TVChartContainer extends React.PureComponent {
  static defaultProps = {
    interval: "D",
    containerId: "tv_chart_container",
    datafeedUrl: "https://demo_feed.tradingview.com",
    libraryPath:
      config.app.ROUTER_BASE_NAME != null
        ? "/" + config.app.ROUTER_BASE_NAME + "charting_library/"
        : "/charting_library/",
    chartsStorageUrl: `${config.api.API_BASE_URL}userdata`,
    chartsStorageApiVersion: "v1",
    clientId: config.api.CLIENT_ID,
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    studiesOverrides: {
      "volume.volume.color.0": "#FF007A",
      "volume.volume.color.1": "#8ec919",
      "volume.volume.transparency": 70,
      "volume.volume ma.color": "#F5BC00",
      "volume.volume ma.transparency": 30,
      "volume.volume ma.linewidth": 5,
      "volume.volume ma.plottype": "line",
      "volume.show ma": true,
      "volume.options.showStudyArguments": false,
      "bollinger bands.median.color": "#33FF88",
      "bollinger bands.upper.linewidth": 7,
    },
    overrides: {
      // "paneProperties.background": "#23292F",
      // "paneProperties.vertGridProperties.color": "#28343C",
      // "paneProperties.horzGridProperties.color": "#28343C",

      "paneProperties.background": "#ffffff",
      "paneProperties.vertGridProperties.color": "#E6E6E6",
      "paneProperties.horzGridProperties.color": "#E6E6E6",

      // "paneProperties.background": "#FFA8C3",
      // "paneProperties.vertGridProperties.color": "#E6E6E6",
      // "paneProperties.horzGridProperties.color": "#E6E6E6",

      "scalesProperties.lineColor": "#555555",
      "scalesProperties.textColor": "#999999",
      "header_widget.background": "#23292F",

      //	Candles styles
      "mainSeriesProperties.candleStyle.upColor": "#8ec919",
      "mainSeriesProperties.candleStyle.downColor": "#FF007A",
      "mainSeriesProperties.candleStyle.drawWick": true,
      "mainSeriesProperties.candleStyle.drawBorder": true,
      "mainSeriesProperties.candleStyle.borderColor": "#378658",
      "mainSeriesProperties.candleStyle.borderUpColor": "#8ec919",
      "mainSeriesProperties.candleStyle.borderDownColor": "#FF007A",
      "mainSeriesProperties.candleStyle.wickUpColor": "rgba(142, 201, 25, 1)",
      "mainSeriesProperties.candleStyle.wickDownColor": "rgba(255, 0, 122, 1)",
      "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
    },
  };

  IS_CHANGE_THEME = true;

  renderBuyByPrice(order) {
    // MUA 10 ACB @ 1,010 LMT
    return (
      `<span class='text-default text-buy'>` +
      getTrans("text-buy", order.language) +
      ` </span>` +
      `<span class='text-symbol'>` +
      order.symbol +
      `</span>` +
      `<span class=''> ` +
      getTrans("text-by-price", order.language) +
      ` </span>` +
      `<span class='text-buy'>` +
      order.price +
      `</span>` +
      `<span class='text-LMT'> ` +
      getTrans("text-LMT", order.language) +
      `</span>`
    );
  }

  renderSellByPrice(order) {
    // B�N 10 ACB @ 1,010 LMT
    return (
      `<span class='text-default text-sell'>` +
      getTrans("text-sell", order.language) +
      ` </span>` +
      `<span class='text-symbol'>` +
      order.symbol +
      `</span>` +
      `<span class=''> ` +
      getTrans("text-by-price", order.language) +
      ` </span>` +
      `<span class='text-sell'>` +
      order.price +
      `</span>` +
      `<span class='text-LMT'> ` +
      getTrans("text-LMT", order.language) +
      `</span>`
    );
  }

  renderNewOrder(order) {
    return (
      `<span class='text-default text-order '>` +
      getTrans("text-order", order.language) +
      `</span>`
    );
  }

  load_overrides_light = () => {
    return {
      "paneProperties.background": "#ffffff",
      "paneProperties.vertGridProperties.color": "#E6E6E6",
      "paneProperties.horzGridProperties.color": "#E6E6E6",
    };
  };

  load_overrides_dark = () => {
    return {
      "paneProperties.background": "#23292F",
      "paneProperties.vertGridProperties.color": "#28343C",
      "paneProperties.horzGridProperties.color": "#28343C",
    };
  };

  load_overrides_blue = () => {
    return {
      "paneProperties.background": "#FFB6C1",
      "paneProperties.vertGridProperties.color": "#10d4d2",
      "paneProperties.horzGridProperties.color": "#10d4d2",
    };
  };

  splitThemeTradingView = (theme) => {
    let header = theme.split("-")[0];
    let end = theme.split("-")[2];
    console.log("heade-end", `${header}-${end}`);
    return `${header}-${end}`;
  };

  async changeClassCustom(defaultTheme, prevTheme) {
    // defaultTheme = this.props.defaultTheme;
    // let iframe = $("#tv_chart_container iframe").contents()
    let iframe = $("#" + this.props.containerId + " iframe").contents();
    let _html = iframe.find("html");
    let _head = iframe.find("head");

    const { language } = this.props;
    console.log(
      "changeClassCustom===========================",
      defaultTheme,
      prevTheme,
      language
    );

    // await $(_html).removeClass("theme-" + prevTheme);
    // await $(_html).addClass("theme-" + defaultTheme);

    await $(_html).removeClass("theme-dark");
    await $(_html).removeClass(prevTheme);
    await $(_html).addClass(defaultTheme);
    let script_url = "/script_custom.js";

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = script_url;
    await $(_head).append(script);
  }

  async applyTheme(defaultTheme, prevTheme) {
    this.IS_CHANGE_THEME = true;
    await this.changeClassCustom(defaultTheme, prevTheme);
  }

  tvWidget = null;
  tvWidgetReady = false;

  initWidget = () => {
    const { language } = this.props;
    let self = this;
    console.log("this.props.datafeedUrl", this.props.datafeedUrl);

    const widgetOptions = {
      symbol: this.props.symbol,
      // symbol: this.props.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      // datafeed: Datafeed,
      // datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
      //   "https://apis.bvsc.com.vn/tvcharts-1.0"
      // ),
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
        this.props.datafeedUrl
      ),
      interval: this.props.interval,
      container_id: this.props.containerId,
      library_path: this.props.libraryPath,

      locale: language || "en",
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: this.props.chartsStorageUrl,
      charts_storage_api_version: this.props.chartsStorageApiVersion,
      client_id: this.props.clientId,
      user_id: this.props.userId,
      fullscreen: this.props.fullscreen,
      autosize: this.props.autosize,
      studies_overrides: this.props.studiesOverrides,
      timezone: "Asia/Bangkok",
      overrides: this.props.overrides,
      custom_css_url: "/index_custom.css",

      // theme: "light",
      // toolbar_bg: "#ffffff",
    };

    const tvWidget = new widget(widgetOptions);
    this.tvWidget = tvWidget;

    tvWidget.onChartReady(() => {
      tvWidget.onContextMenu(function (unixtime, price) {
        let order = {
          symbol: "AAA",
          price: price,
          language: language,
        };

        return [
          {
            position: "top",
            text: self.renderBuyByPrice(order),
            click: function () {
              tvWidget.changeTheme("Light");
            },
          },
          { text: "-", position: "top" },
          { text: "-Objects Tree..." },
          {
            position: "top",
            text: self.renderSellByPrice(order),
            click: function () {
              // alert("Second clicked.");
              tvWidget.changeTheme("Dark");
            },
          },
          { text: "-", position: "top" },
          { text: "-Objects Tree..." },
          {
            position: "top",
            text: self.renderNewOrder(order),
            click: function () {
              alert("Third clicked.");
            },
          },
          { text: "-", position: "top" },
          { text: "-Objects Tree..." },
        ];
      });

      // widget.headerReady().then(function () {
      //   var button = widget.createButton();
      //   button.setAttribute("title", "My custom button tooltip");
      //   button.addEventListener("click", function () {
      //     alert("My custom button pressed!");
      //   });
      //   button.textContent = "My custom button caption";
      // });
    });
    window.addEventListener("storage", function (e) {
      if (self.IS_CHANGE_THEME) {
        self.changeClassCustom(
          self.splitThemeTradingView(self.props.theme),
          "theme-light"
        );
        self.IS_CHANGE_THEME = false;
      }
    });
  };

  doUpdateOrderLineChart(data) {
    if (data && data.length > 0) {
      var order = this.tvWidget
        .chart()
        .createOrderLine()
        .setText("Sell Line")
        .setLineLength(3)
        .setLineStyle(0)
        .setPrice(12000)
        .setQuantity(100)
        .setEditable(true)
        .setExtendLeft(false);

      console.log("order", order);

      order.onMove(function () {
        let data = {
          get_price: order.getPrice(),
          get_quanity: order._data.quantityText,
          get_code: order._line._ownerSource.m_symbol,
        };
        console.log("Move----------------------");
        console.log("get_price", data.get_price);
        console.log("get_quanity", data.get_quanity);
        console.log("get_code", data.get_code);
      });
    }
  }

  doUpdateOrderLineChart2(data) {
    console.log("lần 1");
    if (data && data.length > 0) {
      console.log("lần 3");
      this.tvWidget
        .chart()
        // .createPositionLine()
        // .setText("PROFIT: 71.1 (3.31%)")
        // .setQuantity("8.235")
        // .setPrice(15.5)
        // .setExtendLeft(false)
        // .setLineStyle(0)
        // .setLineLength(25);
        .createExecutionShape()
        .setText("@1,320.75 Limit Buy 1")
        .setTooltip("@1,320.75 Limit Buy 1")
        .setTextColor("rgba(0,255,0,0.5)")
        .setArrowColor("#0F0")
        .setDirection("buy")
        .setTime(1413559061758)
        .setPrice(15000);
    }
  }

  async componentDidUpdate(prevProps) {
    const { language, theme } = this.props;
    const { language: prevLanguage, theme: prevTheme } = prevProps;
    console.log("this.tvWidget", this.tvWidget);

    // this.changeClassCustom(
    //   this.splitThemeTradingView(theme),
    //   this.splitThemeTradingView(prevTheme)
    // );
    // console.log(
    //   "this.splitThemeTradingView(theme)",
    //   this.splitThemeTradingView(theme)
    // );

    // console.log(
    //   "this.splitThemeTradingView(prevTheme)",
    //   this.splitThemeTradingView(prevTheme)
    // );
    // changeClassCustom(defaultTheme, prevTheme);

    // this.changeClassCustom("light", "dark");

    // let split_theme = this.splitThemeTradingView(theme);
    // console.log("split_theme", split_theme);

    let override_dark = this.load_overrides_dark();
    let override_light = this.load_overrides_light();
    let override_blue = this.load_overrides_blue();
    if (this.tvWidget) {
      if (language !== prevLanguage) {
        if (this.tvWidgetReady) {
          await this.tvWidget.setLanguage(language);
        } else {
          console.log("binh", this.tvWidget);
          await this.tvWidget.onChartReady(() => {
            this.tvWidget.setLanguage(language);
            // this.doUpdateOrderLineChart([1, 2]);
            // var order = this.tvWidget
            //   .chart()
            //   .createOrderLine()
            //   .setText("Buy Line")
            //   .setLineLength(3)
            //   .setLineStyle(0)
            //   .setQuantity("221.235 USDT");
            // order.setPrice(12000);
          });
        }
      }
      if (theme !== prevProps.theme && theme === "theme-mode-light") {
        if (this.tvWidgetReady) {
          await this.tvWidget.applyOverrides(override_light);
          await this.applyTheme(
            this.splitThemeTradingView(theme),
            this.splitThemeTradingView(prevTheme)
          );
        } else {
          await this.tvWidget.onChartReady(() => {
            this.tvWidget.applyOverrides(override_light);
            this.applyTheme(
              this.splitThemeTradingView(theme),
              this.splitThemeTradingView(prevTheme)
            );
          });
        }
      }
      if (theme !== prevProps.theme && theme === "theme-mode-dark") {
        if (this.tvWidgetReady) {
          await this.tvWidget.applyOverrides(override_dark);
          await this.applyTheme(
            this.splitThemeTradingView(theme),
            this.splitThemeTradingView(prevTheme)
          );
        } else {
          console.log("binh", this.tvWidget);
          await this.tvWidget.onChartReady(() => {
            this.tvWidget.applyOverrides(override_dark);
            this.applyTheme(
              this.splitThemeTradingView(theme),
              this.splitThemeTradingView(prevTheme)
            );
            this.doUpdateOrderLineChart([1, 2]);
            this.doUpdateOrderLineChart2([1, 2]);

            // var order = this.tvWidget
            //   .chart()
            //   .createOrderLine()
            //   .setText("Buy Line")
            //   .setLineLength(3)
            //   .setLineStyle(0)
            //   .setQuantity("221.235 USDT");
            // order.setPrice(12000);
          });
        }
      }
      if (theme !== prevProps.theme && theme === "theme-mode-blue") {
        if (this.tvWidgetReady) {
          await this.tvWidget.applyOverrides(override_blue);
          await this.applyTheme(
            this.splitThemeTradingView(theme),
            this.splitThemeTradingView(prevTheme)
          );
        } else {
          await this.tvWidget.onChartReady(() => {
            this.tvWidget.applyOverrides(override_blue);
            this.applyTheme(
              this.splitThemeTradingView(theme),
              this.splitThemeTradingView(prevTheme)
            );
          });
        }
      }
      // if (this.tvWidgetReady) {
      //   this.doUpdateOrderLineChart();
      // }
    } else {
      this.initWidget();
    }
  }

  componentWillUnmount() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

  render() {
    return <div id={this.props.containerId} className={"TVChartContainer"} />;
  }
}
