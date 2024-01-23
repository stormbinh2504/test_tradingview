// import {
//   parseSymbolToKeys,
//   subscribeOnStream,
//   unsubscribeFromStream,
// } from "./streaming.js";

import config from "../../configdata/combineConfig";

const API_ROOT_URL = "https://min-api.cryptocompare.com";
const DataFeed_Url = "https://apis.bvsc.com.vn/tvcharts-1.0";
const SUPPORTED_RESOLUTIONS = [
  "1",
  "3",
  "5",
  "15",
  "30",
  "60",
  "120",
  "240",
  "D",
];

const history = {}; // Last bar data storage.
export default {
  onReady: function (callback) {
    console.log("[onReady]: Method call");
    let urlSearch = `${DataFeed_Url}/config`;
    fetch(urlSearch)
      .then((result) => result.json())
      .then((configurationData) => {
        callback(configurationData);
      });
  },
  searchSymbols: function (
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback
  ) {
    console.log("[searchSymbols]: Method call");

    // For implementation this method, we use this API reference:
    //     https://min-api.cryptocompare.com/documentation?key=Other&cat=allExchangesV2Endpoint

    if (symbolType === "stock") {
      onResultReadyCallback([]); // Return empty search result.
    } else if (symbolType === "crypto") {
      // crypto
      fetch(`${API_ROOT_URL}/data/v2/all/exchanges`)
        .then((result) => result.json())
        .then((data) => {
          const exchangePairs = data.Data[exchange].pairs;
          const symbols = [];

          for (const key in exchangePairs) {
            if (!exchangePairs.hasOwnProperty(key)) {
              continue;
            }
            const mainPairKey = key;
            const possiblePairs = exchangePairs[key];

            for (let i = 0; i < possiblePairs.length; i++) {
              const secondPairKey = possiblePairs[i];
              const cryptoPair = mainPairKey + secondPairKey;
              const fullName = `${exchange}:${cryptoPair}`;

              if (cryptoPair.length !== 6) {
                continue; // Simplify. Ignore spesific or invalid pairs.
              }

              symbols.push({
                symbol: cryptoPair,
                full_name: fullName,
                description: cryptoPair,
                exchange: exchange,
                ticker: fullName,
                type: "crypto",
              });
            }
          }

          const searchRegexp = new RegExp(userInput, "i");
          onResultReadyCallback(
            symbols.filter((item) => searchRegexp.test(item.symbol))
          );
        });
    } else {
      let urlSearch = `${DataFeed_Url}/search?query=${userInput}&type=${symbolType}&exchange=${exchange}`;
      fetch(urlSearch)
        .then((result) => result.json())
        .then((data) => {
          const symbols = [];

          for (const item of data) {
            symbols.push({
              symbol: item.symbol,
              full_name: item.name,
              description: item.description,
              exchange: item.exchange,
              ticker: item.ticker,
              type: item.symbol_type,
            });
          }
          onResultReadyCallback(symbols);
        });
    }
  },
  resolveSymbol: function (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) {
    console.log("[resolveSymbol]: Method call", symbolName);
    if (symbolName === "Bitfinex:BTCUSD") {
      const symbolParts = symbolName.split(":");
      const name = symbolParts[1];
      const exchange = symbolParts[0];

      const symbolinfo = {
        name: name,
        description: name,
        type: "сrypto",
        session: "24x7",
        timezone: "Etc/UTC",
        ticker: symbolName,
        exchange: exchange,
        minmov: 1,
        pricescale: 100000000,
        has_intraday: true,
        intraday_multipliers: ["1", "60"],
        supported_resolution: SUPPORTED_RESOLUTIONS,
        volume_precision: 8,
        data_status: "streaming",
      };

      if (name.match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
        symbolinfo.pricescale = 100; // Adjust pricescale;
      }

      setTimeout(function () {
        onSymbolResolvedCallback(symbolinfo);
        console.log("[resolveSymbol]: Symbol resolved", symbolinfo);
      }, 0);
    } else {
      if (symbolName.indexOf(":") > 0) {
        const symbolParts = symbolName.split(":");
        symbolName = symbolParts[1];
      }
      let urlResolve = `${DataFeed_Url}/symbols?symbol=${symbolName}`;
      fetch(urlResolve)
        .then((result) => result.json())
        .then((symbolinfo) => {
          const info = {
            name: symbolinfo.name,
            description: symbolinfo.name,
            type: symbolinfo.type,
            session: symbolinfo.sesion,
            timezone: symbolinfo.timezone,
            ticker: symbolName,
            exchange: symbolinfo.exchange,
            minmov: symbolinfo.minmov,
            pricescale: symbolinfo.pricescale,
            has_intraday: symbolinfo.has_intraday,
            intraday_multipliers: symbolinfo.intraday_multipliers,
            supported_resolution: symbolinfo.supported_resolutions,
            volume_precision: symbolinfo.volume_precision,
            data_status: symbolinfo.streaming,
          };

          onSymbolResolvedCallback(info);
        });
    }
  },
  getBars: function (
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest
  ) {
    console.log("[getBars]: Method call", symbolInfo);
    const dateFrom = new Date(from * 1000);
    const dateTo = new Date(to * 1000);
    console.log(
      "[getBars]: Method call",
      "from",
      dateFrom.toDateString(),
      "to",
      dateTo.toDateString()
    );

    if (symbolInfo.name === "BTCUSD") {
      const getFullHistoryUrl = (resolution) => {
        if (resolution < 60) {
          // '1', '3', '5', '15', '30'
          return `${API_ROOT_URL}/data/histominute`;
        }
        if (resolution >= 60) {
          // '60', '120', '240'
          return `${API_ROOT_URL}/data/histohour`;
        }
        return `${API_ROOT_URL}/data/histoday`;
      };

      symbolInfo.name = "BTCUSD";
      symbolInfo.exchange = "Bitfinex";
      //   const symbolKeys = parseSymbolToKeys([BTC, USD]);
      const urlParameters = {
        e: "Bitfinex",
        fsym: "BTC",
        tsym: "USD",
        toTs: to || "",
        limit: 2000,
      };

      const historyRequestUrl = new URL(getFullHistoryUrl(resolution));
      historyRequestUrl.search = new URLSearchParams(urlParameters);

      fetch(historyRequestUrl)
        .then((result) => result.json())
        .then((data) => {
          if (data.Response && data.Response === "Error") {
            onHistoryCallback([], { noData: true }); // "noData" should be set if there is no data in the requested period.
          }

          if (data.Data.length) {
            const bars = data.Data.map(function (symbolData) {
              return {
                time: symbolData.time * 1000, // Requires candle time in ms.
                low: symbolData.low,
                high: symbolData.high,
                open: symbolData.open,
                close: symbolData.close,
                volume: symbolData.volumefrom,
              };
            });

            if (firstDataRequest) {
              history[symbolInfo.name] = { lastBar: bars[bars.length - 1] }; // Save last bar data about current symbol.
            }
            onHistoryCallback(bars, { noData: false });
          } else {
            onHistoryCallback([], { noData: true }); // "noData" should be set if there is no data in the requested period.
          }
        })
        .catch((error) => {
          console.log("[getBars]: Get error", error);
          onErrorCallback(error);
        });
    } else {
      let urlHistory = `${DataFeed_Url}/history?symbol=${symbolInfo.name}&resolution=${resolution}&limit=300&to=${to}`;
      fetch(urlHistory)
        .then((result) => result.json())
        .then((historyData) => {
          if (historyData && historyData.s === "no_data") {
            onHistoryCallback([], { noData: true }); // "noData" should be set if there is no data in the requested period.
            return;
          }
          let bars = [];
          for (let i = 0; i < historyData.t.length; i++) {
            bars.push({
              time: parseInt(historyData.t[i]) * 1000, // Requires candle time in ms.
              low: historyData.l[i],
              high: historyData.h[i],
              open: historyData.o[i],
              close: historyData.c[i],
              volume: historyData.v[i],
            });
          }
          if (firstDataRequest) {
            history[symbolInfo.name] = { lastBar: bars[bars.length - 1] }; // Save last bar data about current symbol.
          }
          onHistoryCallback(bars, { noData: false });
        })
        .catch((error) => {
          console.log("[getBars]: Get error", error);
          onErrorCallback(error);
        });
    }
  },
  subscribeBars: function (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) {
    console.log(
      "[subscribeBars]: Method call with subscribeUID:",
      subscribeUID
    );
    // subscribeOnStream(
    //   symbolInfo,
    //   resolution,
    //   onRealtimeCallback,
    //   subscribeUID,
    //   onResetCacheNeededCallback,
    //   history
    // );
  },
  unsubscribeBars: function (subscriberUID) {
    console.log(
      "[unsubscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
    // unsubscribeFromStream(subscriberUID);
  },
};
