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
            .replace(/[^\w ]+/g,'') // remove hythen
            .replace(/ +/g,'-'); // condense
    },
    sort: function (object, params) {
        var key = params.key,
            validator = (params.descend) ? [1, -1] : [-1, 1],
            compare = function (a,b) {
                if (a[key] < b[key]) {
                    return validator[0]; 
                }
                if (a[key] > b[key]) {
                    return validator[1];
                }
                    return 0;
            };
        return object.sort(compare);
    }
};