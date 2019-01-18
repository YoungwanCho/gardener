var request = require('request');

exports.sendMessage = function (webhookUrl, formData) {
  var options = {
    url: webhookUrl,
    headers: {
      "Content-type": "application/json",
      "Accept": "application/vnd.tosslab.jandi-v2+json"
    },
    form: formData
  };
  request.post(options, function (err, response, body) {
    if (err) {
      console.error('err: ', err);
      return;
    }
    return;
  });
}