var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = [0, new schedule.Range(1, 5)];
// rule.hour = 10;
// rule.minute = 0;

exports.testJob = function (job) {
    schedule.scheduleJob(rule, job);
}