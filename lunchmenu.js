var cheerio = require('cheerio');
var syncRequest = require('sync-request');

exports.menuOfTheDay = function (url) {
    var res = syncRequest('GET', url);
    var html = res.body;
    var $ = cheerio.load(html);

    var weeklyMenus = new Array();
    var dailyMenus = new Array();

    $('.tbl_table.menu > tbody > tr > td').each(function () {
        $(this).children('span').filter(function (n) {
            if (!$(this).hasClass('kcal')) {
                var menuInfo = $(this);
                menuInfoText = menuInfo.text();
                if (!menuInfoText) {
                    menuInfoText = "메뉴 없음";
                }
                dailyMenus.push(menuInfoText);
                if (dailyMenus.length >= 3) {
                    weeklyMenus.push(dailyMenus.slice(0));
                    dailyMenus = [];
                }
                return true;
            }
        })
    })
    var date = new Date();
    var dayLabel = (date.getDay() + 6) % 7; // 월요일이 0이 되도록 계산
    return weeklyMenus[dayLabel][1]; // 중식은 무조건 1번이다.
}