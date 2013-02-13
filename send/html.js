'use strict';
var hbs = require('hbs')
  , log = require('npmlog');

module.exports = function sendHtml(res, model, sidebarTmpl, contentTmpl) {
  log.verbose('send/html', 'model', model);
  res.locals.sidebar = sidebarTmpl;
  res.locals.content = contentTmpl;
  res.locals.model = model;
  res.render('index');
};
