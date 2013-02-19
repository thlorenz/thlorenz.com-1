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
      blog.getMetadata(function (err, metadata) {
        if (err) {
          log.error('blog', 'error getting blog metadata, redirecting to about page', err);
          return send(req, res, { }, 'projects_nav', 'error');
        }
        res.redirect('/blog/' + blog.getPost().name);
      });
    })

    .get('/blog/:post', function (req, res) {
      var postName = req.params.post;
      log.verbose('blog', 'getting post', postName);

      blog.getMetadata(function (err, metadata) {
        if (err) {
          log.error('blog', 'error getting blog metadata, redirecting to about page', err);
          return send(req, res, { }, 'projects_nav', 'error');
        }

        var model = { 
            sidebar: adapt(metadata, postName)
          , content: blog.getPost(postName) 
          , blog: true
        };
        send(req, res, model, 'blog_nav', 'blog_post');
      });
    })

    // gitub hook to cause blog to update whenever a new post was published
    .post('/blog/pushed', function (req, res) {
      log.info('blog', 'blog post was pushed');
      blog.update(function (err) {
        if (err) { 
          log.error('blog', err); 
          res.writeHead(500);
          return res.end();
        }

        res.writeHead(200, { 'Content-Length': 0 });
        res.end();
      });
    });
};
