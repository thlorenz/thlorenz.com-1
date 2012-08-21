var fs     =  require('fs')
  , path   =  require('path')
  , log    =  require('npmlog')
  , config =  require('../config')
  , utl    =  require('../utl')
  ;

function onError (res, err, status) {
  log.error('js', err);
  res.writeHead(status || 500);
  res.end();
}

function onSuccess (res, data) {
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

function get (jspath) {
  var res = this.res
    , req = this.req
    ;

  fs.readFile(config().paths.js + '/' + jspath, function (err, data) {
    if (err) onError(res, err, 404);
    else onSuccess(res, data);
  });
}

function getFrom(dir, file) {
  if (dir === 'node_modules') { 
    var moduleName = utl.removeExtension(file);
    getModule.call(this, moduleName);
  } else {
    get.call(this, path.join(dir, file));
  }
}

function getModule(name) {
  var res = this.res
    , req = this.req
    , resolvedPath
    ;

  try {
    resolvedPath = require.resolve(name);
  } catch (err) {
    onError(res, err, 404);
    return;
  }
  
  fs.readFile(resolvedPath, function (err, data) {
    if (err) onError(res, err);
    else onSuccess(res, data);
  });
}

  
module.exports = { 
    get    :  get
  , getFrom :  getFrom
};
