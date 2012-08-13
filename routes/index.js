var reqall = require('require-all');

module.exports = reqall({
    dirname: __dirname
  , filter: /(.+)\.js$/
  });
