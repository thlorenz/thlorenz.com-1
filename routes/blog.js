var log    =  require('npmlog')
  , blog   =  require('../blog')
  , utl    =  require('../utl')
  , config =  require('../config')
  ;

function getJsonRes(metadata, maxAge) {
  var data = JSON.stringify(metadata);
  return {
      headers: {
          'Content-Type'   :  'application/json'
        // FIXME: Setting Content-Length explicitly causes problems with large posts
        //, 'Content-Length' :  data.length
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

function pushed () {
  var req      =  this.req
    , res      =  this.res;

  log.info('blog', 'blog post was pushed');
  blog.update(function (err) {
    if (err) { 
      log.error('blog', err); 
      res.writeHead(500);
      res.end();
      return;
    }

    res.writeHead(200, { 'Content-Length': 0 });
    res.end();
  });
}

module.exports = {
    get     :  get
  , getPost :  getPost
  , pushed  :  pushed
};

