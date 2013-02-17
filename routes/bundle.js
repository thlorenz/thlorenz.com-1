'use strict';

var build = require('../build')
  , config = require('../config')
  , built;

module.exports = function (app) {
  app.get('/js/build/bundle.js', function (req, res) {
    var bundle = (built && !config.debug) || (built = build(config.debug));
    res.set('Content-Type', 'application/javascript');
    res.send(200, bundle);
  });
};
