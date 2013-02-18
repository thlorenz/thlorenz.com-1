'use strict';

var build = require('../build')
  , config = require('../config')
  , bundled;

module.exports = function (app) {
  app.get('/js/build/bundle.js', function (req, res) {
    var debug = config[config.mode].debug
      , shouldRebuild = !bundled || debug;
    if (shouldRebuild) bundled = build(debug);

    res.set('Content-Type', 'application/javascript');
    res.send(200, bundled);
  });
};
