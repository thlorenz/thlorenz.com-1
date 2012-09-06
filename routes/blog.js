var log    =  require('npmlog')
  , blog   =  require('../blog')
  , utl    =  require('../utl')
  , config =  require('../config')
  ;

// TODO: lots of common code with github.js - extract

function getJsonRes(metadata, maxAge) {
  var data = JSON.stringify(metadata);
  return {
      headers: {
          'Content-Type'   :  'text/json'
        , 'Content-Length' :  data.length
        , 'ETag'           :  '"' + utl.md5(data) + '"'
        , 'Cache-Control'  :  'public, max-age=' + maxAge.toString()
        }
      , body: data
    };
}

function get () {
  var req      =  this.req
    , res      =  this.res
    , maxAge   =  config().caching.maxAge.blog.index
    , metadata =  blog.getMetadata()
    , jsonRes  =  getJsonRes(metadata, maxAge)
    ;

  log.info('blog', 'Getting index');

  res.writeHead(200, jsonRes.headers);
  res.end(jsonRes.body);
}

function getPost(post) {
  var req      =  this.req
    , res      =  this.res
    , maxAge   =  config().caching.maxAge.blog.post
    , metadata =  blog.getPost(post)
    , jsonRes  =  getJsonRes(metadata, maxAge)
    ;

  log.info('blog', 'Getting post', post);

  res.writeHead(200, jsonRes.headers);
  res.end(jsonRes.body);
}

module.exports = {
    get     :  get
  , getPost :  getPost
};

