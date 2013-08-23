/* jshint node: true */

'use strict';

var _ = require('lodash');

module.exports.getBcpmData = function (westHouseData) {
  return westHouseData.filter(function (el) {
    return (/^bcpm_([0-9]+)_kwh?$/).test(el.Name);
  });
};

module.exports.groupDevices = function (bcpmData) {
  return _.groupBy(bcpmData, function (el) {
    return el.Name.match(/[0-9]+/)[0];
  });
};

module.exports.getCleanerData = function (devicesData) {
  return _.keys(devicesData).map(function (el) {
    var device = devicesData[el],
        kW     = device.filter(function (el) {
          return (/w$/).test(el.Name);
        })[0].Status,
        kWh    = device.filter(function (el) {
          return (/h$/).test(el.Name);
        })[0].Status;
    return {
      deviceNumber: parseInt(el, 10),
      kW          : parseFloat(kW),
      kWh         : parseFloat(kWh)
    };
  }).sort(function (a, b) {
    return a.deviceNumber - b.deviceNumber;
  });
};