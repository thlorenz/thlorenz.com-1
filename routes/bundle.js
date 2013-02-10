'use strict';

var build = require('../build');

module.exports = function (app) {
  app.get('/js/build/bundle.js', function (req, res) {
    // TODO: useful for development, but before going to prod, we need to implement a caching strategy here
    var bundle = build(true);
    res.set('Content-Type', 'application/javascript');
    res.send(200, bundle);
  });
};
