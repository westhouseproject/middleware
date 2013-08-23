/* jshint node: true */
/* globals describe, it */

'use strict';

var _           = require('lodash'),
    expect      = require('expect.js'),
    assert      = require('assert'),
    bcpmHelpers = require('./utilities/lib/bcpm-helpers');

describe('bcpm_helpers', function () {
  describe('getBcpmData', function () {
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
      expect(bcpmHelpers.getBcpmData(data)).to.eql(expected);
    });
  });
  describe('getDeviceData', function () {
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
          result = bcpmHelpers.getDeviceData(data);

      _.keys(expected).forEach(function (el) {
        assert(!!result[el]);
        expect(result[el].sort(function (a, b) {
          return a.Name > b.Name ? 1 : (a.Name < b.Name ? -1 : 0);
        })).to.eql(expected[el]);
      });
    });
  });
});