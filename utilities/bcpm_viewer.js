/* jshint node:true */

'use strict';

var request = require('request'),
    _       = require('lodash');

// TODO: unit test the code below.

request('http://west-house.no-ip.org:3000/devices', function (err, resonse, body) {
  var mControlData, bcpmData, devicesData, values;

  if (err) return console.error(err);

  try {
    mControlData = JSON.parse(body);
  } catch (e) {
    return console.error(err);
  }

  // Get all BCPM devices that are attached to a physical appliance.
  bcpmData = mControlData.filter(function (el) {
    return (/^bcpm_([0-9]+)_kwh?$/).test(el.Name);
  });

  // Each appliance in the house has two BCPM devices. One that reads the
  // current kilowatt (kW), at the time of getting the data, and the total
  // kW used since the appliance was installed (kWh).
  devicesData = _.groupBy(bcpmData, function (el) {
    return el.Name.match(/[0-9]+/);
  });

  // The above `groupBy` operations Generates an object, of the type:
  //
  //     {
  //       "01": [
  //         {
  //           Name: "bcpm_01_kw",
  //           Status: "0.123123",
  //         },
  //         {
  //           Name: "bcpm_01_kwh",
  //           Status: "10.123123",
  //         }
  //       ],
  //       "02": [
  //         {
  //           Name: "bcpm_02_kw",
  //           Status: "1.123123",
  //         },
  //         {
  //           Name: "bcpm_02_kwh",
  //           Status: "200.123123",
  //         }
  //       ]
  //     }
  //
  // Hence, my use of the `keys` operation.

  // Grabs all keys in the object returned from the above `groupBy` operation.
  // With those keys, we can then synthesize `devicesData` into something more
  // meaningful. e.g.
  //
  //     [
  //       {
  //         deviceNumber: 1,
  //         kW          : 0.123123,
  //         kWh         : 10.123123
  //       },
  //       {
  //         deviceNumber: 2,
  //         kW          : 1.123123,
  //         kWh         : 200.123123
  //       }
  //     ]
  values = _.keys(devicesData).map(function (el) {
    var // Remember; `el` is a string, and `devicesData` is an object, where
        // you access its values using string keys.
        device = devicesData[el],
        // `device` is an array. To get kW and kWh, we are simply going to
        // check and see which element of the array holds which data, and store
        // them in the appropriate variables.
        kW     = device.filter(function (el) {
          return (/w$/).test(el.Name);
        })[0].Status,
        kWh    = device.filter(function (el) {
          return (/h$/).test(el.Name);
        })[0].Status;
    return {
      deviceNumber: parseInt(el, 10),
      kW          : kW,
      kWh         : kWh
    };
  })
  // Sort by device number.
  .sort(function (a, b) {
    return a.deviceNumber - b.deviceNumber;
  });
  console.log(values);
});