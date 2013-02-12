'use strict';
var sendJson = require('./json')
  , sendHtml = require('./html')
  ;

module.exports = function send(req, res, model, sidebarTmpl, contentTmpl) {
  var prefersHtml = req.accepts('html, json') === 'html'
    , sendHtmlOrJson = prefersHtml ? sendHtml : sendJson;

   sendHtmlOrJson(res, model, sidebarTmpl, contentTmpl);
};
