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
    }
};
