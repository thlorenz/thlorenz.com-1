'use strict';
var log  =  require('npmlog')
  , send =  require('../send')
  , blog =  require('../blog/provider')
  ;

module.exports = function (app) {
  app
    .get('/blog', function (req, res) {
      send(req, res, { sidebar: blog.getMetadata() }, 'blog_nav', 'blog_content');
    })
    .get('/blog/:post', function (req, res) {
      log.verbose('blog', 'getting post', req.params.post);
      send(req, res, { sidebar: blog.getMetadata(), content: blog.getPost(req.params.post) }, 'blog_nav', 'blog_content');
    });
};
