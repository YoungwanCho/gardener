const fs = require('fs');
const YoutubeSearch = require('./youtubeserach.js');
const jsonFilePath = './storage/youtube-notifier-stamp.json';

exports.newVideoNotify = function () {
  YoutubeSearch.getVideoList(onRecieveVideoList);
}

function onRecieveVideoList(videoList) {
  const stamps = loadNotifyStampOrNull();
  var newVideos = {};
  newVideos.table = [];

  if (stamps) {
    for (var i in videoList.table) {
      var it = videoList.table[i];
      if (!stamps.table.some(item => item.videoId == it.videoId)) {
        newVideos.table.push(it);
      }
    }
  } else {
    newVideos.table = videoList.table;
  }

  //TODO: 잔디에 메세지 보내기

  saveNotificationStamp(stamps, newVideos);
}

function saveNotificationStamp(stampInfo, newVideos) {
  if (!stampInfo) {
    stampInfo = {};
    stampInfo.table = [];
  }

  for (var i in newVideos.table) {
    console.log("New Video : " + JSON.stringify(newVideos.table[i]));
    stampInfo.table.unshift(newVideos.table[i]);
  }

  const json = JSON.stringify(stampInfo, null, 2);
  fs.writeFileSync(jsonFilePath, json);
}

function loadNotifyStampOrNull() {
  const isExists = fs.existsSync(jsonFilePath);
  var stamps
  if (isExists) {
    const json = fs.readFileSync('./storage/youtube-notifier-stamp.json');
    stamps = JSON.parse(json);
  }
  return stamps;
}
