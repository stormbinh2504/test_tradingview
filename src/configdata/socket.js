import io from 'socket.io-client';
import _ from 'lodash';
import config from './combineConfig';
import reduxStore, { dispatch } from './redux';
import * as actions from './store/actions';
import { SocketStatus, sessionKeyFactory, getValueFromSessionStorage, setValueToSessionStorage } from "./utils";
import { inquiryService, userService } from './services';
import { emitter } from 'utils/EventEmitter';

export const socketRoomName = {
    'instrument': "i",    //room publish thông tin mã chứng khoán
    'instrument_ol': "i_ol",    //room publish thông tin mã chứng khoán lô lẻ
    'trade': "t",         //room publish thông tin chi tiết khớp mã chứng khoán
    'trade_ol': "t_ol",         //room publish thông tin chi tiết khớp mã chứng khoán lô lẻ
    'orderBook10': "o10",   //room publish thông tin top10 giá mua giá bán mã chứng khoán
    'orderBook_ol10': "o_ol10",   //room publish thông tin top10 giá mua giá bán mã chứng khoán lô lẻ
    'orderBook3': "o3",    //room publish thông tin top3 giá mua giá bán mã chứng khoán
    'orderBook_ol3': "o_ol3",    //room publish thông tin top3 giá mua giá bán mã chứng khoán lô lẻ
    'orderBook': "o",    //Loại event publish thông tin top3 giá mua giá bán mã chứng khoán
    'orderBook_ol': "o_ol",    //Loại event publish thông tin top3 giá mua giá bán mã chứng khoán lô lẻ
    'exchange': "e",    //room subscribe thông tin mã chứng khoán theo sàn
    'exchange_ol': "e_ol",    //room subscribe thông tin mã chứng khoán lô lẻ theo sàn
    'index': "idx",          //room publish thông tin chỉ số
    'putthrough': "pth",  //room publish thông tin mua bán thỏa thuận theo sàn
    'ptmatch': "ptm",     //room publish thông tin mua bán thỏa thuận theo sàn

    'channel': "ch",      //room publish các loại thông tin cho các kênh kết nối dạng server2server

    'account': "acc",      //room publish tín hiệu thay đổi balance tiểu khoản
    'customer': "cus",    //room publish thông tin liên quan đến tài khoản (Vd: thông báo đã download báo cáo xong)
    'message': "msg",      //room publish thông điệp, cảnh báo liên quan tới tài khoản, hoặc các tiểu khoản
    'report': "rpt",      //Loại event report bắn chung vào room customer
    'message_analytic': "msg.analyt",      //room publish thông điệp tin phân tích do công ty ck soạn
};
const socketAction = {    // socket action từ server trả về
    partial: "p",    // socket action partial
    update: "u",    // socket action update
    insert: "i",    // socket action insert
    delete: "d",    // socket action delete
    signal: "s",    // socket action signal
};
const SDK_INFO = {
    '__sails_io_sdk_version': '1.2.1',
    '__sails_io_sdk_platform': 'browser',
    '__sails_io_sdk_language': 'javascript',
    // clientid: config.api.CLIENT_ID,
    // clientsecret: config.api.CLIENT_SECRET
};
const socket = io(config.api.API_BASE_URL, {
    path: '/realtime/socket.io',
    transports: ['websocket'],
    query: SDK_INFO,
    autoConnect: false
});


const operationsQueue = [];
const subscribedTopics = [];
const registeredTopics = {};
const registeredCalledIds = {};
const _subscribeToTopics = (topics) => {
    const state = reduxStore.getState();
    if (!topics || topics.length === 0) {
        return false;
    }

    if (!socket.connected) {
        console.log('Socket not ready, topics will be subscribe later');
        return false;
    }
    const token = state.user.token != null ? state.user.token['access_token'] : null;
    socket.emit('get', {
        url: '/client/send',
        method: 'get',
        headers: {

        },
        data: {
            op: 'subscribe',
            args: topics,
            token: token
        }
    }, (response) => {
        if (response.statusCode === 200) {
            console.log('Subscribed to topics ' + topics.join(', '));
        } else {
            console.log('Fail to subscribe to topics ' + topics.join(', '));
        }
    }
    );

    return true;
};

const _unsubscribeFromTopics = (topics) => {
    if (!topics || topics.length === 0) {
        return;
    }

    if (!socket.connected) {
        console.log('Socket not ready, unsubscribe is skipped');
        return;
    }
    socket.emit('get', {
        url: '/client/send',
        method: 'get',
        headers: {},
        data: {
            op: 'unsubscribe',
            args: topics
        }
    }, (response) => {
        if (response.statusCode === 200) {
            console.log('Unsubscribed from topics ' + topics.join(', '));
        } else {
            console.log('Fail to unsubscribe from topics ' + topics.join(', '));
        }
    }
    );
};

// Clear callerId with empty topic and clear topic with empty callerId
const _prunce = () => {
    const willBeDeleteTopics = [];
    _.forIn(registeredTopics, (callerIds, topic) => {
        if (!callerIds || callerIds.length === 0) {
            willBeDeleteTopics.push(topic);
        }
    });
    _.forEach(willBeDeleteTopics, (topic) => {
        delete registeredTopics[topic];
    });

    const willBeDeleteCallerIds = [];
    _.forIn(registeredCalledIds, (topics, callerId) => {
        if (!topics || topics.length === 0) {
            willBeDeleteCallerIds.push(callerId);
        }
    });
    _.forEach(willBeDeleteCallerIds, (callerId) => {
        delete registeredCalledIds[callerId];
    });
};

const _clearSubscribedTopics = () => {
    subscribedTopics.length = 0;
};

const _registerTopic = (topic, callerId) => {
    if (registeredTopics.hasOwnProperty(topic)) {
        const callerIds = registeredTopics[topic];
        if (!_.includes(callerIds, callerId)) {
            callerIds.push(callerId);
        }
    } else {
        registeredTopics[topic] = [callerId];
    }

    if (registeredCalledIds.hasOwnProperty(callerId)) {
        const topics = registeredCalledIds[callerId];
        if (!_.includes(topics, topic)) {
            topics.push(topic);
        }
    } else {
        registeredCalledIds[callerId] = [topic];
    }
};

const _unregisterTopic = (topic, callerId) => {
    if (registeredTopics.hasOwnProperty(topic)) {
        const callerIds = registeredTopics[topic];
        _.remove(callerIds, (element) => {
            return callerId === element;
        });
    }

    if (registeredCalledIds.hasOwnProperty(callerId)) {
        const topics = registeredCalledIds[callerId];
        _.remove(topics, (element) => {
            return topic === element;
        });
    }
};

const _unregisterTopics = (topics, callerId, dontCallApply) => {
    if (topics && topics.length > 0) {
        for (let i = 0; i < topics.length; i++) {
            _unregisterTopic(topics[i], callerId);
        }
    }

    _prunce();

    if (!dontCallApply) {
        _apply();
    }
};

const _unregisterCallerId = (callerId, dontCallApply) => {
    if (registeredCalledIds.hasOwnProperty(callerId)) {
        const topics = registeredCalledIds[callerId];
        if (topics && topics.length > 0) {
            _unregisterTopics([...topics], callerId, dontCallApply);
        }
    }
};

const _registerTopics = (topics, callerId) => {
    // Unregister all topic previously registered by this callerId
    _unregisterCallerId(callerId, true);

    if (topics && topics.length > 0) {
        for (let i = 0; i < topics.length; i++) {
            _registerTopic(topics[i], callerId);
        }
    }

    _apply();
};

const _apply = () => {
    const needToSubscribeTopics = [];
    _.forIn(registeredTopics, (callerIds, topic) => {
        if (callerIds.length > 0) {
            needToSubscribeTopics.push(topic);
        }
    });

    const willBeSubscribeTopics = _.difference(needToSubscribeTopics, subscribedTopics);
    const willBeUnSubscribeTopics = _.difference(subscribedTopics, needToSubscribeTopics);

    if (_subscribeToTopics(willBeSubscribeTopics)) {
        _.forEach(willBeSubscribeTopics, (topic) => {
            if (!_.includes(subscribedTopics, topic)) {
                subscribedTopics.push(topic);
            }
        });
    }

    _unsubscribeFromTopics(willBeUnSubscribeTopics);
    _.forEach(willBeUnSubscribeTopics, (topic) => {
        if (_.includes(subscribedTopics, topic)) {
            _.remove(subscribedTopics, (element) => {
                return element === topic;
            });
        }
    });
};

const _scheduleToExecuteOperations = () => {
    setTimeout(_executeOperations, 100);
};

const _executeOperation = (operation) => {
    const { action, data } = operation;
    switch (action) {
        case 're-subscribe':
            _apply();
            break;
        case 'clear-subscribed':
            _clearSubscribedTopics();
            break;
        case 'register': {
            const { topics, callerId } = data;
            _registerTopics(topics, callerId);
            break;
        }
        case 'unregister': {
            const { topics, callerId } = data;
            _unregisterTopics(topics, callerId);
            break;
        }
        case 'unregister-callerId': {
            const { callerId } = data;
            _unregisterCallerId(callerId, false);
            break;
        }
        default:
            console.log('Unknown socket action ' + action);
            break;
    }
};

const _executeOperations = () => {
    while (operationsQueue.length > 0) {
        const operation = operationsQueue.shift();
        _executeOperation(operation);
    }
    _scheduleToExecuteOperations();
};

const _requestReSubscribeToAllSubscribedTopics = () => {
    operationsQueue.push({
        action: 're-subscribe'
    });
};

const _requestClearSubscribedTopics = () => {
    operationsQueue.push({
        action: 'clear-subscribed'
    });
};

// Fired upon a connection including a successful reconnection
socket.on('connect', () => {
    console.log('Socket connected');

    _requestReSubscribeToAllSubscribedTopics();

    dispatch(actions.setSocketConnectStatus(SocketStatus.CONNECTED));
    dispatch(actions.setSocketConnectFirstTime(false));
});

// Fired upon a disconnection including a abnormal disconnection
socket.on('disconnect', () => {
    console.log('Socket disconnected');

    _requestClearSubscribedTopics();

    dispatch(actions.setSocketConnectStatus(SocketStatus.DISCONNECTED));
});

socket.on('connect_error', () => {
    dispatch(actions.setSocketConnectFirstTime(false));
});

socket.on('reconnecting', () => {
    dispatch(actions.setSocketConnectStatus(SocketStatus.CONNECTING));
});

socket.on(socketRoomName.instrument, (message) => {
    const { a: action, d: data, k: keys, t } = message;
    if (action === socketAction.partial) {
        dispatch(actions.setInstrumentData(data, keys, t));
    } else if (action === socketAction.update) {
        dispatch(actions.updateInstrumentData(data, t));
    }
});

socket.on(socketRoomName.orderBook10, (message) => {
    const { a: action, d: data, k: keys } = message;
    if (action === socketAction.partial) {
        dispatch(actions.setOrderbookData(data, keys));
    }
});
socket.on(socketRoomName.orderBook, (message) => {
    const { a: action, d: data } = message;
    if (action === socketAction.update) {
        dispatch(actions.updateOrderbookData(data));
    } else if (action === socketAction.insert) {
        dispatch(actions.insertOrderbookData(data));
    } else if (action === socketAction.delete) {
        dispatch(actions.deleteOrderbookData(data));
    }
});

socket.on(socketRoomName.trade, (message) => {
    const { a: action, d: data, k: keys } = message;
    if (action === socketAction.partial) {
        dispatch(actions.setTradeData(data, keys));
    } else if (action === socketAction.insert) {
        emitter.emit('TRADE' + data[0].SB, data[0]);
        dispatch(actions.insertTradeData(data));
    }
});

// socket.on(socketRoomName.exchange, (message) => {
//     const { a: action, d: data, k: keys, t } = message;
//     if (action === socketAction.partial) {
//         dispatch(actions.setInstrumentData(data, keys, t));
//     }
// });

socket.on(socketRoomName.index, (message) => {
    const { a: action, d: data, k: keys, t } = message;
    if (action === socketAction.partial) {
        dispatch(actions.setIndexsData(data, keys, t));
    } else if (action === socketAction.update) {
        dispatch(actions.updateIndexsData(data, t));
    } else if (action === socketAction.insert) {
        dispatch(actions.updateIndexsData(data, t));
    }
});

socket.on(socketRoomName.account, (message) => {
    if (message.d.length > 0) {
        const { ACC: accountId, DT: type } = message.d[0];
        dispatch(actions.onSocketAccountAction(accountId, type));
    }
});

socket.on(socketRoomName.customer, (message) => {
    if (message.d.length > 0) {
        const { DT: type } = message.d[0];
        if (type == 'CF') dispatch(actions.changeCustomerInfoEventtype(message));
        else if (type == 'AFU') {
            userService.getPermissionInfo().then((data) => { }).catch(error => { }) //giang.ngo: gọi lại hàm getPermissionInfo để cập nhật lại thông tin permissioninfo của tài khoản
            dispatch(actions.changeAccountInfoEventtype(message));
        } else {
            /**
             * xử lí các event theo custid
             * example: reload so lenh moi gioi
             * case1: type=OD
             * ...
             */
            const { CUSTID: custid } = message.d[0];
            dispatch(actions.onSocketCustomerAction(custid, type));
        };
    }
});

socket.on(socketRoomName.report, (message) => {
    let reportKeys = getValueFromSessionStorage(sessionKeyFactory.reportKeys);
    if (reportKeys) {
        reportKeys = JSON.parse(reportKeys);
    } else reportKeys = {};
    if (message.d.length > 0) {
        const { autoid, fekey } = message.d[0];
        if (autoid) {
            if (fekey != null && !reportKeys[fekey]) return;
            delete reportKeys[fekey];
            inquiryService.getReport(autoid);
        }
    }
});

socket.on("logout", (message) => {
    const state = reduxStore.getState(),
        token = state.user.token ? state.user.token.access_token : null;
    const { CLIENTID, REASON, ACCESS_TOKEN } = message;
    if (CLIENTID == "*" || CLIENTID == config.api.CLIENT_ID) {
        if (REASON == "KILL_SESSION") {
            //ko đá bản thân
            if (token !== ACCESS_TOKEN) {
                dispatch(actions.logoutByOther());
            };
        } else if (REASON == "CHANGE_PASS") {
            dispatch(actions.changePassWordInfoEventtype(message))
        }
    }
});
socket.on(socketRoomName.message, (message) => {
    // dispatch(actions.updateAccountNotifyList());
    dispatch(actions.updateAccountNotifyCounter());
});
socket.on(socketRoomName.message_analytic, (message) => {
    // Trường hợp xóa tin không hiển thị thông báo nhận thông điệp
    if (message.d && message.d.length > 0) {
        dispatch(actions.toastToNoticeWhenReceiveMessage());
    }
    dispatch(actions.updateAnalyticNotifyList());
});
socket.on('initday', () => {
    dispatch(actions.onInitDay());
    dispatch(actions.getIndexsData());
});

socket.on('quotes_change', () => {
    dispatch(actions.fetchAllQuotes());
});
socket.on('mk_stt_end', () => {
    dispatch(actions.fetchAllQuotes());
});
socket.on('system_open', () => {
    dispatch(actions.fetchAllQuotes());
});
export const on = (eventName, eventHandler) => {
    socket.on(eventName, (data) => {
        eventHandler(data);
    })
};

export const connect = () => {
    dispatch(actions.setSocketConnectFirstTime(true));
    dispatch(actions.setSocketConnectStatus(SocketStatus.CONNECTING));
    socket.open();
};

export const disconnect = () => {
    dispatch(actions.setSocketConnectFirstTime(true));
    return socket.close();
};

export const registerTopics = (topics, callerId) => {
    if (!callerId) {
        console.error('CallerId need when register interested topics');
        return;
    }
    operationsQueue.push({
        action: 'register',
        data: {
            topics: topics,
            callerId: callerId
        }
    });
};

export const unregisterTopics = (topics, callerId) => {
    if (!callerId) {
        console.error('CallerId need when unregister interested topics');
        return;
    }
    operationsQueue.push({
        action: 'unregister',
        data: {
            topics: topics,
            callerId: callerId
        }
    });
};

export const unregisterTradeTopic = (symbol, callerId) => {
    unregisterTopics([socketRoomName.trade + ':' + symbol], callerId);
};

export const unregisterAnalyticMessage = (language, custid, callerId) => {
    unregisterTopics([socketRoomName.message_analytic + ':' + language, socketRoomName.message_analytic + ':' + language + ':' + custid], callerId);
};

export const unregisterCallerId = (callerId) => {
    if (!callerId) {
        console.error('CallerId need when unregister interested topics');
        return;
    }
    operationsQueue.push({
        action: 'unregister-callerId',
        data: {
            callerId: callerId
        }
    });
};

// Utility functions
export const registerInstrumentTopic = (symbol, callerId) => {
    symbol && symbol.length > 0 && registerTopics([socketRoomName.instrument + ':' + symbol], callerId);
};

export const registerOrderbookTopic = (symbol, callerId) => {
    symbol && symbol.length > 0 && registerTopics([socketRoomName.orderBook10 + ':' + symbol], callerId);
};

export const registerTradeTopic = (symbol, callerId) => {
    symbol && symbol.length > 0 && registerTopics([socketRoomName.trade + ':' + symbol], callerId);
};

export const registerExchangeTopics = (exchange, callerId) => {
    registerTopics([socketRoomName.exchange + ':' + exchange], callerId);
};

export const registerAccountTopics = (accountId, callerId) => {
    registerTopics([socketRoomName.account + ':' + accountId], callerId);
};
export const registerAllAccountTopics = (accountIds, callerId) => {
    var subcribeAccounts = []
    accountIds.forEach(accountId => {
        subcribeAccounts.push([socketRoomName.account + ':' + accountId])
    })
    registerTopics(subcribeAccounts, callerId);
};
export const registerCustomerTopics = (custid, callerId) => {
    registerTopics([socketRoomName.customer + ':' + custid], callerId);
};
export const registerAccountMessageTopics = (custid, callerId) => {
    registerTopics([socketRoomName.message + ':' + custid], callerId);
};
export const registerAnalyticMessageTopics = (language, custid, callerId) => {
    registerTopics([socketRoomName.message_analytic + ':' + language, socketRoomName.message_analytic + ':' + language + ':' + custid], callerId);
};
export const registerMarketInforTopics = (callerId) => {
    let marketCodeArr = config.ALL_INDEXES.map(element => {
        return element.code
    });
    // HOSE và HNX luôn được sub để lấy trạng thái phiên ở footer
    if (!marketCodeArr.includes('HOSE')) marketCodeArr.push('HOSE');
    if (!marketCodeArr.includes('HNX')) marketCodeArr.push('HNX');
    let subArr = marketCodeArr.map(element => {
        return socketRoomName.index + ":" + element;
    })
    registerTopics(subArr, callerId);
};
_scheduleToExecuteOperations();