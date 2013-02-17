'use strict';

var browserify =  require('browserify')
  , shim       =  require('browserify-shim')
  , uglify     =  require('uglify-js')
  , optimizer  =  uglify.uglify
  ;

function minify(code) {
  var compressor = uglify.Compressor()
    , ast = uglify.parse(code);

  ast.figure_out_scope();
  ast.mangle_names();
  return ast.transform(compressor).print_to_string();
}

var createBundle = module.exports = function (debug) {
  var bundled = browserify({ debug: debug })
    .use(shim({ alias: 'jquery', path: './public/js/jquery-1.8.1.min.js', exports: '$' }))
    .use(shim({ 
        alias   :  'bootstrap'
      , path    :  './public/js/bootstrap.js'
      , exports :  null
      , depends :  { jquery : '$' }
    }))
    .addEntry('./public/js/navigation.js')
    .addEntry('./public/js/entry.js')
    .bundle()
    ;

  return debug ? bundled : minify(bundled);
};

if (module.parent) return;

// execute the below only when run from the command line
var path = require('path')
  , fs = require('fs')
  , bundlePath = path.join(__dirname, 'public', 'js', 'build', 'bundle.js');

fs.writeFileSync(bundlePath, createBundle(true), 'utf-8');
