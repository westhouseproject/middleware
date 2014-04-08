/* jshint node:true */

'use strict';

var express = require('express');
var utils = require('./lib/utils');
var settings = require('./lib/settings.js');
var mysql = require('mysql');
var app = express();

var connection = mysql.createConnection(settings.database);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.next();
});
app.use(express.json());
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
  if (req.query.granularity !== '1h') {
    return utils.downloadMControlData(function (err, body) {
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
  } else {
    var to = req.query.to || Math.floor(new Date().getTime() / 1000);
    var from = req.query.from || to - 60 * 60;
    var query = 
      'SELECT id, device_id, time, start_kwh, hour_kwh, min, max ' +
      'FROM hourly_totals ' +
      'ORDER BY time DESC;';

    return connection.query(
      'SET time_zone = \'-07:00\';',
      function () {
        connection.query(
          query,
          //[ from, to ],
          function (err, result) {
            if (err) { console.log(err); return res.json(500, { err: err }) }
            var toSend = result.filter(function (data) {
              var taut = data.time.getTime() >= from * 1000 && data.time.getTime() <= to * 1000;
              return taut;
            });
            res.json(toSend);
            //res.json(result);
          }
        )
      }
    );

  }
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
