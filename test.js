/* jshint node: true */
/* globals describe, it */

'use strict';

var _           = require('lodash'),
    expect      = require('expect.js'),
    assert      = require('assert'),
    utils = require('./lib/utils.js');

describe('utils', function () {
  describe('_getBcpmData', function () {
    it('should only return data that represent BCPM data', function () {
      var data = [
            {
              Name: 'something'
            },
            {
              Name: 'bcpm_10_kw'
            },
            {
              Name: 'bcpm_10_kwh'
            },
            {
              Name: 'bcpm_v_a'
            }
          ],
          expected = [
            {
              Name: 'bcpm_10_kw'
            },
            {
              Name: 'bcpm_10_kwh'
            }
          ];
      expect(utils._getBcpmData(data)).to.eql(expected);
    });
  });
  describe('_groupDevices', function () {
    it('should group bcpm by their device number', function () {
      var data = [
            {
              Name: 'bcpm_10_kw'
            },
            {
              Name: 'bcpm_11_kwh'
            },
            {
              Name: 'bcpm_10_kwh'
            },
            {
              Name: 'bcpm_11_kw'
            },
            {
              Name: 'bcpm_12_kwh'
            },
            {
              Name: 'bcpm_12_kw'
            }
          ],
          expected = {
            '10': [
              {
                Name: 'bcpm_10_kw'
              },
              {
                Name: 'bcpm_10_kwh'
              }
            ],
            '11': [
              {
                Name: 'bcpm_11_kw'
              },
              {
                Name: 'bcpm_11_kwh'
              }
            ],
            '12': [
              {
                Name: 'bcpm_12_kw'
              },
              {
                Name: 'bcpm_12_kwh'
              }
            ]
          },
          result = utils._groupDevices(data);

      _.keys(expected).forEach(function (el) {
        assert(!!result[el]);
        expect(result[el].sort(function (a, b) {
          return a.Name > b.Name ? 1 : (a.Name < b.Name ? -1 : 0);
        })).to.eql(expected[el]);
      });
    });
  });
  describe('_getConsumptionData', function () {
    it('should get the data all cleaned up, and ready for production', function () {
      var data = {
            '10': [
              {
                Name: 'bcpm_10_kw',
                Status: '0.12313'
              },
              {
                Name: 'bcpm_10_kwh',
                Status: '10.23434'
              }
            ],
            '11': [
              {
                Name: 'bcpm_11_kw',
                Status: '1.33'
              },
              {
                Name: 'bcpm_11_kwh',
                Status: '60.4545'
              }
            ],
            '12': [
              {
                Name: 'bcpm_12_kw',
                Status: '0.5343434'
              },
              {
                Name: 'bcpm_12_kwh',
                Status: '20.45466'
              }
            ]
          },
          expected = [
            {
              deviceNumber: 10,
              kW          : 0.12313,
              kWh         : 10.23434
            },
            {
              deviceNumber: 11,
              kW          : 1.33,
              kWh         : 60.4545
            },
            {
              deviceNumber: 12,
              kW          : 0.5343434,
              kWh         : 20.45466
            }
          ];
      expect(utils._getConsumptionData(data)).to.eql(expected);
    });
  });
  describe('getConsumptionData', function () {
    it('it should be able to get the consumption data given an mControl array', function () {
      var data = [
            {
              Name: 'light_switch',
              Status: '0'
            },
            {
              Name: 'Something',
              Status: '50'
            },
            {
              Name: 'bcpm_10_kw',
              Status: '0.12313'
            },
            {
              Name: 'bcpm_11_kwh',
              Status: '60.4545'
            },
            {
              Name: 'Nuclear reactor',
              Status: '9001'
            },
            {
              Name: 'bcpm_10_kwh',
              Status: '10.23434'
            },
            {
              Name: 'bcpm_11_kw',
              Status: '1.33'
            },
            {
              Name: 'bcpm_12_kwh',
              Status: '20.45466'
            },
            {
              Name: 'bcpm_12_kw',
              Status: '0.5343434'
            }
          ],
          expected = [
            {
              deviceNumber: 10,
              kW          : 0.12313,
              kWh         : 10.23434
            },
            {
              deviceNumber: 11,
              kW          : 1.33,
              kWh         : 60.4545
            },
            {
              deviceNumber: 12,
              kW          : 0.5343434,
              kWh         : 20.45466
            }
          ];
      expect(utils.getConsumptionData(data)).to.eql(expected);
    });
  });
});