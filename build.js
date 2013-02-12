'use strict';

var browserify =  require('browserify')
  , shim       =  require('browserify-shim')
  , bootstrap  =  'bootstrap' // use bootstrap.min in prod
  ;

var createBundle = module.exports = function (debug) {
  var bundled = browserify({ debug: debug })
    .use(shim({ alias: 'jquery', path: './public/js/jquery-1.8.1.min.js', exports: '$' }))
    .use(shim({ 
        alias   :  bootstrap
      , path    :  './public/js/' + bootstrap + '.js'
      , exports :  null
      , depends :  { jquery : '$' }
    }))
    .addEntry('./public/js/navigation.js')
    .addEntry('./public/js/entry.js')
    .bundle()
    ;

  return bundled;
};

if (module.parent) return;

// execute the below only when run from the command line
var path = require('path')
  , fs = require('fs')
  , bundlePath = path.join(__dirname, 'public', 'js', 'build', 'bundle.js');

fs.writeFileSync(bundlePath, createBundle(true), 'utf-8');
