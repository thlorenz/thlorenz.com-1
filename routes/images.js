var fs = require('fs')
  , path = require('path')
  , log = require('npmlog')
  , config = require('../config')
  , utl = require('../utl')
  ;

function getImgMime(file) {
  return path.extname(file).slice(1);
}

function getfavicon () {
  get.call(this, 'favicon.ico', { imgMime: 'x-img' });
}

function get (file, dir) {
  var res     =  this.res
    , req     =  this.req
    , imgMime =  getImgMime(file)
    , maxAge  =  config().caching.maxAge.image
    ;


  function onError (err) {
    log.error('images', err);
    res.writeHead(500);
    res.end();
  }

  function onSuccess (data) {
    var img = {
        headers: { 
            'Content-Type'   :  'image/' + imgMime
          , 'Content-Length' :  data.length
          , 'ETag'           :  '"' + utl.md5(data) + '"'
          , 'Cache-Control'  :  'public, max-age=' + maxAge.toString()
          }
        , body: data
        };

    res.writeHead(200, img.headers);
    res.end(img.body);
  }

  fs.readFile(dir || config().paths.images + '/' + file, function (err, data) {
    if (err) onError(err);
    else onSuccess(data);
  });
}

module.exports = {
    get: get
  , getfavicon: getfavicon
};
