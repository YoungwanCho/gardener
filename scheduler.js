var schedule = require('node-schedule');

exports.addSchedule = function (hour, minute, job) {
    var rule = new schedule.RecurrenceRule();
    // rule.dayOfWeek = [0, new schedule.Range(1, 5)]; // 월요일 ~ 금요일
    rule.hour = hour;
    rule.minute = minute;
    rule.second = 0;
    schedule.scheduleJob(rule, job);
}