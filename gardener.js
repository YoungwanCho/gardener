var express = require('express');
var jandi = require('./jandi.js');
var eventday = require('./eventday.js');
var config = require('./config.js');
var scheduler = require('./scheduler.js');
var lunchmenu = require('./lunchmenu.js');

var app = express();

var server = app.listen(3030, function () {
    console.log("Express server has started on port 3030");
    var configData = config.loadConfig();
    var notifyTime = configData["LunchNotifyTime"];
    var notifyTime = notifyTime.split(":");
    scheduler.addSchedule(notifyTime[0], notifyTime[1], menuOfTheDay);
})

var menuOfTheDay = function () {
    var date = new Date();
    var dayLabel = date.getDay();
    var isWeekday = (1 <= dayLabel && dayLabel <= 5); //월요일 금요일

    if (isWeekday) {
        var isEventDay = eventday.checkEventDay();
        if (isEventDay) {
            console.log(date.toDateString() + ' 오늘은 공휴일 입니다.');
        } else {
            var configData = config.loadConfig();
            var formData = {
                body: date.toDateString(),
                connectColor: '#FAC11B', //Hex code color of attachment bar
                connectInfo: [{
                    title: '오늘의 메뉴', //1st attachment area title
                    description: lunchmenu.menuOfTheDay(configData["LunchMenu-Url"]) //1st attachment description
                }]
            }
            jandi.sendMessage(configData["IW-Group"], formData);
        }
    }
}