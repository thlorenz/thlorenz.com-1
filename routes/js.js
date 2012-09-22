var fs      =  require('fs')
  , path    =  require('path')
  , log     =  require('npmlog')
  , config  =  require('../config')
  , utl     =  require('../utl')
  , jsStore =  { }
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
    , fullPath = config().paths.js + '/' + jspath
    ;

  if (jsStore[fullPath]) { 
    log.verbose('js', 'serving %s from store', jspath);
    return onSuccess(res, jsStore[fullPath]);
  }

  fs.readFile(fullPath, function (err, data) {
    if (err) return onError(res, err, 404);
    
    if (config().optimizeJs) 
      jsStore[fullPath] = data;

    onSuccess(res, data);
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

    if (jsStore[resolvedPath]) { 
      log.verbose('js', 'serving module %s from store', name);
      return onSuccess(res, jsStore[resolvedPath]);
    }
  } catch (err) {
    return onError(res, err, 404);
  }
  
  fs.readFile(resolvedPath, function (err, data) {
    if (err) return onError(res, err);

    if (config().optimizeJs) 
      jsStore[resolvedPath] = data;

    onSuccess(res, data);
  });
}

  
module.exports = { 
    get    :  get
  , getFrom :  getFrom
};
