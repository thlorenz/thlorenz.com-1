var config  =  require('../config')
  , stylus  =  require('stylus')
  , fs      =  require('fs')
  , path    =  require('path')
  , log     =  require('npmlog')
  , cssOnly =  ['blog.css']
  ;

function isCssOnly (file) {
  return cssOnly.indexOf(path.basename(file)) > -1;
}


function convertToCss (stylusFile, cb) {
  fs.readFile(config().paths.stylus + '/' + stylusFile, 'utf-8', function (err, data) {
    if (err) cb(err);
    else { 
      stylus(data)
        .include(require('nib').path)
        .include(config().paths.stylus)
        .render(function (err, css) {
          if (err) cb(err);
          else cb(null, css);
      });
    }
  });
}

function generateCss (stylusFile, cb) {
  convertToCss(stylusFile, function (err, css) {
    if (err) cb(err); 
    else fs.writeFile(config().paths.css + '/index.css', css, cb);        
  });
}

function getStaticCss(file, cb) {
  fs.readFile(config().paths.css + '/' + file, 'utf-8', cb);
}

function getDynamicCss(file, cb) {
  var stylusFile = file.replace(path.extname(file), '') + '.styl';
  convertToCss (stylusFile, cb);
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

  return (config().isDev && !isCssOnly(file)) ? getDynamicCss(file, respond) : getStaticCss(file, respond);
}



module.exports = {
  get: get
};
