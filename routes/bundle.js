'use strict';

var build = require('../build')
  , config = require('../config')
  , bundled;

module.exports = function (app) {
  app.get('/js/build/bundle.js', function (req, res) {
    var debug = config[config.mode].debug
      , shouldRebuild = !bundled || debug;

    function sendBundle() {
      res.set('Content-Type', 'application/javascript');
      res.send(200, bundled);
    }

    if (shouldRebuild) { 
      build(debug, function (err, bundled_) {
        if (err) return res.send(500);
        bundled = bundled_;
        sendBundle();
      });
    } else {
      sendBundle();
    }
  });
};
