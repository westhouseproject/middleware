/* jshint node: true */
/* globals describe, it */

'use strict';

var _           = require('lodash'),
    expect      = require('expect.js'),
    assert      = require('assert'),
    utils = require('./lib/helpers.js');

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
    function assertGroups(expected, result) {
      expect(Object.keys(result).length).to.be(Object.keys(expected).length);

      _.keys(expected).forEach(function (el) {
        assert(!!result[el]);
        expect(result[el].sort(function (a, b) {
          return a.Name > b.Name ? 1 : (a.Name < b.Name ? -1 : 0);
        })).to.eql(expected[el]);
      });
    }

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
      ];
      var expected = {
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
      };
      var result = utils._groupDevices(data);
      assertGroups(expected, result);
    });
    
    it('should reject all that have an invalid pairing in them', function () {
      var data = [
        {
          Name: 'bcpm_9_kw'
        },
        {
          Name: 'bcpm_9_kw'
        },
        {
          Name: 'bcpm_9_kwh'
        },
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
        },
        {
          Name: 'bcpm_13_kw'
        },
        {
          Name: 'bcpm_13_kwh'
        },
        {
          Name: 'bcpm_14_kw'
        },
        {
          Name: 'bcpm_15_kwh'
        },
        {
          Name: 'bcpm_15_kwh'
        },
        {
          Name: 'bcpm_16_kw'
        },
        {
          Name: 'bcpm_16_kw'
        }
      ];
      var expected = {
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
        ],
        '13': [
          {
            Name: 'bcpm_13_kw'
          },
          {
            Name: 'bcpm_13_kwh'
          }
        ]
      };
      var result = utils._groupDevices(data);
      assertGroups(expected, result);
    });
  });
  describe('_getUtilityData', function () {
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
      };
      var expected = {
        energy_consumption: [
          { id: '10', value: 10.23434 },
          { id: '11', value: 60.4545 },
          { id: '12', value: 20.45466 }
        ],
        energy_draw: [
          { id: '10', value: 0.12313 },
          { id: '11', value: 1.33 },
          { id: '12', value: 0.5343434 }
        ],
        energy_production: []
      };
      expect(utils._getUtilityData(data)).to.eql(expected);
    });
    it('should reject those that have duplicates', function () {
    });
  });
  describe('getUtilityData', function () {
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
          expected = {
            energy_consumption: [
              { id: '10', value: 10.23434 },
              { id: '11', value: 60.4545 },
              { id: '12', value: 20.45466 }
            ],
            energy_draw: [
              { id: '10', value: 0.12313 },
              { id: '11', value: 1.33 },
              { id: '12', value: 0.5343434 }
            ],
            energy_production: []
          };
      expect(utils.getUtilityData(data)).to.eql(expected);
    });
  });
});