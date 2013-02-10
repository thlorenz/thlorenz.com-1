'use strict';

var config = require('../config');

module.exports = function initLocals(req, res, next) {
  res.locals = config[config.mode];
  next();
};
