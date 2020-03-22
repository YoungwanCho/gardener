var express = require('express');
var bodyParser = require('body-parser');

var jandi = require('./jandi.js');
var holiday = require('./holiday.js');
var config = require('./config.js');
var scheduler = require('./scheduler.js');
var lunchmenu = require('./lunchmenu.js');
var youtubeNotifier = require('./youtubenotifìer.js');
var configData = config.loadConfig();

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var outgoing = require('./router/outgoing.js')(app);
app.use('/outgoing', outgoing);

app.listen(3030, function () {
  console.log("Express server has started on port 3030");

  var lunchNotifyTime = configData["LunchNotifyTime"];
  var lunchNotifyTime = lunchNotifyTime.split(":");
  scheduler.addSchedule(lunchNotifyTime[0], lunchNotifyTime[1], menuOfTheDay);

  // var youtubeNotifyTime = configData["YoutubeNotifyTime"];
  // var youtubeNotifyTime = youtubeNotifyTime.split(":");
  // scheduler.addSchedule(youtubeNotifyTime[0], youtubeNotifyTime[1], youtubeNotify);
})

const youtubeNotify = function () {
  if (isItWeekdayToday() && !isItHolidayToday()) {
    youtubeNotifier.newVideoNotify();
  }
}

const menuOfTheDay = function () {
  if (isItWeekdayToday() && !isItHolidayToday()) {
    const description = lunchmenu.menuOfTheDay(configData["LunchMenu-URL"]);
    var formData = {
      body: "점심메뉴",
      connectColor: '#FAC11B',
      connectInfo: [{
        title: '오늘의 메뉴',
        description: description
      }]
    }
    jandi.sendMessage(configData["IW-Group"], formData);
  }
}

const isItWeekdayToday = function () {
  var date = new Date();
  var dayLabel = date.getDay();
  return (1 <= dayLabel && dayLabel <= 5); //월요일 금요일
}

const isItHolidayToday = function () {
  return holiday.checkHoliday();
}

exports.SendMenuOfTheDay = menuOfTheDay;
