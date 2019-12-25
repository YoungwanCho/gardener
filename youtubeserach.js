var fs = require('fs');
var Youtube = require('youtube-node');
var youtube = new Youtube();

exports.getVideoList = function (callback) {
  youtube.setKey('AIzaSyD6TqfXnXNZx_BCdH9iaWWb9TuERbd3FbQ');
  youtube.addParam('part', 'contentDetails');
  youtube.addParam('channelId', 'UCIHVckqVvKSxmtvP7qDBhaQ');
  youtube.addParam('order', 'date');

  youtube.search('', 50, function (err, result) {
    if (err) { console.log(err); return; }

    const json = JSON.stringify(result, null, 2);
    const obj = JSON.parse(json);

    var videoList = {};
    videoList.table = [];

    var items = obj['items'];
    for (var i in items) {

      var it = items[i];
      var info = {
        title: it["snippet"]["title"],
        publishedAt: it["snippet"]["publishedAt"],
        videoId: it["id"]["videoId"]
      };
      videoList.table.push(info);
    }
    callback(videoList);
  });
}