var express = require('express');
var request = require('request');
var fs = require('fs');
var app = express();
var schedule = require('node-schedule');

var server = app.listen(3030, function () {
    console.log("Express server has started on port 3030");
})

var SendMessage = function (webhook_url) {
    var formData = {
        body: '[[PizzaHouse]](http://url_to_text) You have a new Pizza order.', //Body text (Required)
        connectColor: '#FAC11B', //Hex code color of attachment bar
        connectInfo: [{
            title: 'Topping', //1st attachment area title
            description: 'Pepperoni' //1st attachment description
        },
        {
            title: 'Location', //2nd attachment area title
            description: 'Empire State Building, 5th Ave, New York', //2nd attachment description
            imageUrl: 'http://url_to_text' //Image URL
        }]
    }
    var options = {
        url: webhook_url,
        headers: {
            "Content-type": "application/json",
            "Accept": "application/vnd.tosslab.jandi-v2+json"
        },
        form: formData
    };
    request.post(options, function (err, response, body) {
        if (err) {
            console.error('err: ', err);
            return;
        }
        return;
    });
}

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
rule.dayOfWeek = [0, new schedule.Range(1, 5)];
rule.hour = 10;
rule.minute = 0;

var job = schedule.scheduleJob(rule, function () {
    BreakFast();
});

var BreakFast = function () {
    var config = loadConfig();
    checkEventDay(config["EventDay-host"], config["EventDay-TDCProjecyKey"], config["EventDay-URL"], function () {
        SendMessage(config["Webhook_Url"]);
    });
};