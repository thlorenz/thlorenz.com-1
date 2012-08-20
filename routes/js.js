var fs = require('fs')
  , path = require('path')
  , log = require('npmlog')
  , config = require('../config')
  ;

function get (jspath) {
  var res = this.res
    , req = this.req
    ;

  function onError (err) {
    log.error('js', err);
    res.writeHead(500);
    res.end();
  }

  function onSuccess (data) {
    var js = {
      headers: {
          'Content-Type'  : 'text/javascript' 
        , 'Content-Length' : data.length
        }
      , body: data
    };

    res.writeHead(200, js.headers);
    res.end(js.body);
  }

  fs.readFile(config().paths.js + '/' + jspath, function (err, data) {
    if (err) onError(err);
    else onSuccess(data);
  });
}

function getFrom(dir, file) {
  get.call(this, path.join(dir, file));
}

  
module.exports = { 
    get    :  get
  , getFrom :  getFrom
};
