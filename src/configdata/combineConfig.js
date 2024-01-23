import config from './config';
import merge from 'deepmerge';

const internalConfig = {
    api: {
        // API_BASE_URL: "http://192.168.1.145/",
        API_BASE_URL: "http://192.168.1.170/",
        API_CHART_DATA_URL: "https://apis.bvsc.com.vn/tvcharts-1.0",
        // api lấy Thông tin cho Thông tin thị trường
        API_MARKET_NOTIFICATION: "http://10.140.4.136:8080/frontend-news-1.0/topNewsAll?",
        // api lấy Thông tin các tin tức theo nhóm
        API_MARKET_NOTIFICATION_BY_GROUP: "http://10.140.4.136:8080/frontend-news-1.0/topNewsByCat?",
        // api lấy chi tiết thông tin bằng id thông tin
        API_MARKET_NOTIFICATION_DETAIL: "http://10.140.4.136:8080//frontend-news-1.0/newsDetails?",
        // api lấy thông tin thị trường theo mã
        API_MARKET_NOTIFICATION_BY_SYMBOL: 'https://apis.bvsc.com.vn/frontend-news-1.0/symbolRelatedNews?',
        //api lấy chi tiết thông tin thị trường
        API_MARKET_NOTIFICATION_DETAIL: 'https://apis.bvsc.com.vn/frontend-news-1.0/newsDetails?',
        // CLIENT_ID: "FUXH9U0R7Q",
        // CLIENT_SECRET: "bd31Ctu6czkemvFfnSLAUV0zsYGUYL",
        CLIENT_ID: "FZKD31RTMO",
        CLIENT_SECRET: "AiscAPP9jgSZ9bMjxlkDQypW3I8tEP",
        REDIRECT_URL: "http://localhost:3000/sso",
        SIGN_PLUGIN_CHROME_URL: 'http://127.0.0.1:11368/',
        SIGN_PLUGIN_NOT_CHROME_URL: 'http://127.0.0.1:11369/',
        STATE_AGE: 60 * 5,
        TIME_OUT: 100 * 1000
    },
    app: {
        /**
         * The base URL for all locations. If your app is served from a sub-directory on your server, you'll want to set
         * this to the sub-directory. A properly formatted basename should have a leading slash, but no trailing slash.
         */
        ROUTER_BASE_NAME: null,
        SERVER_DATE_FORMAT: "DD/MM/YYYY",
        PRICE_BOARD_URL: '/priceboard/checkLoginSSO'
    },

    constant: {
        //custodycd cua cty CK
        OWN_CUSTODYCD: "001P000000",
        //accountid cua ty ck
        OWN_ACCOUNTID: "0001900001",
        //huy.quang: paging page size
        ROW_PER_PAGE: 500,
        //huy.quang: interval in seconds
        RESEND_OTP_INTERVAL: 5,
    },

    switch: {
        enableRefreshToken: false,
        //huy.quang: config cac widget k move + resize dc
        isWidgetStatic: true,
        //huy.quang: config co cho doi config duyet lenh dat ko
        enableReconfirmOrderSwitch: false
    },

    conditionOrderList: [
        { id: "GTC", nameId: "trade.advance-condition-order.gtc-full-name", isShow: true },
        { id: "STO", nameId: "trade.advance-condition-order.sto-full-name", isShow: false },
        { id: "SEO", nameId: "trade.advance-condition-order.seo-full-name", isShow: false },
        { id: "SO", nameId: "trade.advance-condition-order.so-full-name", isShow: false },
        { id: "OCO", nameId: "trade.advance-condition-order.oco-full-name", isShow: false },
        { id: "MCO", nameId: "trade.advance-condition-order.mco-full-name", isShow: false },
        { id: "OTO", nameId: "trade.advance-condition-order.oto-full-name", isShow: false },
        { id: "ICO", nameId: "trade.advance-condition-order.ico-full-name", isShow: false },
        { id: "PCO", nameId: "trade.advance-condition-order.pco-full-name", isShow: false },
        { id: "CPO", nameId: "trade.advance-condition-order.cpo-full-name", isShow: false },
        { id: "TSO", nameId: "trade.advance-condition-order.tso-full-name", isShow: false }
    ],

    // Cấu hình index hiển thị (department: index thuộc sở HOSE/HNX)
    ALL_INDEXES: [
        { title: 'VN-INDEX', code: 'HOSE', department: 'HOSE' },
        { title: 'VN30-INDEX', code: '30', department: 'HOSE' },
        { title: 'HNX-INDEX', code: 'HNX', department: 'HNX' },
        { title: 'HNX30-INDEX', code: 'HNX30', department: 'HNX' },
        { title: 'UPCOM', code: 'UPCOM', department: 'HNX' }
    ],

    MARKET_ORDER: [
        {
            "code": "10",
            "name": "HOSE",
            "value": "|ATO|ATC|MP|"
        },
        {
            "code": "02",
            "name": "HNX",
            "value": "|ATC|MAK|MOK|MTL|PLO|"
        },
        {
            "code": "04",
            "name": "UPCOM",
            "value": ""
        }
    ],

    // Link file hướng dẫn
    ALL_LINK: {
        vi: {
            TONG_HOP_TAI_SAN: 'https://bvsc.com.vn/Sites/QuoteVN/SiteRoot/Bwise/2. Màn hình tổng hợp tài sản của tiểu khoản.pdf',
            RUT_TIEN_IDEPOSIT: 'https://bvsc.com.vn/Sites/QuoteVN/SiteRoot/Bwise/1.2 Rút tiền iDeposit.pdf',
            THAY_DOI_MON_IDEPOSIT: 'https://bvsc.com.vn/Sites/QuoteVN/SiteRoot/Bwise/1.3 Thay đổi món iDeposit.pdf',
            UNG_TRUOC: 'https://bvsc.com.vn/Sites/QuoteVN/SiteRoot/Bwise/4.1 Ứng trước.pdf',
            DANG_KY_QUYEN_MUA: 'https://bvsc.com.vn/Sites/QuoteVN/SiteRoot/Bwise/4.2 Đăng ký quyền mua.pdf',
            XAC_NHAN_LENH: 'https://bvsc.com.vn/Sites/QuoteVN/SiteRoot/Bwise/4.3 Xác nhận lệnh.pdf',
        },
        en: {
            TONG_HOP_TAI_SAN: 'https://bvsc.com.vn/Sites/QuoteVN/SiteRoot/Bwise/2. Account balance.pdf',
            RUT_TIEN_IDEPOSIT: 'https://bvsc.com.vn/Sites/QuoteVN/SiteRoot/Bwise/1.2 iDeposit withdrawing.pdf',
            THAY_DOI_MON_IDEPOSIT: 'https://bvsc.com.vn/Sites/QuoteVN/SiteRoot/Bwise/1.3 iDeposit changing.pdf',
            UNG_TRUOC: 'https://bvsc.com.vn/Sites/QuoteVN/SiteRoot/Bwise/4.1 Cash Advance.pdf',
            DANG_KY_QUYEN_MUA: 'https://bvsc.com.vn/Sites/QuoteVN/SiteRoot/Bwise/4.2 Purchase Right Register.pdf',
            XAC_NHAN_LENH: 'https://bvsc.com.vn/Sites/QuoteVN/SiteRoot/Bwise/4.3 Order Confirmation.pdf',
        },
    }
};

const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray
var combineConfig = merge(internalConfig, config, { arrayMerge: overwriteMerge });

export default combineConfig;