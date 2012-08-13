var fs = require('fs')
  , log = require('npmlog')
  , crypto = require('crypto')
  , config = require('../config')
  , utl = require('../utl')
  ;

function getfavicon() {
  log.verbose('root', 'get', 'favicon');
  log.info('root', arguments);

  var res = this.res
    , maxAge = 86400 // 1 day
    ;

  fs.readFile(config().paths.images + '/favicon.ico', function (err, data) {
    var icon = {
        headers: { 
            'Content-Type'   :  'image/x-icon'
          , 'Content-Length' :  data.length
          , 'ETag'           :  '"' + utl.md5(data) + '"'
          , 'Cache-Control'  :  'public, max-age=' + maxAge.toString()
          }
        , body: data
        };

    res.writeHead(200, icon.headers);
    res.end(icon.body);
  });
}

module.exports = {
  getfavicon: getfavicon
};
