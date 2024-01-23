//combineConfig đi theo môi trường cài đặt
//file nay ghi de tuy theo moi truong
const config = {
    switch: {
        enableRefreshToken: true
    },
    conditionOrderList: [
        { id: "GTC", nameId: "trade.advance-condition-order.gtc-full-name", isShow: true },
        { id: "STO", nameId: "trade.advance-condition-order.sto-full-name", isShow: true },
        { id: "SEO", nameId: "trade.advance-condition-order.seo-full-name", isShow: true },
        { id: "SO", nameId: "trade.advance-condition-order.so-full-name", isShow: true },
        { id: "OCO", nameId: "trade.advance-condition-order.oco-full-name", isShow: true },
        { id: "MCO", nameId: "trade.advance-condition-order.mco-full-name", isShow: true },
        { id: "OTO", nameId: "trade.advance-condition-order.oto-full-name", isShow: true },
        { id: "ICO", nameId: "trade.advance-condition-order.ico-full-name", isShow: true },
        { id: "PCO", nameId: "trade.advance-condition-order.pco-full-name", isShow: true },
        { id: "CPO", nameId: "trade.advance-condition-order.cpo-full-name", isShow: true },
        { id: "TSO", nameId: "trade.advance-condition-order.tso-full-name", isShow: true }
    ],
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
export default config;