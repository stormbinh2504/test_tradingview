import React, { PureComponent, Component } from 'react';
import { CommonUtils, ToastUtil, Role, Random, Event, NumberFormatUtils, modules, getValueFromLocalStorage, setValueToLocalStorage, keyFactory } from "../../utils";
import './index.css';
import $ from 'jquery';
import { widget } from '../../charting_library/charting_library.min';
import Datafeed from './datafeed.js';
import config from '../../combineConfig';
import _ from 'lodash';
import { accountService, inquiryService, fdsInquiryService } from "../../services";
import * as actions from "../../store/actions";
import { emitter } from '../../clients/emitter';

const text_trans = {
    "vi": {
        // "text-buy": "MUA",
        // "text-sell": "BAN",
        // "text-order": "Dat lenh",
        // "text-by-price": "@",
        // "text-LMT": "LMT",
        "text-buy": "BUY",
        "text-sell": "SELL",
        "text-order": "Create Order",
        "text-by-price": "@",
        "text-LMT": "LMT",
        "text-show-orders": "Show button Orders",
        "text-hide-orders": "Hide button Orders",
        "text-show-positions": "Show button Positions",
        "text-hide-positions": "Hide button Positions",
    },
    "en": {
        "text-buy": "BUY",
        "text-sell": "SELL",
        "text-order": "Create Order",
        "text-by-price": "@",
        "text-LMT": "LMT",
        "text-show-orders": "Show button Orders",
        "text-hide-orders": "Hide button Orders",
        "text-show-positions": "Show button Positions",
        "text-hide-positions": "Hide button Positions",
    }
}
function getTrans(name, language) {
    return text_trans[language][name]
}

export class TVChartContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.listenToTheEmitter();
    }
    static defaultProps = {
        interval: 'D',
        containerId: 'tv_chart_container',
        datafeedUrl: 'https://demo_feed.tradingview.com',
        libraryPath: config.app.ROUTER_BASE_NAME != null ? '/' + config.app.ROUTER_BASE_NAME + 'charting_library/' : '/charting_library/',
        chartsStorageUrl: `${config.api.API_BASE_URL}userdata`,
        chartsStorageApiVersion: 'v1',
        clientId: config.api.CLIENT_ID,
        userId: 'public_user_id',
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
            "bollinger bands.upper.linewidth": 7
        },
        // overrides: {
        //     // "paneProperties.background": "#23292F",
        //     "paneProperties.background":  stylecss["theme-dark-dark-2_"],
        //     "paneProperties.vertGridProperties.color": "#28343C",
        //     "paneProperties.horzGridProperties.color": "#28343C",
        //     "scalesProperties.lineColor": "#555555",
        //     "scalesProperties.textColor": "#999999",
        //     // "header_widget.background": "#23292F",
        //     "header_widget.background": stylecss["theme-dark-dark-2_"],

        //     //	Candles styles
        //     "mainSeriesProperties.candleStyle.upColor": "#8ec919",
        //     "mainSeriesProperties.candleStyle.downColor": "#FF007A",
        //     "mainSeriesProperties.candleStyle.drawWick": true,
        //     "mainSeriesProperties.candleStyle.drawBorder": true,
        //     "mainSeriesProperties.candleStyle.borderColor": "#378658",
        //     "mainSeriesProperties.candleStyle.borderUpColor": "#8ec919",
        //     "mainSeriesProperties.candleStyle.borderDownColor": "#FF007A",
        //     "mainSeriesProperties.candleStyle.wickUpColor": 'rgba(142, 201, 25, 1)',
        //     "mainSeriesProperties.candleStyle.wickDownColor": 'rgba(255, 0, 122, 1)',
        //     "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false
        // }
    };
    IS_CHANGE_THEME = true;
    IS_FIRST_UPDATE = true;
    IS_RELOAD_UPDATE = false;
    IS_FIRST_UPDATE_POSITIONS = true;
    IS_RELOAD_UPDATE_POSITIONS = false;
    currentTheme = this.props.defaultTheme;
    tvWidget = null;
    tvWidgetReady = false;
    ListOrder = {};
    ListTypeOrder = {};
    ListPositions = {};
    ListTypePositions = {};
    ListQttyPositions = {};
    ListWithDrawPositions = {};
    ListPendingsQttyPositions = {};
    ListPositionTypePositions = {};
    LastClosePrice;
    IS_SHOW_ORDERS_TV = true;
    IS_SHOW_POSITIONS_TV = true;
    // "text-buy": "BUY",
    // "text-sell": "SELL",
    // "text-order": "Order",
    // "text-by-price": "by price"
    renderBuyByPrice(order) {
        let self = this
        // MUA 10 ACB @ 1,010 LMT
        return `<span class='text-default text-buy'>` + getTrans('text-buy', self.props.language) + ` </span>`
            + `<span class='text-symbol'>` + order.symbol + `</span>`
            + `<span class=''> ` + getTrans('text-by-price', self.props.language) + ` </span>`
            + `<span class='text-buy'>` + order.price + `</span>`
            + `<span class='text-LMT'> ` + getTrans('text-LMT', self.props.language) + `</span>`
    }

    renderSellByPrice(order) {
        let self = this
        // B�N 10 ACB @ 1,010 LMT
        return `<span class='text-default text-sell'>` + getTrans('text-sell', self.props.language) + ` </span>`
            + `<span class='text-symbol'>` + order.symbol + `</span>`
            + `<span class=''> ` + getTrans('text-by-price', self.props.language) + ` </span>`
            + `<span class='text-sell'>` + order.price + `</span>`
            + `<span class='text-LMT'> ` + getTrans('text-LMT', self.props.language) + `</span>`
    }

    renderNewOrder(order) {
        let self = this
        return `<span class='text-default text-order '>` + getTrans('text-order', self.props.language) + `</span>`
    }

    renderSettingOrders(IS_SHOW) {
        let self = this
        let key = IS_SHOW ? 'text-show-orders' : 'text-hide-orders'
        return `<span class='text-setting-order'>` + getTrans(key, self.props.language) + `</span>`
    }

    renderSettingPositions(IS_SHOW) {
        let self = this
        let key = IS_SHOW ? 'text-show-positions' : 'text-hide-positions'
        return `<span class='text-setting-position'>` + getTrans(key, self.props.language) + `</span>`
    }

    onFilterNewOrder(data) {
        let self = this
        self.props.setShowOrderPopupCustom(data)
    }


    load_overrides = () => {
        let { cssChart } = this.props;
        return {
            "paneProperties.background": cssChart.background,
            "paneProperties.vertGridProperties.color": cssChart.vertGridColor,
            "paneProperties.horzGridProperties.color": cssChart.horzGridColor,
            "scalesProperties.lineColor": "#555555",
            "scalesProperties.textColor": "#999999",
            //	Candles styles
            "mainSeriesProperties.candleStyle.upColor": "#8ec919",
            "mainSeriesProperties.candleStyle.downColor": "#FF007A",
            "mainSeriesProperties.candleStyle.drawWick": true,
            "mainSeriesProperties.candleStyle.drawBorder": true,
            "mainSeriesProperties.candleStyle.borderColor": "#378658",
            "mainSeriesProperties.candleStyle.borderUpColor": "#8ec919",
            "mainSeriesProperties.candleStyle.borderDownColor": "#FF007A",
            "mainSeriesProperties.candleStyle.wickUpColor": 'rgba(142, 201, 25, 1)',
            "mainSeriesProperties.candleStyle.wickDownColor": 'rgba(255, 0, 122, 1)',
            "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,

        }
    }

    initWidget = (defaultSymbol) => {
        console.log('initWidget ChartTrading')
        let { currentAccount, language, defaultTheme, currentSymbol, symbols, indexOverwrite } = this.props;
        this.currentTheme = defaultTheme
        let overrides = this.load_overrides()
        const widgetOptions = {
            symbol: defaultSymbol,
            // BEWARE: no trailing slash is expected in feed URL
            datafeed: Datafeed,
            interval: this.props.interval,
            // container_id: this.props.containerId,
            container_id: `${this.props.containerId}${this.props.callerId}`,
            library_path: this.props.libraryPath,
            locale: language || 'en',
            charts_storage_url: this.props.chartsStorageUrl,
            charts_storage_api_version: this.props.chartsStorageApiVersion,
            client_id: this.props.clientId,
            user_id: currentAccount ? currentAccount.id : this.props.userId,
            fullscreen: this.props.fullscreen,
            autosize: this.props.autosize,
            studies_overrides: this.props.studiesOverrides,
            disabled_features: ["use_localstorage_for_settings", "header_screenshot", "header_fullscreen_button"],
            // disabled_features: ["use_localstorage_for_settings", "header_screenshot", "header_fullscreen_button", "go_to_date"],
            enabled_features: ["study_templates", "side_toolbar_in_fullscreen_mode"],
            // toolbar_bg: '#262d33',
            toolbar_bg: overrides.toolbar_bg,
            // loading_screen: {
            //     foregroundColor: overrides.toolbar_bg,
            //     backgroundColor: overrides.toolbar_bg
            // },
            Loading_screen: { backgroundColor: "#125236" },
            timezone: 'Asia/Bangkok',
            // overrides: this.props.overrides,

            overrides: overrides,
            drawings_access: {
                type: 'Light',
                tools: [{
                    name: "Regression Trend"
                }]
            },
            // theme: defaultTheme == 'dark' ? 'Dark' : 'Light', // dont working when overrides enable,
            custom_css_url: process.env.PUBLIC_URL + '/charting_library/index_custom.css'
        };

        //khi wiget bị render nhiều lần, cần check element trước khi render
        if (widgetOptions.container_id) {
            let elementExists = document.getElementById(widgetOptions.container_id);
            if (!elementExists) return;
        }

        // noinspection JSPotentiallyInvalidConstructorUsage
        const tvWidget = new widget(widgetOptions);
        this.tvWidget = tvWidget;
        let self = this
        tvWidget.onChartReady(() => {
            this.tvWidgetReady = true;
            const getListStudyTemplate = `${this.props.chartsStorageUrl}/${this.props.chartsStorageApiVersion}/study_templates?client=${this.props.clientId}&user=${widgetOptions.user_id}`;
            fetch(getListStudyTemplate).then(result => result.json()).then(res => {
                if (res && 'ok' === res.status && res.data.length > 0) {
                    let chartName = res.data[0].name;
                    const loadStudyTemplate = `${this.props.chartsStorageUrl}/${this.props.chartsStorageApiVersion}/study_templates?client=${this.props.clientId}&user=${widgetOptions.user_id}&template=${chartName}`;
                    fetch(loadStudyTemplate).then(result => result.json()).then(res => {
                        try {
                            let template = JSON.parse(res.data.content);
                            this.tvWidget.activeChart().applyStudyTemplate(template);
                        } catch (error) {
                            console.log('TVChart: Error when parsing template data')
                        }

                    });
                }
            });
            // Haki.: Set Format Price theo Symbol: 1 ho?c 100.
            // T?m hardcode ??n v? 1 ??ng
            // this.tvWidget.mainSeriesPriceFormatter()._priceScale = 100;
            this.tvWidget.mainSeriesPriceFormatter()._priceScale = 1;
            this.tvWidget.chart().onSymbolChanged().subscribe(null, async function (event) {
                if (event && event.name) {
                    // let IS_SYMBOL_CHECK = false
                    // check symbol h?p l?
                    let foundSymbol = self.getSymbol().find((symbol) => (symbol.id === event.name));
                    if (foundSymbol) {
                        // Haki.: Change Url buy Symbol+
                        //Ghi đè lại symbol trong trường hợp init chart/search symbol
                        // let arr = window.location.pathname.split("/");
                        // if(!indexOverwrite) indexOverwrite = 2;
                        // arr[indexOverwrite] = event.name;
                        // let path = arr.join('/');
                        // await self.props.navigate(path);

                        //old
                        let path = CommonUtils.getPathToRedirect(window.location.pathname)
                        await self.props.navigate(`/${path}/${event.name}/`);
                        //

                        self.tvWidget.setSymbol(event.name, self.tvWidget.activeChart().resolution());
                    }
                    else {
                        self.tvWidget.setSymbol(self.props.currentSymbol.id, self.tvWidget.activeChart().resolution());
                    }
                }
                else {
                    self.tvWidget.setSymbol(self.props.currentSymbol.id, self.tvWidget.activeChart().resolution());
                }
                self.tvWidget.mainSeriesPriceFormatter()._priceScale = 1;
            })

            // self.tvWidget.createButton()
            //     .attr('title', "My custom button tooltip")
            //     // .on('click', function (e) { alert("My custom button pressed!"); })
            //     .append($(self.getBtnShowHideOrders()));
            let { isLoggedIn } = self.props;
            // const { isLoggedIn } = self.props.userInfo;
            //check login
            if (isLoggedIn == true) {
                self.tvWidget.onContextMenu(function (time, price) {
                    // Haki.: Hardcode ?? tr�nh sai b??c gi�
                    price = (price / 100).toFixed(0) * 100
                    let _price = NumberFormatUtils.formatPrice(price.toFixed(0))
                    let order = {
                        symbol: self.props.currentSymbol ? self.props.currentSymbol.id : '',
                        price: _price
                    }
                    let IS_SHOW_ORDERS_TV = self.IS_SHOW_ORDERS_TV
                    let IS_SHOW_POSITIONS_TV = self.IS_SHOW_POSITIONS_TV
                    return [{
                        position: "top",
                        text: self.renderBuyByPrice(order),
                        click: function () {
                            console.log("TradingView.:Buy by price=", _price);
                            let data = {
                                sideCode: 'NB',
                                pricetype: 'LO',
                                symbol: self.props.currentSymbol ? self.props.currentSymbol.id : '',
                                price: price.toFixed(0)
                            }
                            self.onFilterNewOrder(data)
                        }
                    },
                    {
                        position: "top",
                        text: self.renderSellByPrice(order),
                        // text: new Date(time * 1000).toUTCString() + "; " + price.toFixed(0),
                        click: function () {
                            console.log("TradingView.:Sell by price=", _price);
                            let data = {
                                sideCode: 'NS',
                                pricetype: 'LO',
                                symbol: self.props.currentSymbol ? self.props.currentSymbol.id : '',
                                price: price.toFixed(0)
                            }
                            self.onFilterNewOrder(data)
                        }
                    },
                    {
                        position: "top",
                        text: self.renderNewOrder(order),
                        click: function () {
                            console.log("TradingView.:New order by price=0");
                            // let price = self.LastClosePrice ? self.LastClosePrice : Datafeed.getLastClosePrice()
                            let price = self.LastClosePrice
                            let data = {
                                sideCode: 'NB',
                                pricetype: 'LO',
                                symbol: self.props.currentSymbol ? self.props.currentSymbol.id : '',
                                price: price,
                            }
                            self.onFilterNewOrder(data)
                        }
                    },
                    {
                        position: "top",
                        text: self.renderSettingOrders(!IS_SHOW_ORDERS_TV),
                        click: function () {
                            self.updateKeyIsShowBtnOrders(!self.IS_SHOW_ORDERS_TV)
                        }
                    },
                    {
                        position: "top",
                        text: self.renderSettingPositions(!IS_SHOW_POSITIONS_TV),
                        click: function () {
                            self.updateKeyIsShowBtnPositions(!self.IS_SHOW_POSITIONS_TV)
                        }
                    },
                    ];
                });
                // this.changeClassCustom(defaultTheme, 'dark');
                this.loadData(self.IS_SHOW_ORDERS_TV, self.IS_SHOW_POSITIONS_TV)
            }
        });
        window.addEventListener('storage', async function (e) {
            if (self.IS_CHANGE_THEME) {
                console.log('changeClassCustom===========================load&C', self.currentTheme)
                await self.changeClassCustom(self.currentTheme, 'dark');
                self.IS_CHANGE_THEME = false;
            }
        });
    };
    getSymbol() {
        let self = this
        return self.props.symbols
    }

    listenToTheEmitter() {
        let self = this

        emitter.on(Event.RELOAD_TRADINGVIEW_BY_NORMALORDER, (data) => {
            if (self.IS_FIRST_UPDATE == false) {
                self.IS_RELOAD_UPDATE = true
                self.processOrderData(data)
            }
        });
        emitter.on(Event.RELOAD_TRADINGVIEW_BY_NORMALORDER_FDS, (data) => {
            if (self.IS_FIRST_UPDATE == false) {
                self.IS_RELOAD_UPDATE = true
                self.processOrderData(data)
            }
        });
        emitter.on(Event.RELOAD_TRADINGVIEW_BY_OPENPOSITIONS, (data) => {
            if (self.IS_FIRST_UPDATE_POSITIONS == false) {
                self.IS_FIRST_UPDATE_POSITIONS = true
                self.processPositionsData(data, false)
            }
        });
        emitter.on(Event.RELOAD_TRADINGVIEW_BY_FDSOPENPOSITIONS, (data) => {
            if (self.IS_FIRST_UPDATE_POSITIONS == false) {
                self.IS_FIRST_UPDATE_POSITIONS = true
                self.processPositionsData(data, false)
            }
        });

        emitter.on(Event.UPDATE_LAST_CLOSEPRICE, (data) => {
            if (data && data.LastClosePrice) {
                self.LastClosePrice = data.LastClosePrice
                self.updateAllPositions(self.LastClosePrice)
            }
        });
        emitter.on(Event.CANCEL_OR_ERR_ACTION_EDIT_ORDER, (data) => {
            if (self.IS_FIRST_UPDATE == false) {
                self.IS_RELOAD_UPDATE = true
                self.loadData(self.IS_SHOW_ORDERS_TV, self.IS_SHOW_POSITIONS_TV)
            }
        });
        // emitter.on(Event.CANCEL_OR_ERR_ACTION_EDIT_POSITION, (data) => {
        //     if (self.IS_FIRST_UPDATE == false) {
        //         self.IS_RELOAD_UPDATE = true
        //         self.loadData(self.IS_SHOW_ORDERS_TV, self.IS_SHOW_POSITIONS_TV)
        //     }
        // });
        // emitter.on(Event.CANCEL_OR_ERR_ACTION_EDIT_FDSOPENPOSITIONS, (data) => {
        //     if (self.IS_FIRST_UPDATE == false) {
        //         self.IS_RELOAD_UPDATE = true
        //         self.loadData(self.IS_SHOW_ORDERS_TV, self.IS_SHOW_POSITIONS_TV)
        //     }
        // });

        // Haki.: Test realtime CLOSEPRICE
        // setTimeout(function () {
        //     alert('UPDATE_LAST_CLOSEPRICE')
        //     emitter.emit(Event.UPDATE_LAST_CLOSEPRICE, { LastClosePrice: 110957 })
        // }, 10000);
    }
    updateAllPositions(closePrice) {
        let self = this
        let { currentSymbol, language, defaultTheme, cssChart, isDerivativeAccount, isDailyAccount } = self.props;
        let symbol = currentSymbol ? currentSymbol.symbol : null
        let type, type_custom = 'buy'
        let text, position, vwap, total, withDraw, costPrice, qtty, pendingsqtty
        if (self.ListPositions && Object.keys(self.ListPositions).length !== 0) {
            if (self.ListPositions[symbol]) {
                if (!isDerivativeAccount) {
                    // Daily
                    if (isDailyAccount) {
                        position = self.ListQttyPositions[symbol]
                        vwap = self.ListPositions[symbol].getPrice()
                        text = position * (closePrice - vwap)
                        if ((self.ListPositionTypePositions[symbol]).toLowerCase() === 'long') {
                            type_custom = text > 0 ? 'buy' : text < 0 ? 'sell' : ''
                        }
                        else {
                            type_custom = text > 0 ? 'sell' : text < 0 ? 'buy' : ''
                        }
                        text = NumberFormatUtils.formatPrice(text)
                        self.ListPositions[symbol].setText(text)
                            .setBodyTextColor(cssChart['position_' + type_custom + '_BodyTextColor'])
                    }
                    else {
                        // C? s?
                        total = this.ListQttyPositions[symbol]
                        withDraw = this.ListWithDrawPositions[symbol]
                        costPrice = this.ListPositions[symbol].getPrice()
                        // _qtty = obj.total
                        text = (total - withDraw) * (closePrice - costPrice)
                        type = 'buy'
                        type_custom = text > 0 ? 'buy' : text < 0 ? 'sell' : ''
                        text = NumberFormatUtils.formatPrice(text)
                        self.ListPositions[symbol].setText(text)
                            .setBodyTextColor(cssChart['position_' + type_custom + '_BodyTextColor'])
                    }
                }
                else {
                    // _qtty = obj.qtty
                    qtty = self.ListQttyPositions[symbol]
                    pendingsqtty = this.ListPendingsQttyPositions[symbol]
                    vwap = this.ListPositions[symbol].getPrice()
                    text = (qtty - pendingsqtty) * (closePrice - vwap)
                    type = qtty < 0 ? 'sell' : 'buy'
                    if (type == 'sell') {
                        type_custom = text > 0 ? 'buy' : text < 0 ? 'sell' : ''
                    }
                    else {
                        type_custom = text > 0 ? 'sell' : text < 0 ? 'buy' : ''
                    }
                    text = NumberFormatUtils.formatPrice(text)
                    self.ListPositions[symbol].setText(text)
                        .setBodyTextColor(cssChart['position_' + type_custom + '_BodyTextColor'])

                }



            }
        }
    }
    setKeyIsShow() {
        let setKey = getValueFromLocalStorage(keyFactory.IS_SHOW_ORDERS_TV)
        if (setKey == undefined && setKey == null) {
            setValueToLocalStorage(keyFactory.IS_SHOW_ORDERS_TV, true)
        }
        else {
            this.IS_SHOW_ORDERS_TV = setKey === 'true' ? true : false
        }
        setKey = getValueFromLocalStorage(keyFactory.IS_SHOW_POSITIONS_TV)
        if (setKey == undefined && setKey == null) {
            setValueToLocalStorage(keyFactory.IS_SHOW_POSITIONS_TV, true)
        }
        else {
            this.IS_SHOW_POSITIONS_TV = setKey === 'true' ? true : false
        }
    }
    updateKeyIsShowBtnOrders(IS_SHOW_ORDERS_TV) {
        let self = this
        setValueToLocalStorage(keyFactory.IS_SHOW_ORDERS_TV, IS_SHOW_ORDERS_TV)
        self.IS_SHOW_ORDERS_TV = IS_SHOW_ORDERS_TV
        if (!IS_SHOW_ORDERS_TV) {
            self.clearOrderData()
        }
        else {
            self.IS_RELOAD_UPDATE = true
            self.loadData(IS_SHOW_ORDERS_TV, false)
        }
    }
    updateKeyIsShowBtnPositions(IS_SHOW_POSITIONS_TV) {
        let self = this
        setValueToLocalStorage(keyFactory.IS_SHOW_POSITIONS_TV, IS_SHOW_POSITIONS_TV)
        self.IS_SHOW_POSITIONS_TV = IS_SHOW_POSITIONS_TV
        if (!IS_SHOW_POSITIONS_TV) {
            self.clearPositionsData()
        }
        else {
            self.IS_RELOAD_UPDATE_POSITIONS = true
            self.loadData(false, IS_SHOW_POSITIONS_TV)
        }
    }
    async componentDidMount() {
        // Defer widget initialize util we get valid symbol and account

        await this.setKeyIsShow()

        const { currentSymbol } = this.props;
        if (currentSymbol) {
            await this.initWidget(currentSymbol.id);
        }
        else {
            let currentSymbolInUrl = CommonUtils.getCurrentSymbolFromPathName(window.location.pathname)
            await this.initWidget(currentSymbolInUrl);
        }
        let self = this
        // setInterval(function () { self.IS_RELOAD_UPDATE = true; self.loadData(); }, 10000)

    }

    async changeClassCustom(defaultTheme, prevTheme) {
        defaultTheme = this.props.defaultTheme
        // let iframe = $("#tv_chart_container iframe").contents()
        let iframe = $('#' + this.props.containerId + this.props.callerId + ' iframe').contents()
        let _html = iframe.find("html");
        let _head = iframe.find("head");

        const { language } = this.props;
        console.log('changeClassCustom===========================', defaultTheme, prevTheme, language)

        await $(_html).removeClass("theme-" + prevTheme);
        await $(_html).addClass("theme-" + defaultTheme);
        let script_url = process.env.PUBLIC_URL + '/charting_library/script_custom.js'
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = script_url;
        await $(_head).append(script);
    }

    async applyTheme(defaultTheme, prevTheme) {
        this.IS_CHANGE_THEME = true
        defaultTheme = this.props.defaultTheme
        let overrides = this.load_overrides();
        await this.tvWidget.applyOverrides(overrides);
        await this.changeClassCustom(defaultTheme, prevTheme)
        await this.setOrderCSS()
    };

    isBroker = () => {
        const { role } = this.props;
        return role === Role.BROKER;
    };

    loadData = async (IS_SHOW_ORDERS_TV, IS_SHOW_POSITIONS_TV) => {
        let self = this

        const { userInfo, currentCustomer, currentAccount } = self.props;

        const { isForBroker } = self.props; //xem co phai so lenh moi gioi khong
        //console.log("thanh.ngo=====currentCustomer",currentCustomer,userInfo,currentAccount);
        let isBroker = self.isBroker();
        let custid = null;
        let accountId = null;
        accountId = currentAccount ? currentAccount.id : '';
        if (!isBroker || isForBroker) {
            custid = userInfo ? userInfo.custid : null;
        } else if (isBroker) {
            custid = currentCustomer ? currentCustomer.custid : null;
        };

        if (IS_SHOW_ORDERS_TV && custid && accountId) {
            await self.getAllOrder(custid, accountId);
        };
        if (IS_SHOW_POSITIONS_TV && currentAccount) {
            await self.getAllPositions(currentAccount, custid, accountId);
        }


    };
    async processOrderData(data) {
        let self = this
        if (data && data.length > 0) {
            await self.clearOrderData()
            setTimeout(async function () {
                await self.updateOrderLineChart(data)
            }, 500)
        }
        else {
            await self.clearOrderData()
        }
    }
    async clearOrderData() {
        // if (this.ListOrder) {
        let self = this
        await new Promise((resolve, reject) => {
            if (self.tvWidget) {
                if (self.tvWidgetReady) {
                    if (self.ListOrder && Object.keys(self.ListOrder).length !== 0) {
                        for (let event in self.ListOrder) {
                            self.ListOrder[event].onRemove()
                        }
                        self.ListTypeOrder = {}
                    }
                    return resolve(true);
                }
                else {
                    self.tvWidget.onChartReady(async () => {
                        if (self.ListOrder && Object.keys(self.ListOrder).length !== 0) {
                            for (let event in self.ListOrder) {
                                self.ListOrder[event].onRemove()
                            }
                            self.ListTypeOrder = {}
                        }
                        return resolve(true);
                    });
                }
            }
            return resolve(true);

        });
        // }

    }
    getAllOrder = (custid, accountId) => {
        const { isForBroker, isDerivativeAccount, isDailyAccount } = this.props; //xem co phai so lenh moi gioi khong

        //neula so lenh moi gioi thi goi api lay so lenh moi gioi - nguoc lai lay so lenh khach hang
        // const getOrderFunc = isForBroker ? inquiryService.getAllOrdersBroker : inquiryService.getAllOrders;
        // Haki.: S?a lai API theo Tab L?nh ho?t ??ng
        let getOrderFunc = isForBroker ? inquiryService.getAllOrdersBroker : inquiryService.getDlActiveOrders;
        if (isDerivativeAccount && !isForBroker) {
            getOrderFunc = fdsInquiryService.getWaitToMatchOrderList;
        }
        // getOrderFunc(custid, accountId)
        getOrderFunc(accountId)
            .then(data => {
                if (data && data.length > 0) {
                    this.processOrderData(data);
                }
            })
            .catch((error) => {
                this.clearOrderData();
            });
    };


    onChangePrice(data) {
        emitter.emit(
            Event.CHANGE_PRICE_ORDER_BY_TRADINGVIEW,
            data
        );
    }

    onRemoveOrder(data) {
        emitter.emit(
            Event.ON_REMOVE_ORDER_BY_TRADINGVIEW,
            data
        );
    }

    checkPermission = (accountid) => {
        const { permissionInfo, userInfo } = this.props;
        if (userInfo.role === Role.CUSTOMER && accountid && permissionInfo) {
            return (permissionInfo.accounts[accountid] && permissionInfo.accounts[accountid][modules.ORDINPUT]) ? true : false
        }
        if (userInfo.role === Role.BROKER && userInfo && permissionInfo) {
            return (permissionInfo.accounts[userInfo.custid] && permissionInfo.accounts[userInfo.custid][modules.ORDINPUT]) ? true : false
        }
    };
    doUpdateOrderLineChart(data) {
        // remove(): void;
        // onModify(callback: () => void): this;
        // onModify<T>(data: T, callback: (data: T) => void): this;
        // onMove(callback: () => void): this;
        // onMove<T>(data: T, callback: (data: T) => void): this;
        // getPrice(): number;
        // setPrice(value: number): this;
        // getText(): string;
        // setText(value: string): this;
        // getTooltip(): string;
        // setTooltip(value: string): this;
        // getQuantity(): string;
        // setQuantity(value: string): this;
        // getEditable(): boolean;
        // setEditable(value: boolean): this;
        // getExtendLeft(): boolean;
        // setExtendLeft(value: boolean): this;
        // getLineLength(): number;
        // setLineLength(value: number): this;
        // getLineStyle(): number;
        // setLineStyle(value: number): this;
        // getLineWidth(): number;
        // setLineWidth(value: number): this;
        // getBodyFont(): string;
        // setBodyFont(value: string): this;
        // getQuantityFont(): string;
        // setQuantityFont(value: string): this;
        // getLineColor(): string;
        // setLineColor(value: string): this;
        // getBodyBorderColor(): string;
        // setBodyBorderColor(value: string): this;
        // getBodyBackgroundColor(): string;
        // setBodyBackgroundColor(value: string): this;
        // getBodyTextColor(): string;
        // setBodyTextColor(value: string): this;
        // getQuantityBorderColor(): string;
        // setQuantityBorderColor(value: string): this;
        // getQuantityBackgroundColor(): string;
        // setQuantityBackgroundColor(value: string): this;
        // getQuantityTextColor(): string;
        // setQuantityTextColor(value: string): this;
        // getCancelButtonBorderColor(): string;
        // setCancelButtonBorderColor(value: string): this;
        // getCancelButtonBackgroundColor(): string;
        // setCancelButtonBackgroundColor(value: string): this;
        // getCancelButtonIconColor(): string;
        // setCancelButtonIconColor(value: string): this;




        // isDerivativeAccount == true
        // accountno: "0001017294"
        // code: "VN30F2006"
        // custodycd: "002C000100"
        // exec_amt: 0
        // isadmend: "Y"
        // iscancel: "Y"
        // matchprice: 0
        // matchqtty: 0
        // matchtime: "13:20:36"
        // norp: "N"
        // orderid: "0001191020000201"
        // orderprice: 797.1
        // orderqtty: 90
        // ordertype: "LO"
        // remain_qtty: 90
        // side: "Mua"
        // sidecode: "NB"
        // status: "NN"
        // tlname: "USERONLINE"
        // validity: "Y"
        // via: "B"

        if (this.IS_SHOW_ORDERS_TV) {
            if (this.IS_FIRST_UPDATE || this.IS_RELOAD_UPDATE) {
                let self = this;
                let { isDerivativeAccount, isDailyAccount } = self.props
                let text = 'BUY LIMIT'
                let type = 'buy'
                let _qtty
                let { currentSymbol, language, defaultTheme, cssChart } = self.props;
                let symbol = currentSymbol ? currentSymbol.symbol : null
                self.ListOrder = {}
                if (data && data.length > 0) {
                    data.map(async function (obj) {
                        if (!isDerivativeAccount) {
                            if (isDailyAccount) {
                                if (obj.symbol != symbol || obj.remainqtty <= 0) {
                                    return null
                                }
                                _qtty = obj.qtty
                                text = obj.sideCode == 'NB' ? 'BUY LIMIT' : 'SELL LIMIT'
                                type = obj.sideCode == 'NB' ? 'buy' : 'sell'
                                self.ListTypeOrder[obj.odorderid] = type
                            }
                            else {
                                if (obj.symbol != symbol || obj.remainqtty <= 0) {
                                    return null
                                }
                                _qtty = obj.qtty
                                text = obj.sideCode == 'NB' ? 'BUY LIMIT' : 'SELL LIMIT'
                                type = obj.sideCode == 'NB' ? 'buy' : 'sell'
                                self.ListTypeOrder[obj.odorderid] = type
                            }
                        }
                        else {
                            if (obj.code != symbol || obj.remain_qtty <= 0) {
                                return null
                            }
                            obj.odorderid = obj.orderid
                            obj.price = obj.orderprice
                            obj.sideCode = obj.sidecode
                            obj.qtty = obj.orderqtty
                            _qtty = obj.qtty
                            text = obj.sideCode == 'NB' ? 'BUY LIMIT' : 'SELL LIMIT'
                            type = obj.sideCode == 'NB' ? 'buy' : 'sell'
                            self.ListTypeOrder[obj.odorderid] = type
                        }
                        // let amendOrderPermission = (obj['allowamend'] === "Y") && self.checkPermission(obj['afacctno']);
                        // console.log('Haki.:doUpdateOrderLineChart=', obj.price, amendOrderPermission)
                        // if (obj.symbol == symbol && amendOrderPermission == true) {
                        // _qtty = NumberFormatUtils.formatVolume(obj.qtty)
                        // _qtty = obj.qtty
                        // if (obj.symbol == symbol && obj.remainqtty > 0) {
                        // text = obj.sideCode == 'NB' ? 'BUY LIMIT' : 'SELL LIMIT'
                        // type = obj.sideCode == 'NB' ? 'buy' : 'sell'
                        // self.ListTypeOrder[obj.odorderid] = type
                        self.ListOrder[obj.odorderid] = await self.tvWidget.chart().createOrderLine()
                            .setText(text)
                            .setLineLength(10)
                            .setLineStyle(5)
                            .setLineWidth(0.2)
                            .setEditable(true) // Cho ph�p s?a v? tr�/close
                            .setExtendLeft(false)
                            .setQuantity(_qtty)
                            .setPrice(obj.price)
                            .setLineColor(cssChart['order_' + type + '_LineColor'])
                            .setBodyTextColor(cssChart['order_' + type + '_BodyTextColor'])
                            .setBodyBackgroundColor(cssChart['order_' + type + '_BodyBackgroundColor'])
                            .setBodyBorderColor(cssChart['order_' + type + '_BodyBorderColor'])
                            .setQuantityTextColor(cssChart['order_' + type + '_QuantityTextColor'])
                            .setQuantityBackgroundColor(cssChart['order_' + type + '_QuantityBackgroundColor'])
                            .setQuantityBorderColor(cssChart['order_' + type + '_QuantityBorderColor'])
                            .setCancelButtonIconColor(cssChart['order_' + type + '_CancelButtonIconColor'])
                            .setCancelButtonBackgroundColor(cssChart['order_' + type + '_CancelButtonBackgroundColor'])
                            .setCancelButtonBorderColor(cssChart['order_' + type + '_CancelButtonBorderColor'])
                        // self.ListOrder[obj.odorderid].setPrice(obj.price)
                        self.ListOrder[obj.odorderid].onMove(function () {
                            let data = {
                                orderid: obj.odorderid,
                                price: self.ListOrder[obj.odorderid].getPrice()
                            }
                            self.onChangePrice(data)
                            // this.setText("onMove called");
                        })
                        self.ListOrder[obj.odorderid].onModify("onModify called", function (text) {
                            let data = {
                                orderid: obj.odorderid,
                                price: self.ListOrder[obj.odorderid].getPrice()
                            }
                            self.onChangePrice(data)
                            // alert(self.ListOrder[obj.odorderid].getPrice())
                            // this.setText(text);
                        })
                        self.ListOrder[obj.odorderid].onCancel("onCancel called", function (text) {
                            let data = {
                                orderid: obj.odorderid,
                                price: self.ListOrder[obj.odorderid].getPrice()
                            }
                            self.onRemoveOrder(data)
                            // self.ListOrder[obj.odorderid].remove()
                            // delete self.ListOrder[obj.odorderid];
                            // this.setText(text);
                        })
                        self.ListOrder[obj.odorderid].onRemove = function () {
                            self.ListOrder[obj.odorderid].remove()
                            delete self.ListOrder[obj.odorderid];

                        };
                        // }
                    })
                }

                // self.IS_FIRST_UPDATE = false
                // self.IS_RELOAD_UPDATE = false
                // self.IS_FIRST_UPDATE_POSITIONS = false
                // self.IS_RELOAD_UPDATE_POSITIONS = false
            }
        }
    }

    updateOrderLineChart(data) {
        console.log('Haki.:updateOrderLineChart.:', data)
        if (this.tvWidget) {
            if (this.tvWidgetReady) {
                this.doUpdateOrderLineChart(data)
                this.IS_FIRST_UPDATE = false
                this.IS_RELOAD_UPDATE = false
            }
            else {
                this.tvWidget.onChartReady(async () => {
                    this.doUpdateOrderLineChart(data)
                    this.IS_FIRST_UPDATE = false
                    this.IS_RELOAD_UPDATE = false
                });
            }
        }
        // self.IS_FIRST_UPDATE = false
    }

    setOrderCSS() {
        let type;
        let self = this
        let { cssChart } = self.props
        if (self.ListOrder && Object.keys(self.ListOrder).length !== 0) {
            for (let event in self.ListOrder) {
                type = self.ListTypeOrder[event]
                self.ListOrder[event].setLineColor(cssChart['order_' + type + '_LineColor'])
                self.ListOrder[event].setBodyTextColor(cssChart['order_' + type + '_BodyTextColor'])
                self.ListOrder[event].setBodyBackgroundColor(cssChart['order_' + type + '_BodyBackgroundColor'])
                self.ListOrder[event].setBodyBorderColor(cssChart['order_' + type + '_BodyBorderColor'])
                self.ListOrder[event].setQuantityTextColor(cssChart['order_' + type + '_QuantityTextColor'])
                self.ListOrder[event].setQuantityBackgroundColor(cssChart['order_' + type + '_QuantityBackgroundColor'])
                self.ListOrder[event].setQuantityBorderColor(cssChart['order_' + type + '_QuantityBorderColor'])
                self.ListOrder[event].setCancelButtonIconColor(cssChart['order_' + type + '_CancelButtonIconColor'])
                self.ListOrder[event].setCancelButtonBackgroundColor(cssChart['order_' + type + '_CancelButtonBackgroundColor'])
                self.ListOrder[event].setCancelButtonBorderColor(cssChart['order_' + type + '_CancelButtonBorderColor'])
            }
        }
        if (self.ListPositions && Object.keys(self.ListPositions).length !== 0) {
            for (let event in self.ListPositions) {
                type = self.ListTypePositions[event]
                self.ListPositions[event].setLineColor(cssChart['position_' + type + '_LineColor'])
                self.ListPositions[event].setBodyTextColor(cssChart['position_' + type + '_BodyTextColor'])
                self.ListPositions[event].setBodyBackgroundColor(cssChart['position_' + type + '_BodyBackgroundColor'])
                self.ListPositions[event].setBodyBorderColor(cssChart['position_' + type + '_BodyBorderColor'])
                self.ListPositions[event].setQuantityTextColor(cssChart['position_' + type + '_QuantityTextColor'])
                self.ListPositions[event].setQuantityBackgroundColor(cssChart['position_' + type + '_QuantityBackgroundColor'])
                self.ListPositions[event].setQuantityBorderColor(cssChart['position_' + type + '_QuantityBorderColor'])
                self.ListPositions[event].setReverseButtonIconColor(cssChart['position_' + type + '_ReverseButtonIconColor'])
                self.ListPositions[event].setReverseButtonBackgroundColor(cssChart['position_' + type + '_ReverseButtonBackgroundColor'])
                self.ListPositions[event].setReverseButtonBorderColor(cssChart['position_' + type + '_ReverseButtonBorderColor'])
                self.ListPositions[event].setCloseButtonIconColor(cssChart['position_' + type + '_CloseButtonIconColor'])
                self.ListPositions[event].setCloseButtonBackgroundColor(cssChart['position_' + type + '_CloseButtonBackgroundColor'])
                self.ListPositions[event].setCloseButtonBorderColor(cssChart['position_' + type + '_CloseButtonBorderColor'])
            }
        }
    }

    async componentDidUpdate(prevProps) {
        const { currentAccount, currentSymbol, language, defaultTheme, cssChart } = this.props;
        const { currentAccount: prevCurrentAccount, currentSymbol: prevCurrentSymbol, language: prevLanguage, defaultTheme: prevTheme } = prevProps;
        let self = this;


        if (currentSymbol) {
            // Widget already initiated
            if (this.tvWidget) {
                if (defaultTheme !== prevTheme) {
                    if (this.tvWidgetReady) {
                        await this.applyTheme(defaultTheme, prevTheme);
                    } else {
                        this.tvWidget.onChartReady(async () => {
                            await this.applyTheme(defaultTheme, prevTheme);
                        });
                    }
                }
                // May this code can be replace with queue somehow?
                // console.log('componentDidUpdate.: ' + currentAccount.id + ' ' + prevCurrentAccount.id)
                if (currentAccount && prevCurrentAccount && currentAccount.id && currentAccount.id && currentAccount.id !== prevCurrentAccount.id) {
                    // tuan.pham.: khi chuyển kiểu tài khoản, render lại component -> ko có tvWidget -> lỗi undefined activeChart
                    if (currentSymbol === prevCurrentSymbol) { // trường hợp khác symbol đã check bên dưới
                        setTimeout(async () => {
                            if (this.tvWidgetReady) {
                                if (this.tvWidget && this.tvWidget.activeChart) await this.tvWidget.setSymbol(currentSymbol.id, this.tvWidget.activeChart().resolution());
                                self.IS_RELOAD_UPDATE = true
                                self.IS_RELOAD_UPDATE_POSITIONS = true
                                await self.loadData(self.IS_SHOW_ORDERS_TV, self.IS_SHOW_POSITIONS_TV)
                            } else {
                                this.tvWidget.onChartReady(async () => {
                                    if (this.tvWidget && this.tvWidget.activeChart) await this.tvWidget.setSymbol(currentSymbol.id, this.tvWidget.activeChart().resolution());
                                    self.IS_RELOAD_UPDATE = true
                                    self.IS_RELOAD_UPDATE_POSITIONS = true
                                    await self.loadData(self.IS_SHOW_ORDERS_TV, self.IS_SHOW_POSITIONS_TV)
                                });
                            }
                        }, 2000)
                    }
                }
                if (currentSymbol !== prevCurrentSymbol) {
                    setTimeout(async () => {
                        if (this.tvWidgetReady) {
                            if (this.tvWidget && this.tvWidget.activeChart) await this.tvWidget.setSymbol(currentSymbol.id, this.tvWidget.activeChart().resolution());
                            self.IS_RELOAD_UPDATE = true
                            self.IS_RELOAD_UPDATE_POSITIONS = true
                            await self.loadData(self.IS_SHOW_ORDERS_TV, self.IS_SHOW_POSITIONS_TV)
                        } else {
                            this.tvWidget.onChartReady(async () => {
                                if (this.tvWidget && this.tvWidget.activeChart) await this.tvWidget.setSymbol(currentSymbol.id, this.tvWidget.activeChart().resolution());
                                self.IS_RELOAD_UPDATE = true
                                self.IS_RELOAD_UPDATE_POSITIONS = true
                                await self.loadData(self.IS_SHOW_ORDERS_TV, self.IS_SHOW_POSITIONS_TV)
                            });
                        }
                    }, 1000)
                }
                if (language !== prevLanguage) {
                    this.IS_CHANGE_THEME = true
                    if (this.tvWidgetReady) {
                        // this.tvWidget.setLanguage(language);  // Haki.: Lỗi giao diện
                        // window.addEventListener('change', function (e) {
                        //     self.changeClassCustom(defaultTheme, 'dark');
                        // });
                        self.IS_RELOAD_UPDATE = true
                        self.IS_RELOAD_UPDATE_POSITIONS = true
                        await this.initWidget(currentSymbol.id)

                    } else {
                        this.tvWidget.onChartReady(async () => {
                            // this.tvWidget.setLanguage(language);  // Haki.: Lỗi giao diện
                            // window.addEventListener('change', function (e) {
                            //     self.changeClassCustom(defaultTheme, 'dark');
                            // });
                            self.IS_RELOAD_UPDATE = true
                            self.IS_RELOAD_UPDATE_POSITIONS = true
                            await this.initWidget(currentSymbol.id)
                        });
                    }
                }
            }
            // await this.loadData()
            // else {
            //     this.initWidget();
            // }
        }
    }

    componentWillUnmount() {
        // if (this.tvWidget !== null) {
        //remove chart khi ready = true
        if (this.tvWidget !== null && this.tvWidget._ready) {
            this.tvWidget.remove();
            this.tvWidget = null;
        }
    }

    async onClosePositions(data) {
        let self = this
        // Haki.: Set l?i th�ng tin OrderInput t? truy?n theo tradeOrderInput trong appReducer
        await self.props.setOrderInput(data, data.symbol)
        emitter.emit(
            Event.ON_CHANGE_POSITIONS_BY_TRADINGVIEW,
            data
        );
    }

    doUpdatePositionsLineChart(data, isDerivativeAccount, isDailyAccount) {
        // remove(): void;
        // onClose(callback: () => void): this;
        // onClose<T>(data: T, callback: (data: T) => void): this;
        // onModify(callback: () => void): this;
        // onModify<T>(data: T, callback: (data: T) => void): this;
        // onReverse(callback: () => void): this;
        // onReverse<T>(data: T, callback: (data: T) => void): this;
        // getPrice(): number;
        // setPrice(value: number): this;
        // getText(): string;
        // setText(value: string): this;
        // getTooltip(): string;
        // setTooltip(value: string): this;
        // getQuantity(): string;
        // setQuantity(value: string): this;
        // getExtendLeft(): boolean;
        // setExtendLeft(value: boolean): this;
        // getLineLength(): number;
        // setLineLength(value: number): this;
        // getLineStyle(): number;
        // setLineStyle(value: number): this;
        // getLineWidth(): number;
        // setLineWidth(value: number): this;
        // getBodyFont(): string;
        // setBodyFont(value: string): this;
        // getQuantityFont(): string;
        // setQuantityFont(value: string): this;
        // getLineColor(): string;
        // setLineColor(value: string): this;
        // getBodyBorderColor(): string;
        // setBodyBorderColor(value: string): this;
        // getBodyBackgroundColor(): string;
        // setBodyBackgroundColor(value: string): this;
        // getBodyTextColor(): string;
        // setBodyTextColor(value: string): this;
        // getQuantityBorderColor(): string;
        // setQuantityBorderColor(value: string): this;
        // getQuantityBackgroundColor(): string;
        // setQuantityBackgroundColor(value: string): this;
        // getQuantityTextColor(): string;
        // setQuantityTextColor(value: string): this;
        // getReverseButtonBorderColor(): string;
        // setReverseButtonBorderColor(value: string): this;
        // getReverseButtonBackgroundColor(): string;
        // setReverseButtonBackgroundColor(value: string): this;
        // getReverseButtonIconColor(): string;
        // setReverseButtonIconColor(value: string): this;
        // getCloseButtonBorderColor(): string;
        // setCloseButtonBorderColor(value: string): this;
        // getCloseButtonBackgroundColor(): string;
        // setCloseButtonBackgroundColor(value: string): this;
        // getCloseButtonIconColor(): string;
        // setCloseButtonIconColor(value: string): this;
        if (this.IS_SHOW_POSITIONS_TV) {
            if (this.IS_FIRST_UPDATE_POSITIONS || this.IS_RELOAD_UPDATE_POSITIONS) {
                let self = this;
                let text = 'BUY LIMIT'
                let type = 'buy'
                let type_custom = 'buy'
                let _price, _qtty
                let closePrice = self.props.closePrice
                let { currentSymbol, language, defaultTheme, cssChart } = self.props;
                let symbol = currentSymbol ? currentSymbol.symbol : null
                self.ListPositions = {}
                self.ListTypePositions = {}
                self.ListQttyPositions = {}
                if (data && data.length > 0) {
                    data.map(async function (obj) {
                        // let amendPositionsPermission = (obj['allowamend'] !== "Y") && self.checkPermission(obj['afacctno']);
                        // console.log('Haki.:doUpdatePositionsLineChart=', obj.price, amendPositionsPermission)
                        // C? s?.:Danh m?c ??u t?.:data=
                        // accountId: "0101000100"
                        // basicPrice: 87100
                        // costPrice: 37100
                        // issell: "Y"
                        // mortgage: 0
                        // receiving: 0
                        // symbol: "VCB"
                        // total: 90000
                        // trade: 88900
                        // withDraw: 0

                        // Ph�i sinh.: V? th? ?�ng.:data=
                        //                 codeid: "000040"
                        // custodycd: "002C000100"
                        // diff: 0
                        // dtacctno: "0001017294"
                        // isclose: "Y"
                        // isnet: "N"
                        // last_change: "2020-10-22T14:12:55.797Z"
                        // nonrplamt: 0
                        // nvalue: 10000
                        // pecentnonrplamt: 0
                        // pendinglqtty: 0
                        // pendingsqtty: 0
                        // position: "1"
                        // price_secured: 110444
                        // qtty: 42
                        // rdsp: 1104440000
                        // symbol: "GB05F2006"
                        // totalplamt: 0
                        // vm: 0
                        // vrdebtvmamt: 0
                        // vrimamt: 6030242400
                        // vwap: 110444

                        if (obj.symbol == symbol) {
                            // text = obj.sideCode == 'NB' ? 'BUY LIMIT' : 'SELL LIMIT'

                            if (!isDerivativeAccount) {
                                // Daily
                                if (isDailyAccount) {
                                    obj.vwap = 30500
                                    _price = obj.vwap
                                    _qtty = NumberFormatUtils.formatVolume(obj.position)
                                    // _qtty = obj.total
                                    text = obj.position * (closePrice - obj.vwap)
                                    // type = 'buy'
                                    if ((obj['positiontype']).toLowerCase() === 'long') {
                                        type = 'buy'
                                        type_custom = text > 0 ? 'buy' : text < 0 ? 'sell' : ''
                                    }
                                    else {
                                        type = 'sell'
                                        type_custom = text > 0 ? 'sell' : text < 0 ? 'buy' : ''
                                    }
                                    text = NumberFormatUtils.formatPrice(text)
                                    self.ListTypePositions[obj.symbol] = type
                                    self.ListQttyPositions[obj.symbol] = obj.position
                                    self.ListPositionTypePositions[obj.symbol] = obj['positiontype']
                                }
                                else {
                                    // C? s?
                                    if (obj.issell != "Y") {
                                        // Haki.: Kh�ng th?a m�n ?i?u ki?n hi?n th? th� return null
                                        return null
                                    }
                                    _price = obj.costPrice
                                    _qtty = NumberFormatUtils.formatVolume(obj.total)
                                    // _qtty = obj.total
                                    text = (obj.total - obj.withDraw) * (closePrice - obj.costPrice)
                                    type = 'buy'
                                    type_custom = text > 0 ? 'buy' : text < 0 ? 'sell' : ''
                                    text = NumberFormatUtils.formatPrice(text)
                                    self.ListTypePositions[obj.symbol] = type
                                    self.ListQttyPositions[obj.symbol] = obj.total
                                    self.ListWithDrawPositions[obj.symbol] = obj.withDraw
                                }
                            }
                            else {
                                // Ph�i sinh
                                if (obj.qtty == 0) {
                                    // Haki.: Kh�ng th?a m�n ?i?u ki?n hi?n th? th� return null
                                    return null
                                }
                                _price = obj.vwap
                                _qtty = NumberFormatUtils.formatVolume(obj.qtty)
                                // _qtty = obj.qtty
                                text = (obj.qtty - obj.pendingsqtty) * (closePrice - obj.vwap)
                                type = obj.qtty < 0 ? 'sell' : 'buy'
                                if (type == 'sell') {
                                    type_custom = text > 0 ? 'buy' : text < 0 ? 'sell' : 'normal'
                                }
                                else {
                                    type_custom = text > 0 ? 'sell' : text < 0 ? 'buy' : 'normal'
                                }
                                text = NumberFormatUtils.formatPrice(text)
                                self.ListTypePositions[obj.symbol] = type
                                self.ListQttyPositions[obj.symbol] = obj.qtty
                                self.ListPendingsQttyPositions[obj.symbol] = obj.pendingsqtty

                            }
                            self.ListPositions[obj.symbol] = await self.tvWidget.chart().createPositionLine()
                                .setText(text)
                                .setLineLength(10)
                                .setLineStyle(5)
                                .setLineWidth(0.01)
                                // .setEditable(false)
                                .setExtendLeft(false)
                                .setQuantity(_qtty + '')
                                .setPrice(_price)
                                .setLineColor(cssChart['position_' + type + '_LineColor'])
                                .setBodyTextColor(cssChart['position_' + type_custom + '_BodyTextColor'])
                                .setBodyBackgroundColor(cssChart['position_' + type + '_BodyBackgroundColor'])
                                .setBodyBorderColor(cssChart['position_' + type + '_BodyBorderColor'])
                                .setQuantityTextColor(cssChart['position_' + type + '_QuantityTextColor'])
                                .setQuantityBackgroundColor(cssChart['position_' + type + '_QuantityBackgroundColor'])
                                .setQuantityBorderColor(cssChart['position_' + type + '_QuantityBorderColor'])
                                .setReverseButtonIconColor(cssChart['position_' + type + '_ReverseButtonIconColor'])
                                .setReverseButtonBackgroundColor(cssChart['position_' + type + '_ReverseButtonBackgroundColor'])
                                .setReverseButtonBorderColor(cssChart['position_' + type + '_ReverseButtonBorderColor'])
                                .setCloseButtonIconColor(cssChart['position_' + type + '_CloseButtonIconColor'])
                                .setCloseButtonBackgroundColor(cssChart['position_' + type + '_CloseButtonBackgroundColor'])
                                .setCloseButtonBorderColor(cssChart['position_' + type + '_CloseButtonBorderColor'])

                            // self.ListPositions[obj.symbol].onModify("onModify called", function (text) {
                            //     alert('onModify called')
                            //     return null;
                            //     let data = {
                            //         orderid: obj.symbol,
                            //         price: self.ListPositions[obj.symbol].getPrice()
                            //     }
                            //     self.onChangePrice(data)
                            //     // alert(self.ListPositions[obj.symbol].getPrice())
                            //     // this.setText(text);
                            // })
                            self.ListPositions[obj.symbol].onReverse("onReverse called", function (text) {
                                // Haki.: Khi ?�ng th� t?o 1 l?nh ??o ng??c Buy->Sell v� x2 kh?i l??ng, gi� l� LastClosePrice
                                // ??ng th?i disable/hide Icon (Reverse v� Close)


                                // alert('onReverse called')
                                // return null;
                                // let price = self.LastClosePrice ? self.LastClosePrice : Datafeed.getLastClosePrice()
                                let price = self.LastClosePrice
                                let side = self.ListTypePositions[obj.symbol] == 'buy' ? 'sell' : 'buy'
                                let action = self.ListTypePositions[obj.symbol] == 'buy' ? 'sell' : 'buy'
                                let data = {
                                    // orderid: obj.odorderid,
                                    symbol: symbol,
                                    // price: self.ListPositions[obj.symbol].getPrice(),
                                    // limitPrice: self.ListPositions[obj.symbol].getPrice(),
                                    price: price,
                                    limitPrice: price,
                                    // qtty: 2 * parseFloat(self.ListPositions[obj.symbol].getQuantity()).toFixed(0),
                                    qtty: 2 * parseFloat(self.ListQttyPositions[obj.symbol]).toFixed(0),
                                    // quantity: 2 * parseFloat(self.ListPositions[obj.symbol].getQuantity()).toFixed(0),
                                    quantity: 2 * parseFloat(self.ListQttyPositions[obj.symbol]).toFixed(0),
                                    side: side,
                                    action: action,
                                    type: "limit"
                                }
                                self.onClosePositions(data)
                            })
                            self.ListPositions[obj.symbol].onClose("onClose called", function (text) {
                                // Haki.: Khi ?�ng th� t?o 1 l?nh ??o ng??c Buy->Sell gi? nguy�n kh?i l??ng, gi� l� LastClosePrice 

                                // alert('onClose called')
                                // return null;
                                // let price = self.LastClosePrice ? self.LastClosePrice : Datafeed.getLastClosePrice()
                                let price = self.LastClosePrice
                                let side = self.ListTypePositions[obj.symbol] == 'buy' ? 'sell' : 'buy'
                                let action = self.ListTypePositions[obj.symbol] == 'buy' ? 'sell' : 'buy'
                                let data = {
                                    // orderid: obj.odorderid,
                                    symbol: symbol,
                                    // price: self.ListPositions[obj.symbol].getPrice(),
                                    // limitPrice: self.ListPositions[obj.symbol].getPrice(),
                                    price: price,
                                    limitPrice: price,
                                    // qtty: self.ListPositions[obj.symbol].getQuantity(),
                                    qtty: self.ListQttyPositions[obj.symbol],
                                    // quantity: self.ListPositions[obj.symbol].getQuantity(),
                                    quantity: self.ListQttyPositions[obj.symbol],
                                    side: side,
                                    action: action,
                                    type: "limit"
                                }
                                self.onClosePositions(data)
                                // self.ListPositions[obj.symbol].remove()
                                // delete self.ListPositions[obj.symbol];
                                // this.setText(text);
                            })
                            self.ListPositions[obj.symbol].onRemove = function () {
                                self.ListPositions[obj.symbol].remove()
                                delete self.ListPositions[obj.symbol];
                                delete self.ListTypePositions[obj.symbol];
                                delete self.ListQttyPositions[obj.symbol];
                            };
                        }
                    })
                }

                self.IS_FIRST_UPDATE_POSITIONS = false
                self.IS_RELOAD_UPDATE_POSITIONS = false

            }
        }
    }

    updatePositionsLineChart(data, isDerivativeAccount, isDailyAccount) {
        console.log('Haki.:updatePositionsLineChart.:', data)
        if (this.tvWidget) {
            if (this.tvWidgetReady) {
                this.doUpdatePositionsLineChart(data, isDerivativeAccount, isDailyAccount)
                this.IS_FIRST_UPDATE_POSITIONS = false
                this.IS_RELOAD_UPDATE_POSITIONS = false
            }
            else {
                this.tvWidget.onChartReady(async () => {
                    this.doUpdatePositionsLineChart(data, isDerivativeAccount, isDailyAccount)
                    this.IS_FIRST_UPDATE_POSITIONS = false
                    this.IS_RELOAD_UPDATE_POSITIONS = false
                });
            }
        }
        // self.IS_FIRST_UPDATE = false
    }

    async clearPositionsData() {
        // if (this.ListOrder) {
        let self = this
        await new Promise((resolve, reject) => {
            if (self.tvWidget) {
                if (self.tvWidgetReady) {
                    if (self.ListPositions && Object.keys(self.ListPositions).length !== 0) {
                        for (let event in self.ListPositions) {
                            self.ListPositions[event].onRemove()
                        }
                        self.ListTypePositions = {};
                        self.ListQttyPositions = {};
                    }
                    return resolve(true);
                }
                else {
                    self.tvWidget.onChartReady(async () => {
                        if (self.ListPositions && Object.keys(self.ListPositions).length !== 0) {
                            for (let event in self.ListPositions) {
                                self.ListPositions[event].onRemove()
                            }
                            self.ListTypePositions = {};
                            self.ListQttyPositions = {};
                        }
                        return resolve(true);
                    });
                }
            }
            return resolve(true);

        });
        // }

    }
    async processPositionsData(data, isDerivativeAccount, isDailyAccount) {
        let self = this
        if (data && data.length > 0) {
            await self.clearPositionsData()
            setTimeout(async function () {
                await self.updatePositionsLineChart(data, isDerivativeAccount, isDailyAccount)
            }, 500)
        }
        else {
            await self.clearPositionsData()
        }
    }
    getAllPositions = async (currentAccount, custid, accountId) => {

        let { isDerivativeAccount, isDailyAccount } = this.props
        if (isDerivativeAccount) {
            //VN30F2006
            await fdsInquiryService.getOpenPositionList(currentAccount.id)
                .then(data => {
                    if (data && data.length > 0) {
                        this.processPositionsData(data, true, false);
                    }
                })
                .catch((error) => {
                    this.clearPositionsData();
                });
        }
        else {
            if (isDailyAccount) {
                await inquiryService.getDLAccInfoDailyTrade(currentAccount.id, null).then(data => {
                    if (data && data.length > 0) {
                        this.processPositionsData(data, false, true);
                    }
                })
                    .catch((error) => {
                        this.clearPositionsData();
                    });
            }
            else {
                await inquiryService.getSecurities(currentAccount.id)
                    .then(data => {
                        if (data && data.length > 0) {
                            this.processPositionsData(data, false, false);
                        }
                    })
                    .catch((error) => {
                        this.clearPositionsData();
                    });
            }
        }
    };

    render() {
        return (
            <div
                // id={this.props.containerId}
                id={`${this.props.containerId}${this.props.callerId}`}
                style={{ height: '100%' }}
                className={'TVChartContainer'}
            />
        );
    }
}