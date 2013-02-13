'use strict';
var sendJson = require('./json')
  , sendHtml = require('./html')
  ;

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
  var prefersHtml = req.accepts('html, json') === 'html'
    , sendHtmlOrJson = prefersHtml ? sendHtml : sendJson;

   sendHtmlOrJson(res, model, sidebarTmpl, contentTmpl);
};
