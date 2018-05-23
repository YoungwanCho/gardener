var express = require('express');
var request = require('request');
var fs = require('fs');
var app = express();

var server = app.listen(3030, function () {
    console.log("Express server has started on port 3030");
})

var SendMessage = function (webhook_url) {
    var formData = {
        body: '[[PizzaHouse]](http://url_to_text) You have a new Pizza order.', //Body text (Required)
        connectColor: '#FAC11B', //Hex code color of attachment bar
        connectInfo: [{
            title: 'Topping', //1st attachment area title
            description: 'Pepperoni' //1st attachment description
        },
        {
            title: 'Location', //2nd attachment area title
            description: 'Empire State Building, 5th Ave, New York', //2nd attachment description
            imageUrl: 'http://url_to_text' //Image URL
        }]
    }
    var options = {
        url: webhook_url,
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

var loadConfig = function () {
    try {
        var data = fs.readFileSync(__dirname + "/data/config.json", 'utf8');
        var resource = {};
        resource = JSON.parse(data);
        return resource["webhook_url"];
    }
    catch (err) {
        console.log(err);
    }
}

SendMessage(loadConfig());