/* jshint node: true */

'use strict';

var _ = require('lodash');

module.exports.getBcpmData = function (westHouseData) {
  return westHouseData.filter(function (el) {
    return (/^bcpm_([0-9]+)_kwh?$/).test(el.Name);
  });
};

module.exports.getDeviceData = function (bcpmData) {
  return _.groupBy(bcpmData, function (el) {
    return el.Name.match(/[0-9]+/)[0];
  });
};