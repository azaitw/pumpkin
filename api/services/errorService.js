var errorService = {
    returnErrorMsg: function (errorType) {
        var result = '';
        switch (errorType) {
        case 'email':
            result = '請輸入正確的電子郵件格式';
            break;
        case 'required':
            result = '此欄位必填';
            break;
        case 'duplicate':
            result = '這個電子信箱已經註冊過了';
            break;
        case 'incorrect':
            result = '輸入的電子信箱或密碼有誤';
            break;
        }
        return result;
    },
    error400: function (E) {
        var placeholder;
        var key;
        var invalidAttrs = E.invalidAttributes || JSON.parse(E.response).invalidAttributes; // object
        var result = {};
        for (key in invalidAttrs) {
            placeholder = invalidAttrs[key][0].rule;
            result[key] = this.returnErrorMsg(placeholder);
        }
        return result;
    },
    error500: function (E) {
        var errorMsg = JSON.parse(JSON.stringify(E)).raw;
        var result;
        switch (errorMsg.code) {
        case 11000:
            result = {
                email: '這個電子信箱已經註冊過了'
            };
            break;
        default:
            result = {
                general: '未知的錯誤'
            };
        }
        return result;
    },
    returnErrorMessages: function (E) {
        switch (E.status) {
        case 400:
            errors = this.error400(E);
            break;
        case 500:
            errors = this.error500(E);
            break;
        case 0:
            errors = {
                general: '網路連線中斷'
            };
            break;
        }
        return errors;
    }
};
module.exports = errorService;