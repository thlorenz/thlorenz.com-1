var config  =  require('./config')
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
        .set('compress', config().optimizeCss)
        .render(function (err, css) {
          if (err) cb(err);
          else cb(null, css);
      });
    }
  });
}

function generateCss (stylusFile, cb) {
  log.info('styles', 'generating css from', stylusFile);
  convertToCss(stylusFile, function (err, css) {
    if (err) cb(err); 
    else fs.writeFile(config().paths.css + '/index.css', css, cb);        
  });
}

function init (cb) {
  var conf = config();
  if (!conf.optimizeCss) return cb(null);
  generateCss('index.styl', cb);
}

module.exports = {
    init         :  init
  , isCssOnly    :  isCssOnly
  , convertToCss :  convertToCss
  , generateCss  :  generateCss
};
