import * as socket from "../../configdata/socket";

// const CONNECTION_METADATA_PARAMS = {
// 	version: '__sails_io_sdk_version',
// 	platform: '__sails_io_sdk_platform',
// 	language: '__sails_io_sdk_language',
// 	clientid: 'clientid',
// 	clientsecret: 'clientsecret'
// };

// const SDK_INFO = {
// 	version: '1.2.1',
// 	platform: typeof module === 'undefined' ? 'browser' : 'node',
// 	language: 'javascript',
// 	clientid: config.api.CLIENT_ID,
// 	clientsecret: config.api.CLIENT_SECRET
// };
// let queryString = '';
// Object.keys(CONNECTION_METADATA_PARAMS).forEach(key => {
// 	queryString += '&' + CONNECTION_METADATA_PARAMS[key] + '=' + SDK_INFO[key]
// });
// if (queryString.length > 0) queryString = queryString.slice(- (queryString.length - 1));

// const socket = io(API_ROOT_URL, {
// 	path: "/realtime/socket.io",
// 	transports: ['websocket'],
// 	query: queryString,
// });
const subscribeStorage = [];

// socket.on('connect', () => {
// 	console.log('[socket] Connected');
// });

// socket.on('disconnect', (reason) => {
// 	console.log('[socket] Disconnected:', reason);
// });

// socket.on('error', (error) => {
// 	console.log('[socket] Error:', error);
// });

// console.log("socket", socket)

socket.on("trade", (data) => {
  //FT: hh:mm:ss
  //TD: dd/mm/yyyy

  // const eventData = data.split('~'); // Example response: 0~Huydeptrai~BTC~USD~2~335394436~1548837377~0.36~3504.1~1261.4759999999999~1f
  // const subscribeType = parseInt(eventData[0]);

  // if (subscribeType === 3) {
  // 	console.log('[socket] Snapshot load event complete');
  // 	return;
  // }

  //moi lan nhan msg gia goi ham tvcallback({time, close, open, high, low, volume})

  //gọi call back (translog)

  // const parsedSymbolData = {
  // 	subs_type: subscribeType,
  // 	exchange: eventData[1],
  // 	fsym: eventData[2],
  // 	tsym: eventData[3],
  // 	trade_id: eventData[5],
  // 	time: parseInt(eventData[6]),
  // 	volume: parseFloat(eventData[7]),
  // 	price: parseFloat(eventData[8])
  // };

  // const newSubscribe = {
  // 	channelString,
  // 	subscribeUID,
  // 	resolution,
  // 	symbolInfo,
  // 	lastBar: historyData[symbolInfo.name].lastBar,
  // 	tvCallback: onRealtimeCallback,
  // };
  // const channelString = `${parsedSymbolData.subs_type}~${parsedSymbolData.exchange}~${parsedSymbolData.fsym}~${parsedSymbolData.tsym}`;
  let transData = data.data[0];
  if (!transData) return;
  const symbolName = transData.SB;
  const transDate = transData.TD.split("/");
  const transTime = transData.FT.split(":");
  const transUnix =
    new Date(
      parseInt(transDate[2]),
      parseInt(transDate[1]) - 1,
      parseInt(transDate[0]),
      parseInt(transTime[0]),
      parseInt(transTime[1]),
      parseInt(transTime[2])
    ).getTime() / 1000;
  const parsedSymbolData = {
    time: transUnix,
    volume: parseInt(transData.FV),
    price: parseInt(transData.FMP) / 1000,
  };
  const subscribeData = subscribeStorage.find(
    (_subscribe) => _subscribe.name === symbolName
  );

  if (subscribeData) {
    if (transUnix < subscribeData.lastBar.time / 1000) {
      return;
    }

    const lastBar = updateLastBar(parsedSymbolData, subscribeData);

    if (lastBar) {
      subscribeData.tvCallback(lastBar); // Send data by "onRealtimeCallback"
    }
  }
});

function updateLastBar(eventBarData, subscribeData) {
  const lastBar = subscribeData.lastBar;
  const lastBarPreviousTimeInSeconds = Math.floor(lastBar.time / 1000);
  const barTimeInSeconds = getBarTime(
    eventBarData.time,
    lastBar.time,
    subscribeData.resolution
  );

  //eventBarData: info translog
  //subscribeData: cua thu vien

  // const parsedSymbolData = {
  // 	subs_type: subscribeType,
  // 	exchange: eventData[1],
  // 	fsym: eventData[2],
  // 	tsym: eventData[3],
  // 	trade_id: eventData[5],
  // 	time: parseInt(eventData[6]),
  // 	volume: parseFloat(eventData[7]),
  // 	price: parseFloat(eventData[8])
  // };

  // const newSubscribe = {
  // 	channelString,
  // 	subscribeUID,
  // 	resolution,
  // 	symbolInfo,
  // 	lastBar: historyData[symbolInfo.name].lastBar,
  // 	tvCallback: onRealtimeCallback,
  // };
  if (barTimeInSeconds < 0) {
    // Old or incorrect time.
    return false;
  }

  lastBar.time = barTimeInSeconds * 1000; // Requires time in ms.
  lastBar.close = eventBarData.price;

  const isNeedUpdateCandle = barTimeInSeconds === lastBarPreviousTimeInSeconds;
  const isNeedCreateNewCandle = barTimeInSeconds === eventBarData.time;

  if (isNeedUpdateCandle) {
    // console.log('[subscribeBars]: Update last bar', eventBarData);
    if (eventBarData.price < lastBar.low) {
      lastBar.low = eventBarData.price;
    } else if (eventBarData.price > lastBar.high) {
      lastBar.high = eventBarData.price;
    }

    lastBar.volume += eventBarData.volume;
  } else if (isNeedCreateNewCandle) {
    console.log("[subscribeBars]: Create new bar", eventBarData);
    lastBar.open = lastBar.close;
    lastBar.high = lastBar.close;
    lastBar.low = lastBar.close;
    lastBar.volume = eventBarData.volume;
  }

  return lastBar;
}

function getBarTime(barTimeFromEvent, lastBarTime, resolution) {
  let resolutionInMinute = parseInt(resolution);
  if (resolution === "D") {
    resolutionInMinute = 1440;
  }

  const lastBarTimeInSeconds = Math.floor(lastBarTime / 1000);
  const differenceInSeconds = barTimeFromEvent - lastBarTimeInSeconds;

  if (differenceInSeconds >= 0) {
    // Newest data.
    const resolutionInSeconds = resolutionInMinute * 60;

    if (differenceInSeconds > resolutionInSeconds) {
      // Return time for create new bar.
      return barTimeFromEvent;
    }

    if (differenceInSeconds <= resolutionInSeconds) {
      // Return time for update last bar.
      return lastBarTimeInSeconds;
    }
  }
  return -1;
}

export function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscribeUID,
  onResetCacheNeededCallback,
  historyData
) {
  // const symbolKeys = parseSymbolToKeys(symbolInfo.name);
  // const fsym = symbolKeys[0];
  // const tsym = symbolKeys[1];
  // const channelString = `0~${symbolInfo.exchange}~${fsym}~${tsym}`;
  // console.log('[subscribeBars]: Subscribe to streaming. Channel:', channelString);
  // socket.emit(
  // 	'get',
  // 	{
  // 		method: "get",
  // 		url: API_ROOT_URL + 'client/send',
  // 		headers: {},
  // 		// subs: [channelString]
  // 		data: {
  // 			op: 'subscribe',
  // 			args: ['trade:' + symbolInfo.name]
  // 		}
  // 	}, (response) => {

  // 	}
  // );
  socket.registerTradeTopic(symbolInfo.name, subscribeUID);

  // Subscribe to the CryptoCompare trade channel for the pair and exchange.

  const newSubscribe = {
    name: symbolInfo.name,
    subscribeUID,
    resolution,
    symbolInfo,
    lastBar: historyData[symbolInfo.name].lastBar,
    tvCallback: onRealtimeCallback,
  };
  subscribeStorage.push(newSubscribe);
}

export function unsubscribeFromStream(subscriberUID) {
  const subIndex = subscribeStorage.findIndex(
    (e) => e.subscribeUID === subscriberUID
  );

  if (subIndex !== -1) {
    const subscribe = subscribeStorage[subIndex];
    console.log(
      "[unsubscribeBars]: Unsubscribe from streaming. Channel:",
      subscribe.name
    );
    // socket.emit(
    // 	'get',
    // 	{
    // 		method: "get",
    // 		url: API_ROOT_URL + 'client/send',
    // 		headers: {},
    // 		// subs: [channelString]
    // 		data: {
    // 			op: 'unsubscribe',
    // 			args: ['trade:' + subscribe.name]
    // 		}
    // 	}, (response) => {

    // 	}
    // );
    socket.unregisterTradeTopic(subscribe.name, subscriberUID);
    subscribeStorage.splice(subIndex, 1);
  }
}

export function parseSymbolToKeys(symbolName) {
  let fsym = "";
  let tsym = "";

  if (symbolName.length === 6) {
    // E.g. BTCUSD
    fsym = symbolName.slice(0, 3); // BTC
    tsym = symbolName.slice(3); // USD
  }

  return [fsym, tsym];
}
