define(function() {
    function getReq() {
        var url = location.search;
        var params = {}
        if (url.indexOf("?") != -1) {
            url = url.substr(1);
            var arr = url.split("&");
            arr.forEach(function(item, index) {
                var objArr = item.split("=");
                params[objArr[0]] = objArr[1]
            })
            return params
        }
    }
    return getReq;
})