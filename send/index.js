'use strict';
var sendJson = require('./json')
  , sendHtml = require('./html')
  , log = require('npmlog')
  ;

function prefersHtml(req) {
  log.verbose('send', 'accept headers', req.accepted);
  var hasNoAcceptHeaders = !(req.accepted && req.accepted.length);
  if (hasNoAcceptHeaders) return true;
  return req.accepts('html, json') === 'html';
}

/**
 * Renders the page as html or sends a JSON response based on the requests's accept headers.
 * 
 * @name send
 * @function
 * @param req {Object} http request
 * @param res {Object} http response 
 * @param model {Object} model to be used when as context to the templates
 * @param sidebarTmpl {String} name of the template to be used for the sidebar area of the page
 * @param contentTmpl {String} name of the template to be used for the content area of the page
 */
module.exports = function send(req, res, model, sidebarTmpl, contentTmpl) {
  model = model || { };
  model.content = model.content || {};
  model.prescripts = model.prescripts || [];
  model.postscripts = model.postscripts || [];

  var sendHtmlOrJson = prefersHtml(req) ? sendHtml : sendJson;

  sendHtmlOrJson(res, model, sidebarTmpl, contentTmpl);
};
