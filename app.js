/* jshint node:true */

'use strict';

var express = require('express');
var utils = require('./lib/utils');
var settings = require('./lib/settings.js');
var app = express();

console.log(settings);

app.use(express.bodyParser());
app.use(express.methodOverride());

// TODO: require authentication. Use a middleware for that.

app.get('/', function (req, res) {
  res.redirect('/devices');
});

app.get('/devices', function (req, res) {
  utils.downloadMControlData(function (err, body) {
    if (err) return res.json(500, { error: err.message });
    res.set('Content-Type', 'application/json');
    res.send(body);
  });
});

app.get('/consumptions', function (req, res) {

  // TODO: be able to accept query strings.

  utils.downloadMControlData(function (err, body) {
    var devices, consumptions;
    if (err) {
      return res.json(500, { error: err.message });
    }
    try {
      devices = JSON.parse(body);
      consumptions = utils.getConsumptionData(devices);
    } catch (e) {
      return res.json(500, { error: e.message });
    }
    res.json(consumptions);
  });
});

function sendComingSoon(res) {
  res.send(501, { message: 'Coming soon.' });
}

app.get('/consumptions/:deviceId', function (req, res) {
  sendComingSoon(res);
});

app.get('/rooms', function (req, res) {
  sendComingSoon(res);
});

app.listen(settings.listenPort);
console.log('Server listening on port ' + settings.listenPort);
