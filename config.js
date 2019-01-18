var fs = require('fs');

exports.loadConfig = function () {
  try {
    var data = fs.readFileSync(__dirname + "/data/config.json", 'utf8');
    var resource = {};
    resource = JSON.parse(data);
    return resource;
  }
  catch (err) {
    console.log(err);
  }
}