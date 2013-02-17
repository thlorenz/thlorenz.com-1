'use strict';

var build = require('../build')
  , config = require('../config')
  , bundled;

module.exports = function (app) {
  app.get('/js/build/bundle.js', function (req, res) {
    var shouldRebuild = !bundled || config.debug;
    if (shouldRebuild) bundled = build(config.debug);

    res.set('Content-Type', 'application/javascript');
    res.send(200, bundled);
  });
};
