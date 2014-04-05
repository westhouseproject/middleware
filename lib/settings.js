/* jshint node: true */

var env = process.env.NODE_ENV || 'development';

module.exports = require('../' + env + '.json');

if (process.env.NODE_ENV === 'production') {
  module.exports = settings.prod;
}
