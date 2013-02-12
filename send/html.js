'use strict';
var hbs = require('hbs');

module.exports = function sendHtml(res, model, sidebarTmpl, contentTmpl) {
  res.locals.sidebar = sidebarTmpl;
  res.locals.content = contentTmpl;
  res.locals.model = model;
  res.render('index');
};
