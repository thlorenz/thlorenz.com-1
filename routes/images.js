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
  get('favicon.ico', { imgMime: 'x-img' });
}

function get (file, optsArg) {
  log.verbose('root', 'get', file);

  var res          =  this.res
    , opts         =  optsArg || { };

  opts.maxAge  =  opts.maxAge || 86400; // 1 day
  opts.imgMime =  opts.imgMime || getImgMime(file);

  function onError (err) {
    log.error('images', err);
    res.writeHead(500);
    res.end();
  }

  function onSuccess (data) {
    var img = {
        headers: { 
            'Content-Type'   :  'image/' + opts.imgMime
          , 'Content-Length' :  data.length
          , 'ETag'           :  '"' + utl.md5(data) + '"'
          , 'Cache-Control'  :  'public, max-age=' + opts.maxAge.toString()
          }
        , body: data
        };

    res.writeHead(200, img.headers);
    res.end(img.body);
  }

  fs.readFile(config().paths.images + '/' + file, function (err, data) {
    if (err) onError(err);
    else onSuccess(data);
  });
}

module.exports = {
    get: get
  , getfavicon: getfavicon
};
