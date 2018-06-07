var express = require('express');
var request = require('request');
var jandi = require('./jandi.js');
var eventday = require('./eventday.js');
var config = require('./config.js');
var scheduler = require('./scheduler.js');

var app = express();

var server = app.listen(3030, function () {
    console.log("Express server has started on port 3030");
})

var BreakFast = function () {
    var configValue = config.loadConfig();
    eventday.checkEventDay(configValue["EventDay-host"], configValue["EventDay-TDCProjecyKey"], configValue["EventDay-URL"], function () {
        jandi.sendMessage(configValue["Webhook_Url"]);
    });
};

scheduler.testJob(BreakFast);
