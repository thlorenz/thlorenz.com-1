'use strict';
var log = require('npmlog')
  , send = require('../send');

module.exports = function (app) {
  app
    .get('/blog', function (req, res) {
      res.locals.sidebar = 'blog_nav';
      res.locals.content = 'blog_content';
      res.render('index');
    })
    .get('/blog/:post', function (req, res) {
      log.verbose('blog', 'getting post', req.params.post);
      send(req, res, { content: { title: req.params.post } }, 'blog_nav', 'blog_content');
    });
};
