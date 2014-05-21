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

var client = influx(
  settings.get('influxdb:host'),
  settings.get('influxdb:port'),
  settings.get('influxdb:username'),
  settings.get('influxdb:password'),
  settings.get('influxdb:database')
);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});
app.use(express.json());
app.use(express.methodOverride());
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index', { routes: app.routes });
});

app.get('/devices', function (req, res) {
  helpers.getUtilityData(function (err, body) {
    if (err) return res.json(500, { error: err.message });
    res.set('Content-Type', 'application/json');
    res.send(body);
  });
});

app.get('/data', function (req, res, next) {
  // TODO:
  //   - Some computations required: sum, mean, min, max
  //   - Computations possible for:
  //     - energy consumption
  //     - energy draw
  //     - gas consumption
  //   - Computation not entirely possible for:
  //     - Weather
  //   - Some caveats:
  //     - energy consumption is--in a sense--a running total itself
  //     - energy draw, on the other hand, is not. Now, the question is: do
  //       we need a running total for it.
  //   - Weather can potentially have its temperature, humidity, presipitation
  //     calculated
  //   - We should also have a hanging/running total.
  //     - kWh is already a running total
  //       - Although, it can easily be reset. But the solution in this case is
  //         fairly easy. Just add to the previously calculated running total.
  //         - But this is a problem up to the poller to solve.
  //     - TOOD: should energy_draw also have an additional running total
  //       stored?
  //   - Be sure that no queries cause the server to crash

  var now = new Date();

  var type = req.query.type || 'energy_consumption';
  var granularity = req.query.granularity || '5m';
  var funct = req.query.funct || 'mean';
  var earliest =
    (req.query.earliest && parseInt(req.query.earliest, 10)) ||
    Math.floor((now.getTime() - 1000 * 60 * 60 * 6) / 1000);
  var latest =
    (req.query.latest && parseInt(req.query.latest, 10)) ||
    Math.floor(now.getTime() / 1000);
  var devices;

  if (req.query.devices) {
    try {
      var devicesList = JSON.parse(req.query.devices);
      if (!_.isArray(devicesList)) {
        throw new Error('Not an array');
      }
    } catch (e) {
      return res.send(401, 'The requested devices list must be a JSON array');
    }
  }

  // The way the weather is stored is different, and therefore, the way we will
  // compute its data is different.
  if (type === 'weather') {
    return res.send(501, 'Coming soon');
  }


  if (
    !/^(water_use|gas_consumption|energy_draw|energy_consumption|energy_production)$/
      .test(type)
  ) {
    return res
      .status(400)
      .send(util.format('The data type "%s" does not exist', type));
  }

  if (granularity !== undefined &&
    !/^\d+(u|s|m|h|d|w)$/.test(granularity)
  ) {
    return res
      .status(400)
      .send(
        util
          .format(
            'Can\'t understand your granularity query of %s',
            granularity
          )
      );
  }

  if (
    funct !== undefined &&
    !/^(min|max|mean)$/.test(funct)
  ) {
    return res.status(400).send(util.format('Function "%s" not supported', funct));
  }

  var query = util.format('SELECT %s(value) FROM %s WHERE time > %ss AND time < %ss GROUP BY time(%s)', funct, type, earliest, latest, granularity);
  console.log(query);

  client.query(query, function (err, data) {
    if (err) { return next(err); }
    console.log(data);
    res.json(data);
  });
});

app.get('/current', function (req, res, next) {
  helpers.downloadMControlData(function (err, data) {
    if (err) { return next(err); }
    res.json(helpers.getUtilityData(data));
  });
});

app.get('/consumptions/:deviceId', function (req, res) {
  res.send(501, { message: 'Coming soon.' });
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
