var syncRequest = require('sync-request');
var fs = require('fs');
var configure = require('./config.js');

var download = function (filePath) {
    var configData = configure.loadConfig();
    const getConfig = {
        host: configData["EventDay-Host"],
        Referer: "",
        headers: {
            "TDCProjectKey": configData["EventDay-TDCProjecyKey"],
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    };

    var today = new Date();
    var year = today.getFullYear();
    var queryUrl = configData["EventDay-Url"] + "?type=h&year=" + year;
    var url = queryUrl;

    var res = syncRequest('GET', url, getConfig);
    var body = res.body;
    var jsonString = JSON.parse(body);
    var jsonData = JSON.stringify(jsonString);
    fs.writeFileSync(filePath, jsonData);
}

var checkEventDay = function () {
    var today = new Date();
    var yyyy = today.getFullYear();
    var fileName = "eventDay-" + yyyy + ".json";
    var filePath = "./data/" + fileName;
    var isExists = fs.existsSync(filePath);

    if (isExists) {
        var mm = today.getMonth() + 1;
        var dd = today.getDate();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var eventday = fs.readFileSync(filePath, 'utf8');
        var eventday = JSON.parse(eventday);
        var days = eventday["results"];
        var isEventDay = false;

        days.forEach(element => {
            var month = element["month"];
            var day = element["day"];
            if (mm == month && dd == day) {
                isEventDay = true;
            }
        });
        return isEventDay;
    } else {
        console.log(fileName + "file not exist");
        download(filePath);
        return checkEventDay();
    }
}

exports.checkEventDay = checkEventDay;