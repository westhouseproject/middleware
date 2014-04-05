/* jshint node: true */

'use strict';

var _        = require('lodash'),
    request  = require('request'),
    settings = require('./settings');

/**
 * Filters out all device readings that don't represent BCPM.
 */
module.exports._getBcpmData = function (westHouseData) {
  if (!_.isArray(westHouseData)) throw new Error('The data is not an array.');
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
module.exports._groupDevices = function (bcpmData) {
  var groups = _.groupBy(bcpmData, function (el) {
    return el.Name.match(/[0-9]+/)[0];
  });
  var retval = {};
  Object.keys(groups).forEach(function (key) {
    var group = groups[key];
    var kw = _.find(group, function (device) {
      return (/h$/).test(device.Name);
    });
    var kwh = _.find(group, function (device) {
      return (/w$/).test(device.Name);
    });
    if (group.length != 2 || !kw || !kwh) {
      return;
    }
    retval[key] = group;
  });
  return retval;
};

/**
 * From the grouped devices, clean up the data to be presentable.
 */
module.exports._getConsumptionData = function (devicesData) {
  return _.keys(devicesData).map(function (el) {
    var device = devicesData[el];
    var kW = device.filter(function (el) {
      return (/w$/).test(el.Name);
    })[0].Status;
    var kWh = device.filter(function (el) {
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

/**
 * Sift out BCPM data from the mControl data.
 */
module.exports.getConsumptionData = function (mControlData) {
  var bcpmData, deviceData;
  bcpmData = module.exports._getBcpmData(mControlData);
  deviceData = module.exports._groupDevices(bcpmData);
  return module.exports._getConsumptionData(deviceData);
};

/**
 * Download the mControl data, from the mControl server.
 */
module.exports.downloadMControlData = function (callback) {
  if (!settings.mControl) {
    throw new Error('mControl settings are not defined.');
  }
  var host = settings.mControl.host
  if (settings.mControl.port && settings.mControl.port !== 80) {
    host += ':' + settings.mControl.port;
  }
  var url = 'http://' + host + '/mControl/api/devices';
  
  console.log(url);
  request({
    uri: url,
    headers: {
      'Content-Type': 'text/json'
    }
  }, function (err, res, body) {
    // TODO: validate `body`.
    if (err) return callback(err);
    callback(null, body);
  });
};
