var express = require('express');
var jandi = require('./jandi.js');
var eventday = require('./eventday.js');
var config = require('./config.js');
var scheduler = require('./scheduler.js');

var app = express();

var server = app.listen(3030, function () {
    console.log("Express server has started on port 3030");
    // scheduler.testJob(BreakFast);
    breakFast();
})

var breakFast = function () {
    var isEventDay = eventday.checkEventDay();
    if (isEventDay) {
        console.log("오늘은 공휴일입니다.");
    } else {
        var configData = config.loadConfig();
        jandi.sendMessage(configData["Webhook_Url"]);
    }
};