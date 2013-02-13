'use strict';

var compilePartial = require('../views/utils/compile-partial');

function json(model, sidebarTmpl, contentTmpl) {
  var data = {};
  if (sidebarTmpl && model.sidebar) data.sidebar = compilePartial(sidebarTmpl)(model.sidebar);
  if (contentTmpl && model.content) data.content = compilePartial(contentTmpl)(model.content);
  return data;
}

module.exports = function sendJson(res, model, sidebarTmpl, contentTmpl) {
  res.json(json(model, sidebarTmpl, contentTmpl));
};
