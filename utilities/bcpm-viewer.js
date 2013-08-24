/* jshint node:true */

'use strict';

var request     = require('request'),
    bcpmHelpers = require('./lib/bcpm-helpers.js');

// TODO: unit test the code below.

request('http://west-house.no-ip.org:3000/devices', function (err, resonse, body) {
  var mControlData;

  if (err) return console.error(err);

  try {
    mControlData = JSON.parse(body);
  } catch (e) {
    return console.error(err);
  }
  
  console.log(bcpmHelpers.getConsumptionData(mControlData));
});