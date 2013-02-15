'use strict';
var log  =  require('npmlog')
  , send =  require('../send')
  , blog =  require('../blog/provider')
  , moment = require('moment')
  ;

function adapt(metadata) {
  return metadata.map(function (x) {
    var d = moment(x.created);
    return { title: x.title, name: x.name, created: d.format('dddd, MMMM Do YYYY') };
  });
}

module.exports = function (app) {
  app
    .get('/blog', function (req, res) {
      res.redirect('/blog/' + blog.getPost().name);
    })
    .get('/blog/:post', function (req, res) {
      log.verbose('blog', 'getting post', req.params.post);
      var model = { sidebar: adapt(blog.getMetadata()), content: blog.getPost(req.params.post) };
      send(req, res, model, 'blog_nav', 'blog_post');
    });
};
