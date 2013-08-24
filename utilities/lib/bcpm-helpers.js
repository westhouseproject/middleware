/* jshint node: true */

'use strict';

var _ = require('lodash');

/**
 * Filters out all device readings that don't represent BCPM.
 */
module.exports.getBcpmData = function (westHouseData) {
  return westHouseData.filter(function (el) {
    return (/^bcpm_([0-9]+)_kwh?$/).test(el.Name);
  });
};

/**
 * Group all BCPM readings.
 *
 * @param bcpmData an array, where each element either represents kW or kWh
 *   for a particular device.
 *
 * @returns a key-value pair, where the keys represent the device number, and
 *   the value is an array with two objects: one for the kW readings, and the
 *   other for kWh readings.
 */
module.exports.groupDevices = function (bcpmData) {
  return _.groupBy(bcpmData, function (el) {
    return el.Name.match(/[0-9]+/)[0];
  });
};

/**
 * From the grouped devices, clean up the data to be presentable.
 */
module.exports.getConsumptionData = function (devicesData) {
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