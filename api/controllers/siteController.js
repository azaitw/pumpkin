var siteController = {
    returnFeatures: function () {
        var features = [
                {
                    title: '客製化',
                    desc: 'Beardude Engine 提供完全的頁面客製化自由度，讓您打造符合品牌風格的網站門面。我們也提供額外的客製化服務，為您精製專為電腦、平板與手機優化的網站。'
                },
                {
                    title: '月租費',
                    desc: '單一商店月租費僅 ? 元，單件商品依付款方式收5~7%手續費。同時以最合理實惠的方式提供各種客製化的服務。'
                },
                {
                    title: '購物車',
                    desc: '購物車除了方便顧客使用，同時提供追蹤尚未結帳的購物車。'
                },
                {
                    title: '各種付款',
                    desc: '信用卡, Paypal, 貨到付款, 便利商店, 銀行轉帳。'
                },
                {
                    title: '促銷工具',
                    desc: '可以依需求設定各種促銷方案，發送商店專屬的促銷郵件'
                    /*
                    coupon:
                        unlimited
                        單一
                        多個
                    限時折扣
                    買滿 x 元打 y 折
                    買滿 x 元折 y 元
                    買滿 x 件 免運費
                    */
                },
                {
                    title: '庫存管理',
                    desc: '提供簡易的庫存管理'
                },
                {
                    title: '運費管理',
                    desc: '可設定不同的運費規則，例如使用不同的郵寄服務與跨國寄送的運費計算'
                },
                {
                    title: '獨立的網址',
                    desc: '可申請您專屬的網址'
                },
                {
                    title: 'Facebook整合',
                    desc: '粉絲團/帳號自動上架'
                }
            ];
            return features;
    },
    index: function (req, res) {
//        res.redirect('/beardude');
        renderService.renderHtml(res, {
            templates: {
                body: 'site'
            },
            title: 'Beardude Engine 建立您專屬的網路商店',
            features: siteController.returnFeatures()
        });
    }
};
module.exports = siteController;