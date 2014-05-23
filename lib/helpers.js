/* jshint node: true */

'use strict';

var _        = require('lodash'),
    request  = require('request'),
    settings = require('../settings');

/**
 * Filters out all device readings that don't represent BCPM.
 */
module.exports._getBcpmData = function (westHouseData) {
  if (!_.isArray(westHouseData)) {
    throw new Error('The data is not an array.');
  }
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
module.exports._getUtilityData = function (devicesData) {
  var readings = _.keys(devicesData).map(function (el) {
    var device = devicesData[el];
    var kW = device.filter(function (el) {
      return (/w$/).test(el.Name);
    })[0].Status;
    var kWh = device.filter(function (el) {
      return (/h$/).test(el.Name);
    })[0].Status;
    return {
      deviceNumber: el,
      kW          : parseFloat(kW),
      kWh         : parseFloat(kWh)
    };
  }).sort(function (a, b) {
    return a.deviceNumber - b.deviceNumber;
  });

  return {
    energy_consumption: readings.map(function (data) {
      return {
        id: data.deviceNumber,
        value: data.kWh
      }
    }),
    energy_draw: readings.map(function (data) {
      return {
        id: data.deviceNumber,
        value: data.kW
      }
    }),
    energy_production: []
  } 
};

/**
 * Sift out utility data from the mControl data.
 */
module.exports.getUtilityData = function (mControlData) {
  var bcpmData, deviceData;
  bcpmData = module.exports._getBcpmData(mControlData);
  deviceData = module.exports._groupDevices(bcpmData);
  return module.exports._getUtilityData(deviceData);
};

/**
 * Download the mControl data, from the mControl server.
 */
module.exports.downloadMControlData = function (callback) {
  if (!settings.get('mcontrol')) {
    throw new Error('mControl settings are not defined.');
  }
  var url = 'http://' + settings.get('mcontrol:host') + '/mControl/api/devices';

  request({
    uri: url,
    headers: {
      'Content-Type': 'text/json'
    }
  }, function (err, res, body) {
    if (err) { return callback(err); }
    callback(null, JSON.parse(body));
  });
};
