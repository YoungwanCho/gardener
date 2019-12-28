const fs = require('fs');
const youtubeSearch = require('./youtubeserach.js');
const jandi = require('./jandi.js');
const config = require('./config.js');
const jsonFilePath = './storage/youtube-notificatoin-stamp.json';
const configData = config.loadConfig();

exports.newVideoNotify = function () {
  const accessKey = configData["YoutubeAccessKey"];
  const channelId = configData["YoutubeChannelID"];
  youtubeSearch.getVideoList(accessKey, channelId, onRecieveVideoList);
}

function onRecieveVideoList(videoList) {
  const stamps = loadNotificationStampOrNull();
  var newVideos = {};
  newVideos.table = [];

  if (stamps) {
    for (var i in videoList.table) {
      var content = videoList.table[i];
      if (!stamps.table.some(item => item.videoId == content.videoId)) {
        newVideos.table.push(content);
      }
    }
  } else {
    newVideos.table = videoList.table;
  }

  for (var i in newVideos.table) {
    var content = newVideos.table[i];
    var formData = {
      body: '[YouTube 구독 & 좋아요 & 댓글](https://www.youtube.com/watch?v=' + content.videoId +')',
    }
    jandi.sendMessage(configData["IW-Group"], formData);
  }

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
  fs.writeFileSync(jsonFilePath, json, 'utf8');
}

function loadNotificationStampOrNull() {
  const isExists = fs.existsSync(jsonFilePath);
  var stamps
  if (isExists) {
    const json = fs.readFileSync(jsonFilePath, 'utf8');
    stamps = JSON.parse(json);
  }
  return stamps;
}
