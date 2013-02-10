'use strict';

var config = require('../config')
  , clone = require('clone');

module.exports = function initLocals(req, res, next) {
  // clone here to prevent config to be affected by additions/changes to res.locals inside routes
  res.locals = clone(config[config.mode], false);
  res.locals.model = {};
  next();
};


