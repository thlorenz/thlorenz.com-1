'use strict';
var log = require('npmlog');

module.exports = function (app) {
  app
    .get('/blog', function (req, res) {
      res.locals.sidebar = 'blog_nav';
      res.locals.content = 'blog_content';
      res.render('index');
    })
    .get('/blog/:post', function (req, res) {
      log.verbose('blog', 'getting post', req.params.post);

      var wantsHtml = req.accepts('html, json') === 'html';
      
        res.locals.sidebar = 'blog_nav';
        res.locals.content = 'blog_content';

        res.locals.model.content.title = req.params.post;

      if (wantsHtml) return res.render('index');

      res.json(json(res.locals.model, res.locals.sidebar, res.locals.content));
    });
};


var compilePartial = require('../views/utils/compile-partial');

function json(model, sidebarTmpl, contentTmpl) {
  var data = {};
  if (sidebarTmpl) data.sidebar = compilePartial(sidebarTmpl)(model.sidebar);
  if (contentTmpl) data.content = compilePartial(contentTmpl)(model.content);
  return data;
}

