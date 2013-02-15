'use strict';
var log  =  require('npmlog')
  , send =  require('../send')
  , blog =  require('../blog/provider')
  , moment = require('moment')
  ;

function adapt(metadata, postName) {
  return metadata.map(function (x) {
    var d = moment(x.created);
    return { 
        title: x.title
      , name: x.name
      , created: d.format('dddd, MMMM Do YYYY')
      , active: x.name === postName 
    };
  });
}

module.exports = function (app) {
  app
    .get('/blog', function (req, res) {
      res.redirect('/blog/' + blog.getPost().name);
    })
    .get('/blog/:post', function (req, res) {
      var postName = req.params.post;
      log.verbose('blog', 'getting post', postName);

      var model = { 
          sidebar: adapt(blog.getMetadata(), postName)
        , content: blog.getPost(postName) 
      };
      send(req, res, model, 'blog_nav', 'blog_post');
    });
};
