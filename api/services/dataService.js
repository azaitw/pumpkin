module.exports = {
    _config: {

    },
    /*
        params: {
            key: SORT_KEY,
            descend: false // default: ascend
        }
    */
    slug: function (string) {
        return string
        .toLowerCase()
        .replace(/[^\w ]+/g,'') // remove hyphen
        .replace(/ +/g,''); // condense
    },
    sort: function (object, params) {
        var newObj = object.slice(0);
        var key = params.key;
        var validator = (params.descend) ? [1, -1] : [-1, 1];
        var compare = function (a,b) {
            if (a[key] < b[key]) {
                return validator[0]; 
            }
            if (a[key] > b[key]) {
                return validator[1];
            }
                return 0;
        };
        return newObj.sort(compare);
    }
};