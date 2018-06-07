var express = require('express');
var request = require('request');
var fs = require('fs');
var app = express();
var schedule = require('node-schedule');
var jandi = require('./jandi.js');

var server = app.listen(3030, function () {
    console.log("Express server has started on port 3030");
})


var loadConfig = function () {
    try {
        var data = fs.readFileSync(__dirname + "/data/config.json", 'utf8');
        var resource = {};
        resource = JSON.parse(data);
        return resource;
    }
    catch (err) {
        console.log(err);
    }
}

var checkEventDay = function (Host, ProjectKey, baseUrl, callbackAction) {
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

var rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = [0, new schedule.Range(1, 5)];
// rule.hour = 10;
// rule.minute = 0;
rule.second = 30;

var job = schedule.scheduleJob(rule, function () {
    BreakFast();
});

var BreakFast = function () {
    var config = loadConfig();
    checkEventDay(config["EventDay-host"], config["EventDay-TDCProjecyKey"], config["EventDay-URL"], function () {
        jandi.sendMessage(config["Webhook_Url"]);
    });
};