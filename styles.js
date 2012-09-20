var config   =  require('./config')
  , stylus   =  require('stylus')
  , fs       =  require('fs')
  , path     =  require('path')
  , log      =  require('npmlog')
  , utl      =  require('./utl')
  , cssOnly  =  ['blog.css']
  , cssStore =  { }
  ;

function isCssOnly (file) {
  return cssOnly.indexOf(path.basename(file)) > -1;
}

function convertToCss (stylusFile, cb) {
  var fullPath = path.join(config().paths.stylus, stylusFile);
  fs.readFile(fullPath, 'utf-8', function (err, data) {
    if (err) return cb(err);

    stylus(data)
      .include(require('nib').path)
      .include(config().paths.stylus)
      .set('compress', config().optimizeCss)
      .render(function (err, css) {
        if (err) return cb(err);
        cb(null, css);
      });
  });
}

function loadCss (cssFile, cb) {
  log.info('styles', 'loading css from', cssFile);
  var fullPath = path.join(config().paths.css, cssFile);

  fs.readFile(fullPath, 'utf-8', function (err, css) {
    if (err) return cb(err);

    stylus(css)
      .set('compress', config().optimizeCss)
      .render(function (err, css) {
        if (err) return cb(err);
        cssStore[cssFile] = css;
        cb();
      });
  });
}

function generateCss (stylusFile, cb) {
  log.info('styles', 'generating css from', stylusFile);
  convertToCss(stylusFile, function (err, css) {
    if (err) return cb(err); 

    cssStore[utl.removeExtension(stylusFile) + '.css'] = css;
    cb();
  });
}


function init (cb) {
  if (!config().optimizeCss) return cb(null);

  generateCss('index.styl',  function (err) {
    if (err) return cb(err);

    loadCss('blog.css', cb);
  });
}

function provide(file) {
  return cssStore[file];
}

module.exports = {
    init         :  init
  , isCssOnly    :  isCssOnly
  , convertToCss :  convertToCss
  , generateCss  :  generateCss
  , provide      :  provide
};
