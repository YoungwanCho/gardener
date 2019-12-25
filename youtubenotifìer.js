const YoutubeSearch = require('./youtubeserach.js');

exports.newVideoNotify = function() {
  YoutubeSearch.getVideoList(onRecieveVideoList);
}

function onRecieveVideoList(videoList)
{
  for (var i in videoList.table) {
    var it = videoList.table[i];
    console.log(it);
  }
}