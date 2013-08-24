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

app.get('/consumptions', function (req, res) {
  res.json(501, { error: 'Not yet implemented.' });
});

app.listen(3000);
console.log('Server listening on port 3000');