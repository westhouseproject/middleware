/* jshint node: true */
/* globals describe, it */

'use strict';

var expect      = require('expect.js'),
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
});