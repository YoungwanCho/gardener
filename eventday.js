var request = require('request');

exports.checkEventDay = function (Host, ProjectKey, baseUrl, callbackAction) {
    const config = {
        host: Host,
        Referer: "",
        headers: {
            "TDCProjectKey": ProjectKey,
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    };

    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1; //January is 0!
    var day = today.getDay();
    var queryUrl = baseUrl + "?type=h&year=" + year + "&month=" + month + "&day=" + day;
    var url = queryUrl;

    request.get(url, config, function (err, response, body) {
        console.log("event Day Check Url : " + url);
        if (err) {
            console.error('err: ', err);
            return;
        }
        console.log('responese : ', body);
        if (parseInt(body["totalResult"]) > 0) {
            console.log("오늘은 공휴일입니다.");
        }
        else {
            console.log("오늘은 업무일입니다.");
            callbackAction();
        }
    });
}