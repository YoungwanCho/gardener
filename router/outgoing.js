module.exports = function (app) {
  var express = require('express');
  var router = express.Router();
  var jandi = require('../jandi.js');
  var config = require('../config.js');

  router.post("/", function (req, res) {
    console.log(req.body);
    var configData = config.loadConfig();
    var formData = {
        body: req.body.text.replace('/'+req.body.keyword, ''),
        connectColor: '#FAC11B', //Hex code color of attachment bar
        // connectInfo: [{
        //     title: '', //1st attachment area title
        //     description: ''//1st attachment description
        // }]
    }
    jandi.sendMessage(configData["IW-Personal"], formData);
  });
  return router;
}