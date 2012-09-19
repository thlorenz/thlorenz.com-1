var config  =  require('../config')
  , fs      =  require('fs')
  , path    =  require('path')
  , log     =  require('npmlog')
  , styles  =  require('../styles')
  ;

function getStaticCss(file, cb) {
  log.verbose('css', 'getting static css from', file);
  fs.readFile(config().paths.css + '/' + file, 'utf-8', cb);
}

function getDynamicCss(file, cb) {
  var stylusFile = file.replace(path.extname(file), '') + '.styl';
  styles.convertToCss (stylusFile, cb);
}

function get(file) {
  var res = this.res;

  function onError (err) {
    log.error('css', err);
    res.writeHead(500);
    res.end();
  }
  
  function onSuccess (data) {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.end(data);
  }

  function respond (err, data) {
    if (err) onError(err);
    else onSuccess(data);
  }

  return (!config().optimizeCss && !styles.isCssOnly(file)) ? getDynamicCss(file, respond) : getStaticCss(file, respond);
}

module.exports = {
  get: get
};
