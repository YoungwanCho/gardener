var express = require('express');
var request = require('request');
var schedule = require('node-schedule');
var jandi = require('./jandi.js');
var eventday = require('./eventday.js');
var config = require('./config.js');
var app = express();

var server = app.listen(3030, function () {
    console.log("Express server has started on port 3030");
})

var rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = [0, new schedule.Range(1, 5)];
// rule.hour = 10;
// rule.minute = 0;
rule.second = 30;

var job = schedule.scheduleJob(rule, function () {
    BreakFast();
});

var BreakFast = function () {
    var configValue = config.loadConfig();
    eventday.checkEventDay(configValue["EventDay-host"], configValue["EventDay-TDCProjecyKey"], configValue["EventDay-URL"], function () {
        jandi.sendMessage(configValue["Webhook_Url"]);
    });
};