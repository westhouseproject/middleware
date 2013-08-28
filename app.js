/* jshint node:true */

'use strict';

var express = require('express'),
    utils   = require('./lib/utils'),
    app     = express();

app.use(express.bodyParser());
app.use(express.methodOverride());

app.get('/', function (req, res) {
  res.redirect('/devices');
});

app.get('/devices', function (req, res) {
  utils.downloadMControlData(function (err, body) {
    if (err) return res.json(500, { error: err.message });
    res.set('Content-Type', 'text/json');
    res.send(body);
  });
});

// TODO: deprecate `/consumptions` in favour of `/energy-consumptions`
app.get('/consumptions', function (req, res) {

  // TODO: have the function also return device information.
  utils.downloadMControlData(function (err, body) {
    var devices, consumptions;
    if (err) return res.json(500, { error: err.message });
    try {
      devices = JSON.parse(body);
      consumptions = utils.getConsumptionData(devices);
    } catch (e) {
      return res.json(500, { error: e.message });
    }
    res.json(consumptions);
  });

});

app.listen(3000);
console.log('Server listening on port 3000');