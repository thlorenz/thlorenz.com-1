'use strict';

var send            =  require('../send')
  , log             =  require('npmlog')
  , handlebars      =  require('hbs').handlebars
  , getRepos        =  require('../github/get-repos')
  , projectsSidebar =  require('./projects-sidebar')
  , blogSidebar     =  require('./blog-sidebar')
  , blog            =  require('../blog/provider')
  , fs              =  require('fs')
  , path            =  require('path');

var urls      =  projectsSidebar(null).map(function (x) { return x.url; })
  , tmpl      =  fs.readFileSync(path.join(__dirname, '..', 'views', 'sitemap.hbs'), 'utf-8')
  , sitemapFn =  handlebars.compile(tmpl);

module.exports = function (app) {
  app
    .get('/sitemap.xml', function (req, res) {
      blog.getMetadata(function (err, metadata) {
        var blogposts;
        if (err) {
          log.error('blog', 'error getting blog metadata, returning empty in sitemap', err);
          blogposts = [];
        } else {
          blogposts = blogSidebar(metadata, null);
        }
        var xml = sitemapFn({ projects: urls, blogposts: blogposts });

        res.set('Content-Type', 'text/xml');
        res.send(200, xml);
      });
    });
};
