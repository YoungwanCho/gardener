var cheerio = require('cheerio');
var syncRequest = require('sync-request');

exports.menuOfTheDay = function (url) {
    var res = syncRequest('GET', url);
    var html = res.body;
    var $ = cheerio.load(html);
    var menuList = [];

    menuList.push("일요일 운영하지 않습니다.");
    $('.tbl_table.menu > tbody > tr > td > span').each(function () {
        var tableInfo = $(this);
        var tableInfoText = tableInfo.text();
        if (tableInfoText) {
            menuList.push(tableInfoText);
        }
    })
    menuList.push("토요일은 운영하지 않습니다.");

    var date = new Date();
    var dayLabel = date.getDay();
    return menuList[dayLabel];
}