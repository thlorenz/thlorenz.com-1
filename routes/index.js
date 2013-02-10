'use strict';
var config = require('../config');

module.exports = function (app) {
  app.get('/', function (req, res) {
    res.locals = config[config.mode];
    res.render('index');
  });
};
