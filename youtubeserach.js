var youtubenode = require('youtube-node');
var youtube = new youtubenode();

exports.getVideoList = function (accessKey, channelId, callback) {
  youtube.setKey(accessKey);
  youtube.addParam('part', 'contentDetails');
  youtube.addParam('channelId', channelId);
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
