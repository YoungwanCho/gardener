var express = require('express');
var request = require('request');
var fs = require('fs');
var app = express();
var schedule = require('node-schedule');
var jandi = require('./jandi.js');
var eventday = require('./eventday.js');

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
    eventday.checkEventDay(config["EventDay-host"], config["EventDay-TDCProjecyKey"], config["EventDay-URL"], function () {
        jandi.sendMessage(config["Webhook_Url"]);
    });
};