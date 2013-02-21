'use strict';

var Rss = require('rss')
  , config = require('../config');

module.exports = function createFeed(posts) {
  var siteUrl = config.siteUrl;
  return new Rss({
        title       :  'Thorsten Lorenz'
      , description :  'JavaScript, nodejs and other goodies'
      , feed_url    :  siteUrl + '/blog/rss.xml'
      , site_url    :  siteUrl
      , image_url   :  siteUrl + '/img/avatar.jpg'
      , author      :  'Thorsten Lorenz'
    }
    , (posts || []).map(function (x) {
        return { 
            title       :  x.metadata.title
          , description :  x.html
          , url         :  siteUrl + '/blog/' + x.metadata.name
          , author      :  'Thorsten Lorenz'
          , date        :  x.metadata.created
          };
      })
    )
    .xml();
};
