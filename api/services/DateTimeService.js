module.exports = {
    _config: {

    },
    getDate: function () {
        var appendZero = function (input) {
                return ((input < 10) ? '0' : '') + input;
            },
            date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day  = date.getDate(),
            hour = date.getHours(),
            min  = date.getMinutes(),
            sec  = date.getSeconds();

        month = appendZero(month);
        day = appendZero(day);
        hour = appendZero(hour);
        min =  appendZero(min);
        sec = appendZero(sec);
        return year + "-" + month + "-" + day + "_" + hour + ":" + min + ":" + sec;
    },
    getYear: function () {
        var date = new Date();
        return date.getFullYear();
    },
    getMonth: function (options) {
        var date = new Date();
        var monthKey = date.getMonth();
        var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var monthNameAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        var result = monthKey;
        var params = options || {};

        switch (params.format) {
        case 'name':
            result = monthName[monthKey];
            break;
        case 'name-abbr':
            result = monthNameAbbr[monthKey];
            break;
        case 'double-digit':
            result = monthKey + 1;
            if (result < 10) {
                result = '0' + result;
            }
            break;
        default:
            result = monthKey + 1;
        }

        return result;
    },
    getDay: function () {
        var date = new Date();
        return date.getDate();
    },
};
