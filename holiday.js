var fs = require('fs');
var syncRequest = require('sync-request');
var configure = require('./config.js');

var download = function (filePath) {
  var today = new Date();
  var year = today.getFullYear();

  var configData = configure.loadConfig();
  var url = configData["HoliDay-URL"];
  url += "?ServiceKey=" + configData["HoliDay-ServiceKey"];
  url += "&_type=json";
  url += "&numOfRows=50";
  url += "&solYear=" + year;

  const getConfig = {
    host: configData["HoliDay-URL"],
    Referer: "",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  };
  
  var res = syncRequest('GET', url, getConfig);
  var body = res.body;
  var jsonString = JSON.parse(body);
  var jsonData = JSON.stringify(jsonString);
  fs.writeFileSync(filePath, jsonData);
}

const checkHoliday = function () {
  var today = new Date();
  var yyyy = today.getFullYear();
  var fileName = "holiday-" + yyyy + ".json";
  var filePath = "./data/" + fileName;
  var isExists = fs.existsSync(filePath);

  if (isExists) {
    var isHoilday = false;
    var holidays = fs.readFileSync(filePath, 'utf8');
    holidays = JSON.parse(holidays);
    holidays = holidays["response"]["body"]["items"]["item"];
    holidays.forEach(element => {
      var locdate = element["locdate"];
      var date = parseStringToDate(locdate);
      if (today.getMonth() == date.getMonth() && today.getDay() == date.getDay()) {
        isHoilday = true;
      }
    }); 
    return isHoilday;
  } else {
    console.log(fileName + "file not exist");
    download(filePath);
    return checkHoliday();
  }
}
exports.checkHoliday = checkHoliday;

function parseStringToDate(str) {
  str = String(str);
  var y = str.substr(0,4),
      m = str.substr(4,2) - 1,
      d = str.substr(6,2);
  var date = new Date(y,m,d);
  date.setHours(9); // 한국 표준시 더 해줌
  return (date.getFullYear() == y && date.getMonth() == m && date.getDate() == d) ? date : 'invalid date';
}
