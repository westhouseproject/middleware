'use strict';

// TODO: use caching for the devices in the house.

var express = require('express');
// TODO: KISS. Why this additional utilties file? I have no clue. Get rid of it.
var helpers = require('./lib/helpers');
var settings = require('./settings');
var influx = require('influx');
var util = require('util');
var _ = require('lodash');

var app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});
app.use(express.json());
app.use(express.methodOverride());
app.set('view engine', 'jade');

app.get('/devices', function (req, res) {
  helpers.downloadMControlData(function (err, body) {
    if (err) { return next(err); };
    res.json(body);
  });
});

app.get('/current', function (req, res, next) {
  helpers.downloadMControlData(function (err, data) {
    if (err) { return next(err); }
    res.json(helpers.getUtilityData(data));
  });
});

app.get('/rooms', function (req, res) {
  res.send(501, { message: 'Coming soon.' });
});

app.listen(settings.get('port'));
console.log(
  'Server listening on port %s, in %s mode',
  settings.get('port'),
  settings.get('environment')
);
