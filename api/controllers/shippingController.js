/* global sails */
var Q = require('q');
var shippingController = {
    addShippingPage: function (req, res) { // admin
        var brandName = req.params.brand;
        var form = [
            {
                label: '寄送方式',
                select: 'shipName',
                selectOptions: [
                    {
                        label: '郵局',
                        value: 'post',
                        description: '一般郵局寄送'
                    },
                    {
                        label: '貨到付款',
                        value: 'post-collect',
                        description: '郵局寄送並請郵局代收貨款。寄送時需提供郵局儲蓄或劃撥帳號'
                    }
                ]
            },
            {
                label: '運費計算規則',
                select: 'rule',
                selectOptions: [
                    {
                        label: '固定運費',
                        value: 'fixed',
                        description: '當客戶購買多樣商品時，僅收取固定的運費。'
                    },
                    {
                        label: '累加運費',
                        value: 'incremental',
                        description: '當客戶購買多樣商品時，取運費較高的商品為基礎，再累加額外的運費。'
                    }
                ]
            },
            {
                label: '運費',
                number: 'basePrice',
                description: '設定固定運費的價格。'
            },
            {
                label: '累加運費',
                number: 'incrementPrice',
                description: '當客戶購買多筆商品時，系統會取其中最高運費為基礎，再加上其他商品的累加運費。'
            }
        ];
        renderService.htmlOld(req, res, {form: form, submit: '新增'});
    }
};
module.exports = shippingController;